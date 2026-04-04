// selectors/buildComputedStats.ts
/**
 * Sidebar stats: summary labels + combat from data-driven formula pipeline
 * (collect → aggregate → derive). No PRNG / stableMix.
 */
import type { BuildSnapshot, MainSkillSlot, SkillSetup } from '@/types/build'
import { isMainSkillSlot } from '@/lib/build/supportLinks'
import type { BuildSidebarCombatStats, CombatBreakdown, ContributionEntry } from '@/types/combat'
import type {
  CalculationConfidence,
  InspectedSkillDamageView,
  InspectedSkillDebugView,
  InspectedSkillNoneReason,
  SkillInstance,
  SkillInstanceBreakdown,
} from '@/types/skillInstance'
import {
  collectBuildContributions,
  computeSkillInstanceForMainSlot,
  filterContributionsForInspectedMainSkill,
} from '@/lib/formula/collectBuildContributions'
import { selectDivinityBoardTextChars, selectFilledGearCount, selectValidationErrors } from '@/selectors/buildSelectors'
import {
  mockDivinityBoardOptions,
  mockHeroes,
  mockRelics,
  mockSpecialties,
  mockTraits,
} from '@/data/mockGameData'
import { aggregateStatBlocks } from '@/lib/formula/aggregateStats'
import { computeDerivedCombat } from '@/lib/formula/computeDerivedCombat'
import { resolveLevelRow } from '@/lib/formula/skills/levelRowModifiers'
import type { SkillDamageRole } from '@/types/skillDamageRole'
import { getSkillDefinitionById } from '@/lib/runtime/runtimeSkillLookup'
import type { SkillDefinition, SkillLevelEntry } from '@/types/skillData'
import type { DerivedCombatLayerConfidence } from '@/types/combat'

export type { BuildSidebarCombatStats } from '@/types/combat'

function worstCalculationConfidence(a: CalculationConfidence, b: CalculationConfidence): CalculationConfidence {
  const rank: Record<CalculationConfidence, number> = { unsupported: 0, partial: 1, ready: 2 }
  return rank[a] <= rank[b] ? a : b
}

/** Prefer numeric `baseDamage` from level row for rules-first hit base; min–max → average (flagged). */
function skillHitBaseFromLevelRow(row: SkillLevelEntry | undefined): {
  value: number | null
  fromMinMaxAvg: boolean
} {
  if (!row || row.baseDamage == null) return { value: null, fromMinMaxAvg: false }
  const bd = row.baseDamage
  if (typeof bd === 'number' && Number.isFinite(bd)) {
    return { value: bd, fromMinMaxAvg: false }
  }
  if (typeof bd === 'object' && 'min' in bd && 'max' in bd) {
    const min = Number((bd as { min: number }).min)
    const max = Number((bd as { max: number }).max)
    if (Number.isFinite(min) && Number.isFinite(max)) {
      return { value: (min + max) / 2, fromMinMaxAvg: true }
    }
  }
  return { value: null, fromMinMaxAvg: false }
}

function collectMissingDataHints(inst: SkillInstance): string[] {
  const hints: string[] = []
  const b = inst.breakdown
  if (b.levelRow.source === 'none') hints.push('無可用技能等級列（levelTable／breakpoints）。')
  if (b.levelRow.partial) hints.push('等級列 partial：部分欄位未結構化。')
  if (!b.structuralDamageEvidence) hints.push('無結構化傷害證據（數值 baseDamage、傷害相關 modifier、或 mechanics 提示）。')
  if (b.parseStatus === 'partial') hints.push('技能紀錄 parseStatus=partial。')
  if (b.parseStatus === 'failed') hints.push('技能紀錄 parseStatus=failed。')
  if (b.levelRow.modifierCount === 0 && b.levelRow.source !== 'none') {
    hints.push('等級列存在但未產生傷害相關 modifier（可能僅 mana／cooldown／castTime）。')
  }
  return hints
}

