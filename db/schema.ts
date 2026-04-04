/**
 * Programmatic reference to the canonical SQLite DDL (used by `openLocalDatabase`).
 * Source of truth: `db/schema.sql`
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'

export const LOCAL_DB_SCHEMA_SQL_PATH = path.join(process.cwd(), 'db', 'schema.sql')

export function readLocalDbSchemaSql(): string {
  return readFileSync(LOCAL_DB_SCHEMA_SQL_PATH, 'utf8')
}
