/**
 * Node-only: global rules + override report from SQLite.
 */
import type Database from 'better-sqlite3'
import type { OverrideApplyReport } from '@/types/override'
import type { NormalizedGlobalRulesFile } from '@/types/normalized'
import type { GlobalCombatRuleSet } from '@/types/rules'
import { getActiveDatasetVersionId } from './localSkillRepository'

export function getGlobalRulesFile(
  db: Database.Database,
  datasetVersionId: number,
  ruleKind: 'skill-level-rules' | 'combat-rules',
): NormalizedGlobalRulesFile | null {
  const row = db
    .prepare(
      `SELECT rules_json FROM global_rules WHERE dataset_version_id = ? AND rule_kind = ? LIMIT 1`,
    )
    .get(datasetVersionId, ruleKind) as { rules_json: string } | undefined
  if (!row) return null
  return JSON.parse(row.rules_json) as NormalizedGlobalRulesFile
}

export function getSkillLevelRulesPayload(db: Database.Database, datasetVersionId: number): GlobalCombatRuleSet | null {
  const f = getGlobalRulesFile(db, datasetVersionId, 'skill-level-rules')
  return f?.rules ?? null
}

export function getOverrideReport(db: Database.Database, datasetVersionId: number): OverrideApplyReport | null {
  const row = db
    .prepare(`SELECT report_json FROM override_reports WHERE dataset_version_id = ? LIMIT 1`)
    .get(datasetVersionId) as { report_json: string } | undefined
  if (!row) return null
  return JSON.parse(row.report_json) as OverrideApplyReport
}

export function getActiveRulesBundle(db: Database.Database): {
  datasetVersionId: number
  skillLevel: NormalizedGlobalRulesFile | null
  combat: NormalizedGlobalRulesFile | null
  overrideReport: OverrideApplyReport | null
} | null {
  const vid = getActiveDatasetVersionId(db)
  if (vid == null) return null
  return {
    datasetVersionId: vid,
    skillLevel: getGlobalRulesFile(db, vid, 'skill-level-rules'),
    combat: getGlobalRulesFile(db, vid, 'combat-rules'),
    overrideReport: getOverrideReport(db, vid),
  }
}
