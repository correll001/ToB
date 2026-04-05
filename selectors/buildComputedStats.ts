// selectors/buildComputedStats.ts
/**
 * Sidebar stats: summary labels + combat from data-driven formula pipeline
 * (collect → aggregate → derive). No PRNG / stableMix.
 */
import type { BuildSnapshot, MainSkillSlot, SkillSetup } from '@/types/build'
import { isMainSkillSlot } from '@/lib/build/supportLinks'
import type { BuildSidebarCombatStats, CombatBreakdown, ContributionEntry, StatBlock } from '@/types/combat'
import type {
  CalculationConfidence,
  InspectedSkillDamageView,
  InspectedSkillDebugView,
  InspectedSkillNoneReason,
  InspectedSkillPresentationMode,
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
import { resolveLevelRow, skillHitBaseAnchorFromLevelRow } from '@/lib/formula/skills/levelRowModifiers'
import type { SkillDamageRole } from '@/types/skillDamageRole'
import { getSkillDefinitionById } from '@/lib/runtime/runtimeSkillLookup'
import type { SkillDefinition } from '@/types/skillData'
import type { DerivedCombatLayerConfidence } from '@/types/combat'
import { cloneSnapshotWithSkillRow } from '@/lib/build/cloneSnapshotSkillRow'

export type { BuildSidebarCombatStats } from '@/types/combat'
export type { InspectedSkillPresentationMode } from '@/types/skillInstance'

/** Single source for panel routing (4F-7) — only depends on current-frame `InspectedSkillDamageView`. */
export function deriveInspectedPresentationMode(dv: InspectedSkillDamageView): InspectedSkillPresentationMode {
  if (dv.mode === 'none') {
    const map: Record<InspectedSkillNoneReason, InspectedSkillPresentationMode> = {
      no_slot: 'none_no_slot',
      invalid_slot: 'none_invalid_slot',
      empty_slot: 'none_empty_slot',
      disabled: 'none_disabled',
      unsupported_main_family: 'none_unsupported_main_family',
    }
    return map[dv.reason]
  }
  if (dv.mode === 'dpsBlocked') {
    return dv.blockReason === 'instance_unsupported'
      ? 'dps_blocked_instance_unsupported'
      : 'dps_blocked_effective_unsupported'
  }
  if (dv.mode === 'nonDamaging') {
    switch (dv.role) {
      case 'support-only':
        return 'role_support_only'
      case 'aura-only':
        return 'role_aura_only'
      case 'utility':
        return 'role_utility'
      case 'unknown':
        return 'role_unknown'
      case 'summon-driver':
        return 'role_summon_driver'
      default:
        return 'role_unknown'
    }
  }
  if (dv.mode === 'damaging') {
    if (dv.effectiveCalculationConfidence === 'ready' && dv.damagingPresentation === 'authoritative') {
      return 'damaging_ready'
    }
    return 'damaging_partial'
  }
  return 'role_unknown'
}

/** Deterministic remount id: must change on slot / resolution / skill identity / presentation branch switch. */
export function buildInspectedViewSequenceKey(args: {
  metaSlotRaw: number | null
  coreResolution: InspectedSkillDebugView['resolution']
  coreSlot: MainSkillSlot | null
  activeId: string | null
  presentationMode: InspectedSkillPresentationMode
  damageViewMode: InspectedSkillDamageView['mode']
}): string {
  const slot = args.metaSlotRaw
  return [
    slot === null || slot === undefined ? '∅' : String(slot),
    args.coreResolution,
    args.coreSlot === null || args.coreSlot === undefined ? '∅' : String(args.coreSlot),
    args.activeId ?? '∅',
    args.damageViewMode,
    args.presentationMode,
  ].join('|')
}

function worstCalculationConfidence(a: CalculationConfidence, b: CalculationConfidence): CalculationConfidence {
  const rank: Record<CalculationConfidence, number> = { unsupported: 0, partial: 1, ready: 2 }
  return rank[a] <= rank[b] ? a : b
}

function skillInstanceIsChanneled(inst: SkillInstance): boolean {
  if (inst.canonicalTags.includes('Channeled')) return true
  if (inst.computedTags.includes('Channeled')) return true
  const raw = inst.activeDefinition.tags ?? []
  return raw.some((t) => t === 'Channeled')
}

/**
 * Level-row spell/base anchor is merged into hit base in derive; strip the same amount from skill `baseDamageFlat`
 * so `skill.addedBaseDamage` from the row is not double-counted (supports / passives still add flat).
 */
function contributionBlocksForInspectedAggregate(
  filtered: ContributionEntry[],
  slot: MainSkillSlot,
  hitAnchor: number | null,
): StatBlock[] {
  const prefix = `Skill slot ${slot} ·`
  return filtered.map((e) => {
    if (
      hitAnchor == null ||
      !(hitAnchor > 0) ||
      e.kind !== 'skill' ||
      !e.label.startsWith(prefix)
    ) {
      return e.block
    }
    const b = { ...e.block }
    const f = b.baseDamageFlat ?? 0
    const sub = Math.min(f, hitAnchor)
    b.baseDamageFlat = f - sub
    return b
  })
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
   * Meta inspected slot when 1–5; null if cleared or non-numeric.
   * Prefer this for “正在檢視槽 N” even when the row is empty (4F-7).
   */
  inspectedTargetSlot: MainSkillSlot | null
  /**
   * Legacy: same as today — non-null only when `selectInspectedSkillPrimaryCore` resolves `ok` (instance exists).
   * Prefer `inspectedTargetSlot` + `inspectedSkillDamageView` for full truth.
   */
  inspectedMainSkillSlot: MainSkillSlot | null
  /** 4F-7 — strict panel branch; derived from `inspectedSkillDamageView` only. */
  inspectedPresentationMode: InspectedSkillPresentationMode
  /** Force subtree remount so no DPS / copy survives across inspected transitions. */
  inspectedViewSequenceKey: string
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

  if (!inst.structuralDamageEvidence) {
    return buildDpsBlockedInspectedView(
      snapshot,
      slot,
      inst,
      'instance_unsupported',
      supportApplied,
      supportSkipped,
      {
        effectiveCalculationConfidence: 'unsupported',
        extraMissingHints: ['無結構化傷害證據：不以 damaging-ready／主 DPS 卡呈現。'],
      },
    )
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
  const levelRowMeta = resolveLevelRow(inst.activeDefinition, inst.level)
  const hitBase = skillHitBaseAnchorFromLevelRow(levelRowMeta.row)
  const agg = aggregateStatBlocks(
    contributionBlocksForInspectedAggregate(filtered, slot, hitBase.value),
  )
  const textChars = selectDivinityBoardTextChars(snapshot)
  const level = snapshot.meta?.level ?? 1
  const { combat, breakdown } = computeDerivedCombat(level, agg, textChars, {
    skillHitBaseFromLevel: hitBase.value,
    skillHitBaseFromMinMaxAverage: hitBase.fromMinMaxAverage,
    skillIsChanneled: skillInstanceIsChanneled(inst),
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

/**
 * Same scoped damaging combat as `selectInspectedSkillDamageView` (global base + this slot’s skill row),
 * but for an arbitrary `SkillSetup` row. Used for support removal counterfactuals only.
 */
export function tryComputeInspectedScopedDamagingCombat(
  snapshot: BuildSnapshot,
  slot: MainSkillSlot,
  skillRow: SkillSetup,
): {
  combat: BuildSidebarCombatStats
  effectiveCalculationConfidence: CalculationConfidence
  damagingPresentation: 'authoritative' | 'estimate'
} | null {
  const snap = cloneSnapshotWithSkillRow(snapshot, slot, skillRow)
  const inst = computeSkillInstanceForMainSlot(skillRow, snap)
  if (!inst) return null
  if (inst.damageRole !== 'damaging') return null
  if (!inst.structuralDamageEvidence) return null
  if (inst.calculationConfidence === 'unsupported') return null

  const entries: ContributionEntry[] = collectBuildContributions(snap)
  const filtered = filterContributionsForInspectedMainSkill(entries, slot)
  const levelRowMeta = resolveLevelRow(inst.activeDefinition, inst.level)
  const hitBase = skillHitBaseAnchorFromLevelRow(levelRowMeta.row)
  const agg = aggregateStatBlocks(
    contributionBlocksForInspectedAggregate(filtered, slot, hitBase.value),
  )
  const textChars = selectDivinityBoardTextChars(snap)
  const level = snap.meta?.level ?? 1
  const { combat, breakdown } = computeDerivedCombat(level, agg, textChars, {
    skillHitBaseFromLevel: hitBase.value,
    skillHitBaseFromMinMaxAverage: hitBase.fromMinMaxAverage,
    skillIsChanneled: skillInstanceIsChanneled(inst),
  })

  let derivedLayerConf: DerivedCombatLayerConfidence = breakdown.derivedCombatConfidence
  if (hitBase.value == null && levelRowMeta.source === 'none') {
    derivedLayerConf = 'unsupported'
  }

  const effectiveCalculationConfidence = worstCalculationConfidence(
    inst.calculationConfidence,
    derivedLayerConf as CalculationConfidence,
  )

  if (effectiveCalculationConfidence === 'unsupported') return null

  const damagingPresentation: 'authoritative' | 'estimate' =
    effectiveCalculationConfidence === 'ready' ? 'authoritative' : 'estimate'

  return { combat, effectiveCalculationConfidence, damagingPresentation }
}

function buildInspectedSkillDebugView(
  snapshot: BuildSnapshot,
  core: InspectedPrimaryCore,
  damageView: InspectedSkillDamageView,
): InspectedSkillDebugView {
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
    presentationMode: deriveInspectedPresentationMode(damageView),
    inspectedFilteredContributionCount: filteredLen,
    buildWideContributionCount: entries.length,
  }
}

export function selectInspectedSkillDebugView(snapshot: BuildSnapshot): InspectedSkillDebugView {
  const core = selectInspectedSkillPrimaryCore(snapshot)
  const damageView = selectInspectedSkillDamageView(snapshot)
  return buildInspectedSkillDebugView(snapshot, core, damageView)
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
  const inspectedSkillDebugView = buildInspectedSkillDebugView(
    snapshot,
    core,
    inspectedSkillDamageView,
  )

  const metaSlot = snapshot.meta.inspectedMainSkillSlot ?? null
  const inspectedTargetSlot =
    metaSlot != null && isMainSkillSlot(metaSlot) ? (metaSlot as MainSkillSlot) : null
  const presentationMode = deriveInspectedPresentationMode(inspectedSkillDamageView)
  const inspectedViewSequenceKey = buildInspectedViewSequenceKey({
    metaSlotRaw: metaSlot,
    coreResolution: inspectedSkillDebugView.resolution,
    coreSlot: inspectedSkillDebugView.resolvedSlot,
    activeId: inspectedSkillDebugView.primaryInstance?.activeId ?? null,
    presentationMode,
    damageViewMode: inspectedSkillDamageView.mode,
  })

  return {
    combat,
    breakdown,
    skillInstanceBreakdowns,
    inspectedTargetSlot,
    inspectedMainSkillSlot: slot,
    inspectedPresentationMode: presentationMode,
    inspectedViewSequenceKey,
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
