/**
 * Canonical skill schema for normalized JSON (ETL → versioned data → engine).
 * Deliberately decoupled from TLIDB HTML and from UI.
 * All shapes must remain JSON-serializable (JSON.stringify-safe).
 */

/** TLIDB / game families; extend as new support gem tiers appear. */
export type SkillFamily =
  | "active"
  | "support"
  | "passive"
  | "medium"
  | "noble"
  | "precise"

/** How per-level numbers are represented for this skill. */
export type LevelScalingMode = "table" | "breakpoints" | "rule+table" | "unknown"

/** JSON-serializable primitive / tree (for extension payloads). */
export type JsonPrimitive = string | number | boolean | null
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }

/**
 * Reference to a globally versioned rule (e.g. Skill_Level post-20 template).
 * Resolver lives outside this file; schema only carries stable ids + params.
 */
export type Post20RuleRef = {
  ruleSetId: string
  ruleId: string
  params?: Record<string, JsonPrimitive>
}

/** One row of a skill level table or a sparse breakpoint. */
export type SkillLevelEntry = {
  level: number
  manaCost?: number | null
  cooldown?: number | null
  castTime?: number | null
  projectileCount?: number | null
  /** Flat damage interval or scalar when known. */
  baseDamage?: number | { min: number; max: number } | null
  /** Added damage effectiveness ratio if known (e.g. 0–1+). */
  addedDamageEffectiveness?: number | null
  /** Verbatim or cleaned lines when numeric fields are incomplete. */
  textLines?: string[]
  /** When this level row defers to global post-20 scaling. */
  post20Ref?: Post20RuleRef
  /** True when parser only recovered partial fields for this level. */
  partial?: boolean
}

/** Where a modifier applies (gear / talent / skill can reuse). */
export type Selector =
  | { kind: "self" }
  | { kind: "skill"; skillId?: string }
  | { kind: "supportedSkill" }
  | { kind: "target" }
  | { kind: "aura"; radiusMeters?: number }
  | { kind: "statPath"; path: string[] }
  | { kind: "custom"; key: string; payload?: JsonValue }

export type Condition =
  | { kind: "tagAll"; tags: string[] }
  | { kind: "tagAny"; tags: string[] }
  | { kind: "familyIs"; family: SkillFamily }
  | { kind: "statGte"; stat: string; value: number }
  | { kind: "statLt"; stat: string; value: number }
  | { kind: "custom"; key: string; payload?: JsonValue }

/** Shared modifier shape for skills, support gems, gear, talents. */
export type ModifierOperation = "add" | "mul" | "override" | "convert"

export type ModifierDefinition = {
  id?: string
  selector: Selector
  operation: ModifierOperation
  /** Registry key for the stat / attribute (engine resolves). */
  stat: string
  /** Numeric magnitude or symbolic token (e.g. curve id) until resolved. */
  value: number | string
  /** Multiplicative factor stacks as more / increased in engine — optional hint. */
  valueKind?: "flat" | "increased" | "more" | "unknown"
  conditions?: Condition[]
  /** Audit trail to source sentence / table cell. */
  sourceText?: string
  /** Priority when multiple overrides compete (higher wins). */
  priority?: number
}

/** Support-gem compatibility (TLIDB shows several of these as text + tags). */
export type SupportRule = {
  /** Supported **active** skill must have at least one (unless empty = unspecified). */
  allowedSkillTags?: string[]
  /** Pairing invalid if the active skill has any of these tags. */
  forbiddenSkillTags?: string[]
  /** e.g. red / green / blue socket expectations when known. */
  socketColors?: Array<"red" | "green" | "blue">
  /** Maximum copies of this support on one active, if ruled. */
  maxSupportsPerSkill?: number
  requiresAttack?: boolean
  requiresSpell?: boolean
  requiresProjectile?: boolean
  requiresChanneled?: boolean
  /** Unstructured requirements not yet mapped to booleans. */
  rawRequirementLines?: string[]
}

/**
 * Named mechanical hook for formulas / special cases (curse caps, exert, etc.).
 * Keeps SkillDefinition extensible without stuffing free text into one field.
 */
export type MechanicHook = {
  hookId: string
  category?: string
  parameters?: Record<string, JsonValue>
  /** Human context only; engine should prefer `parameters`. */
  notes?: string[]
}

export type SkillDefinition = {
  id: string
  name: string
  family: SkillFamily
  tags: string[]
  sourceUrl: string
  locale: string
  season: string
  /** Semantic version of this normalized document (not game patch). */
  version: string

  summaryText?: string[]
  detailText?: string[]

  /** Dense levels keyed by level number (JSON stores string keys). */
  levelTable?: Record<number, SkillLevelEntry>
  /** Sparse known levels; use when full table is unavailable. */
  levelBreakpoints?: SkillLevelEntry[]
  levelScalingMode?: LevelScalingMode

  supportRules?: SupportRule
  modifiers?: ModifierDefinition[]
  mechanics?: MechanicHook[]

  /** ETL / authorship metadata (optional). */
  parserVersion?: string
  fetchedAt?: string
}
