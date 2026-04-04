/**
 * Skill Setup — presentation-only view model (4F / player refactor).
 * Built from `SkillTabExplanation` without recomputing combat or skill-engine numbers.
 */

import type { MainSkillSlot } from '@/types/build'
import type { ParseStatus } from '@/types/normalized'
import type { SkillFamily } from '@/types/skillData'
import type { SkillDamageRole } from '@/types/skillDamageRole'
import type { InspectedSkillDamageView } from '@/types/skillInstance'
import type { SkillTabSupportSkippedRow } from '@/types/skillTabExplanation'

/** Shown when a subsection has no strings and no fabricated deltas are allowed. */
export const SKILL_SETUP_DATA_GAP_NO_QUANTIFIED_DELTA =
  '這裡算不出精確增減數字，先以文字效果為準。'

export type SkillSetupPlayerSkillSummary = {
  skillName: string | null
  skillId: string | null
  slot: MainSkillSlot | null
  family: SkillFamily | null
  damageRole: SkillDamageRole | null
  /** Mapped enum → short zh (presentation map only). */
  damageRoleLabelZh: string | null
  /** Curated chips from `presentationTags` (engine already player-oriented). */
  corePresentationTags: string[]
  /**
   * Raw game tags from definition (first slice), for flavor — not re-interpreted.
   * Empty when no definition / id.
   */
  definitionTagsSample: string[]
  gemLevel: number | null
  manaCost: number | null
  cooldownSec: number | null
  castTimeSec: number | null
  /** When weaponDamagePct set on row, UI historically labels cast row as attack+spell timing. */
  castTimeLabelHint: 'cast_only' | 'cast_or_attack_timing' | null
  baseDamageSummary: string | null
  baseDamageIsRangeMidpoint: boolean
  levelRowSource: 'levelTable' | 'breakpoints' | 'none' | null
  levelRowSourceLabelZh: string | null
  rowPartial: boolean
  weaponDamagePct: number | null
  addedDamageEffectiveness: number | null
  projectileCount: number | null
  /** Copied from `localNumericSummary.scopedAttackSpeed` when present — not recomputed. */
  derivedAttackSpeedPreview: number | null
  inspectedDamageViewMode: InspectedSkillDamageView['mode']
  /** When critical summary fields are missing. */
  summaryDataGaps: string[]
}

export type SkillSetupSupportResultRow = {
  linkSlot: number
  supportId: string
  supportName: string
  gemLevel: number
  editorDisabled: boolean
  applied: boolean
  /** Player lines from `localStatEffects` only. */
  impactSummaryLines: string[]
  skipPlainLanguage: string
  machineSkipReason: string | undefined
  /** False when applied but engine reported no structured numeric fold (`noStructuredEffect`). */
  hasStructuredQuantifiedSummary: boolean
}

export type SkillSetupSupportResults = {
  rows: SkillSetupSupportResultRow[]
  /** Lengths from `supportAppliedDetail` / `supportSkippedDetail` — not recomputed from rows. */
  appliedCount: number
  skippedCount: number
}

/** Base → narrative strings + structured level-row facts (formatting only). */
export type ContributionFlowBaseLayer = {
  narrativeLines: string[]
  levelRowFactLines: string[]
}

/**
 * One **applied & enabled** support on the contribution path.
 * Skipped / disabled links belong in Support Results, not here.
 */
export type ContributionFlowSupportAppliedItem = {
  linkSlot: number
  supportName: string
  gemLevel: number
  effectLines: string[]
  /** Additional `localStatEffects` beyond the first 3 shown. */
  moreEffectCount: number
  noStructuredEffect: boolean
  /** From `supportRemovalDeltas[].deltaLines` when present. */
  counterfactualDeltaLines: string[]
  /** Formatted from `computedStatDeltas` + combat compare fields only (no new math). */
  counterfactualMetricLines: string[]
  counterfactualUnsupported: boolean
  counterfactualUnsupportedNote: string | null
}

export type ContributionFlowSupportsLayer = {
  items: ContributionFlowSupportAppliedItem[]
  emptyHint: string
}

export type ContributionFlowPassiveTraceItem = {
  headline: string
  bodyLines: string[]
}

export type ContributionFlowPassivesLayer = {
  narrativeLines: string[]
  traces: ContributionFlowPassiveTraceItem[]
  /** Explicit honesty: passive layer does not emit per-line numeric deltas here. */
  unquantifiedDeltaNotice: string
}

export type ContributionFlowFinalMetricRow = {
  label: string
  value: string
}

export type ContributionFlowFinalLayer = {
  metrics: ContributionFlowFinalMetricRow[]
  extraLines: string[]
  unavailableNote: string | null
}

/** Player-facing single path: Base → Supports (applied only) → Passives/Aura → Final. */
export type SkillSetupContributionFlow = {
  base: ContributionFlowBaseLayer
  supports: ContributionFlowSupportsLayer
  passivesAura: ContributionFlowPassivesLayer
  final: ContributionFlowFinalLayer
}

export type SkillSetupAdvancedDetails = {
  canonicalTags: string[]
  mainSkillRawRequirementLines: string[]
  supportRawRequirements: Array<{
    linkSlot: number
    supportId: string
    supportName: string
    lines: string[]
  }>
  traceSummaryLines: string[]
  missingDataHintsFoldout: string[]
  missingDataHintsTop: string[]
  parseStatus: ParseStatus | null
  parseStatusLabelZh: string
  recordWarnings: string[]
  instanceWarnings: string[]
  engineWarnings: string[]
  contextNotesWithoutInstance: string[]
  levelRowDetailLines: string[]
  supportSkippedEngineRows: SkillTabSupportSkippedRow[]
  topLevelLocalWarnings: string[]
}

export type SkillSetupPlayerView = {
  skillSummary: SkillSetupPlayerSkillSummary
  supportResults: SkillSetupSupportResults
  contributionFlow: SkillSetupContributionFlow
  advancedDetails: SkillSetupAdvancedDetails
}
