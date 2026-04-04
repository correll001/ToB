/**
 * Global combat / scaling rules (Skill_Level, Character_Build, etc.).
 * Separate from per-skill SkillDefinition so season/version diffs stay clear.
 * JSON-serializable only.
 */

import type { JsonValue } from "./skillData"
import type { StructuredCombatRules } from "./combatRules"

/** One document aggregating wiki-derived global rules for a season. */
export type GlobalCombatRuleSet = {
  id: string
  season: string
  version: string
  locale?: string
  sourceUrls?: string[]
  post20Scaling?: Post20SkillScalingRule[]
  damageBuckets?: DamageBucketRule[]
  /** Build / character-wide constraints from Character_Build-style sources. */
  characterBuildRules?: CharacterBuildRuleSection[]
  /**
   * Escape hatch for tables not yet classified — keep structured subtrees,
   * not a single blob string.
   *
   * Runtime (4E-4): optional `derivedCombatPanel` may supply numeric panel derive constants
   * (`hpBaseFlat`, `weaponDamagePerLevel`, …) — see `getDerivedCombatBaseRules`.
   */
  extensions?: Record<string, JsonValue>
  /**
   * 4E-1: authoritative combat rules as typed blocks (`types/combatRules.ts`).
   * Optional until ETL ingests transcripts + manifest; does not replace `extensions` escape hatch.
   */
  structuredCombatRules?: StructuredCombatRules
}

/** Describes how skills (or modifiers) scale after the standard cap (e.g. Lv20+). */
export type Post20SkillScalingRule = {
  id: string
  /** Cross-reference from SkillLevelEntry.post20Ref.ruleId */
  labels?: string[]
  description?: string[]
  fromLevel?: number
  toLevel?: number | null
  /**
   * Per-stat incremental hints; engine may interpret perLevel or follow curveId
   * from a separate curve table.
   */
  increments?: Array<{
    stat: string
    perLevel?: number
    curveId?: string
  }>
  /** Unparsed but segmented lines from source. */
  textLines?: string[]
}

/** Taxonomy for damage / debuff buckets (ailments, DoT refresh rules, …). */
export type DamageBucketRule = {
  id: string
  bucketKey: string
  displayNames?: string[]
  stackingRule?: "additive" | "refresh" | "independent" | "max" | "unknown"
  /** e.g. affects ignite / bleed / trauma */
  ailmentKeys?: string[]
  notes?: string[]
}

/** Section from character build documentation (stats, resources, reservation…). */
export type CharacterBuildRuleSection = {
  sectionId: string
  title?: string
  bullets?: string[]
  modifiers?: Array<{
    stat: string
    value: number | string
    operation?: "add" | "mul" | "override"
  }>
  childSections?: CharacterBuildRuleSection[]
}
