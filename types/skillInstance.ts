/**
 * Runtime skill evaluation (instances) — builds on normalized SkillDefinition.
 */

import type { ModifierDefinition, SkillDefinition } from "./skillData"
import type { ContributionEntry, StatBlock } from "./combat"
import type { ParseStatus } from "./normalized"

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
  slotLabel: string
  level: number
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
}

export type SkillInstance = {
  /** Same as SkillDefinition.id */
  activeId: string
  activeName: string
  activeDefinition: SkillDefinition
  level: number
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

export type ComputeSkillInstanceInput = {
  active: SkillDefinition
  level: number
  supports: SkillDefinition[]
  externalModifiers?: ModifierDefinition[]
  /** Passive gems / auras: folded into this instance (caller scopes to `active.id`). */
  passiveModifiers?: ModifierDefinition[]
  globalLayer?: GlobalCombatRuleLayer
  activeParse?: { status: ParseStatus; warnings?: string[] }
  /** For breakdown labels only (e.g. "Skill slot 1"). */
  slotLabel?: string
}

/** Merge pipeline: append computed skill rows without removing existing mock contributions. */
export function appendSkillInstanceContributions(
  contributions: ContributionEntry[],
  instances: SkillInstance[],
  adapter: (i: SkillInstance) => ContributionEntry,
): ContributionEntry[] {
  return [...contributions, ...instances.map(adapter)]
}
