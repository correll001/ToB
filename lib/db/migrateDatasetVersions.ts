/**
 * Add freeze / provenance columns to legacy SQLite DBs (idempotent).
 */
import type Database from 'better-sqlite3'

export function ensureDatasetVersionsFreezeColumns(db: Database.Database): void {
  const rows = db.prepare(`PRAGMA table_info(dataset_versions)`).all() as { name: string }[]
  const names = new Set(rows.map((r) => r.name))
  if (!names.has('frozen_at')) {
    db.exec(`ALTER TABLE dataset_versions ADD COLUMN frozen_at TEXT`)
  }
  if (!names.has('source_snapshot_manifest')) {
    db.exec(`ALTER TABLE dataset_versions ADD COLUMN source_snapshot_manifest TEXT`)
  }
  if (!names.has('provenance_json')) {
    db.exec(`ALTER TABLE dataset_versions ADD COLUMN provenance_json TEXT`)
  }
}
