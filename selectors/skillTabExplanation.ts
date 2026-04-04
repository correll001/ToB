/**
 * Central Skill TAB — skill-local explanation selector only.
 * Does not alter BuildStatsPanel, `selectBuildStatsPanelDerived`, or `selectInspectedSkillDamageView`.
 * Regression: `npm run verify:skill-tab-explainer` (left-panel contract + explainer invariants).
 */
import type { BuildSnapshot, MainSkillSlot, SkillSetup } from '@/types/build'
import type { ParseStatus } from '@/types/normalized'
import type { SkillDamageRole } from '@/types/skillDamageRole'
import type { ModifierDefinition, SkillDefinition, SkillFamily } from '@/types/skillData'
import type {
  CalculationConfidence,
  InspectedSkillDamageView,
  SkillInstance,
} from '@/types/skillInstance'
import type {
  SkillTabExplanation,
  SkillTabLevelRowFacts,
  SkillTabLocalNumericSummary,
  SkillTabLocalPreviewMetrics,
  SkillTabSupportLinkExplanation,
} from '@/types/skillTabExplanation'
import { getNormalizedSkillRecord, getSkillDefinitionById } from '@/lib/runtime/runtimeSkillLookup'
import {
  modifiersFromSupportGemLevelRowAppliedToActive,
  resolveLevelRow,
  skillHitBaseAnchorFromLevelRow,
} from '@/lib/formula/skills/levelRowModifiers'
import { evaluateSupportAttachment } from '@/lib/formula/skills/applySupportRules'
import { formatSupportSkipReasonZh, summarizeSupportModifierList } from '@/lib/format/supportLinkExplanationFormat'
import { selectInspectedSkillDamageView, selectInspectedSkillPrimaryCore } from '@/selectors/buildComputedStats'
import {
  buildStripAllSupportsDelta,
  buildSupportRemovalDeltas,
} from '@/lib/formula/buildSupportRemovalDeltas'
import { buildPassiveImpactTraces } from '@/lib/formula/buildPassiveImpactTraces'
import { formatSkillInstanceTraceLines, skillTabCanonicalTags } from '@/lib/format/skillTabDebugFormat'

const COMPUTED_STATS_SAMPLE_MAX = 14

function buildSkillTabDebugFoldout(
  base: Pick<
    SkillTabExplanation,
    | 'activeSkillId'
    | 'parseStatus'
    | 'levelRowLines'
    | 'levelRowFacts'
    | 'supportSkippedDetail'
    | 'localMissingDataHints'
    | 'localWarnings'
    | 'supportLinkExplanations'
    | 'debugTrace'
  >,
  inst: SkillInstance | null,
): SkillTabExplanation['debugFoldout'] {
  const activeId = base.activeSkillId
  const mainDef = activeId ? getSkillDefinitionById(activeId) : undefined
  const mainSkillRawRequirementLines = [...(mainDef?.supportRules?.rawRequirementLines ?? [])]

  const parseStatusResolved =
    base.parseStatus ?? (activeId ? getNormalizedSkillRecord(activeId)?.parseStatus ?? null : null)

  const supportLinkRawRequirements = base.supportLinkExplanations
    .map((e) => ({
      linkSlot: e.linkSlot,
      supportId: e.supportId,
      supportName: e.supportName,
      lines: [...(e.rawRequirementLines ?? [])],
    }))
    .filter((x) => x.lines.length > 0)

  let instanceWarnings: string[] = []
  let recordWarnings: string[] = []
  let engineWarnings: string[] = []
  if (inst) {
    instanceWarnings = [...inst.warnings]
    recordWarnings = [...(inst.breakdown.recordWarnings ?? [])]
    engineWarnings = [...inst.breakdown.engineWarnings]
  }

  const levelRowDetailLines: string[] = []
  if (base.levelRowFacts) {
    const f = base.levelRowFacts
    levelRowDetailLines.push(
      `摘要 · source=${f.source} · gemLevel=${f.skillGemLevel} · rowPartial=${f.rowPartial}` +
        ` · modifierCount（詳列）見下行`,
    )
  }
  levelRowDetailLines.push(...base.levelRowLines)

  if (inst) {
    const lr = inst.breakdown.levelRow
    levelRowDetailLines.push(
      `breakdown.levelRow · source=${lr.source} · partial=${lr.partial} · modifierCount=${lr.modifierCount}` +
        (lr.hitScalingFromRow != null ? ` · hitScalingFromRow=${lr.hitScalingFromRow}` : ''),
    )
    if (lr.warnings?.length) {
      levelRowDetailLines.push(...lr.warnings.map((w) => `levelRow.warning: ${w}`))
    }
    if (lr.textLineHints?.length) {
      levelRowDetailLines.push(...lr.textLineHints.map((h) => `levelRow.hint: ${h}`))
    }
  }

  return {
    canonicalTags: skillTabCanonicalTags(activeId),
    mainSkillRawRequirementLines,
    supportLinkRawRequirements,
    instanceWarnings,
    recordWarnings,
    engineWarnings,
    parseStatus: parseStatusResolved,
    levelRowDetailLines,
    supportSkippedRows: [...base.supportSkippedDetail],
    localMissingDataHints: [...base.localMissingDataHints],
    traceSummaryLines: formatSkillInstanceTraceLines(base.debugTrace),
    contextNotesWithoutInstance: inst ? [] : [...base.localWarnings],
  }
}