function roleWhyNoPrimaryDpsCard(role: SkillDamageRole): string[] {
  const lines: Record<SkillDamageRole, string> = {
    'support-only': '純輔助技能：不提供主 DPS 估算卡。',
    'aura-only': '光環／範圍類：不以單一「命中 DPS」呈現。',
    utility: '功能／詛咒／位移等：不以單一命中 DPS 呈現。',
    unknown: '角色分類 unknown：資料不足以支撐可信任的輸出估算。',
    'summon-driver': '召喚／圖騰驅動：代理輸出不在此卡以單一數字呈現。',
    damaging: '（內部）damaging 應走輸出閘門，不應呼叫此說明。',
  }
  const head = lines[role]
  return head && role !== 'damaging' ? [head] : []
}

export type BuildStatsPanelSummaryLabels = {
  heroLabel: string
  traitLabel: string
  relicLabel: string
  specialtyLabel: string
  divinitySummaryLine: string
  gearEquippedLine: string
  divinityTextLine: string
}

export type BuildStatsPanelDerived = {
  combat: BuildSidebarCombatStats
  /** Full build pipeline (all skills + gear…) — secondary readout. */
  breakdown: CombatBreakdown
  skillInstanceBreakdowns: SkillInstanceBreakdown[]
  /**
   * Valid main slot 1–5 when `meta.inspectedMainSkillSlot` is usable; null if unset or invalid.
   * UI highlights should still read `snapshot.meta.inspectedMainSkillSlot` when distinguishing “cleared” vs “invalid”.
   */
  inspectedMainSkillSlot: MainSkillSlot | null
  inspectedSkillBreakdown: SkillInstanceBreakdown | null
  /** @deprecated Renamed in 4E-3 — use `inspectedSkillPrimaryInstance`. */
  inspectedSkillInstance: SkillInstance | null
  /** Skill-centric instance for `meta.inspectedMainSkillSlot` (single source of truth). */
  inspectedSkillPrimaryInstance: SkillInstance | null
  /** PoB-style primary readout for the inspected skill only (never whole-build aggregate). */
  inspectedSkillDamageView: InspectedSkillDamageView
  /** Selector resolution / contribution scoping audit. */
  inspectedSkillDebugView: InspectedSkillDebugView
  validationErrors: string[]
  summary: BuildStatsPanelSummaryLabels
}

function runCombatPipeline(snapshot: BuildSnapshot): {
  combat: BuildSidebarCombatStats
  breakdown: CombatBreakdown
} {
  const entries = collectBuildContributions(snapshot)
  const agg = aggregateStatBlocks(entries.map((e) => e.block))
  const textChars = selectDivinityBoardTextChars(snapshot)
  const level = snapshot.meta?.level ?? 1
  const { combat, breakdown } = computeDerivedCombat(level, agg, textChars)
  return {
    combat,
    breakdown: { ...breakdown, contributionCount: entries.length },
  }
}

export function selectBuildSidebarCombatStats(snapshot: BuildSnapshot): BuildSidebarCombatStats {
  return runCombatPipeline(snapshot).combat
}

function selectBuildStatsPanelSummary(snapshot: BuildSnapshot): BuildStatsPanelSummaryLabels {
  const boardIds = snapshot.divinityBoard?.selectedBoardIds
  const ids = Array.isArray(boardIds) ? boardIds : []
  const divinityPickN = ids.length
  const divinitySummaryLine =
    divinityPickN === 0
      ? '未選示意石板'
      : `${divinityPickN} 塊：${ids
          .map((id) => mockDivinityBoardOptions.find((o) => o.id === id)?.name ?? id)
          .join('、')}`

  const gearN = selectFilledGearCount(snapshot)
  const gearEquippedLine = `${gearN} / 10 欄已配置`

  const textChars = selectDivinityBoardTextChars(snapshot)
  const divinityTextLine =
    textChars === 0 ? '補充文字：無' : `補充文字：共 ${textChars} 字（示意）`

  return {
    heroLabel: mockHeroes.find((h) => h.id === snapshot.hero?.heroId)?.name ?? '—',
    traitLabel: mockTraits.find((t) => t.id === snapshot.hero?.traitId)?.name ?? '—',
    relicLabel: mockRelics.find((r) => r.id === snapshot.hero?.relicId)?.name ?? '—',
    specialtyLabel: mockSpecialties.find((s) => s.id === snapshot.hero?.specialtyId)?.name ?? '—',
    divinitySummaryLine,
    gearEquippedLine,
    divinityTextLine,
  }
}

