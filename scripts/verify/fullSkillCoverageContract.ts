/**
 * 4F-8 — Full skill coverage metrics + release gate thresholds (bundle + engine, no UI).
 * Shared by `report:full-skill-coverage` and `verify:full-skill-coverage-gate`.
 */
import type { EffectiveRuntimeBundle } from '@/lib/data/types'
import type { ParseStatus } from '@/types/normalized'
import type { SkillDefinition, SupportRule } from '@/types/skillData'
import type { CalculationConfidence } from '@/types/skillInstance'
import { createEmptyBuildSnapshot } from '@/lib/defaultBuildSnapshot'
import { normalizeBuildSnapshot } from '@/lib/normalizeBuildSnapshot'
import { computeSkillInstanceForMainSlot } from '@/lib/formula/collectBuildContributions'
import { computeSkillInstance } from '@/lib/formula/skills/computeSkillInstance'
import { modifiersFromSkillLevelRow, resolveLevelRow } from '@/lib/formula/skills/levelRowModifiers'
import { selectInspectedSkillDamageView } from '@/selectors/buildComputedStats'
import { isMainSlotSkillFamily } from '@/lib/runtime/runtimeSkillLookup'
import { bundledGlobalCombatRuleLayer } from '@/lib/runtime/runtimeRulesLookup'

/** Hard gate: regression must not loosen these without team sign-off (see docs/4f-release-checklist.md). */
export const FULL_SKILL_COVERAGE_GATE = {
  /** No normalized skill record may be `failed`. */
  maxParseFailedRecords: 0,
  /** Floor for parse ok / (active+support+passive) — catches mass parser breakage. */
  minParseOkRatio: 0.82,
  /** Actives must retain a level surface (table, breakpoints, or documented opt-out). */
  maxActiveMissingLevelTable: 0,
  /** Lv20 row must resolve for all actives without explicit unsupportedLevelDataReason. */
  maxActiveResolveLv20None: 0,
  /** Support gems must not be both modifier-empty AND rule-empty (unpairable). */
  maxSupportBothHollow: 0,
  /** Damaging skills must reach instance `ready` in isolated Lv20 probe (formula + row). */
  maxMainDamagingInstanceNotReady: 0,
  /** Passives with parseStatus ok must expose at least one injectable modifier path. */
  maxPassiveParseOkWithoutInjectableModifiers: 0,
} as const

export type FullSkillCoverageMetrics = {
  recordCounts: { active: number; support: number; passive: number; all: number }
  parseTally: Record<ParseStatus, number>
  parseOkRatio: number
  activeMissingLevelTable: number
  activeResolveLv20None: number
  supportBothHollow: number
  supportWeakRules: number
  supportEmptyModifiers: number
  damagingInstanceNotReadyCount: number
  passiveNoInjectAllParseStatuses: number
  passiveParseOkWithoutInjectableModifiers: number
  mainSlotActiveCount: number
  mainActiveConfidence: Record<CalculationConfidence, number>
  mainDamagingConfidence: Record<CalculationConfidence, number>
  inspectedDamagingAuthoritative: number
  inspectedDamagingNonReadyEffective: number
  inspectedDpsBlocked: number
}

export function supportRulesMeaningful(r: SupportRule | undefined): boolean {
  if (!r || typeof r !== 'object') return false
  if (Array.isArray(r.allowedSkillTags) && r.allowedSkillTags.length > 0) return true
  if (Array.isArray(r.forbiddenSkillTags) && r.forbiddenSkillTags.length > 0) return true
  if (Array.isArray(r.rawRequirementLines) && r.rawRequirementLines.length > 0) return true
  if (r.requiresAttack || r.requiresSpell || r.requiresProjectile || r.requiresChanneled) return true
  if (typeof r.maxSupportsPerSkill === 'number') return true
  if (Array.isArray(r.socketColors) && r.socketColors.length > 0) return true
  return false
}

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

