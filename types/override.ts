/**
 * Data patch layer: merges on top of normalized ETL output (merge-patch style).
 *
 * **Merge order (authoritative):**
 * 1. `data/raw/` HTML snapshots
 * 2. `data/normalized/{season}/` — parser output (immutable baseline for the season pin)
 * 3. `data/overrides/{season}/` — human / curated patches (`applyOverrides.ts`)
 * 4. `data/effective/{season}/` — normalized + overrides (reproducible build artifact)
 * 5. Runtime: `computeSkillInstance` / UI adapters (never rewrite JSON on disk)
 */

import type { GlobalCombatRuleSet } from "./rules"
import type {
  MechanicHook,
  ModifierDefinition,
  SkillDefinition,
  SkillFamily,
  SkillLevelEntry,
  SupportRule,
} from "./skillData"
import type { NormalizedSkillRecord } from "./normalized"

export const DATA_MERGE_ORDER = [
  "raw:data/raw/{season}",
  "normalized:data/normalized/{season}",
  "overrides:data/overrides/{season}",
  "effective:data/effective/{season}",
  "runtime:SkillInstance & formula adapters",
] as const

/** Post-20 knobs; applied as `mechanics` hook `override:post20` + read by skill engine. */
export type Post20OverrideSpec = {
  disabled?: boolean
  tier21to30PerLevelMorePct?: number
  tier31PlusPerLevelMorePct?: number
}

/**
 * One skill row patch. `id` matches `NormalizedSkillRecord.definition.id`
 * (with or without `skill:` prefix — normalized to `skill:` on load).
 */
export type SkillOverrideEntry = {
  id: string
  /** Deep merge into `NormalizedSkillRecord` top-level allowed keys only. */
  recordPatch?: Partial<Pick<NormalizedSkillRecord, "parseStatus" | "unparsedText">>
  /** Replace / extend parser warnings (audit trail). */
  warningsAppend?: string[]
  /** Free-form maintainer notes (not consumed by engine). */
  notes?: string[]
  author?: string
  /** Season or ISO date when patch applies. */
  since?: string

  /** Deep merge into `definition` (shallow keys overwritten per deepMerge rules). */
  definitionMerge?: Partial<SkillDefinition>
  /** Force family (noble / precise / medium ladder) without re-ingesting TLIDB. */
  familyOverride?: SkillFamily

  /** Replace `definition.modifiers` entirely. */
  modifiersReplace?: ModifierDefinition[]
  /** Append to `definition.modifiers`. */
  modifiersAppend?: ModifierDefinition[]

  /** Merge entries into `definition.levelTable` by level key (string or number in JSON). */
  levelTableMerge?: Record<string, Partial<SkillLevelEntry>>

  /** Deep merge into `definition.supportRules`. */
  supportRulesMerge?: Partial<SupportRule>

  /** Append `MechanicHook` (e.g. custom hooks without stuffing formula engine). */
  mechanicsAppend?: MechanicHook[]

  /** Post-20 exception → `override:post20` mechanic (+ tier overrides). */
  post20?: Post20OverrideSpec
}

export type SkillsOverrideDocument = {
  season: string
  /** Bump when changing patches for this file. */
  version: string
  /** Should match file: active-skills / support-skills / passive-skills */
  family: "active" | "support" | "passive"
  entries: SkillOverrideEntry[]
}

/** Patch global normalized rule artifacts (both skill-level + combat in one doc). */
export type GlobalRulesOverrideDocument = {
  season: string
  version: string
  /** Merged into `skill-level-rules.json` → `rules`. */
  skillLevelRulesMerge?: Partial<GlobalCombatRuleSet>
  /** Merged into `combat-rules.json` → `rules`. */
  combatRulesMerge?: Partial<GlobalCombatRuleSet>
}

/** Report written next to effective data after `applyOverrides`. */
export type OverrideApplyReport = {
  season: string
  generatedAt: string
  overridesSchemaVersion: string
  mergeOrder: readonly string[]
  skillFiles: Array<{
    file: string
    overrideSource: string | null
    touchedIds: string[]
    /** id → human notes from override entries */
    notesById: Record<string, string[]>
  }>
  globalRules: {
    skillLevelTouched: boolean
    combatTouched: boolean
    globalOverrideSource: string | null
  }
}

/** Summary for `diffSeasonData` / effective-vs-normalized. */
export type SkillListDiffReport = {
  leftLabel: string
  rightLabel: string
  added: string[]
  removed: string[]
  changed: Array<{ id: string; changedFields: string[] }>
}