function formatModifierLines(def: SkillDefinition): string[] {
  return (def.modifiers ?? []).slice(0, 18).map((m) => {
    const id = m.id ? `${m.id} · ` : ''
    return `${id}${m.stat} ${m.operation} ${String(m.value)}`
  })
}

function passiveContextLines(snapshot: BuildSnapshot, mainSlot: MainSkillSlot): string[] {
  const lines: string[] = []
  for (const p of snapshot.passives ?? []) {
    if (!p.skillId || p.enabled === false) continue
    const def = getSkillDefinitionById(p.skillId)
    const name = def?.name ?? p.skillId
    if (p.applyMode === 'global') {
      lines.push(`${name} · 全域（modifiers 會注入包含 Slot ${mainSlot} 的主技能实例）`)
    } else {
      const linked = p.linkedMainSkillSlots ?? []
      if (linked.length === 0) {
        lines.push(`${name} · linked 模式但未選槽（對任何主技能不生效）`)
        continue
      }
      if (linked.includes(mainSlot)) {
        lines.push(`${name} · 僅連結槽 [${linked.join(', ')}]（命中此檢查槽）`)
      } else {
        lines.push(`${name} · 僅連結槽 [${linked.join(', ')}]（未命中此檢查槽）`)
      }
    }
  }
  return lines
}

type InspectedPrimaryCore = {
  metaSlotRaw: number | null
  resolvedSlot: MainSkillSlot | null
  resolution: InspectedSkillDebugView['resolution']
  row: SkillSetup | null
  instance: SkillInstance | null
}

/**
 * Single resolution pass for `meta.inspectedMainSkillSlot` → row + primary SkillInstance.
 * Whole-build aggregates must not substitute for this.
 */
export function selectInspectedSkillPrimaryCore(snapshot: BuildSnapshot): InspectedPrimaryCore {
  const metaSlotRaw = snapshot.meta.inspectedMainSkillSlot ?? null
  if (metaSlotRaw == null) {
    return {
      metaSlotRaw,
      resolvedSlot: null,
      resolution: 'no_slot',
      row: null,
      instance: null,
    }
  }
  if (!isMainSkillSlot(metaSlotRaw)) {
    return {
      metaSlotRaw,
      resolvedSlot: null,
      resolution: 'invalid_slot',
      row: null,
      instance: null,
    }
  }
  const slot = metaSlotRaw
  const row = snapshot.skills[slot - 1] ?? null
  if (!row?.skillId) {
    return { metaSlotRaw, resolvedSlot: slot, resolution: 'empty_slot', row, instance: null }
  }
  if (row.enabled === false) {
    return { metaSlotRaw, resolvedSlot: slot, resolution: 'disabled', row, instance: null }
  }
  const instance = computeSkillInstanceForMainSlot(row, snapshot)
  if (!instance) {
    return {
      metaSlotRaw,
      resolvedSlot: slot,
      resolution: 'unsupported_main_family',
      row,
      instance: null,
    }
  }
  return { metaSlotRaw, resolvedSlot: slot, resolution: 'ok', row, instance }
}