export function computeFullSkillCoverageMetrics(bundle: EffectiveRuntimeBundle): FullSkillCoverageMetrics {
  const { activeSkills, supportSkills, passiveSkills } = bundle
  const na = activeSkills.skills.length
  const ns = supportSkills.skills.length
  const np = passiveSkills.skills.length
  const nAll = na + ns + np

  const parseTally = tallyParse([activeSkills, supportSkills, passiveSkills])
  const parseOkRatio = nAll > 0 ? parseTally.ok / nAll : 0

  const activeNoLt = activeSkills.skills.filter((r) => missingLevelTable(r.definition))
  const activeNoRow20 = activeSkills.skills.filter((r) => {
    if (r.definition.unsupportedLevelDataReason) return false
    return resolveLevelRow(r.definition, 20).source === 'none'
  })

  const supportBothHollow = supportSkills.skills.filter(
    (r) => (r.definition.modifiers?.length ?? 0) === 0 && !supportRulesMeaningful(r.definition.supportRules),
  )
  const supportWeakRules = supportSkills.skills.filter((r) => !supportRulesMeaningful(r.definition.supportRules))
  const supportEmptyModifiers = supportSkills.skills.filter((r) => (r.definition.modifiers?.length ?? 0) === 0)

  const passiveNoInject = passiveSkills.skills.filter((r) => passiveHasNoApplicableModifiers(r.definition))
  let passiveOkNoInject = 0
  for (const row of passiveSkills.skills) {
    if (row.parseStatus !== 'ok') continue
    const def = row.definition
    const modN = def.modifiers?.length ?? 0
    const rowMods = modifiersFromSkillLevelRow(def, 20).length
    if (modN === 0 && rowMods === 0) passiveOkNoInject += 1
  }

  const layer = bundledGlobalCombatRuleLayer()
  let damagingNotReady = 0
  let inspectedAuth = 0
  let inspectedNonReadyEff = 0
  let inspectedDpsBlocked = 0

  const confMain: Record<CalculationConfidence, number> = { ready: 0, partial: 0, unsupported: 0 }
  const confDamaging: Record<CalculationConfidence, number> = { ready: 0, partial: 0, unsupported: 0 }

  const allMains = activeSkills.skills
    .map((r) => r.definition)
    .filter((d) => isMainSlotSkillFamily(d.family))

  for (const def of allMains) {
    const rec = activeSkills.skills.find((x) => x.definition.id === def.id)
    const inst = computeSkillInstance({
      active: def,
      level: 20,
      supports: [],
      globalLayer: layer,
      activeParse: rec ? { status: rec.parseStatus, warnings: rec.warnings } : undefined,
    })
    confMain[inst.calculationConfidence] += 1
    if (inst.damageRole === 'damaging') {
      confDamaging[inst.calculationConfidence] += 1
    }
    if (inst.damageRole === 'damaging' && inst.calculationConfidence !== 'ready') {
      damagingNotReady += 1
    }

    const snap = normalizeBuildSnapshot({
      ...createEmptyBuildSnapshot(),
      meta: { ...createEmptyBuildSnapshot().meta, inspectedMainSkillSlot: 1, level: 99 },
      skills: [
        { slot: 1, skillId: def.id, supports: [], skillLevel: 20, enabled: true },
        ...createEmptyBuildSnapshot().skills.slice(1),
      ],
    })
    const instMain = computeSkillInstanceForMainSlot(snap.skills[0]!, snap)
    if (!instMain) continue
    const view = selectInspectedSkillDamageView(snap)
    if (view.mode === 'damaging') {
      if (view.damagingPresentation === 'authoritative' && view.effectiveCalculationConfidence === 'ready') {
        inspectedAuth += 1
      }
      if (view.effectiveCalculationConfidence !== 'ready') {
        inspectedNonReadyEff += 1
      }
    }
    if (view.mode === 'dpsBlocked') inspectedDpsBlocked += 1
  }

  return {
    recordCounts: { active: na, support: ns, passive: np, all: nAll },
    parseTally,
    parseOkRatio,
    activeMissingLevelTable: activeNoLt.length,
    activeResolveLv20None: activeNoRow20.length,
    supportBothHollow: supportBothHollow.length,
    supportWeakRules: supportWeakRules.length,
    supportEmptyModifiers: supportEmptyModifiers.length,
    damagingInstanceNotReadyCount: damagingNotReady,
    passiveNoInjectAllParseStatuses: passiveNoInject.length,
    passiveParseOkWithoutInjectableModifiers: passiveOkNoInject,
    mainSlotActiveCount: allMains.length,
    mainActiveConfidence: confMain,
    mainDamagingConfidence: confDamaging,
    inspectedDamagingAuthoritative: inspectedAuth,
    inspectedDamagingNonReadyEffective: inspectedNonReadyEff,
    inspectedDpsBlocked: inspectedDpsBlocked,
  }
}

