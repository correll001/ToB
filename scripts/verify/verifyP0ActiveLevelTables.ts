/**
 * 4E-1: P0 active skills must have non-empty levelTable (effective / bundled snapshot).
 *
 *   npm run verify:p0-active-level-tables
 */
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import type { EffectiveRuntimeBundle } from '@/lib/data/types'
import type { BuildSnapshot } from '@/types/build'
import { createEmptyBuildSnapshot } from '@/lib/defaultBuildSnapshot'
import { normalizeBuildSnapshot } from '@/lib/normalizeBuildSnapshot'
import { computeSkillInstanceForMainSlot } from '@/lib/formula/collectBuildContributions'
import { selectInspectedSkillDamageView } from '@/selectors/buildComputedStats'
import { P0_ACTIVE_SKILL_IDS } from '@/scripts/verify/p0SkillIds'

const ROOT = process.cwd()
const BUNDLE = path.join(ROOT, 'lib', 'gameData', 'generated', 'effective-runtime-bundle.json')

export { P0_ACTIVE_SKILL_IDS }

function buildSnap(skillId: string, skillLevel: number, slot: 1 = 1): BuildSnapshot {
  const empty = createEmptyBuildSnapshot()
  const skills = empty.skills.map((row) =>
    row.slot === slot ? { ...row, skillId, skillLevel, enabled: true } : row,
  )
  return normalizeBuildSnapshot({
    ...empty,
    meta: { ...empty.meta, inspectedMainSkillSlot: slot },
    skills,
  })
}

function main() {
  if (!existsSync(BUNDLE)) {
    console.error(`[verify:p0-active-level-tables] missing ${path.relative(ROOT, BUNDLE)}`)
    process.exit(1)
  }

  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8')) as EffectiveRuntimeBundle
  const byId = new Map(bundle.activeSkills.skills.map((r) => [r.definition.id, r]))
  const issues: string[] = []

  for (const id of P0_ACTIVE_SKILL_IDS) {
    const rec = byId.get(id)
    if (!rec) {
      issues.push(`missing active record: ${id}`)
      continue
    }
    const ltRaw = rec.definition.levelTable as Record<string, unknown> | undefined
    const keys = ltRaw && typeof ltRaw === 'object' ? Object.keys(ltRaw) : []
    if (keys.length < 4) {
      issues.push(`${id}: levelTable has ${keys.length} rows, expected >= 4`)
      continue
    }
    const levelNums = keys.map((k) => Number(k)).filter((n) => Number.isFinite(n))
    if (!levelNums.includes(10) || !levelNums.includes(20)) {
      issues.push(`${id}: levelTable missing level 10 or 20 (got: ${keys.slice(0, 12).join(', ')})`)
      continue
    }

    const snap10 = buildSnap(id, 10)
    const snap20 = buildSnap(id, 20)
    const inst10 = computeSkillInstanceForMainSlot(snap10.skills[0]!, snap10)
    const inst20 = computeSkillInstanceForMainSlot(snap20.skills[0]!, snap20)
    if (!inst10 || !inst20) {
      issues.push(`${id}: could not build skill instance at L10/L20`)
      continue
    }

    const view10 = selectInspectedSkillDamageView(snap10)
    const view20 = selectInspectedSkillDamageView(snap20)
    if (view10.mode === 'damaging' && view20.mode === 'damaging') {
      const m10 = view10.manaCost
      const m20 = view20.manaCost
      const st10 = inst10.computedStats['skill.addedBaseDamage'] ?? 0
      const st20 = inst20.computedStats['skill.addedBaseDamage'] ?? 0
      const changed =
        m10 !== m20 ||
        view10.castTimeSec !== view20.castTimeSec ||
        view10.cooldownSec !== view20.cooldownSec ||
        st10 !== st20 ||
        JSON.stringify(inst10.contributionBlock) !== JSON.stringify(inst20.contributionBlock)
      if (!changed) {
        issues.push(`${id}: L10 vs L20 produced identical mana/cast/cooldown/base/contribution — check levelTable`)
      }
    }

    if (inst20.calculationConfidence === 'unsupported') {
      issues.push(`${id}: L20 instance still unsupported`)
    }
  }

  if (issues.length) {
    console.error('[verify:p0-active-level-tables] FAILED:\n  - ' + issues.join('\n  - '))
    process.exit(1)
  }

  console.log(`[verify:p0-active-level-tables] OK (${P0_ACTIVE_SKILL_IDS.length} skills)`)
}

main()
