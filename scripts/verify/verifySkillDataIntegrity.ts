/**
 * 4D-5: Bundled effective-runtime-bundle.json integrity (no network, no SQLite).
 *
 *   npm run verify:skill-data-integrity
 */
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import type { EffectiveRuntimeBundle } from '@/lib/data/types'
import type { ParseStatus } from '@/types/normalized'
import { createEmptyBuildSnapshot } from '@/lib/defaultBuildSnapshot'
import { normalizeBuildSnapshot } from '@/lib/normalizeBuildSnapshot'
import { encodeBuildToShareCode, decodeBuildFromShareCode } from '@/lib/shareCodec'
import { selectInspectedSkillDamageView, selectBuildStatsPanelDerived } from '@/selectors/buildComputedStats'

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

function main() {
  if (!existsSync(BUNDLE)) {
    console.error(`[verify:skill-data-integrity] missing ${path.relative(ROOT, BUNDLE)}`)
    process.exit(1)
  }

  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8')) as EffectiveRuntimeBundle
  const { activeSkills, supportSkills, passiveSkills, skillLevelRules, combatRules } = bundle

  const na = activeSkills.skills.length
  const ns = supportSkills.skills.length
  const np = passiveSkills.skills.length

  const issues: string[] = []
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

  // Inspected selector: null / invalid / unsupported must not throw
  const empty = createEmptyBuildSnapshot()
  const v0 = selectInspectedSkillDamageView(empty)
  if (v0.mode !== 'none' || v0.reason !== 'no_slot') {
    issues.push(`expected no_slot when inspected null, got ${JSON.stringify(v0)}`)
  }

  const badInspect = normalizeBuildSnapshot({
    ...empty,
    meta: { ...empty.meta, inspectedMainSkillSlot: 99 as unknown as typeof empty.meta.inspectedMainSkillSlot },
  })
  selectBuildStatsPanelDerived(badInspect, badInspect.meta.inspectedMainSkillSlot)
  selectInspectedSkillDamageView(badInspect)

  const legacyish = normalizeBuildSnapshot({
    ...empty,
    meta: { ...empty.meta, inspectedMainSkillSlot: null },
  })
  selectInspectedSkillDamageView(legacyish)

  const roundTrip = normalizeBuildSnapshot(decodeBuildFromShareCode(encodeBuildToShareCode(empty)))
  if (roundTrip.meta.inspectedMainSkillSlot !== empty.meta.inspectedMainSkillSlot) {
    issues.push('share round-trip altered inspectedMainSkillSlot')
  }

  if (issues.length) {
    console.error('[verify:skill-data-integrity] selector/share FAILED:\n  - ' + issues.join('\n  - '))
    process.exit(1)
  }

  console.log('[verify:skill-data-integrity] selectors + share round-trip: OK')
  console.log('[verify:skill-data-integrity] OK')
}

main()