export type GateResult = { ok: boolean; failures: string[]; warnings: string[] }

export function evaluateFullSkillCoverageGate(m: FullSkillCoverageMetrics): GateResult {
  const failures: string[] = []
  const warnings: string[] = []
  const G = FULL_SKILL_COVERAGE_GATE

  if (m.parseTally.failed > G.maxParseFailedRecords) {
    failures.push(`parse failed records ${m.parseTally.failed} > max ${G.maxParseFailedRecords}`)
  }
  if (m.parseOkRatio + 1e-9 < G.minParseOkRatio) {
    failures.push(
      `parse ok ratio ${m.parseOkRatio.toFixed(4)} < min ${G.minParseOkRatio} (ok=${m.parseTally.ok} / all=${m.recordCounts.all})`,
    )
  }
  if (m.activeMissingLevelTable > G.maxActiveMissingLevelTable) {
    failures.push(
      `active missing levelTable ${m.activeMissingLevelTable} > max ${G.maxActiveMissingLevelTable}`,
    )
  }
  if (m.activeResolveLv20None > G.maxActiveResolveLv20None) {
    failures.push(`active Lv20 resolve none ${m.activeResolveLv20None} > max ${G.maxActiveResolveLv20None}`)
  }
  if (m.supportBothHollow > G.maxSupportBothHollow) {
    failures.push(`support both hollow ${m.supportBothHollow} > max ${G.maxSupportBothHollow}`)
  }
  if (m.damagingInstanceNotReadyCount > G.maxMainDamagingInstanceNotReady) {
    failures.push(
      `damaging but instance not ready ${m.damagingInstanceNotReadyCount} > max ${G.maxMainDamagingInstanceNotReady}`,
    )
  }
  if (m.passiveParseOkWithoutInjectableModifiers > G.maxPassiveParseOkWithoutInjectableModifiers) {
    failures.push(
      `passive parse=ok without inject ${m.passiveParseOkWithoutInjectableModifiers} > max ${G.maxPassiveParseOkWithoutInjectableModifiers}`,
    )
  }

  if (m.supportWeakRules > m.recordCounts.support * 0.65) {
    warnings.push(
      `support weak rules ${m.supportWeakRules}/${m.recordCounts.support} — audit supportRules coverage (non-fatal)`,
    )
  }
  if (m.passiveNoInjectAllParseStatuses > m.recordCounts.passive * 0.92) {
    warnings.push(
      `passive narrative-only ${m.passiveNoInjectAllParseStatuses}/${m.recordCounts.passive} — many partial passives lack inject`,
    )
  }

  return { ok: failures.length === 0, failures, warnings }
}

export function formatConfidenceDist(label: string, d: Record<CalculationConfidence, number>): string {
  return `${label}: ready=${d.ready} partial=${d.partial} unsupported=${d.unsupported}`
}