function buildNonDamagingInspectedView(
  snapshot: BuildSnapshot,
  mainSlot: MainSkillSlot,
  inst: SkillInstance,
  supportApplied: number,
  supportSkipped: number,
): InspectedSkillDamageView {
  const def = inst.activeDefinition
  const otherMainSkills = snapshot.skills
    .filter((r) => r.slot !== mainSlot && r.skillId && r.enabled !== false)
    .map((r) => ({
      slot: r.slot,
      skillId: r.skillId!,
      name: getSkillDefinitionById(r.skillId)?.name ?? r.skillId!,
    }))
  const rawReq = def.supportRules?.rawRequirementLines ?? []
  const summaryHints = (def.summaryText ?? []).slice(0, 4).map((s) => `概述: ${s}`)
  const supportsSkippedDetail = inst.supports
    .filter((s) => !s.applied)
    .map((s) => ({ id: s.supportRefId, name: s.supportName, skipReason: s.skipReason }))
  const supportsAppliedDetail = inst.supports
    .filter((s) => s.applied)
    .map((s) => ({ id: s.supportRefId, name: s.supportName }))
  const missingDataHints = collectMissingDataHints(inst)
  const whyNoDpsLines = [
    ...roleWhyNoPrimaryDpsCard(inst.damageRole),
    `family「${def.family}」· tags ${def.tags.slice(0, 6).join('、') || '—'}`,
    `calculationConfidence=${inst.calculationConfidence}`,
  ]
  return {
    mode: 'nonDamaging',
    role: inst.damageRole,
    family: def.family,
    tags: [...def.tags],
    calculationConfidence: inst.calculationConfidence,
    whyNoDpsLines,
    missingDataHints,
    otherMainSkills,
    passiveAuraLines: passiveContextLines(snapshot, mainSlot),
    modifierLines: formatModifierLines(def),
    requirementLines: [...rawReq, ...summaryHints],
    supportApplied,
    supportSkipped,
    supportsSkippedDetail,
    supportsAppliedDetail,
  }
}

function buildDpsBlockedInspectedView(
  snapshot: BuildSnapshot,
  mainSlot: MainSkillSlot,
  inst: SkillInstance,
  blockReason: 'instance_unsupported' | 'effective_unsupported',
  supportApplied: number,
  supportSkipped: number,
  opts?: { effectiveCalculationConfidence?: CalculationConfidence; extraMissingHints?: string[] },
): InspectedSkillDamageView {
  const def = inst.activeDefinition
  const otherMainSkills = snapshot.skills
    .filter((r) => r.slot !== mainSlot && r.skillId && r.enabled !== false)
    .map((r) => ({
      slot: r.slot,
      skillId: r.skillId!,
      name: getSkillDefinitionById(r.skillId)?.name ?? r.skillId!,
    }))
  const rawReq = def.supportRules?.rawRequirementLines ?? []
  const summaryHints = (def.summaryText ?? []).slice(0, 4).map((s) => `概述: ${s}`)
  const supportsSkippedDetail = inst.supports
    .filter((s) => !s.applied)
    .map((s) => ({ id: s.supportRefId, name: s.supportName, skipReason: s.skipReason }))
  const supportsAppliedDetail = inst.supports
    .filter((s) => s.applied)
    .map((s) => ({ id: s.supportRefId, name: s.supportName }))
  const baseHints = collectMissingDataHints(inst)
  const extra = opts?.extraMissingHints ?? []
  const effective = opts?.effectiveCalculationConfidence ?? inst.calculationConfidence
  const whyNoDpsLines =
    blockReason === 'instance_unsupported'
      ? [
          '此技能在分類上為 damaging，但 instance calculationConfidence=unsupported（缺結構化傷害證據、解析問題或等級列不足以精算），依 4E-5 不顯示主 DPS 卡。',
        ]
      : [
          'instance 可為 partial／ready，但與衍生戰鬥層合併後 effectiveCalculationConfidence=unsupported（例如無等級列錨定命中、derive 拒絕占位輸出），不顯示主 DPS 卡。',
        ]
  return {
    mode: 'dpsBlocked',
    blockReason,
    role: inst.damageRole,
    family: def.family,
    tags: [...def.tags],
    calculationConfidence: inst.calculationConfidence,
    effectiveCalculationConfidence: effective,
    whyNoDpsLines,
    missingDataHints: [...baseHints, ...extra],
    otherMainSkills,
    passiveAuraLines: passiveContextLines(snapshot, mainSlot),
    modifierLines: formatModifierLines(def),
    requirementLines: [...rawReq, ...summaryHints],
    supportApplied,
    supportSkipped,
    supportsSkippedDetail,
    supportsAppliedDetail,
  }
}

