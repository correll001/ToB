/**
 * MAINTENANCE-ONLY — not a production or `next build` dependency.
 * Offline import: data/effective/{season} → SQLite + webpack bundle JSON.
 * Does not fetch networks. Run manually after ETL / apply-overrides.
 *
 * Usage:
 *   npm run data:import:effective -- --season=ss12
 *   npm run data:import:effective -- --season=ss12 --version-label=my-label
 *   npm run data:import:effective -- --season=ss12 --no-activate
 *   npm run data:import:effective -- --set-active --season=ss12 --version-label=<label>
 */
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import type { NormalizedGlobalRulesFile, NormalizedSkillsFile } from '@/types/normalized'
import type { OverrideApplyReport } from '@/types/override'
import type { EffectiveRuntimeBundle } from '@/lib/data/types'
import { openLocalDatabase } from '@/lib/db/openLocalDatabase'
import { setActiveDatasetByVersionLabel } from '@/lib/data/localSkillRepository'

import { parseArgs, repoRoot } from '../etl/shared'

function readJson<T>(p: string): T {
  return JSON.parse(readFileSync(p, 'utf8')) as T
}

function contentHash(parts: string[]): string {
  const h = createHash('sha256')
  for (const s of parts) h.update(s)
  return h.digest('hex').slice(0, 16)
}

