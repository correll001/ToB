/**
 * 4D-5 / 4E-6: Bundled effective-runtime-bundle.json integrity (no network, no SQLite).
 *
 *   npm run verify:skill-data-integrity
 */
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import type { EffectiveRuntimeBundle } from '@/lib/data/types'
import type { BuildSnapshot, MainSkillSlot } from '@/types/build'
import type { ParseStatus } from '@/types/normalized'
import type { SupportRule } from '@/types/skillData'
import { createEmptyBuildSnapshot } from '@/lib/defaultBuildSnapshot'
import { normalizeBuildSnapshot } from '@/lib/normalizeBuildSnapshot'
import { encodeBuildToShareCode, decodeBuildFromShareCode } from '@/lib/shareCodec'
import {
  selectInspectedSkillDamageView,
  selectBuildStatsPanelDerived,
  selectInspectedSkillDebugView,
} from '@/selectors/buildComputedStats'
import { P0_ACTIVE_SKILL_IDS, P0_SUPPORT_SKILL_IDS } from '@/scripts/verify/p0SkillIds'

const ROOT = process.cwd()
const BUNDLE = path.join(ROOT, 'lib', 'gameData', 'generated', 'effective-runtime-bundle.json')

function tallyParse(files: EffectiveRuntimeBundle['activeSkills'][]): Record<ParseStatus, number> {
  const out: Record<ParseStatus, number> = { ok: 0, partial: 0, failed: 0 }
  for (const f of files) {
    for (const row of f.skills) {
      const s = row.parseStatus
      out[s] = (out[s] ?? 0) + 1
    }
  }
  return out
}

function sumWarningMeta(files: EffectiveRuntimeBundle['activeSkills'][]): number {
  return files.reduce((a, f) => a + (f.meta.warningsCount ?? 0), 0)
}

/** supportRules must carry at least one structured compatibility signal (not `{}`). */
function supportRulesMeaningful(r: SupportRule | undefined): boolean {
  if (!r || typeof r !== 'object') return false
  if (Array.isArray(r.allowedSkillTags) && r.allowedSkillTags.length > 0) return true
  if (Array.isArray(r.forbiddenSkillTags) && r.forbiddenSkillTags.length > 0) return true
  if (Array.isArray(r.rawRequirementLines) && r.rawRequirementLines.length > 0) return true
  if (r.requiresAttack || r.requiresSpell || r.requiresProjectile || r.requiresChanneled) return true
  if (typeof r.maxSupportsPerSkill === 'number') return true
  if (Array.isArray(r.socketColors) && r.socketColors.length > 0) return true
  return false
}