function formatBaseSkillModifierLines(def: SkillDefinition): string[] {
  return (def.modifiers ?? []).slice(0, 18).map((m) => {
    const id = m.id ? `${m.id} · ` : ''
    return `${id}${m.stat} ${m.operation} ${String(m.value)}`
  })
}

function passiveAuraLinesForSlot(snapshot: BuildSnapshot, mainSlot: MainSkillSlot): string[] {
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

function collectLocalMissingDataHints(inst: SkillInstance): string[] {
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

function buildLevelRowLines(inst: SkillInstance): string[] {
  const lr = inst.breakdown.levelRow
  const lines: string[] = [
    `levelRow.source=${lr.source} · partial=${lr.partial} · modifierCount=${lr.modifierCount}` +
      (lr.hitScalingFromRow != null ? ` · hitScalingFromRow=${lr.hitScalingFromRow}` : ''),
  ]
  if (lr.warnings?.length) lines.push(...lr.warnings.map((w) => `levelRow.warning: ${w}`))
  if (lr.textLineHints?.length) lines.push(...lr.textLineHints.map((h) => `levelRow.hint: ${h}`))

  const resolved = resolveLevelRow(inst.activeDefinition, inst.level)
  const row = resolved.row
  if (row) {
    if (row.manaCost != null) lines.push(`level row manaCost=${row.manaCost}`)
    if (row.cooldown != null) lines.push(`level row cooldown=${row.cooldown}`)
    if (row.castTime != null) lines.push(`level row castTime=${row.castTime}`)
    if (row.projectileCount != null) lines.push(`level row projectileCount=${row.projectileCount}`)
    const anchor = skillHitBaseAnchorFromLevelRow(row)
    if (anchor.value != null) {
      lines.push(
        `level row hit base (structured)=${anchor.value}` +
          (anchor.fromMinMaxAverage ? ' (min–max midpoint)' : ''),
      )
    }
  }
  return lines
}

function buildLevelRowFacts(inst: SkillInstance): SkillTabLevelRowFacts {
  const lr = inst.breakdown.levelRow
  const { row } = resolveLevelRow(inst.activeDefinition, inst.level)
  let baseDamageDisplay: string | null = null
  let baseDamageIsRangeMidpoint = false
  if (row?.baseDamage != null && row.baseDamage !== undefined) {
    const bd = row.baseDamage
    if (typeof bd === 'number' && Number.isFinite(bd)) {
      baseDamageDisplay = String(bd)
    } else if (typeof bd === 'object' && bd !== null && 'min' in bd && 'max' in bd) {
      const mm = bd as { min: number; max: number }
      const a = skillHitBaseAnchorFromLevelRow(row)
      if (a.value != null && a.fromMinMaxAverage) {
        baseDamageDisplay = `${mm.min}–${mm.max}（表中點 ${a.value}，僅供估算）`
        baseDamageIsRangeMidpoint = true
      } else if (a.value != null) {
        baseDamageDisplay = `${mm.min}–${mm.max}（合併為 ${a.value}）`
      } else {
        baseDamageDisplay = `${mm.min}–${mm.max}（無法化為單一命中基礎）`
      }
    }
  }
  return {
    source: lr.source,
    skillGemLevel: inst.level,
    rowPartial: lr.partial,
    baseDamageDisplay,
    baseDamageIsRangeMidpoint,
    manaCost: row?.manaCost ?? null,
    cooldownSec: row?.cooldown ?? null,
    castTimeSec: row?.castTime ?? null,
    weaponDamagePct: row?.weaponDamagePct ?? null,
    addedDamageEffectiveness: row?.addedDamageEffectiveness ?? null,
    projectileCount: row?.projectileCount ?? null,
  }
}

function buildPresentationTags(args: {
  mode: InspectedSkillDamageView['mode']
  parseStatus: ParseStatus | null
  calculationConfidence: CalculationConfidence | null
  effectiveCalculationConfidence: CalculationConfidence | null
  damageRole: SkillDamageRole | null
  family: SkillFamily | null
  coreResolution: SkillTabExplanation['coreResolution']
}): string[] {
  const tags: string[] = []
  const push = (s: string) => {
    if (!tags.includes(s)) tags.push(s)
  }
  switch (args.coreResolution) {
    case 'no_slot':
      push('未選檢視槽')
      break
    case 'invalid_slot':
      push('檢視槽無效')
      break
    case 'empty_slot':
      push('空槽')
      break
    case 'disabled':
      push('已停用')
      break
    case 'unsupported_main_family':
      push('非主槽技能類型')
      break
    default:
      break
  }
  if (args.parseStatus === 'partial') push('資料部分解析')
  if (args.parseStatus === 'failed') push('解析失敗')
  if (args.calculationConfidence === 'partial') push('精算不完整')
  if (args.calculationConfidence === 'unsupported') push('技能層不支援精算')
  if (args.mode === 'damaging') {
    if (args.effectiveCalculationConfidence === 'partial') push('與衍生層：估算')
    if (args.effectiveCalculationConfidence === 'unsupported') push('不適合主 DPS 精算')
  }
  if (args.mode === 'dpsBlocked') push('主 DPS 卡暫停')
  if (args.damageRole === 'damaging' && args.family === 'active') push('輸出技能')
  if (args.damageRole === 'support-only') push('輔助定位')
  if (args.damageRole === 'aura-only') push('光環')
  if (args.damageRole === 'utility') push('功能技')
  if (args.damageRole === 'summon-driver') push('召喚／圖騰驅動')
  if (args.damageRole === 'unknown') push('角色分類未明')
  if (args.family === 'support') push('輔助石')
  return tags
}

function dedupeExplanationLines(lines: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const s of lines) {
    const t = s.trim()
    if (!t || seen.has(t)) continue
    seen.add(t)
    out.push(t)
  }
  return out
}

function buildSkillTabLocalNumericSummary(
  damageView: InspectedSkillDamageView,
  levelRowFacts: SkillTabLevelRowFacts | null,
  inst: SkillInstance | null,
  localMissingDataHints: string[],
): SkillTabLocalNumericSummary {
  const rowBits = {
    manaCost: levelRowFacts?.manaCost ?? null,
    cooldownSec: levelRowFacts?.cooldownSec ?? null,
    castTimeSec: levelRowFacts?.castTimeSec ?? null,
    projectileCount: levelRowFacts?.projectileCount ?? null,
  }
  const cs = inst?.computedStats ?? {}
  const atkRaw = cs['skill.attackSpeedIncreased']
  const castRaw = cs['skill.castSpeedIncreased'] ?? cs['skill.castSpeed']
  const skillLocalAttackSpeedIncreased =
    typeof atkRaw === 'number' && Number.isFinite(atkRaw) ? atkRaw : null
  const skillLocalCastSpeedIncreased =
    typeof castRaw === 'number' && Number.isFinite(castRaw) ? castRaw : null

  let previewKind: SkillTabLocalNumericSummary['previewKind'] = 'unavailable'
  let scopedHitDamage: number | null = null
  let scopedDpsPreview: number | null = null
  let scopedAttackSpeed: number | null = null
  let effectiveCalculationConfidence: CalculationConfidence | null = null
  let calculationConfidence: CalculationConfidence | null = inst?.calculationConfidence ?? null
  let damagingPresentation: 'authoritative' | 'estimate' | null = null
  const confidenceCaveats: string[] = [...localMissingDataHints]

  if (damageView.mode === 'damaging') {
    previewKind = 'full_scoped_combat'
    scopedHitDamage = damageView.combat.hitDamage
    scopedDpsPreview = damageView.combat.dps
    scopedAttackSpeed = damageView.combat.attackSpeed
    effectiveCalculationConfidence = damageView.effectiveCalculationConfidence
    damagingPresentation = damageView.damagingPresentation
    if (damageView.damagingPresentation === 'estimate') {
      confidenceCaveats.push('此命中／DPS 為估算：不可視為「唯一權威最終值」（與左欄標記一致）。')
    }
    if (damageView.effectiveCalculationConfidence === 'partial') {
      confidenceCaveats.push('有效信賴度為 partial：數值可能不完整或仍含假設。')
    }
    for (const f of damageView.skillBreakdown.derivedCombatFallbacks.slice(0, 8)) {
      confidenceCaveats.push(`衍生層：${f.key} — ${f.reason}`)
    }
  } else if (damageView.mode === 'dpsBlocked') {
    previewKind = 'resource_timing_only'
    effectiveCalculationConfidence = damageView.effectiveCalculationConfidence
    calculationConfidence = damageView.calculationConfidence
    confidenceCaveats.push(...damageView.whyNoDpsLines)
    confidenceCaveats.push(...damageView.missingDataHints)
    if (damageView.effectiveCalculationConfidence === 'unsupported') {
      confidenceCaveats.push('不顯示命中傷害／DPS 預覽（信賴度 unsupported；與左欄主 DPS 閘道一致）。')
    }
  } else if (damageView.mode === 'nonDamaging') {
    previewKind = 'resource_timing_only'
    calculationConfidence = damageView.calculationConfidence
    confidenceCaveats.push(...damageView.whyNoDpsLines)
    confidenceCaveats.push(...damageView.missingDataHints)
    if (damageView.calculationConfidence !== 'ready') {
      confidenceCaveats.push('技能層信賴度非 ready，下方數值僅供參考。')
    }
    confidenceCaveats.push('非輸出向角色分類：不提供單一「主技能 DPS」預覽。')
  } else if (damageView.mode === 'none') {
    previewKind = 'unavailable'
    const reasons: Record<string, string> = {
      no_slot: '尚未選擇檢視的主技能槽。',
      invalid_slot: '檢視槽位無效。',
      empty_slot: '此槽未配置主技能。',
      disabled: '主技能已停用。',
      unsupported_main_family: '主技能類型不支援計算管道。',
    }
    confidenceCaveats.push(reasons[damageView.reason] ?? '無法產生預覽。')
  }

  return {
    previewKind,
    scopedHitDamage,
    scopedDpsPreview,
    scopedAttackSpeed,
    ...rowBits,
    skillLocalAttackSpeedIncreased,
    skillLocalCastSpeedIncreased,
    effectiveCalculationConfidence,
    calculationConfidence,
    damagingPresentation,
    confidenceCaveats: dedupeExplanationLines(confidenceCaveats),
  }
}

function buildSupportLinkExplanations(
  row: SkillSetup | null,
  inst: SkillInstance | null,
  resolution: SkillTabExplanation['coreResolution'],
): SkillTabSupportLinkExplanation[] {
  if (!row?.skillId) return []
  const activeDef = getSkillDefinitionById(row.skillId)
  if (!activeDef) return []

  const forceNoEngine =
    resolution === 'disabled' ||
    resolution === 'unsupported_main_family' ||
    resolution === 'invalid_slot' ||
    resolution === 'no_slot'

  const links = [...(row.supports ?? [])].sort((a, b) => a.linkSlot - b.linkSlot)

  return links.map((link) => {
    const supDef = getSkillDefinitionById(link.supportSkillId)
    const supportName = supDef?.name ?? link.supportSkillId
    const gemLevel = Math.max(1, Math.floor(link.level ?? 1))
    const editorDisabled = link.enabled === false
    const rawLinesBase = supDef?.supportRules?.rawRequirementLines

    if (editorDisabled) {
      return {
        linkSlot: link.linkSlot,
        supportId: link.supportSkillId,
        supportName,
        gemLevel,
        editorDisabled: true,
        applied: false,
        skipReason: 'link_disabled',
        skipReasonZh: formatSupportSkipReasonZh('link_disabled'),
        warnings: [],
        rawRequirementLines: rawLinesBase,
        localStatEffects: ['連結停用：未送入技能 instance。'],
        affectedStatKeys: [],
        noStructuredEffect: false,
      }
    }

    if (!supDef || supDef.family !== 'support') {
      return {
        linkSlot: link.linkSlot,
        supportId: link.supportSkillId,
        supportName,
        gemLevel,
        editorDisabled: false,
        applied: false,
        skipReason: 'not_support_family',
        skipReasonZh: formatSupportSkipReasonZh('not_support_family'),
        warnings: [],
        rawRequirementLines: rawLinesBase,
        localStatEffects: [formatSupportSkipReasonZh('not_support_family')],
        affectedStatKeys: [],
        noStructuredEffect: false,
      }
    }

    if (forceNoEngine) {
      const sr = resolution === 'disabled' ? 'main_skill_disabled' : 'unsupported_main_family'
      const zh = formatSupportSkipReasonZh(sr)
      return {
        linkSlot: link.linkSlot,
        supportId: link.supportSkillId,
        supportName,
        gemLevel,
        editorDisabled: false,
        applied: false,
        skipReason: sr,
        skipReasonZh: zh,
        warnings: [],
        rawRequirementLines: rawLinesBase,
        localStatEffects: [zh],
        affectedStatKeys: [],
        noStructuredEffect: false,
      }
    }

    const att = inst?.supports.find((s) => s.supportRefId === link.supportSkillId)

    let applied: boolean
    let skipReason: string | undefined
    let warnings: string[]
    let rawLines: string[] | undefined

    if (att) {
      applied = att.applied
      skipReason = att.skipReason
      warnings = [...att.warnings]
      rawLines = att.rawRequirementLines ?? rawLinesBase
    } else {
      const ev = evaluateSupportAttachment(activeDef, supDef)
      applied = ev.applied
      skipReason = ev.skipReason
      warnings = [...ev.warnings]
      rawLines = ev.rawRequirementLines ?? rawLinesBase
    }

    let mods: ModifierDefinition[] = []
    if (applied && inst) {
      mods = inst.appliedModifiers
        .filter((m) => m.source === 'support' && m.refId === link.supportSkillId)
        .map((m) => m.modifier)
    } else if (applied && !inst) {
      mods = [
        ...(supDef.modifiers ?? []),
        ...modifiersFromSupportGemLevelRowAppliedToActive(activeDef.id, supDef, gemLevel),
      ]
    }

    const summarized = summarizeSupportModifierList(mods)
    let localStatEffects: string[] = []
    let noStructuredEffect = false

    if (!applied) {
      localStatEffects = [formatSupportSkipReasonZh(skipReason)]
    } else if (summarized.lines.length === 0) {
      noStructuredEffect = true
      localStatEffects = [
        '已判定相容，但缺少可量化的結構化效果（無有效 definition／等級列數值可摺入）。若仍見到「套用」，代表相容但資料不足以拆成數值摘要。',
      ]
      const extraWarn = warnings.filter((w) => !w.startsWith('support_raw_requirements_trace:')).slice(0, 4)
      if (extraWarn.length) {
        localStatEffects.push(...extraWarn.map((w) => `引擎提示：${w}`))
      }
    } else {
      localStatEffects = [...summarized.lines]
    }

    return {
      linkSlot: link.linkSlot,
      supportId: link.supportSkillId,
      supportName,
      gemLevel,
      editorDisabled: false,
      applied,
      skipReason,
      skipReasonZh: formatSupportSkipReasonZh(skipReason),
      warnings,
      rawRequirementLines: rawLines,
      localStatEffects,
      affectedStatKeys: summarized.statKeys,
      noStructuredEffect,
    }
  })
}

function buildLocalPreviewMetrics(inst: SkillInstance): SkillTabLocalPreviewMetrics {
  const { row } = resolveLevelRow(inst.activeDefinition, inst.level)
  const anchor = skillHitBaseAnchorFromLevelRow(row)
  const keys = Object.keys(inst.computedStats).sort((a, b) => a.localeCompare(b, 'en'))
  const computedStatSample = keys.slice(0, COMPUTED_STATS_SAMPLE_MAX).map((key) => ({
    key,
    value: inst.computedStats[key]!,
  }))
  return {
    manaCost: row?.manaCost ?? null,
    cooldownSec: row?.cooldown ?? null,
    castTimeSec: row?.castTime ?? null,
    projectileCount: row?.projectileCount ?? null,
    levelRowHitBase: anchor.value,
    levelRowHitBaseFromMinMaxAverage: anchor.fromMinMaxAverage,
    computedStatSample,
  }
}

function buildExplanationCore(
  snapshot: BuildSnapshot,
  core: ReturnType<typeof selectInspectedSkillPrimaryCore>,
  damageView: ReturnType<typeof selectInspectedSkillDamageView>,
): Omit<
  SkillTabExplanation,
  | 'localNumericSummary'
  | 'supportRemovalDeltas'
  | 'stripAllSupportsDelta'
  | 'passiveImpactTraces'
  | 'debugFoldout'
> {
  const slot = core.resolvedSlot
  const row = core.row
  const inst = core.instance

  if (core.resolution === 'no_slot' || core.resolution === 'invalid_slot') {
    return {
      slot: null,
      coreResolution: core.resolution,
      activeSkillId: null,
      activeSkillName: null,
      activeSkillFamily: null,
      enabled: false,
      parseStatus: null,
      damageRole: null,
      calculationConfidence: null,
      effectiveCalculationConfidence: null,
      inspectedDamageViewMode: damageView.mode,
      presentationTags: buildPresentationTags({
        mode: damageView.mode,
        parseStatus: null,
        calculationConfidence: null,
        effectiveCalculationConfidence: null,
        damageRole: null,
        family: null,
        coreResolution: core.resolution,
      }),
      levelRowFacts: null,
      localPreviewMetrics: null,
      baseSkillLines: [],
      levelRowLines: [],
      supportAppliedDetail: [],
      supportSkippedDetail: [],
      supportDeltaCandidates: [],
      supportLinkExplanations: buildSupportLinkExplanations(core.row ?? null, core.instance, core.resolution),
      passiveAuraLines: [],
      localWarnings: [],
      localMissingDataHints: [],
    }
  }

  if (core.resolution === 'empty_slot') {
    return {
      slot,
      coreResolution: 'empty_slot',
      activeSkillId: null,
      activeSkillName: null,
      activeSkillFamily: null,
      enabled: row?.enabled !== false,
      parseStatus: null,
      damageRole: null,
      calculationConfidence: null,
      effectiveCalculationConfidence: null,
      inspectedDamageViewMode: damageView.mode,
      presentationTags: buildPresentationTags({
        mode: damageView.mode,
        parseStatus: null,
        calculationConfidence: null,
        effectiveCalculationConfidence: null,
        damageRole: null,
        family: null,
        coreResolution: 'empty_slot',
      }),
      levelRowFacts: null,
      localPreviewMetrics: null,
      baseSkillLines: [],
      levelRowLines: [],
      supportAppliedDetail: [],
      supportSkippedDetail: [],
      supportDeltaCandidates: [],
      supportLinkExplanations: buildSupportLinkExplanations(core.row ?? null, core.instance, core.resolution),
      passiveAuraLines: slot != null ? passiveAuraLinesForSlot(snapshot, slot) : [],
      localWarnings: [],
      localMissingDataHints: ['主技能槽為空：無 level row / support 可解釋。'],
    }
  }

  if (core.resolution === 'disabled') {
    const def = row?.skillId ? getSkillDefinitionById(row.skillId) : undefined
    return {
      slot,
      coreResolution: 'disabled',
      activeSkillId: row?.skillId ?? null,
      activeSkillName: def?.name ?? row?.skillId ?? null,
      activeSkillFamily: def?.family ?? null,
      enabled: false,
      parseStatus: null,
      damageRole: null,
      calculationConfidence: null,
      effectiveCalculationConfidence: null,
      inspectedDamageViewMode: damageView.mode,
      presentationTags: buildPresentationTags({
        mode: damageView.mode,
        parseStatus: null,
        calculationConfidence: null,
        effectiveCalculationConfidence: null,
        damageRole: null,
        family: def?.family ?? null,
        coreResolution: 'disabled',
      }),
      levelRowFacts: null,
      localPreviewMetrics: null,
      baseSkillLines: def ? [`family=${def.family}`, `tags: ${def.tags.slice(0, 8).join('、') || '—'}`] : [],
      levelRowLines: [],
      supportAppliedDetail: [],
      supportSkippedDetail: [],
      supportDeltaCandidates: [],
      supportLinkExplanations: buildSupportLinkExplanations(core.row ?? null, core.instance, core.resolution),
      passiveAuraLines: slot != null ? passiveAuraLinesForSlot(snapshot, slot) : [],
      localWarnings: ['此主技能已停用（未建立 instance）。'],
      localMissingDataHints: [],
    }
  }

  if (core.resolution === 'unsupported_main_family' && row?.skillId) {
    const def = getSkillDefinitionById(row.skillId)
    return {
      slot,
      coreResolution: 'unsupported_main_family',
      activeSkillId: row.skillId,
      activeSkillName: def?.name ?? row.skillId,
      activeSkillFamily: def?.family ?? null,
      enabled: row.enabled !== false,
      parseStatus: null,
      damageRole: null,
      calculationConfidence: null,
      effectiveCalculationConfidence: null,
      inspectedDamageViewMode: damageView.mode,
      presentationTags: buildPresentationTags({
        mode: damageView.mode,
        parseStatus: null,
        calculationConfidence: null,
        effectiveCalculationConfidence: null,
        damageRole: null,
        family: def?.family ?? null,
        coreResolution: 'unsupported_main_family',
      }),
      levelRowFacts: null,
      localPreviewMetrics: null,
      baseSkillLines: def ? [`family=${def.family}（非主槽可用族）`] : [],
      levelRowLines: [],
      supportAppliedDetail: [],
      supportSkippedDetail: [],
      supportDeltaCandidates: [],
      supportLinkExplanations: buildSupportLinkExplanations(core.row ?? null, core.instance, core.resolution),
      passiveAuraLines: slot != null ? passiveAuraLinesForSlot(snapshot, slot) : [],
      localWarnings: [],
      localMissingDataHints: ['主槽技能族別不支援 instance 管道。'],
    }
  }

  if (!inst || slot == null) {
    const defW = row?.skillId ? getSkillDefinitionById(row.skillId) : undefined
    return {
      slot,
      coreResolution: core.resolution,
      activeSkillId: row?.skillId ?? null,
      activeSkillName: defW?.name ?? null,
      activeSkillFamily: defW?.family ?? null,
      enabled: row?.enabled !== false,
      parseStatus: null,
      damageRole: null,
      calculationConfidence: null,
      effectiveCalculationConfidence: null,
      inspectedDamageViewMode: damageView.mode,
      presentationTags: buildPresentationTags({
        mode: damageView.mode,
        parseStatus: null,
        calculationConfidence: null,
        effectiveCalculationConfidence: null,
        damageRole: null,
        family: defW?.family ?? null,
        coreResolution: core.resolution,
      }),
      levelRowFacts: null,
      localPreviewMetrics: null,
      baseSkillLines: [],
      levelRowLines: [],
      supportAppliedDetail: [],
      supportSkippedDetail: [],
      supportDeltaCandidates: [],
      supportLinkExplanations: buildSupportLinkExplanations(core.row ?? null, core.instance, core.resolution),
      passiveAuraLines: slot != null ? passiveAuraLinesForSlot(snapshot, slot) : [],
      localWarnings: [],
      localMissingDataHints: ['無法建立技能 instance。'],
    }
  }

  const def = inst.activeDefinition
  const baseSkillLines = [
    `active · Lv${inst.level} · ${def.name} (${def.id})`,
    `family=${def.family} · damageRole=${inst.damageRole} · structuralDamageEvidence=${inst.structuralDamageEvidence}`,
    `tags: ${def.tags.slice(0, 10).join('、') || '—'}`,
    ...formatBaseSkillModifierLines(def),
  ]

  const supportAppliedDetail = inst.supports
    .filter((s) => s.applied)
    .map((s) => ({ id: s.supportRefId, name: s.supportName, gemLevel: s.gemLevel }))
  const supportSkippedDetail = inst.supports
    .filter((s) => !s.applied)
    .map((s) => ({ id: s.supportRefId, name: s.supportName, skipReason: s.skipReason }))

  const localWarnings = [
    ...inst.warnings,
    ...(inst.breakdown.recordWarnings ?? []),
    ...inst.breakdown.engineWarnings,
  ]

  let effectiveCalculationConfidence: SkillTabExplanation['effectiveCalculationConfidence'] = null
  if (damageView.mode === 'damaging') {
    effectiveCalculationConfidence = damageView.effectiveCalculationConfidence
  } else if (damageView.mode === 'dpsBlocked') {
    effectiveCalculationConfidence = damageView.effectiveCalculationConfidence
  }

  return {
    slot,
    coreResolution: 'ok',
    activeSkillId: inst.activeId,
    activeSkillName: inst.activeName,
    activeSkillFamily: def.family,
    enabled: row?.enabled !== false,
    parseStatus: inst.breakdown.parseStatus ?? null,
    damageRole: inst.damageRole,
    calculationConfidence: inst.calculationConfidence,
    effectiveCalculationConfidence,
    inspectedDamageViewMode: damageView.mode,
    presentationTags: buildPresentationTags({
      mode: damageView.mode,
      parseStatus: inst.breakdown.parseStatus ?? null,
      calculationConfidence: inst.calculationConfidence,
      effectiveCalculationConfidence,
      damageRole: inst.damageRole,
      family: def.family,
      coreResolution: 'ok',
    }),
    levelRowFacts: buildLevelRowFacts(inst),
    localPreviewMetrics: buildLocalPreviewMetrics(inst),
    baseSkillLines,
    levelRowLines: buildLevelRowLines(inst),
    supportAppliedDetail,
    supportSkippedDetail,
    supportDeltaCandidates: [],
    supportLinkExplanations: buildSupportLinkExplanations(core.row ?? null, core.instance, core.resolution),
    passiveAuraLines: passiveAuraLinesForSlot(snapshot, slot),
    localWarnings,
    localMissingDataHints: collectLocalMissingDataHints(inst),
    debugTrace: inst.breakdown.trace,
  }
}

/**
 * Skill-local explanation for the central Skill TAB (inspected main slot only).
 * Safe to call alongside `selectBuildStatsPanelDerived`; does not mutate shared state.
 */
export function selectSkillTabExplanation(snapshot: BuildSnapshot): SkillTabExplanation {
  const core = selectInspectedSkillPrimaryCore(snapshot)
  const damageView = selectInspectedSkillDamageView(snapshot)
  const base = buildExplanationCore(snapshot, core, damageView)
  const supportRemovalDeltas =
    core.resolution === 'ok' && core.instance && core.row && core.resolvedSlot != null
      ? buildSupportRemovalDeltas(
          snapshot,
          core.resolvedSlot,
          core.row,
          core.instance,
          base.supportLinkExplanations,
        )
      : []
  const stripAllSupportsDelta =
    core.resolution === 'ok' && core.instance && core.row && core.resolvedSlot != null
      ? buildStripAllSupportsDelta(snapshot, core.resolvedSlot, core.row, core.instance)
      : null

  const passiveImpactTraces =
    core.resolvedSlot != null && core.row?.skillId
      ? buildPassiveImpactTraces(snapshot, core.resolvedSlot, core.row.skillId)
      : []

  const debugFoldout = buildSkillTabDebugFoldout(
    {
      activeSkillId: base.activeSkillId,
      parseStatus: base.parseStatus,
      levelRowLines: base.levelRowLines,
      levelRowFacts: base.levelRowFacts,
      supportSkippedDetail: base.supportSkippedDetail,
      localMissingDataHints: base.localMissingDataHints,
      localWarnings: base.localWarnings,
      supportLinkExplanations: base.supportLinkExplanations,
      debugTrace: base.debugTrace,
    },
    core.instance,
  )

  return {
    ...base,
    passiveImpactTraces,
    debugFoldout,
    localNumericSummary: buildSkillTabLocalNumericSummary(
      damageView,
      base.levelRowFacts,
      core.instance,
      base.localMissingDataHints,
    ),
    supportRemovalDeltas,
    stripAllSupportsDelta,
    supportDeltaCandidates: supportRemovalDeltas.map((r) => ({
      supportId: r.supportId,
      supportName: r.supportName,
      deltas: Object.fromEntries(r.computedStatDeltas.map((x) => [x.key, x.delta])),
    })),
  }
}

export type { SkillTabExplanation } from '@/types/skillTabExplanation'
