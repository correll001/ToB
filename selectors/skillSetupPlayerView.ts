/**
 * Skill Setup — player-facing view model: presentation regroup only.
 * Does not alter `selectSkillTabExplanation` output or any formula / global panel selectors.
 */
import type { BuildSnapshot } from '@/types/build'
import type { SkillSetupPlayerView } from '@/types/skillSetupPlayerView'
import type { SkillTabExplanation } from '@/types/skillTabExplanation'
import type { ParseStatus } from '@/types/normalized'
import type { SkillDamageRole } from '@/types/skillDamageRole'
import { getSkillDefinitionById } from '@/lib/runtime/runtimeSkillLookup'
import { selectSkillTabExplanation } from '@/selectors/skillTabExplanation'
import { buildPlayerContributionFlow } from '@/selectors/skillSetupContributionFlow'

function parseStatusLabelZh(p: ParseStatus | null): string {
  if (p === 'ok') return '完整'
  if (p === 'partial') return '部分'
  if (p === 'failed') return '失敗'
  return '—'
}

function damageRoleLabelZh(r: SkillDamageRole | null): string | null {
  if (r == null) return null
  switch (r) {
    case 'damaging':
      return '輸出'
    case 'support-only':
      return '輔助'
    case 'aura-only':
      return '光環'
    case 'utility':
      return '功能'
    case 'summon-driver':
      return '召喚／圖騰'
    case 'unknown':
      return '未明'
    default:
      return null
  }
}

function levelRowSourceLabelZh(
  source: 'levelTable' | 'breakpoints' | 'none' | null,
): string | null {
  if (source == null) return null
  if (source === 'levelTable') return '等級表（連續 Lv）'
  if (source === 'breakpoints') return '稀疏等級表（不連續）'
  return '無對應列'
}

function buildSkillSummary(ex: SkillTabExplanation): SkillSetupPlayerView['skillSummary'] {
  const f = ex.levelRowFacts
  const num = ex.localNumericSummary
  const gaps: string[] = []

  if (!ex.activeSkillName && !ex.activeSkillId) gaps.push('尚未選擇主技能。')
  if (f == null) gaps.push('缺少等級表摘要。')
  if (f?.source === 'none') gaps.push('等級表對不上，基礎數值可能不完整。')

  const def = ex.activeSkillId ? getSkillDefinitionById(ex.activeSkillId) : undefined
  const rawTags = def?.tags?.length ? def.tags.slice(0, 12) : []

  return {
    skillName: ex.activeSkillName,
    skillId: ex.activeSkillId,
    slot: ex.slot,
    family: ex.activeSkillFamily,
    damageRole: ex.damageRole,
    damageRoleLabelZh: damageRoleLabelZh(ex.damageRole),
    corePresentationTags: [...ex.presentationTags],
    definitionTagsSample: rawTags,
    gemLevel: f?.skillGemLevel ?? null,
    manaCost: f?.manaCost ?? null,
    cooldownSec: f?.cooldownSec ?? null,
    castTimeSec: f?.castTimeSec ?? null,
    castTimeLabelHint:
      f?.weaponDamagePct != null ? 'cast_or_attack_timing' : f != null ? 'cast_only' : null,
    baseDamageSummary: f?.baseDamageDisplay ?? null,
    baseDamageIsRangeMidpoint: f?.baseDamageIsRangeMidpoint ?? false,
    levelRowSource: f?.source ?? null,
    levelRowSourceLabelZh: levelRowSourceLabelZh(f?.source ?? null),
    rowPartial: f?.rowPartial ?? false,
    weaponDamagePct: f?.weaponDamagePct ?? null,
    addedDamageEffectiveness: f?.addedDamageEffectiveness ?? null,
    projectileCount: f?.projectileCount ?? null,
    derivedAttackSpeedPreview:
      num.previewKind === 'full_scoped_combat' ? num.scopedAttackSpeed : null,
    inspectedDamageViewMode: ex.inspectedDamageViewMode,
    summaryDataGaps: gaps,
  }
}

function buildSupportResults(ex: SkillTabExplanation): SkillSetupPlayerView['supportResults'] {
  const rows = ex.supportLinkExplanations.map((l) => ({
    linkSlot: l.linkSlot,
    supportId: l.supportId,
    supportName: l.supportName,
    gemLevel: l.gemLevel,
    editorDisabled: l.editorDisabled,
    applied: l.applied,
    impactSummaryLines: [...l.localStatEffects],
    skipPlainLanguage: l.skipReasonZh,
    machineSkipReason: l.skipReason,
    hasStructuredQuantifiedSummary: l.applied && !l.noStructuredEffect,
  }))

  return {
    rows,
    appliedCount: ex.supportAppliedDetail.length,
    skippedCount: ex.supportSkippedDetail.length,
  }
}

function buildAdvancedDetails(ex: SkillTabExplanation): SkillSetupPlayerView['advancedDetails'] {
  const d = ex.debugFoldout
  return {
    canonicalTags: [...d.canonicalTags],
    mainSkillRawRequirementLines: [...d.mainSkillRawRequirementLines],
    supportRawRequirements: d.supportLinkRawRequirements.map((b) => ({
      linkSlot: b.linkSlot,
      supportId: b.supportId,
      supportName: b.supportName,
      lines: [...b.lines],
    })),
    traceSummaryLines: [...d.traceSummaryLines],
    missingDataHintsFoldout: [...d.localMissingDataHints],
    missingDataHintsTop: [...ex.localMissingDataHints],
    parseStatus: d.parseStatus,
    parseStatusLabelZh: parseStatusLabelZh(d.parseStatus),
    recordWarnings: [...d.recordWarnings],
    instanceWarnings: [...d.instanceWarnings],
    engineWarnings: [...d.engineWarnings],
    contextNotesWithoutInstance: [...d.contextNotesWithoutInstance],
    levelRowDetailLines: [...d.levelRowDetailLines],
    supportSkippedEngineRows: d.supportSkippedRows.map((s) => ({ ...s })),
    topLevelLocalWarnings: [...ex.localWarnings],
  }
}

/**
 * Pure transform: `SkillTabExplanation` → player view tiers.
 * Safe to call in tests without snapshot.
 */
export function buildSkillSetupPlayerView(explanation: SkillTabExplanation): SkillSetupPlayerView {
  return {
    skillSummary: buildSkillSummary(explanation),
    supportResults: buildSupportResults(explanation),
    contributionFlow: buildPlayerContributionFlow(explanation),
    advancedDetails: buildAdvancedDetails(explanation),
  }
}

/**
 * Snapshot entry: reuses `selectSkillTabExplanation` only — no new combat math.
 */
export function selectSkillSetupPlayerView(snapshot: BuildSnapshot): SkillSetupPlayerView {
  return buildSkillSetupPlayerView(selectSkillTabExplanation(snapshot))
}
