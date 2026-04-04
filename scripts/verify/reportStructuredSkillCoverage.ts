/**
 * 4E-0: Structured skill coverage baseline (read-only bundled JSON + engine hooks).
 * No UI changes. No formula behavior changes.
 *
 *   npm run report:structured-skill-coverage
 */
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import type { EffectiveRuntimeBundle } from '@/lib/data/types'
import type { ParseStatus } from '@/types/normalized'
import type { SkillDefinition } from '@/types/skillData'
import { createEmptyBuildSnapshot } from '@/lib/defaultBuildSnapshot'
import { normalizeBuildSnapshot } from '@/lib/normalizeBuildSnapshot'
import { computeSkillInstanceForMainSlot } from '@/lib/formula/collectBuildContributions'
import { evaluateSupportAttachment } from '@/lib/formula/skills/applySupportRules'
import {
  modifiersFromSkillLevelRow,
  modifiersFromSupportGemLevelRowAppliedToActive,
  resolveLevelRow,
} from '@/lib/formula/skills/levelRowModifiers'
import { selectInspectedSkillDamageView } from '@/selectors/buildComputedStats'
import { isMainSlotSkillFamily } from '@/lib/runtime/runtimeSkillLookup'

const ROOT = process.cwd()
const BUNDLE = path.join(ROOT, 'lib', 'gameData', 'generated', 'effective-runtime-bundle.json')
const LIST_MAX = 50

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

function missingLevelTable(def: SkillDefinition): boolean {
  const t = def.levelTable
  const empty = t == null || typeof t !== 'object' || Object.keys(t).length === 0
  if (!empty) return false
  if ((def.levelBreakpoints?.length ?? 0) > 0) return false
  if (def.unsupportedLevelDataReason) return false
  return true
}

function supportModifierCountAtLevel(sup: SkillDefinition, level: number): number {
  return (sup.modifiers?.length ?? 0) + modifiersFromSkillLevelRow(sup, level).length
}

/** Passive: no definition modifiers and no level-row modifiers at a representative level. */
function passiveHasNoApplicableModifiers(def: SkillDefinition): boolean {
  if ((def.modifiers?.length ?? 0) > 0) return false
  const lv =
    def.levelTable && Object.keys(def.levelTable).length
      ? Math.min(...Object.keys(def.levelTable).map(Number).filter(Number.isFinite))
      : 1
  return modifiersFromSkillLevelRow(def, lv).length === 0
}

function pickProbeActives(definitions: Map<string, SkillDefinition>): {
  projectile?: SkillDefinition
  allMains: SkillDefinition[]
} {
  const allMains: SkillDefinition[] = []
  for (const def of definitions.values()) {
    if (!isMainSlotSkillFamily(def.family)) continue
    allMains.push(def)
  }
  let projectile: SkillDefinition | undefined
  const ice = definitions.get('skill:Ice_Shot')
  if (ice && isMainSlotSkillFamily(ice.family)) projectile = ice
  else {
    for (const d of allMains) {
      const canon = d.tags.join(' ').toLowerCase()
      if (canon.includes('projectile') || d.tags.some((t) => t.includes('投射'))) {
        projectile = d
        break
      }
    }
  }
  if (!projectile && allMains[0]) projectile = allMains[0]
  return { projectile, allMains }
}

