-- Local game data (SQLite). Import from data/effective/{season} via scripts/import/importEffectiveData.ts
-- Supports future seasons (ss13, ss14, …) via dataset_versions.season + version_label.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS dataset_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  season TEXT NOT NULL,
  source_kind TEXT NOT NULL DEFAULT 'effective-json',
  version_label TEXT NOT NULL,
  imported_at TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 0 CHECK (is_active IN (0, 1)),
  UNIQUE (season, version_label)
);

-- Only one row may be active at a time (global pointer for “current product dataset”).
CREATE UNIQUE INDEX IF NOT EXISTS idx_dataset_versions_one_active
  ON dataset_versions (is_active) WHERE is_active = 1;

CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  skill_public_id TEXT NOT NULL,
  dataset_version_id INTEGER NOT NULL,
  family TEXT NOT NULL,
  name TEXT NOT NULL,
  locale TEXT,
  season TEXT,
  tags_json TEXT NOT NULL,
  parse_status TEXT NOT NULL,
  warnings_json TEXT,
  definition_json TEXT NOT NULL,
  FOREIGN KEY (dataset_version_id) REFERENCES dataset_versions (id) ON DELETE CASCADE,
  UNIQUE (dataset_version_id, skill_public_id)
);

CREATE INDEX IF NOT EXISTS idx_skills_version_family
  ON skills (dataset_version_id, family);

CREATE TABLE IF NOT EXISTS global_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dataset_version_id INTEGER NOT NULL,
  rule_kind TEXT NOT NULL CHECK (rule_kind IN ('skill-level-rules', 'combat-rules')),
  locale TEXT,
  rules_json TEXT NOT NULL,
  FOREIGN KEY (dataset_version_id) REFERENCES dataset_versions (id) ON DELETE CASCADE,
  UNIQUE (dataset_version_id, rule_kind)
);

CREATE TABLE IF NOT EXISTS override_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dataset_version_id INTEGER NOT NULL UNIQUE,
  report_json TEXT NOT NULL,
  FOREIGN KEY (dataset_version_id) REFERENCES dataset_versions (id) ON DELETE CASCADE
);
