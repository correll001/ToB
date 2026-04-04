/**
 * Runtime skill evaluation (instances) — builds on normalized SkillDefinition.
 */

import type { ModifierDefinition, SkillDefinition } from "./skillData"
import type { SkillDamageRole } from "./skillDamageRole"
import type { BuildSidebarCombatStats, CombatBreakdown, ContributionEntry, StatBlock } from "./combat"
import type { MainSkillSlot } from "./build"
import type { ParseStatus } from "./normalized"

/** How much the engine trusts numeric output for this instance (4D-4). */
export type CalculationConfidence = "ready" | "partial" | "unsupported"

/** TLIDB-aligned default; override via GlobalCombatRuleLayer. */
export type Post20ScalingConfig = {
  /** Levels 21–30: each level in this band applies this % as more (multiplicative with prior levels). */
  tier21to30PerLevelMorePct: number
  /** Level 31+: each level in this band applies this % as more. */
  tier31PlusPerLevelMorePct: number
}

/** Pluggable global rules (Skill_Level + Character_Build hooks). */
export type GlobalCombatRuleLayer = {
  getPost20Scaling(): Post20ScalingConfig
  /** Character_Build–style resource bases (optional; panel uses computeDerivedCombat today). */
  getResourceScalingHint(): {
    hpFlatPerLevel?: number
    mpFlatPerLevel?: number
    strToHp?: number
    intToMp?: number
  } | null
  /** For damage bucket / ailment stacking — extend later. */
  getDamageBucketKeys(): string[]
}

export type SupportAttachment = {
  supportRefId: string
  supportName: string
  supportDefinition: SkillDefinition
  /** Support gem level used for level-row / evaluation (not character level). */
  gemLevel: number
  applied: boolean
  warnings: string[]
  skipReason?: string
  /** From normalized data — audit only, not re-parsed into booleans. */
  rawRequirementLines?: string[]
}

export type AppliedModifierRef = {
  source: "active" | "support" | "external" | "levelRow" | "post20" | "passive"
  refId: string
  modifier: ModifierDefinition
}

/**
 * Folded skill-centric stats (registry keys, e.g. skill.weaponDamagePct, damage.increased).
 * Engine-specific; not identical to StatBlock.
 */
export type SkillComputedStats = Record<string, number>

/** Explainable snapshot for UI / QA (no random components). */
export type SkillInstanceBreakdown = {
  activeId: string
  activeName: string
  mainSlot: number
  slotLabel: string
  level: number
  /** Data-driven routing: only `damaging` + confidence may feed primary DPS UI. */
  damageRole: SkillDamageRole
  calculationConfidence: CalculationConfidence
  structuralDamageEvidence: boolean
  parseStatus?: ParseStatus
  recordWarnings?: string[]
  levelRow: {
    source: "levelTable" | "breakpoints" | "none"
    partial: boolean
    modifierCount: number
    textLineHints?: string[]
  }
  supports: Array<{
    id: string
    name: string
    gemLevel: number
    applied: boolean
    skipReason?: string
    warnings: string[]
    rawRequirementLines?: string[]
  }>
  post20: {
    multiplier: number
    tier21to30PerLevelMorePct: number
    tier31PlusPerLevelMorePct: number
    disabledByMechanic: boolean
  }
  passiveModifierCount: number
  externalModifierCount: number
  levelModifierCount: number
  activeBaseModifierCount: number
  appliedSupportModifierCount: number
  computedStats: SkillComputedStats
  engineWarnings: string[]
  trace: SkillInstanceTrace
}

/** Audit trail: which supports/passives/post-20 participated (IDs + stats only, no fabricated values). */
export type SkillInstanceTrace = {
  supportsAcceptedIds: string[]
  supportsRejected: Array<{ id: string; reason?: string }>
  passiveInjects: Array<{ refId: string; stat: string; operation: string }>
  post20Applied: boolean
  post20RefId?: string
}

export type SkillInstance = {
  /** Same as SkillDefinition.id */
  activeId: string
  activeName: string
  activeDefinition: SkillDefinition
  level: number
  damageRole: SkillDamageRole
  calculationConfidence: CalculationConfidence
  structuralDamageEvidence: boolean
  /** Display + logic tags (active tags + canonical copies where useful). */
  computedTags: string[]
  /** Canonical tags used for support matching (English keys + unique Zh where unmapped). */
  canonicalTags: string[]
  supports: SupportAttachment[]
  computedStats: SkillComputedStats
  appliedModifiers: AppliedModifierRef[]
  warnings: string[]
  /** Multiplier from global post-20 rule (1 = no extra). */
  post20MoreMultiplier: number
  /** Ready to merge into aggregateStatBlocks via adapter. */
  contributionBlock: StatBlock
  breakdown: SkillInstanceBreakdown
}