/**
 * Primary `SkillInstance` for `meta.inspectedMainSkillSlot` (4E-3 skill-centric API).
 */
export function selectInspectedSkillPrimaryInstance(snapshot: BuildSnapshot): SkillInstance | null {
  return selectInspectedSkillPrimaryCore(snapshot).instance
}

/** @deprecated Use `selectInspectedSkillPrimaryInstance` (same behavior, reads only `meta.inspectedMainSkillSlot`). */
export function selectInspectedSkillInstance(snapshot: BuildSnapshot): SkillInstance | null {
  return selectInspectedSkillPrimaryInstance(snapshot)
}

/**
 * Primary left-panel combat readout scoped to the inspected skill + rest-of-build;
 * non-damaging roles omit fake single-line DPS.
 */
export function selectInspectedSkillDamageView(snapshot: BuildSnapshot): InspectedSkillDamageView {
  const core = selectInspectedSkillPrimaryCore(snapshot)
  if (core.resolution === 'no_slot') return { mode: 'none', reason: 'no_slot' }
  if (core.resolution === 'invalid_slot') return { mode: 'none', reason: 'invalid_slot' }
  if (core.resolution === 'empty_slot') {
    return { mode: 'none', reason: 'empty_slot' }
  }
  if (core.resolution === 'unsupported_main_family') {
    return { mode: 'none', reason: 'unsupported_main_family' }
  }
  if (core.resolution === 'disabled') return { mode: 'none', reason: 'disabled' }

  const slot = core.resolvedSlot!
  const inst = core.instance!

  const supportApplied = inst.supports.filter((s) => s.applied).length
  const supportSkipped = inst.supports.filter((s) => !s.applied).length

  if (inst.damageRole !== 'damaging') {
    return buildNonDamagingInspectedView(snapshot, slot, inst, supportApplied, supportSkipped)
  }

  if (inst.calculationConfidence === 'unsupported') {
    return buildDpsBlockedInspectedView(
      snapshot,
      slot,
      inst,
      'instance_unsupported',
      supportApplied,
      supportSkipped,
      { effectiveCalculationConfidence: 'unsupported' },
    )
  }

  const entries: ContributionEntry[] = collectBuildContributions(snapshot)
  const filtered = filterContributionsForInspectedMainSkill(entries, slot)
  const agg = aggregateStatBlocks(filtered.map((e) => e.block))
  const textChars = selectDivinityBoardTextChars(snapshot)
  const level = snapshot.meta?.level ?? 1
  const levelRowMeta = resolveLevelRow(inst.activeDefinition, inst.level)
  const hitBase = skillHitBaseFromLevelRow(levelRowMeta.row)
  const { combat, breakdown } = computeDerivedCombat(level, agg, textChars, {
    skillHitBaseFromLevel: hitBase.value,
    skillHitBaseFromMinMaxAverage: hitBase.fromMinMaxAvg,
  })

  let derivedLayerConf: DerivedCombatLayerConfidence = breakdown.derivedCombatConfidence
  const extraFallbacks = [...breakdown.derivedCombatFallbacks]
  if (hitBase.value == null && levelRowMeta.source === 'none') {
    derivedLayerConf = 'unsupported'
    extraFallbacks.push({
      key: 'inspected_skill',
      reason: 'no_level_row_cannot_anchor_hit_base',
    })
  }

  const skillBreakdown: CombatBreakdown = {
    ...breakdown,
    contributionCount: filtered.length,
    derivedCombatConfidence: derivedLayerConf,
    derivedCombatFallbacks: extraFallbacks,
  }

  const effectiveCalculationConfidence = worstCalculationConfidence(
    inst.calculationConfidence,
    derivedLayerConf as CalculationConfidence,
  )

  if (effectiveCalculationConfidence === 'unsupported') {
    return buildDpsBlockedInspectedView(
      snapshot,
      slot,
      inst,
      'effective_unsupported',
      supportApplied,
      supportSkipped,
      {
        effectiveCalculationConfidence,
        extraMissingHints: skillBreakdown.derivedCombatFallbacks.map((f) => `${f.key}:${f.reason}`),
      },
    )
  }

  const damagingPresentation: 'authoritative' | 'estimate' =
    effectiveCalculationConfidence === 'ready' ? 'authoritative' : 'estimate'

  const lvRow = levelRowMeta.row
  return {
    mode: 'damaging',
    role: inst.damageRole,
    damagingPresentation,
    combat,
    skillBreakdown,
    effectiveCalculationConfidence,
    supportApplied,
    supportSkipped,
    manaCost: lvRow?.manaCost ?? null,
    cooldownSec: lvRow?.cooldown ?? null,
    castTimeSec: lvRow?.castTime ?? null,
  }
}

