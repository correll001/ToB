/**
 * 4F-0 / 4F-8: Full skill baseline — coverage matrix + gap buckets (read-only bundle + engine).
 * Hard thresholds live in `fullSkillCoverageContract.ts` → `npm run verify:full-skill-coverage-gate`.
 *
 *   npm run report:full-skill-coverage
 */
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import type { EffectiveRuntimeBundle } from '@/lib/data/types'
import type { ParseStatus } from '@/types/normalized'
import type { SkillDefinition } from '@/types/skillData'
import { createEmptyBuildSnapshot } from '@/lib/defaultBuildSnapshot'
import { normalizeBuildSnapshot } from '@/lib/normalizeBuildSnapshot'
import { computeSkillInstanceForMainSlot } from '@/lib/formula/collectBuildContributions'
import { computeSkillInstance } from '@/lib/formula/skills/computeSkillInstance'
import { modifiersFromSkillLevelRow, resolveLevelRow } from '@/lib/formula/skills/levelRowModifiers'
import { selectInspectedSkillDamageView } from '@/selectors/buildComputedStats'
import { isMainSlotSkillFamily } from '@/lib/runtime/runtimeSkillLookup'
import { bundledGlobalCombatRuleLayer } from '@/lib/runtime/runtimeRulesLookup'
import { supportRulesMeaningful } from '@/scripts/verify/fullSkillCoverageContract'

const ROOT = process.cwd()
const BUNDLE = path.join(ROOT, 'lib', 'gameData', 'generated', 'effective-runtime-bundle.json')
const LIST_MAX = 80
const TOP_GAP_SKILLS = 20

export type GapCategory =
  | 'parser'
  | 'override_level'
  | 'level_row'
  | 'support_rule'
  | 'passive_inject'
  | 'formula_engine'

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

/** False when levelTable exists, breakpoints exist, or wiki truly has no `成長` table (4F-2 documented gap). */
function missingLevelTable(def: SkillDefinition): boolean {
  const t = def.levelTable
  const empty = t == null || typeof t !== 'object' || Object.keys(t).length === 0
  if (!empty) return false
  if ((def.levelBreakpoints?.length ?? 0) > 0) return false
  if (def.unsupportedLevelDataReason) return false
  return true
}

function passiveHasNoApplicableModifiers(def: SkillDefinition): boolean {
  if ((def.modifiers?.length ?? 0) > 0) return false
  const lv =
    def.levelTable && Object.keys(def.levelTable).length
      ? Math.min(...Object.keys(def.levelTable).map(Number).filter(Number.isFinite))
      : 1
  return modifiersFromSkillLevelRow(def, lv).length === 0
}

function passiveNarrativeOnly(def: SkillDefinition): boolean {
  const hasNarrative = (def.summaryText?.length ?? 0) > 0 || (def.detailText?.length ?? 0) > 0
  return hasNarrative && passiveHasNoApplicableModifiers(def)
}

function tagGaps(map: Map<string, Set<GapCategory>>, id: string, ...cats: GapCategory[]) {
  if (!map.has(id)) map.set(id, new Set())
  const s = map.get(id)!
  for (const c of cats) s.add(c)
}

