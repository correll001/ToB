/**
 * Node-only: query skills from SQLite. Use for import/verify/admin APIs — not in client bundles.
 */
import type Database from 'better-sqlite3'
import type { SkillDefinition, SkillFamily } from '@/types/skillData'
import type { NormalizedSkillRecord } from '@/types/normalized'
import { openLocalDatabase } from '@/lib/db/openLocalDatabase'

export function getActiveDatasetVersionId(db: Database.Database): number | null {
  const row = db
    .prepare(`SELECT id FROM dataset_versions WHERE is_active = 1 LIMIT 1`)
    .get() as { id: number } | undefined
  return row?.id ?? null
}

export function setActiveDatasetByVersionLabel(db: Database.Database, season: string, versionLabel: string): boolean {
  const dv = db
    .prepare(`SELECT id FROM dataset_versions WHERE season = ? AND version_label = ?`)
    .get(season, versionLabel) as { id: number } | undefined
  if (!dv) return false
  db.transaction(() => {
    db.prepare(`UPDATE dataset_versions SET is_active = 0`).run()
    db.prepare(`UPDATE dataset_versions SET is_active = 1 WHERE id = ?`).run(dv.id)
  })()
  return true
}

export function listDatasetVersions(db: Database.Database): Array<{ id: number; season: string; version_label: string; is_active: number; imported_at: string }> {
  return db
    .prepare(
      `SELECT id, season, version_label, is_active, imported_at FROM dataset_versions ORDER BY season, imported_at DESC`,
    )
    .all() as Array<{ id: number; season: string; version_label: string; is_active: number; imported_at: string }>
}

export function listSkillCountsByFamily(db: Database.Database, datasetVersionId: number): Record<string, number> {
  const rows = db
    .prepare(
      `SELECT family, COUNT(*) as n FROM skills WHERE dataset_version_id = ? GROUP BY family`,
    )
    .all(datasetVersionId) as Array<{ family: string; n: number }>
  const out: Record<string, number> = {}
  for (const r of rows) out[r.family] = r.n
  return out
}

export function getSkillDefinitionJson(
  db: Database.Database,
  datasetVersionId: number,
  skillPublicId: string,
): SkillDefinition | undefined {
  const row = db
    .prepare(
      `SELECT definition_json FROM skills WHERE dataset_version_id = ? AND skill_public_id = ? LIMIT 1`,
    )
    .get(datasetVersionId, skillPublicId) as { definition_json: string } | undefined
  if (!row) return undefined
  return JSON.parse(row.definition_json) as SkillDefinition
}

export function getNormalizedSkillRecordFromDb(
  db: Database.Database,
  datasetVersionId: number,
  skillPublicId: string,
): NormalizedSkillRecord | undefined {
  const row = db
    .prepare(
      `SELECT parse_status, warnings_json, definition_json FROM skills WHERE dataset_version_id = ? AND skill_public_id = ? LIMIT 1`,
    )
    .get(datasetVersionId, skillPublicId) as
    | { parse_status: string; warnings_json: string | null; definition_json: string }
    | undefined
  if (!row) return undefined
  return {
    parseStatus: row.parse_status as NormalizedSkillRecord['parseStatus'],
    warnings: row.warnings_json ? (JSON.parse(row.warnings_json) as string[]) : undefined,
    definition: JSON.parse(row.definition_json) as SkillDefinition,
  }
}

export function listSkillPickerRows(db: Database.Database, datasetVersionId: number, family: SkillFamily) {
  const rows = db
    .prepare(
      `SELECT skill_public_id, name, family FROM skills WHERE dataset_version_id = ? AND family = ? ORDER BY name COLLATE NOCASE`,
    )
    .all(datasetVersionId, family) as Array<{ skill_public_id: string; name: string; family: string }>
  return rows.map((r) => ({ id: r.skill_public_id, name: r.name, family: r.family as SkillFamily }))
}

/** Open default DB and return active version id (convenience for CLI). */
export function getActiveDatasetVersionIdFromDefaultDb(): number | null {
  const db = openLocalDatabase()
  try {
    return getActiveDatasetVersionId(db)
  } finally {
    db.close()
  }
}