function main() {
  if (!existsSync(BUNDLE)) {
    console.error(`[report:structured-skill-coverage] missing ${path.relative(ROOT, BUNDLE)}`)
    process.exit(1)
  }

  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8')) as EffectiveRuntimeBundle
  const { activeSkills, supportSkills, passiveSkills } = bundle

  const na = activeSkills.skills.length
  const ns = supportSkills.skills.length
  const np = passiveSkills.skills.length
  const tally = tallyParse([activeSkills, supportSkills, passiveSkills])

  console.log('=== 4E-0 structured skill coverage (bundled effective-runtime-bundle.json) ===\n')
  console.log('1) Totals')
  console.log(`   active: ${na}  support: ${ns}  passive: ${np}`)
  console.log('')
  console.log('2) parseStatus (all skill records)')
  console.log(`   ok=${tally.ok}  partial=${tally.partial}  failed=${tally.failed}`)
  console.log('')

  const definitionsById = new Map<string, SkillDefinition>()
  for (const row of activeSkills.skills) definitionsById.set(row.definition.id, row.definition)
  for (const row of supportSkills.skills) definitionsById.set(row.definition.id, row.definition)
  for (const row of passiveSkills.skills) definitionsById.set(row.definition.id, row.definition)

  const activeNoLevelTable = activeSkills.skills
    .filter((r) => missingLevelTable(r.definition))
    .map((r) => ({ id: r.definition.id, name: r.definition.name, parseStatus: r.parseStatus }))
  console.log('3) Active skills missing levelTable (empty or absent)')
  console.log(`   count: ${activeNoLevelTable.length}`)
  for (const row of activeNoLevelTable.slice(0, LIST_MAX)) {
    console.log(`   - ${row.id}  ${row.name}  [${row.parseStatus}]`)
  }
  if (activeNoLevelTable.length > LIST_MAX) {
    console.log(`   … ${activeNoLevelTable.length - LIST_MAX} more`)
  }
  console.log(
    '   note: 多數現行 ETL 以 definition.modifiers / summary 為主，未必寫入 levelTable；下方 3b 補「Lv20 無任何 level row」更有公式意義。',
  )

  const activeNoLevelRow20 = activeSkills.skills
    .filter((r) => !r.definition.unsupportedLevelDataReason)
    .filter((r) => resolveLevelRow(r.definition, 20).source === 'none')
    .map((r) => ({ id: r.definition.id, name: r.definition.name, parseStatus: r.parseStatus }))
  console.log('')
  console.log('3b) Active skills: resolveLevelRow absent at gem level 20 (no table/breakpoint row)')
  console.log(`   count: ${activeNoLevelRow20.length}`)
  for (const row of activeNoLevelRow20.slice(0, LIST_MAX)) {
    console.log(`   - ${row.id}  ${row.name}  [${row.parseStatus}]`)
  }
  if (activeNoLevelRow20.length > LIST_MAX) {
    console.log(`   … ${activeNoLevelRow20.length - LIST_MAX} more`)
  }
  console.log('')

  const supportNoMods = supportSkills.skills
    .filter((r) => (r.definition.modifiers?.length ?? 0) === 0)
    .map((r) => ({ id: r.definition.id, name: r.definition.name, parseStatus: r.parseStatus }))
  console.log('4) Support skills with no definition.modifiers array entries')
  console.log(`   count: ${supportNoMods.length}`)
  for (const row of supportNoMods.slice(0, LIST_MAX)) {
    console.log(`   - ${row.id}  ${row.name}  [${row.parseStatus}]`)
  }
  if (supportNoMods.length > LIST_MAX) console.log(`   … ${supportNoMods.length - LIST_MAX} more`)
  console.log('')

  const passiveNoApply = passiveSkills.skills
    .filter((r) => passiveHasNoApplicableModifiers(r.definition))
    .map((r) => ({ id: r.definition.id, name: r.definition.name, parseStatus: r.parseStatus }))
  console.log('5) Passive skills with no modifiers and no level-row-derived modifiers')
  console.log(`   count: ${passiveNoApply.length}`)
  for (const row of passiveNoApply.slice(0, LIST_MAX)) {
    console.log(`   - ${row.id}  ${row.name}  [${row.parseStatus}]`)
  }
  if (passiveNoApply.length > LIST_MAX) console.log(`   … ${passiveNoApply.length - LIST_MAX} more`)
  console.log('')

  const { projectile: probeMain, allMains } = pickProbeActives(definitionsById)

  const damagingPartial: string[] = []
  const damagingUnsupported: string[] = []
  const mainPartialRecord: string[] = []

  for (const def of allMains) {
    const snap = normalizeBuildSnapshot({
      ...createEmptyBuildSnapshot(),
      meta: { ...createEmptyBuildSnapshot().meta, inspectedMainSkillSlot: 1, level: 99 },
      skills: [
        {
          slot: 1,
          skillId: def.id,
          supports: [],
          skillLevel: 20,
          enabled: true,
        },
        ...createEmptyBuildSnapshot().skills.slice(1),
      ],
    })

    const inst = computeSkillInstanceForMainSlot(snap.skills[0]!, snap)
    if (!inst) continue

    const rec = activeSkills.skills.find((x) => x.definition.id === def.id)
    if (rec?.parseStatus === 'partial') {
      mainPartialRecord.push(`${def.id}  ${def.name}  damageRole=${inst.damageRole}  conf=${inst.calculationConfidence}`)
    }

    if (inst.damageRole === 'damaging' && inst.calculationConfidence === 'partial') {
      damagingPartial.push(`${def.id}  ${def.name}  parse=${rec?.parseStatus ?? '?'}`)
    }
    if (inst.damageRole === 'damaging' && inst.calculationConfidence === 'unsupported') {
      damagingUnsupported.push(`${def.id}  ${def.name}  parse=${rec?.parseStatus ?? '?'}`)
    }
  }

  console.log(
    '6) Main-slot pickable skills — inspected pipeline (Lv20 main, empty supports, char L99 in snapshot for formula only)',
  )
  console.log(`   damaging + calculationConfidence partial: ${damagingPartial.length}`)
  for (const line of damagingPartial.slice(0, LIST_MAX)) console.log(`   - ${line}`)
  if (damagingPartial.length > LIST_MAX) console.log(`   … ${damagingPartial.length - LIST_MAX} more`)

  console.log(`   damaging + calculationConfidence unsupported: ${damagingUnsupported.length}`)
  for (const line of damagingUnsupported.slice(0, LIST_MAX)) console.log(`   - ${line}`)
  if (damagingUnsupported.length > LIST_MAX) console.log(`   … ${damagingUnsupported.length - LIST_MAX} more`)

  console.log(`   main-slot skills with record parseStatus=partial: ${mainPartialRecord.length}`)
  for (const line of mainPartialRecord.slice(0, 40)) console.log(`   - ${line}`)
  if (mainPartialRecord.length > 40) console.log(`   … ${mainPartialRecord.length - 40} more`)
  console.log('')

  console.log('6b) Spot-check: inspected damage view mode vs instance confidence (slot 1)')
  if (probeMain) {
    const snap = normalizeBuildSnapshot({
      ...createEmptyBuildSnapshot(),
      meta: { ...createEmptyBuildSnapshot().meta, inspectedMainSkillSlot: 1 },
      skills: [
        { slot: 1, skillId: probeMain.id, supports: [], skillLevel: 20, enabled: true },
        ...createEmptyBuildSnapshot().skills.slice(1),
      ],
    })
    const view = selectInspectedSkillDamageView(snap)
    const inst = computeSkillInstanceForMainSlot(snap.skills[0]!, snap)
    console.log(
      `   probe main: ${probeMain.id}  view.mode=${view.mode}  instance.conf=${inst?.calculationConfidence ?? 'n/a'}  role=${inst?.damageRole ?? 'n/a'}`,
    )
  }
  console.log('')

  const mainCount = allMains.length
  console.log('7) Support links: UI always allows gems — structured effect often empty')
  const supportOnlyTagRule = supportSkills.skills.filter((r) => {
    const t = r.definition.supportRules?.allowedSkillTags
    return Array.isArray(t) && t.length > 0 && t.every((x) => x === 'Support' || x === '輔助')
  })
  console.log(
    `   supports whose supportRules.allowedSkillTags only list the support-gem tag (Support/輔助): ${supportOnlyTagRule.length}`,
  )
  console.log(
    '   → 現行 evaluateSupportAttachment 會要求主技能也帶該 tag，導致 appliedTo=0（資料/推斷規則問題，非純 UI）。',
  )
  console.log(
    `   Per-support stats vs ${mainCount} main-slot skills (Lv20). ` +
      '“empty_when_applied” = applied to active but 0 def.modifiers + 0 Lv20 level-row mods on support.',
  )

  type SupRow = {
    id: string
    name: string
    appliedTo: number
    skipped: number
    emptyWhenApplied: number
    missingRulesCompat: number
  }
  const supRows: SupRow[] = []

  for (const row of supportSkills.skills) {
    const sup = row.definition
    if (sup.family !== 'support') continue

    let appliedTo = 0
    let skipped = 0
    let emptyWhenApplied = 0
    let missingRulesCompat = 0

    const rules = sup.supportRules
    if (!rules || Object.keys(rules).length === 0) missingRulesCompat = 1

    for (const main of allMains) {
      const ev = evaluateSupportAttachment(main, sup)
      if (!ev.applied) {
        skipped += 1
        continue
      }
      appliedTo += 1
      if (supportModifierCountAtLevel(sup, 20) === 0) emptyWhenApplied += 1
    }

    supRows.push({
      id: sup.id,
      name: sup.name,
      appliedTo,
      skipped,
      emptyWhenApplied,
      missingRulesCompat,
    })
  }

  const oftenSkipped = supRows
    .filter((r) => mainCount > 0 && r.skipped / mainCount >= 0.9)
    .sort((a, b) => b.skipped - a.skipped)
  const appliedButNoMods = supRows
    .filter((r) => r.appliedTo > 0 && r.emptyWhenApplied === r.appliedTo)
    .sort((a, b) => b.appliedTo - a.appliedTo)

  console.log(`   supports skipped on ≥90% of main skills: ${oftenSkipped.length}`)
  for (const r of oftenSkipped.slice(0, LIST_MAX)) {
    console.log(
      `   - ${r.id}  ${r.name}  appliedTo=${r.appliedTo}/${mainCount}  skipped=${r.skipped}  missingRulesCompat=${r.missingRulesCompat}`,
    )
  }
  if (oftenSkipped.length > LIST_MAX) console.log(`   … ${oftenSkipped.length - LIST_MAX} more`)

  console.log(`   supports that can attach to ≥1 main but never emit structured mods (when attached): ${appliedButNoMods.length}`)
  for (const r of appliedButNoMods.slice(0, LIST_MAX)) {
    console.log(
      `   - ${r.id}  ${r.name}  appliedTo=${r.appliedTo}  (all those attachments have 0 modifiers + 0 Lv20 row mods)`,
    )
  }
  if (appliedButNoMods.length > LIST_MAX) console.log(`   … ${appliedButNoMods.length - LIST_MAX} more`)

  if (probeMain) {
    console.log('')
    console.log(`   Reference main for single-pair probe: ${probeMain.id} (${probeMain.name})`)
    const refLines: string[] = []
    for (const row of supportSkills.skills) {
      const sup = row.definition
      if (sup.family !== 'support') continue
      const ev = evaluateSupportAttachment(probeMain, sup)
      const n = supportModifierCountAtLevel(sup, 20)
      const fromRow = modifiersFromSupportGemLevelRowAppliedToActive(probeMain.id, sup, 20).length
      if (ev.applied && (sup.modifiers?.length ?? 0) === 0 && fromRow === 0) {
        refLines.push(`${sup.id}  ${sup.name}  applied  Lv20 row mods→active: 0`)
      }
    }
    refLines.sort()
    console.log(`   applied to reference main but 0 structured mods at Lv20: ${refLines.length}`)
    for (const line of refLines.slice(0, 30)) console.log(`   - ${line}`)
    if (refLines.length > 30) console.log(`   … ${refLines.length - 30} more`)
  }

  console.log('')
  console.log('[report:structured-skill-coverage] done')
}

main()