function writeRuntimeBundle(bundle: EffectiveRuntimeBundle) {
  const outDir = path.join(repoRoot, 'lib', 'gameData', 'generated')
  mkdirSync(outDir, { recursive: true })
  const outPath = path.join(outDir, 'effective-runtime-bundle.json')
  writeFileSync(outPath, JSON.stringify(bundle, null, 2) + '\n', 'utf8')
  console.log(`[importEffectiveData] wrote ${path.relative(repoRoot, outPath)}`)
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const season = typeof args.season === 'string' ? args.season : null

  if (args['set-active'] === true) {
    if (!season || typeof args['version-label'] !== 'string') {
      console.error('[importEffectiveData] --set-active requires --season and --version-label=<label>')
      process.exit(1)
    }
    const db = openLocalDatabase()
    try {
      const ok = setActiveDatasetByVersionLabel(db, season, args['version-label'])
      if (!ok) {
        console.error('[importEffectiveData] dataset version not found')
        process.exit(1)
      }
      console.log('[importEffectiveData] active dataset switched')
    } finally {
      db.close()
    }
    return
  }

  if (!season) {
    console.error('[importEffectiveData] required: --season=ss12')
    process.exit(1)
  }

  const effDir = path.join(repoRoot, 'data', 'effective', season)
  const paths = {
    active: path.join(effDir, 'active-skills.json'),
    support: path.join(effDir, 'support-skills.json'),
    passive: path.join(effDir, 'passive-skills.json'),
    skillLevel: path.join(effDir, 'skill-level-rules.json'),
    combat: path.join(effDir, 'combat-rules.json'),
    overrideReport: path.join(effDir, 'override-report.json'),
  }

  for (const [k, p] of Object.entries(paths)) {
    if (k === 'overrideReport') continue
    if (!existsSync(p)) {
      console.error(`[importEffectiveData] missing ${p}`)
      process.exit(1)
    }
  }

  const activeStr = readFileSync(paths.active, 'utf8')
  const supportStr = readFileSync(paths.support, 'utf8')
  const passiveStr = readFileSync(paths.passive, 'utf8')
  const skillLevelStr = readFileSync(paths.skillLevel, 'utf8')
  const combatStr = readFileSync(paths.combat, 'utf8')
  const overrideStr = existsSync(paths.overrideReport) ? readFileSync(paths.overrideReport, 'utf8') : 'null'

  const activeSkills = JSON.parse(activeStr) as NormalizedSkillsFile
  const supportSkills = JSON.parse(supportStr) as NormalizedSkillsFile
  const passiveSkills = JSON.parse(passiveStr) as NormalizedSkillsFile
  const skillLevelRules = JSON.parse(skillLevelStr) as NormalizedGlobalRulesFile
  const combatRules = JSON.parse(combatStr) as NormalizedGlobalRulesFile
  const overrideReport = overrideStr === 'null' ? null : (JSON.parse(overrideStr) as OverrideApplyReport)

  const defaultLabel = contentHash([activeStr, supportStr, passiveStr, skillLevelStr, combatStr, overrideStr])
  const versionLabel =
    typeof args['version-label'] === 'string' ? args['version-label'] : `${season}-${defaultLabel}`

  const activate = args['no-activate'] !== true && args['no-activate'] !== ''
  const importedAt = new Date().toISOString()
  const sourceKind = 'effective-json'

  const db = openLocalDatabase()
  try {
    db.transaction(() => {
      const existing = db
        .prepare(`SELECT id FROM dataset_versions WHERE season = ? AND version_label = ?`)
        .get(season, versionLabel) as { id: number } | undefined

      let versionId: number

      if (existing) {
        versionId = existing.id
        db.prepare(`DELETE FROM skills WHERE dataset_version_id = ?`).run(versionId)
        db.prepare(`DELETE FROM global_rules WHERE dataset_version_id = ?`).run(versionId)
        db.prepare(`DELETE FROM override_reports WHERE dataset_version_id = ?`).run(versionId)
        db.prepare(`UPDATE dataset_versions SET imported_at = ?, source_kind = ? WHERE id = ?`).run(
          importedAt,
          sourceKind,
          versionId,
        )
      } else {
        const info = db
          .prepare(
            `INSERT INTO dataset_versions (season, source_kind, version_label, imported_at, is_active)
             VALUES (?, ?, ?, ?, 0)`,
          )
          .run(season, sourceKind, versionLabel, importedAt)
        versionId = Number(info.lastInsertRowid)
      }

      const insSkill = db.prepare(
        `INSERT INTO skills (
           skill_public_id, dataset_version_id, family, name, locale, season,
           tags_json, parse_status, warnings_json, definition_json
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )

      const ingestFile = (file: NormalizedSkillsFile) => {
        for (const row of file.skills) {
          const def = row.definition
          insSkill.run(
            def.id,
            versionId,
            def.family,
            def.name,
            def.locale ?? null,
            def.season ?? season,
            JSON.stringify(def.tags ?? []),
            row.parseStatus,
            row.warnings ? JSON.stringify(row.warnings) : null,
            JSON.stringify(def),
          )
        }
      }

      ingestFile(activeSkills)
      ingestFile(supportSkills)
      ingestFile(passiveSkills)

      const insRule = db.prepare(
        `INSERT INTO global_rules (dataset_version_id, rule_kind, locale, rules_json) VALUES (?, ?, ?, ?)`,
      )

      insRule.run(
        versionId,
        'skill-level-rules',
        skillLevelRules.meta.locale ?? null,
        JSON.stringify(skillLevelRules),
      )
      insRule.run(versionId, 'combat-rules', combatRules.meta.locale ?? null, JSON.stringify(combatRules))

      if (overrideReport) {
        db.prepare(`INSERT INTO override_reports (dataset_version_id, report_json) VALUES (?, ?)`).run(
          versionId,
          JSON.stringify(overrideReport),
        )
      }

      if (activate) {
        db.prepare(`UPDATE dataset_versions SET is_active = 0`).run()
        db.prepare(`UPDATE dataset_versions SET is_active = 1 WHERE id = ?`).run(versionId)
      }
    })()

    const row = db
      .prepare(`SELECT id FROM dataset_versions WHERE season = ? AND version_label = ?`)
      .get(season, versionLabel) as { id: number }

    const bundle: EffectiveRuntimeBundle = {
      schemaVersion: 1,
      datasetVersion: {
        id: row.id,
        season,
        versionLabel,
        sourceKind,
        importedAt,
      },
      activeSkills,
      supportSkills,
      passiveSkills,
      skillLevelRules,
      combatRules,
      overrideReport,
    }
    writeRuntimeBundle(bundle)

    console.log(
      `[importEffectiveData] OK season=${season} version_label=${versionLabel} dataset_version_id=${row.id} skills=${activeSkills.skills.length + supportSkills.skills.length + passiveSkills.skills.length} activate=${activate}`,
    )
  } finally {
    db.close()
  }
}

main()