function main() {
  if (!existsSync(BUNDLE)) {
    console.error(`[report:full-skill-coverage] missing ${path.relative(ROOT, BUNDLE)}`)
    process.exit(1)
  }

  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8')) as EffectiveRuntimeBundle
  const { activeSkills, supportSkills, passiveSkills } = bundle
  const tally = tallyParse([activeSkills, supportSkills, passiveSkills])
  const gapBySkill = new Map<string, Set<GapCategory>>()

  const na = activeSkills.skills.length
  const ns = supportSkills.skills.length
  const np = passiveSkills.skills.length

  console.log('=== 4F-0 full skill coverage matrix (effective-runtime-bundle.json) ===\n')

  console.log('1) Totals')
  console.log(`   active: ${na}  support: ${ns}  passive: ${np}`)
  console.log('')
  console.log('2) parseStatus distribution (all records)')
  console.log(`   ok=${tally.ok}  partial=${tally.partial}  failed=${tally.failed}`)
  console.log('')

  const activeNoLt = activeSkills.skills.filter((r) => missingLevelTable(r.definition))
  console.log('3) Active — missing levelTable (empty / absent)')
  console.log(`   count: ${activeNoLt.length}`)
  for (const r of activeNoLt) {
    tagGaps(gapBySkill, r.definition.id, 'override_level')
    if (r.parseStatus !== 'ok') tagGaps(gapBySkill, r.definition.id, 'parser')
  }
  for (const r of activeNoLt.slice(0, LIST_MAX)) {
    console.log(`   - ${r.definition.id}  ${r.definition.name}  [${r.parseStatus}]`)
  }
  if (activeNoLt.length > LIST_MAX) console.log(`   … ${activeNoLt.length - LIST_MAX} more`)
  console.log('')

  const activeNoRow20 = activeSkills.skills.filter((r) => {
    if (r.definition.unsupportedLevelDataReason) return false
    return resolveLevelRow(r.definition, 20).source === 'none'
  })
  console.log('3b) Active — resolveLevelRow(Lv20) === none')
  console.log(`   count: ${activeNoRow20.length}`)
  for (const r of activeNoRow20) {
    tagGaps(gapBySkill, r.definition.id, 'level_row')
    if (r.parseStatus !== 'ok') tagGaps(gapBySkill, r.definition.id, 'parser')
    if (missingLevelTable(r.definition) && r.parseStatus === 'ok') tagGaps(gapBySkill, r.definition.id, 'override_level')
  }
  for (const r of activeNoRow20.slice(0, LIST_MAX)) {
    console.log(`   - ${r.definition.id}  ${r.definition.name}  [${r.parseStatus}]`)
  }
  if (activeNoRow20.length > LIST_MAX) console.log(`   … ${activeNoRow20.length - LIST_MAX} more`)
  console.log('')

  const layer = bundledGlobalCombatRuleLayer()
  const damagingNotReady: string[] = []
  const inspectedPartial: string[] = []
  const inspectedUnsupported: string[] = []
  const inspectedDpsBlocked: string[] = []

  const allMains = activeSkills.skills
    .map((r) => r.definition)
    .filter((d) => isMainSlotSkillFamily(d.family))

  for (const def of allMains) {
    const rec = activeSkills.skills.find((x) => x.definition.id === def.id)
    const snap = normalizeBuildSnapshot({
      ...createEmptyBuildSnapshot(),
      meta: { ...createEmptyBuildSnapshot().meta, inspectedMainSkillSlot: 1, level: 99 },
      skills: [
        { slot: 1, skillId: def.id, supports: [], skillLevel: 20, enabled: true },
        ...createEmptyBuildSnapshot().skills.slice(1),
      ],
    })
    const inst = computeSkillInstance({
      active: def,
      level: 20,
      supports: [],
      globalLayer: layer,
      activeParse: rec ? { status: rec.parseStatus, warnings: rec.warnings } : undefined,
    })
    if (inst.damageRole === 'damaging' && inst.calculationConfidence !== 'ready') {
      const line = `${def.id}  ${def.name}  conf=${inst.calculationConfidence}  parse=${rec?.parseStatus ?? '?'}`
      damagingNotReady.push(line)
      tagGaps(gapBySkill, def.id, 'formula_engine')
      if (rec && rec.parseStatus !== 'ok') tagGaps(gapBySkill, def.id, 'parser')
      if (resolveLevelRow(def, 20).source === 'none') tagGaps(gapBySkill, def.id, 'level_row')
    }

    const instMain = computeSkillInstanceForMainSlot(snap.skills[0]!, snap)
    if (!instMain) continue
    const view = selectInspectedSkillDamageView(snap)
    if (view.mode === 'damaging' && view.effectiveCalculationConfidence !== 'ready') {
      inspectedPartial.push(
        `${def.id}  ${def.name}  effective=${view.effectiveCalculationConfidence}  presentation=${view.damagingPresentation}`,
      )
    }
    if (view.mode === 'dpsBlocked') {
      inspectedDpsBlocked.push(
        `${def.id}  ${def.name}  ${view.blockReason}  inst=${view.calculationConfidence} eff=${view.effectiveCalculationConfidence}`,
      )
    }
    if (
      instMain.calculationConfidence === 'partial' ||
      instMain.calculationConfidence === 'unsupported'
    ) {
      inspectedUnsupported.push(
        `${def.id}  ${def.name}  role=${instMain.damageRole}  conf=${instMain.calculationConfidence}  view=${view.mode}`,
      )
    }
  }

  console.log('4) Active — damaging @ Lv20 isolated instance but calculationConfidence !== ready')
  console.log(`   count: ${damagingNotReady.length}`)
  for (const line of damagingNotReady.slice(0, LIST_MAX)) console.log(`   - ${line}`)
  if (damagingNotReady.length > LIST_MAX) console.log(`   … ${damagingNotReady.length - LIST_MAX} more`)
  console.log('')

  const supportEmptyMods = supportSkills.skills.filter((r) => (r.definition.modifiers?.length ?? 0) === 0)
  console.log('5) Support — definition.modifiers empty')
  console.log(`   count: ${supportEmptyMods.length}`)
  for (const r of supportEmptyMods) {
    if (r.parseStatus !== 'ok') tagGaps(gapBySkill, r.definition.id, 'parser')
  }
  for (const r of supportEmptyMods.slice(0, LIST_MAX)) {
    console.log(`   - ${r.definition.id}  ${r.definition.name}  [${r.parseStatus}]`)
  }
  if (supportEmptyMods.length > LIST_MAX) console.log(`   … ${supportEmptyMods.length - LIST_MAX} more`)
  console.log('')

  const supportWeakRules = supportSkills.skills.filter((r) => !supportRulesMeaningful(r.definition.supportRules))
  console.log('5b) Support — supportRules not meaningful (no tags/requires/raw lines)')
  console.log(`   count: ${supportWeakRules.length}`)
  for (const r of supportWeakRules) {
    tagGaps(gapBySkill, r.definition.id, 'support_rule')
    if (r.parseStatus !== 'ok') tagGaps(gapBySkill, r.definition.id, 'parser')
  }
  for (const r of supportWeakRules.slice(0, LIST_MAX)) {
    console.log(`   - ${r.definition.id}  ${r.definition.name}  [${r.parseStatus}]`)
  }
  if (supportWeakRules.length > LIST_MAX) console.log(`   … ${supportWeakRules.length - LIST_MAX} more`)
  console.log('')

  const supportBothHollow = supportSkills.skills.filter(
    (r) => (r.definition.modifiers?.length ?? 0) === 0 && !supportRulesMeaningful(r.definition.supportRules),
  )
  console.log('5c) Support — BOTH empty modifiers AND weak supportRules (pairing/effect data hole)')
  console.log(`   count: ${supportBothHollow.length}`)
  for (const r of supportBothHollow) {
    tagGaps(gapBySkill, r.definition.id, 'support_rule')
  }
  for (const r of supportBothHollow.slice(0, LIST_MAX)) {
    console.log(`   - ${r.definition.id}  ${r.definition.name}  [${r.parseStatus}]`)
  }
  if (supportBothHollow.length > LIST_MAX) console.log(`   … ${supportBothHollow.length - LIST_MAX} more`)
  console.log('')

  const passiveNoInject = passiveSkills.skills.filter((r) => passiveHasNoApplicableModifiers(r.definition))
  console.log('6) Passive — no def.modifiers and no level-row-derived modifiers (representative level)')
  console.log(`   count: ${passiveNoInject.length}`)
  for (const r of passiveNoInject) {
    tagGaps(gapBySkill, r.definition.id, 'passive_inject')
    if (r.parseStatus !== 'ok') tagGaps(gapBySkill, r.definition.id, 'parser')
  }
  for (const r of passiveNoInject.slice(0, LIST_MAX)) {
    console.log(`   - ${r.definition.id}  ${r.definition.name}  [${r.parseStatus}]`)
  }
  if (passiveNoInject.length > LIST_MAX) console.log(`   … ${passiveNoInject.length - LIST_MAX} more`)
  console.log('')

  const passiveStoryOnly = passiveSkills.skills.filter((r) => passiveNarrativeOnly(r.definition))
  console.log(
    '6b) Passive — narrative text present but no structured inject (linked/global 可能長期無實效 — 僅文字)',
  )
  console.log(`   count: ${passiveStoryOnly.length}`)
  for (const r of passiveStoryOnly) {
    tagGaps(gapBySkill, r.definition.id, 'passive_inject')
  }
  for (const r of passiveStoryOnly.slice(0, Math.min(40, LIST_MAX))) {
    console.log(`   - ${r.definition.id}  ${r.definition.name}  [${r.parseStatus}]`)
  }
  if (passiveStoryOnly.length > 40) console.log(`   … ${passiveStoryOnly.length - 40} more`)
  console.log('')

  console.log('7) Inspected pipeline (slot1, Lv20 main, empty supports, char L99) — partial / blocked / conf flags')
  console.log(`   damaging view but effective !== ready: ${inspectedPartial.length}`)
  for (const line of inspectedPartial.slice(0, 40)) console.log(`   - ${line}`)
  if (inspectedPartial.length > 40) console.log(`   … ${inspectedPartial.length - 40} more`)
  console.log(`   dpsBlocked view: ${inspectedDpsBlocked.length}`)
  for (const line of inspectedDpsBlocked.slice(0, 40)) console.log(`   - ${line}`)
  if (inspectedDpsBlocked.length > 40) console.log(`   … ${inspectedDpsBlocked.length - 40} more`)
  console.log(`   instance conf partial|unsupported (any role): ${inspectedUnsupported.length}`)
  for (const line of inspectedUnsupported.slice(0, 40)) console.log(`   - ${line}`)
  if (inspectedUnsupported.length > 40) console.log(`   … ${inspectedUnsupported.length - 40} more`)
  console.log('')

  const allRecords = [...activeSkills.skills, ...supportSkills.skills, ...passiveSkills.skills]
  for (const r of allRecords) {
    if (r.parseStatus === 'partial' || r.parseStatus === 'failed') {
      tagGaps(gapBySkill, r.definition.id, 'parser')
    }
  }

  const gapLabels: { key: GapCategory; title: string }[] = [
    { key: 'parser', title: 'parser 缺口 (parseStatus partial/failed)' },
    { key: 'override_level', title: 'override 缺口 (active 缺 levelTable；parse 仍可能 ok)' },
    { key: 'level_row', title: 'level row 映射缺口 (Lv20 resolve none)' },
    { key: 'support_rule', title: 'support rule 缺口 (無 meaningful supportRules)' },
    { key: 'passive_inject', title: 'passive inject 缺口 (無可套用 modifier / 僅敘述)' },
    { key: 'formula_engine', title: 'formula 缺口 (damaging 但 instance confidence !== ready)' },
  ]

  console.log('8) Gap buckets (skill id 可多標籤)')
  for (const { key, title } of gapLabels) {
    const ids = [...gapBySkill.entries()].filter(([, set]) => set.has(key)).map(([id]) => id)
    console.log(`   ${title}: ${ids.length}`)
    console.log(`      ${ids.slice(0, 25).join(', ')}${ids.length > 25 ? ' …' : ''}`)
  }
  console.log('')

  const ranked = [...gapBySkill.entries()]
    .map(([id, set]) => ({ id, n: set.size, tags: [...set].sort().join('+') }))
    .sort((a, b) => b.n - a.n || a.id.localeCompare(b.id))

  console.log(`9) Top ${TOP_GAP_SKILLS} skills by multi-gap severity (標籤數)`)
  for (const row of ranked.slice(0, TOP_GAP_SKILLS)) {
    console.log(`   ${row.n}  ${row.id}  (${row.tags})`)
  }
  console.log('')

  console.log('[report:full-skill-coverage] done')
}

main()
