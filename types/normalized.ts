/**
 * Envelopes for versioned normalized JSON (ETL output).
 * Wraps canonical SkillDefinition / GlobalCombatRuleSet with parse metadata.
 */

import type { GlobalCombatRuleSet } from "./rules"
import type { SkillDefinition } from "./skillData"

export type ParseStatus = "ok" | "partial" | "failed"

/** Included at the top of each normalized JSON artifact. */
export type NormalizedDocumentMeta = {
  season: string
  locale: string
  generatedAt: string
  /** ETL normalize step version (bump when parser logic changes). */
  parserVersion: string
  /** Number of source records merged into this file (skills.length or rule sources). */
  sourceCount: number
  /** Total warnings across all records in this file. */
  warningsCount: number

  /** Present when file is written to `data/effective/` after override merge. */
  effectiveLayer?: string
}

export type NormalizedSkillRecord = {
  parseStatus: ParseStatus
  /** Raw fragments that could not be structured (audit / overrides). */
  unparsedText?: string[]
  warnings?: string[]
  definition: SkillDefinition
}

export type NormalizedSkillsFile = {
  meta: NormalizedDocumentMeta
  skills: NormalizedSkillRecord[]
}

export type NormalizedGlobalRulesFile = {
  meta: NormalizedDocumentMeta
  rules: GlobalCombatRuleSet
}

export type NormalizedManifest = {
  season: string
  generatedAt: string
  parserVersion: string
  artifacts: Array<{
    path: string
    kind: "active-skills" | "support-skills" | "passive-skills" | "skill-level-rules" | "combat-rules"
    recordCount?: number
    parseStatusSummary?: Record<ParseStatus, number>
    warningsCount: number
  }>
}
