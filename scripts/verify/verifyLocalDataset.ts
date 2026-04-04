/**
 * Verify SQLite + bundled runtime snapshot align with data/effective/{season} artifacts.
 *
 *   npm run data:verify:local -- --season=ss12
 */
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import type { NormalizedSkillsFile, NormalizedGlobalRulesFile, NormalizedManifest } from '@/types/normalized'
import type { EffectiveRuntimeBundle } from '@/lib/data/types'
import { openLocalDatabase } from '@/lib/db/openLocalDatabase'
import {
  getActiveDatasetVersionId,
  listDatasetVersions,
  listSkillCountsByFamily,
} from '@/lib/data/localSkillRepository'
import { getGlobalRulesFile, getOverrideReport } from '@/lib/data/localRulesRepository'
import { parseArgs, repoRoot } from '../etl/shared'

function countCombatRuleRows(rules: NormalizedGlobalRulesFile['rules']): number {
  const r = rules as { characterBuildRules?: unknown[] }
  return Array.isArray(r.characterBuildRules) ? r.characterBuildRules.length : 0
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const season = typeof args.season === 'string' ? args.season : 'ss12'

  const effDir = path.join(repoRoot, 'data', 'effective', season)
  const activePath = path.join(effDir, 'active-skills.json')
  if (!existsSync(activePath)) {
    console.error(`[data:verify:local] missing ${activePath}`)
    process.exit(1)
  }

  const manifestPath = path.join(effDir, 'manifest.json')
  if (!existsSync(manifestPath)) {
    console.error(`[data:verify:local] missing ${manifestPath}`)
    process.exit(1)
  }
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as NormalizedManifest
  if (manifest.season !== season) {
    console.error(`[data:verify:local] manifest.season ${manifest.season} !== cli season ${season}`)
    process.exit(1)
  }

  const active = JSON.parse(readFileSync(activePath, 'utf8')) as NormalizedSkillsFile
  const support = JSON.parse(readFileSync(path.join(effDir, 'support-skills.json'), 'utf8')) as NormalizedSkillsFile
  const passive = JSON.parse(readFileSync(path.join(effDir, 'passive-skills.json'), 'utf8')) as NormalizedSkillsFile
  const skillLevelFile = JSON.parse(
    readFileSync(path.join(effDir, 'skill-level-rules.json'), 'utf8'),
  ) as NormalizedGlobalRulesFile
  const combatFile = JSON.parse(readFileSync(path.join(effDir, 'combat-rules.json'), 'utf8')) as NormalizedGlobalRulesFile

  const manifestMismatch: string[] = []
  for (const art of manifest.artifacts) {
    const expected = art.recordCount
    if (expected == null) continue
    switch (art.kind) {
      case 'active-skills':
        if (active.skills.length !== expected) {
          manifestMismatch.push(`active-skills: file ${active.skills.length} vs manifest ${expected}`)
        }
        break
      case 'support-skills':
        if (support.skills.length !== expected) {
          manifestMismatch.push(`support-skills: file ${support.skills.length} vs manifest ${expected}`)
        }
        break
      case 'passive-skills':
        if (passive.skills.length !== expected) {
          manifestMismatch.push(`passive-skills: file ${passive.skills.length} vs manifest ${expected}`)
        }
        break
      case 'combat-rules': {
        const n = countCombatRuleRows(combatFile.rules)
        if (n !== expected) {
          manifestMismatch.push(`combat-rules: derived rows ${n} vs manifest ${expected}`)
        }
        break
      }
      case 'skill-level-rules': {
        const src = skillLevelFile.meta.sourceCount ?? 1
        if (src !== expected) {
          manifestMismatch.push(`skill-level-rules: meta.sourceCount ${src} vs manifest ${expected}`)
        }
        break
      }
      default:
        break
    }
  }

  const db = openLocalDatabase()
  try {
    const vid = getActiveDatasetVersionId(db)
    if (vid == null) {
      console.error('[data:verify:local] no active dataset_versions row (run data:import:effective)')
      listDatasetVersions(db).forEach((r) => console.error('  ', r))
      process.exit(1)
    }

    const dvRow = db
      .prepare(`SELECT id, season, version_label, imported_at FROM dataset_versions WHERE id = ?`)
      .get(vid) as { id: number; season: string; version_label: string; imported_at: string }

    const counts = listSkillCountsByFamily(db, vid)
    const idsInFile = (f: NormalizedSkillsFile) => f.skills.map((s) => s.definition.id)
    const countDbForIds = (ids: string[]) => {
      if (ids.length === 0) return 0
      const ph = ids.map(() => '?').join(',')
      const row = db
        .prepare(
          `SELECT COUNT(*) as c FROM skills WHERE dataset_version_id = ? AND skill_public_id IN (${ph})`,
        )
        .get(vid, ...ids) as { c: number }
      return row.c
    }

    const expectActive = active.skills.length
    const expectSupport = support.skills.length
    const expectPassive = passive.skills.length
    const dbActive = countDbForIds(idsInFile(active))
    const dbSupport = countDbForIds(idsInFile(support))
    const dbPassive = countDbForIds(idsInFile(passive))

    const countsOk = dbActive === expectActive && dbSupport === expectSupport && dbPassive === expectPassive

    const sl = getGlobalRulesFile(db, vid, 'skill-level-rules')
    const cb = getGlobalRulesFile(db, vid, 'combat-rules')
    const ovr = getOverrideReport(db, vid)

    const bundlePath = path.join(repoRoot, 'lib', 'gameData', 'generated', 'effective-runtime-bundle.json')
    let bundle: EffectiveRuntimeBundle | null = null
    let bundleMismatch: string[] = []
    if (existsSync(bundlePath)) {
      bundle = JSON.parse(readFileSync(bundlePath, 'utf8')) as EffectiveRuntimeBundle
      if (bundle.datasetVersion.id !== vid) {
        bundleMismatch.push(`bundle.datasetVersion.id ${bundle.datasetVersion.id} !== active DB id ${vid}`)
      }
      if (bundle.datasetVersion.season !== dvRow.season) {
        bundleMismatch.push(
          `bundle.datasetVersion.season ${bundle.datasetVersion.season} !== DB season ${dvRow.season}`,
        )
      }
      if (bundle.datasetVersion.versionLabel !== dvRow.version_label) {
        bundleMismatch.push(
          `bundle.versionLabel ${bundle.datasetVersion.versionLabel} !== DB ${dvRow.version_label}`,
        )
      }
      if (bundle.datasetVersion.importedAt !== dvRow.imported_at) {
        bundleMismatch.push(
          `bundle.importedAt ${bundle.datasetVersion.importedAt} !== DB imported_at ${dvRow.imported_at}`,
        )
      }
      if (bundle.datasetVersion.season !== season) {
        bundleMismatch.push(`bundle season ${bundle.datasetVersion.season} !== verify --season=${season}`)
      }
    } else {
      bundleMismatch.push(`missing ${path.relative(repoRoot, bundlePath)} (run data:import:effective)`)
    }

    const configPath = path.join(repoRoot, 'lib', 'gameData', 'gameDataConfig.ts')
    const configText = readFileSync(configPath, 'utf8')
    const configMatch = configText.match(/RUNTIME_GAME_DATA_SEASON\s*=\s*['"]([^'"]+)['"]/)
    const configSeason = configMatch?.[1]
    if (bundle && configSeason && configSeason !== bundle.datasetVersion.season) {
      bundleMismatch.push(
        `RUNTIME_GAME_DATA_SEASON ${configSeason} !== bundle.season ${bundle.datasetVersion.season}`,
      )
    }

    console.log(`[data:verify:local] active dataset_version_id=${vid}`)
    console.log(
      `  skills by family (DB): ${counts['active'] ?? 0}/${counts['support'] ?? 0}/${counts['passive'] ?? 0}`,
    )
    console.log(
      `  row coverage vs source files: ${dbActive}/${expectActive} active ids, ${dbSupport}/${expectSupport} support, ${dbPassive}/${expectPassive} passive`,
    )
    if (manifestMismatch.length) {
      console.error('  manifest vs files:', manifestMismatch.join('; '))
    } else {
      console.log('  manifest vs files: OK')
    }
    console.log(`  global_rules skill-level: ${sl ? 'ok' : 'MISSING'}`)
    console.log(`  global_rules combat: ${cb ? 'ok' : 'MISSING'}`)
    const overridePath = path.join(effDir, 'override-report.json')
    const expectOverride = existsSync(overridePath)
    console.log(
      `  override_report: ${ovr ? 'ok' : expectOverride ? 'MISSING in DB' : 'none (file absent)'}`,
    )
    if (bundleMismatch.length) {
      console.error('  runtime bundle vs DB:', bundleMismatch.join('; '))
    } else {
      console.log('  runtime bundle vs DB: OK')
    }

    if (!countsOk) {
      console.error('[data:verify:local] FAILED skill count mismatch')
      process.exit(1)
    }
    if (manifestMismatch.length) {
      console.error('[data:verify:local] FAILED manifest mismatch')
      process.exit(1)
    }
    if (!sl || !cb) {
      console.error('[data:verify:local] FAILED rules missing')
      process.exit(1)
    }
    if (expectOverride && !ovr) {
      console.error('[data:verify:local] FAILED override-report.json exists but not imported')
      process.exit(1)
    }
    if (bundleMismatch.length) {
      console.error('[data:verify:local] FAILED bundle / config mismatch')
      process.exit(1)
    }
    console.log('[data:verify:local] OK')
  } finally {
    db.close()
  }
}

main()