export type InspectedSkillNoneReason =
  | 'no_slot'
  | 'empty_slot'
  | 'disabled'
  | 'invalid_slot'
  | 'unsupported_main_family'

export type InspectedSkillDamageViewNone = {
  mode: 'none'
  reason: InspectedSkillNoneReason
}

/** Inspected skill is treated as a primary damage skill (hit / spell / DoT heuristics). */
export type InspectedSkillDamageViewDamaging = {
  mode: 'damaging'
  role: SkillDamageRole
  /** `authoritative` only when instance + derive layer are `ready`; otherwise `estimate` (4E-5). */
  damagingPresentation: 'authoritative' | 'estimate'
  /** Combat derived from full build + only this skill’s skill contribution (not other skills). */
  combat: BuildSidebarCombatStats
  skillBreakdown: CombatBreakdown
  /** Worst of skill-instance vs derived-combat layer so UI never shows “ready” on placeholder DPS (4E-4). */
  effectiveCalculationConfidence: CalculationConfidence
  supportApplied: number
  supportSkipped: number
  manaCost: number | null
  cooldownSec: number | null
  castTimeSec: number | null
}

/** damaging role but presentation gate blocks primary DPS card (4E-5). */
export type InspectedSkillDamageViewDpsBlocked = {
  mode: 'dpsBlocked'
  blockReason: 'instance_unsupported' | 'effective_unsupported'
  role: SkillDamageRole
  family: string
  tags: string[]
  calculationConfidence: CalculationConfidence
  effectiveCalculationConfidence: CalculationConfidence
  whyNoDpsLines: string[]
  missingDataHints: string[]
  otherMainSkills: Array<{ slot: MainSkillSlot; skillId: string; name: string }>
  passiveAuraLines: string[]
  modifierLines: string[]
  requirementLines: string[]
  supportApplied: number
  supportSkipped: number
  supportsSkippedDetail: Array<{ id: string; name: string; skipReason?: string }>
  supportsAppliedDetail: Array<{ id: string; name: string }>
}

export type InspectedSkillDamageViewNonDamaging = {
  mode: 'nonDamaging'
  role: SkillDamageRole
  family: string
  tags: string[]
  calculationConfidence: CalculationConfidence
  whyNoDpsLines: string[]
  missingDataHints: string[]
  otherMainSkills: Array<{ slot: MainSkillSlot; skillId: string; name: string }>
  passiveAuraLines: string[]
  modifierLines: string[]
  requirementLines: string[]
  supportApplied: number
  supportSkipped: number
  supportsSkippedDetail: Array<{ id: string; name: string; skipReason?: string }>
  supportsAppliedDetail: Array<{ id: string; name: string }>
}

export type InspectedSkillDamageView =
  | InspectedSkillDamageViewNone
  | InspectedSkillDamageViewDamaging
  | InspectedSkillDamageViewDpsBlocked
  | InspectedSkillDamageViewNonDamaging

/** Selector-only audit bundle for inspected skill (4E-3). */
export type InspectedSkillDebugView = {
  metaSlotRaw: number | null
  resolvedSlot: MainSkillSlot | null
  resolution:
    | 'ok'
    | 'no_slot'
    | 'invalid_slot'
    | 'empty_slot'
    | 'disabled'
    | 'unsupported_main_family'
  primaryInstance: SkillInstance | null
  damageViewMode: InspectedSkillDamageView['mode']
  inspectedFilteredContributionCount: number
  buildWideContributionCount: number
}

export type ComputeSkillInstanceInput = {
  active: SkillDefinition
  level: number
  supports: SkillDefinition[]
  /** Per support id → gem level (defaults to 1 if missing). */
  supportLevelsById?: Record<string, number>
  externalModifiers?: ModifierDefinition[]
  /** Passive gems / auras: folded into this instance (caller scopes to `active.id`). */
  passiveModifiers?: ModifierDefinition[]
  globalLayer?: GlobalCombatRuleLayer
  activeParse?: { status: ParseStatus; warnings?: string[] }
  /** For breakdown labels only (e.g. "Skill slot 1"). */
  slotLabel?: string
  /** Main skill slot index 1–5 (PoB inspected grouping). */
  mainSlot?: number
}

/** Merge pipeline: append computed skill rows without removing existing mock contributions. */
export function appendSkillInstanceContributions(
  contributions: ContributionEntry[],
  instances: SkillInstance[],
  adapter: (i: SkillInstance) => ContributionEntry,
): ContributionEntry[] {
  return [...contributions, ...instances.map(adapter)]
}
