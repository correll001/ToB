/**
 * Node / maintenance: frozen dataset provenance (not imported by Next client bundles).
 * Describes one immutable "freeze" from `data/effective/{season}` into SQLite + bundle.
 */

import type { NormalizedManifest } from '@/types/normalized'

/** Allowed TLIDB index pages for *maintenance-only* ingestion (listed in policy docs). */
export const MAINTENANCE_TLIDB_SOURCE_PAGES = [
  'https://tlidb.com/Active_Skill',
  'https://tlidb.com/Support_Skill',
  'https://tlidb.com/Passive_Skill',
  'https://tlidb.com/en/Skill_Level',
  'https://tlidb.com/en/Character_Build',
] as const

/** Record-level counts at freeze time (derived from files + manifest). */
export type FrozenRecordCounts = {
  activeSkills: number
  supportSkills: number
  passiveSkills: number
  skillLevelRulesRows: number
  combatRulesRows: number
  /** parseStatus tallies for skill files only */
  parseStatusSummary?: {
    ok: number
    partial: number
    failed: number
  }
}

/**
 * Full provenance for a frozen dataset version (stored in SQLite `provenance_json`
 * and copied into `data/frozen/...` manifest).
 */
export type FrozenDatasetProvenance = {
  schemaVersion: 1
  /** Same as `dataset_versions.season` */
  season: string
  /** Same as `dataset_versions.version_label` */
  frozenDatasetVersion: string
  /** SQLite row id after ingest */
  datasetVersionId: number
  /** When the freeze transaction completed (ISO 8601) */
  frozenAt: string
  /** When rows were first written as effective JSON (from effective manifest if present) */
  effectiveGeneratedAt?: string
  /** ETL fetch/parser version from effective manifest */
  parserVersion?: string
  /** Normalize step version (artifact meta.parserVersion max / manifest) */
  normalizeParserVersion?: string
  /** Override layer: schema + report timestamps */
  override?: {
    overridesSchemaVersion?: string
    generatedAt?: string
  }
  /** Declared source URLs from global rules + per-skill definitions (deduped, audit trail) */
  sourceUrls: string[]
  /** Per-URL or per-artifact fetch hint when present on definitions (best-effort from JSON) */
  fetchedAtHints: string[]
  /** Copy of `data/effective/{season}/manifest.json` when present */
  effectiveManifest?: NormalizedManifest
  /** Record counts at freeze */
  recordCounts: FrozenRecordCounts
  /** Policy: partial/failed skills are stored with parseStatus + warnings; no fabricated stats */
  dataQualityNote: string
}

export function summarizeSkillsParseStatus(skillsFiles: { skills: Array<{ parseStatus: string }> }[]): {
  ok: number
  partial: number
  failed: number
} {
  let ok = 0
  let partial = 0
  let failed = 0
  for (const f of skillsFiles) {
    for (const r of f.skills) {
      if (r.parseStatus === 'ok') ok += 1
      else if (r.parseStatus === 'partial') partial += 1
      else failed += 1
    }
  }
  return { ok, partial, failed }
}

function uniqueStrings(urls: string[]): string[] {
  return [...new Set(urls.filter((u) => typeof u === 'string' && u.length > 0))].sort()
}

/** Collect sourceUrl / sourceUrls from global rule sets and all skill definitions. */
export function collectSourceUrlsFromEffectivePayload(payload: {
  activeSkills: { skills: Array<{ definition: { sourceUrl?: string } }> }
  supportSkills: { skills: Array<{ definition: { sourceUrl?: string } }> }
  passiveSkills: { skills: Array<{ definition: { sourceUrl?: string } }> }
  skillLevelRules: { rules?: { sourceUrls?: string[] } }
  combatRules: { rules?: { sourceUrls?: string[] } }
}): string[] {
  const out: string[] = [...MAINTENANCE_TLIDB_SOURCE_PAGES]

  const globSl = payload.skillLevelRules.rules?.sourceUrls
  const globCb = payload.combatRules.rules?.sourceUrls
  if (Array.isArray(globSl)) out.push(...globSl)
  if (Array.isArray(globCb)) out.push(...globCb)

  for (const file of [payload.activeSkills, payload.supportSkills, payload.passiveSkills]) {
    for (const row of file.skills) {
      const u = row.definition.sourceUrl
      if (u) out.push(u)
    }
  }
  return uniqueStrings(out)
}

export function collectFetchedAtHintsFromFiles(metas: Array<{ generatedAt?: string; fetchedAt?: string }>): string[] {
  const hints: string[] = []
  for (const m of metas) {
    if (typeof m.generatedAt === 'string') hints.push(m.generatedAt)
    if (typeof m.fetchedAt === 'string') hints.push(m.fetchedAt)
  }
  return uniqueStrings(hints)
}

export function countCombatRuleSections(rules: { characterBuildRules?: unknown[] }): number {
  return Array.isArray(rules.characterBuildRules) ? rules.characterBuildRules.length : 0
}
