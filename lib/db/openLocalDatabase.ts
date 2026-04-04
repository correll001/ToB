/**
 * Node-only SQLite handle. Do not import from client components (use runtime JSON bundle instead).
 */
import { mkdirSync, readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'

export function getDefaultLocalDbPath(): string {
  return process.env.LOCAL_DB_PATH ?? path.join(process.cwd(), 'data', 'local', 'game.db')
}

export function openLocalDatabase(filePath?: string): Database.Database {
  const p = filePath ?? getDefaultLocalDbPath()
  mkdirSync(path.dirname(p), { recursive: true })
  const db = new Database(p)
  db.pragma('foreign_keys = ON')
  const schemaPath = path.join(process.cwd(), 'db', 'schema.sql')
  if (existsSync(schemaPath)) {
    db.exec(readFileSync(schemaPath, 'utf8'))
  }
  return db
}