export function selectInspectedSkillDebugView(snapshot: BuildSnapshot): InspectedSkillDebugView {
  const core = selectInspectedSkillPrimaryCore(snapshot)
  const damageView = selectInspectedSkillDamageView(snapshot)
  const entries = collectBuildContributions(snapshot)
  const slot = core.resolvedSlot
  const filteredLen =
    slot != null ? filterContributionsForInspectedMainSkill(entries, slot).length : 0
  return {
    metaSlotRaw: core.metaSlotRaw,
    resolvedSlot: core.resolvedSlot,
    resolution: core.resolution,
    primaryInstance: core.instance,
    damageViewMode: damageView.mode,
    inspectedFilteredContributionCount: filteredLen,
    buildWideContributionCount: entries.length,
  }
}

/**
 * Build stats panel: always derives inspected slice from `snapshot.meta.inspectedMainSkillSlot` only
 * (4E-3 — do not pass a parallel slot; avoids desync with aggregate).
 */
export function selectBuildStatsPanelDerived(snapshot: BuildSnapshot): BuildStatsPanelDerived {
  const { combat, breakdown } = runCombatPipeline(snapshot)
  const core = selectInspectedSkillPrimaryCore(snapshot)
  const slot = core.resolution === 'ok' ? core.resolvedSlot : null

  const skillInstanceBreakdowns = snapshot.skills
    .map((row) => computeSkillInstanceForMainSlot(row, snapshot))
    .filter((i): i is NonNullable<typeof i> => i != null)
    .map((i) => i.breakdown)
  const inspectedSkillBreakdown =
    slot != null ? (skillInstanceBreakdowns.find((b) => b.mainSlot === slot) ?? null) : null

  const inspectedSkillPrimaryInstance = selectInspectedSkillPrimaryInstance(snapshot)
  const inspectedSkillDamageView = selectInspectedSkillDamageView(snapshot)
  const inspectedSkillDebugView = selectInspectedSkillDebugView(snapshot)

  return {
    combat,
    breakdown,
    skillInstanceBreakdowns,
    inspectedMainSkillSlot: slot,
    inspectedSkillBreakdown,
    inspectedSkillInstance: inspectedSkillPrimaryInstance,
    inspectedSkillPrimaryInstance,
    inspectedSkillDamageView,
    inspectedSkillDebugView,
    validationErrors: selectValidationErrors(snapshot),
    summary: selectBuildStatsPanelSummary(snapshot),
  }
}

/** @deprecated Prefer selectBuildSidebarCombatStats + BuildStatsPanelDerived */
export type BuildPanelStats = {
  dpsPerSecond: number
  attackSpeed: number
  damagePerHit: number
  strength: number
  dexterity: number
  intelligence: number
  hp: number
  mp: number
}

/** @deprecated Prefer selectBuildStatsPanelDerived */
export function computeBuildPanelStats(snapshot: BuildSnapshot): BuildPanelStats {
  const c = selectBuildSidebarCombatStats(snapshot)
  return {
    dpsPerSecond: c.dps,
    attackSpeed: c.attackSpeed,
    damagePerHit: c.hitDamage,
    strength: c.strength,
    dexterity: c.dexterity,
    intelligence: c.intelligence,
    hp: c.hp,
    mp: c.mp,
  }
}
