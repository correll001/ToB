/**
 * Shared shapes for local DB rows + webpack-bundled runtime snapshot.
 */
import type { OverrideApplyReport } from '@/types/override'
import type { NormalizedGlobalRulesFile, NormalizedSkillsFile } from '@/types/normalized'

export type DatasetVersionRow = {
  id: number
  season: string
  source_kind: string
  version_label: string
  imported_at: string
  is_active: number
  frozen_at: string | null
  source_snapshot_manifest: string | null
  provenance_json: string | null
}

export type SkillRow = {
  id: number
  skill_public_id: string
  dataset_version_id: number
  family: string
  name: string
  locale: string | null
  season: string | null
  tags_json: string
  parse_status: string
  warnings_json: string | null
  definition_json: string
}

export type GlobalRuleRow = {
  id: number
  dataset_version_id: number
  rule_kind: 'skill-level-rules' | 'combat-rules'
  locale: string | null
  rules_json: string
}

/** Written by import script; consumed by `lib/runtime/runtimeDataset` via bundled JSON (no SQLite on client). */
export type EffectiveRuntimeBundle = {
  schemaVersion: 1
  datasetVersion: {
    id: number
    season: string
    versionLabel: string
    sourceKind: string
    importedAt: string
  }
  activeSkills: NormalizedSkillsFile
  supportSkills: NormalizedSkillsFile
  passiveSkills: NormalizedSkillsFile
  skillLevelRules: NormalizedGlobalRulesFile
  combatRules: NormalizedGlobalRulesFile
  overrideReport: OverrideApplyReport | null
}