function main() {
  const issues: string[] = []

  if (!existsSync(BUNDLE)) {
    console.error(`[verify:skill-data-integrity] missing ${path.relative(ROOT, BUNDLE)}`)
    process.exit(1)
  }

  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8')) as EffectiveRuntimeBundle
  const { activeSkills, supportSkills, passiveSkills, skillLevelRules, combatRules } = bundle

  const na = activeSkills.skills.length
  const ns = supportSkills.skills.length
  const np = passiveSkills.skills.length

  if (na < 1) issues.push('activeSkills count is 0')
  if (ns < 1) issues.push('supportSkills count is 0')
  if (np < 1) issues.push('passiveSkills count is 0')

  if (!skillLevelRules?.rules) issues.push('skillLevelRules.rules missing')
  if (!combatRules?.rules) issues.push('combatRules.rules missing')

  const tAll = tallyParse([activeSkills, supportSkills, passiveSkills])
  const warnSum = sumWarningMeta([activeSkills, supportSkills, passiveSkills])

  console.log('[verify:skill-data-integrity] record counts')
  console.log(`  active: ${na}  support: ${ns}  passive: ${np}`)
  console.log(`  parseStatus (all skills): ok=${tAll.ok} partial=${tAll.partial} failed=${tAll.failed}`)
  console.log(`  meta.warningsCount sum (3 files): ${warnSum}`)
  console.log(`  effectiveLayer: ${activeSkills.meta.effectiveLayer ?? '—'}`)

  if (issues.length) {
    console.error('[verify:skill-data-integrity] FAILED:\n  - ' + issues.join('\n  - '))
    process.exit(1)
  }

  const p0Issues: string[] = []
  const activeById = new Map(activeSkills.skills.map((r) => [r.definition.id, r]))
  for (const id of P0_ACTIVE_SKILL_IDS) {
    const rec = activeById.get(id)
    if (!rec) {
      p0Issues.push(`P0 active missing in bundle: ${id}`)
      continue
    }
    const ltRaw = rec.definition.levelTable as Record<string, unknown> | undefined
    const keys = ltRaw && typeof ltRaw === 'object' ? Object.keys(ltRaw) : []
    if (keys.length < 1) p0Issues.push(`P0 active ${id}: levelTable must not be empty (4E-6)`)
  }

  const supportById = new Map(supportSkills.skills.map((r) => [r.definition.id, r]))
  for (const id of P0_SUPPORT_SKILL_IDS) {
    const rec = supportById.get(id)
    if (!rec) {
      p0Issues.push(`P0 support missing in bundle: ${id}`)
      continue
    }
    const def = rec.definition
    const modN = def.modifiers?.length ?? 0
    if (modN < 1 && !supportRulesMeaningful(def.supportRules)) {
      p0Issues.push(
        `P0 support ${id}: modifiers and supportRules must not both be empty (4E-6; need pairing / effect data)`,
      )
    }
  }

  if (p0Issues.length) {
    console.error('[verify:skill-data-integrity] P0 contracts FAILED:\n  - ' + p0Issues.join('\n  - '))
    process.exit(1)
  }

  const selectorIssues: string[] = []
  const noThrow = (label: string, fn: () => void) => {
    try {
      fn()
    } catch (e) {
      selectorIssues.push(`${label} threw: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  const empty = createEmptyBuildSnapshot()
  const v0 = selectInspectedSkillDamageView(empty)
  if (v0.mode !== 'none' || v0.reason !== 'no_slot') {
    selectorIssues.push(`expected no_slot when inspected null, got ${JSON.stringify(v0)}`)
  }

  const badInspect = normalizeBuildSnapshot({
    ...empty,
    meta: { ...empty.meta, inspectedMainSkillSlot: 99 as unknown as typeof empty.meta.inspectedMainSkillSlot },
  })
  noThrow('selectBuildStatsPanelDerived(badInspect)', () => selectBuildStatsPanelDerived(badInspect))
  noThrow('selectInspectedSkillDamageView(badInspect)', () => selectInspectedSkillDamageView(badInspect))
  noThrow('selectInspectedSkillDebugView(badInspect)', () => selectInspectedSkillDebugView(badInspect))

  const legacyish = normalizeBuildSnapshot({
    ...empty,
    meta: { ...empty.meta, inspectedMainSkillSlot: null },
  })
  noThrow('selectInspectedSkillDamageView(cleared inspected)', () => selectInspectedSkillDamageView(legacyish))

  const inspectClearedMain = normalizeBuildSnapshot({
    ...empty,
    meta: { ...empty.meta, inspectedMainSkillSlot: 1 },
    skills: empty.skills.map((row) =>
      row.slot === 1
        ? { ...row, skillId: null }
        : row.slot === 2
          ? { ...row, skillId: 'skill:Ice_Shot' }
          : row,
    ),
  })
  noThrow('selectInspectedSkillDamageView(cleared main + skill on slot2)', () =>
    selectInspectedSkillDamageView(inspectClearedMain),
  )
  // When all mains empty, finalize clears inspected; with a filler on slot 2 normalize still yields a stable slot — must not throw.

  const rogueSlot: BuildSnapshot = {
    ...createEmptyBuildSnapshot(),
    meta: {
      ...createEmptyBuildSnapshot().meta,
      inspectedMainSkillSlot: 6 as MainSkillSlot,
    },
  }
  noThrow('selectInspectedSkillDamageView(invalid slot)', () => selectInspectedSkillDamageView(rogueSlot))

  const scatterRec = supportById.get('skill:Multiple_Projectiles')
  if (scatterRec) {
    const supportMain = normalizeBuildSnapshot({
      ...empty,
      meta: { ...empty.meta, inspectedMainSkillSlot: 1 },
      skills: [
        { slot: 1, skillId: scatterRec.definition.id, supports: [], skillLevel: 20, enabled: true },
        ...empty.skills.slice(1),
      ],
    })
    noThrow('selectInspectedSkillDamageView(support as main)', () =>
      selectInspectedSkillDamageView(supportMain),
    )
    noThrow('selectBuildStatsPanelDerived(support as main)', () => selectBuildStatsPanelDerived(supportMain))
  }

  const roundTrip = normalizeBuildSnapshot(decodeBuildFromShareCode(encodeBuildToShareCode(empty)))
  if (roundTrip.meta.inspectedMainSkillSlot !== empty.meta.inspectedMainSkillSlot) {
    selectorIssues.push('share round-trip altered inspectedMainSkillSlot')
  }

  const withInspect3 = normalizeBuildSnapshot({
    ...empty,
    meta: { ...empty.meta, inspectedMainSkillSlot: 3 },
    skills: empty.skills.map((row) =>
      row.slot === 3 ? { ...row, skillId: 'skill:Ice_Shot', skillLevel: 20, enabled: true } : row,
    ),
  })
  const rt3 = normalizeBuildSnapshot(decodeBuildFromShareCode(encodeBuildToShareCode(withInspect3)))
  if (rt3.meta.inspectedMainSkillSlot !== 3) {
    selectorIssues.push(`share round-trip expected inspectedMainSkillSlot=3, got ${rt3.meta.inspectedMainSkillSlot}`)
  }

  if (selectorIssues.length) {
    console.error('[verify:skill-data-integrity] selector/share FAILED:\n  - ' + selectorIssues.join('\n  - '))
    process.exit(1)
  }

  console.log('[verify:skill-data-integrity] P0 contracts: OK')
  console.log('[verify:skill-data-integrity] selectors + share round-trip: OK')
  console.log('[verify:skill-data-integrity] OK')
}

main()
