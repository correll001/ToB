/**
 * MAINTENANCE-ONLY — one-shot "freeze" from `data/effective/{season}` into SQLite + bundle + disk manifest.
 * Does not fetch networks. Run manually after ETL / normalize / overrides land in `data/effective`.
 *
 *   npm run data:freeze:from-effective -- --season=ss12
 *   npm run data:freeze:from-effective -- --season=ss12 --no-activate
 */
import { mkdirSync, readFileSync, existsSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import type { NormalizedGlobalRulesFile, NormalizedManifest, NormalizedSkillsFile } from '@/types/normalized'
import type { OverrideApplyReport } from '@/types/override'
import type { FrozenDatasetProvenance } from '@/lib/data/datasetProvenance'
import {
  collectFetchedAtHintsFromFiles,
  collectSourceUrlsFromEffectivePayload,
  countCombatRuleSections,
  summarizeSkillsParseStatus,
} from '@/lib/data/datasetProvenance'
import { openLocalDatabase } from '@/lib/db/openLocalDatabase'
import { parseArgs, repoRoot } from '../etl/shared'
import { contentHash, runEffectiveDirectoryIngest } from './effectiveIngestShared'

function safeFilePart(s: string) {
  return s.replace(/[/\\:*?"<>|]/g, '_').slice(0, 120)
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const season = typeof args.season === 'string' ? args.season : null
  if (!season) {
    console.error('[freeze] required: --season=ss12')
    process.exit(1)
  }

  const activate = args['no-activate'] !== true && args['no-activate'] !== ''
  const versionLabelArg = typeof args['version-label'] === 'string' ? args['version-label'] : undefined

  const effDir = path.join(repoRoot, 'data', 'effective', season)
  const paths = {
    active: path.join(effDir, 'active-skills.json'),
    support: path.join(effDir, 'support-skills.json'),
    passive: path.join(effDir, 'passive-skills.json'),
    skillLevel: path.join(effDir, 'skill-level-rules.json'),
    combat: path.join(effDir, 'combat-rules.json'),
    manifest: path.join(effDir, 'manifest.json'),
    overrideReport: path.join(effDir, 'override-report.json'),
  }

  for (const [k, p] of Object.entries(paths)) {
    if (k === 'overrideReport' || k === 'manifest') continue
    if (!existsSync(p)) {
      console.error(`[freeze] missing ${p}`)
      process.exit(1)
    }
  }

  const activeStr = readFileSync(paths.active, 'utf8')
  const supportStr = readFileSync(paths.support, 'utf8')
  const passiveStr = readFileSync(paths.passive, 'utf8')
  const skillLevelStr = readFileSync(paths.skillLevel, 'utf8')
  const combatStr = readFileSync(paths.combat, 'utf8')
  const overrideStr = existsSync(paths.overrideReport) ? readFileSync(paths.overrideReport, 'utf8') : 'null'
  const manifestStr = existsSync(paths.manifest) ? readFileSync(paths.manifest, 'utf8') : 'null'

  const activeSkills = JSON.parse(activeStr) as NormalizedSkillsFile
  const supportSkills = JSON.parse(supportStr) as NormalizedSkillsFile
  const passiveSkills = JSON.parse(passiveStr) as NormalizedSkillsFile
  const skillLevelRules = JSON.parse(skillLevelStr) as NormalizedGlobalRulesFile
  const combatRules = JSON.parse(combatStr) as NormalizedGlobalRulesFile
  const overrideReport = overrideStr === 'null' ? null : (JSON.parse(overrideStr) as OverrideApplyReport)
  const effectiveManifest = manifestStr === 'null' ? undefined : (JSON.parse(manifestStr) as NormalizedManifest)

  const defaultLabel = contentHash([activeStr, supportStr, passiveStr, skillLevelStr, combatStr, overrideStr])
  const versionLabel = versionLabelArg ?? `${season}-${defaultLabel}`

  const frozenAt = new Date().toISOString()
  const parseAgg = summarizeSkillsParseStatus([activeSkills, supportSkills, passiveSkills])

  const source_snapshot_manifest = {
    kind: 'effective-freeze' as const,
    season,
    effectiveDirRelative: path.posix.join('data/effective', season),
    effectiveManifest: effectiveManifest ?? null,
    recordCounts: {
      activeSkills: activeSkills.skills.length,
      supportSkills: supportSkills.skills.length,
      passiveSkills: passiveSkills.skills.length,
      skillLevelRulesRows: skillLevelRules.meta.sourceCount ?? 1,
      combatRulesRows: countCombatRuleSections(combatRules.rules as { characterBuildRules?: unknown[] }),
      parseStatusSummary: parseAgg,
    },
    frozenAt,
  }

  const normalizeParserVersions = [
    activeSkills.meta.parserVersion,
    supportSkills.meta.parserVersion,
    passiveSkills.meta.parserVersion,
    effectiveManifest?.parserVersion,
  ].filter((x): x is string => typeof x === 'string' && x.length > 0)

  const result = runEffectiveDirectoryIngest({
    season,
    versionLabel,
    activate,
    extra: {
      frozenAt,
      source_snapshot_manifest,
    },
    provenanceFactory: (datasetVersionId) => {
      const p: FrozenDatasetProvenance = {
        schemaVersion: 1,
        season,
        frozenDatasetVersion: versionLabel,
        datasetVersionId,
        frozenAt,
        effectiveGeneratedAt: effectiveManifest?.generatedAt,
        parserVersion: effectiveManifest?.parserVersion,
        normalizeParserVersion: [...new Set(normalizeParserVersions)].join('|') || undefined,
        override: overrideReport
          ? {
              overridesSchemaVersion: overrideReport.overridesSchemaVersion,
              generatedAt: overrideReport.generatedAt,
            }
          : undefined,
        sourceUrls: collectSourceUrlsFromEffectivePayload({
          activeSkills,
          supportSkills,
          passiveSkills,
          skillLevelRules,
          combatRules,
        }),
        fetchedAtHints: collectFetchedAtHintsFromFiles([
          activeSkills.meta,
          supportSkills.meta,
          passiveSkills.meta,
          skillLevelRules.meta,
          combatRules.meta,
        ]),
        effectiveManifest,
        recordCounts: source_snapshot_manifest.recordCounts,
        dataQualityNote:
          'parseStatus ok/partial/failed and warnings_json are authoritative; the engine must not invent numeric skill fields from free text. Unknown stays unknown.',
      }
      return p
    },
  })

  const frozenDir = path.join(repoRoot, 'data', 'frozen', season)
  mkdirSync(frozenDir, { recursive: true })
  const manifestPath = path.join(frozenDir, `frozen-${safeFilePart(versionLabel)}.json`)

  const db = openLocalDatabase()
  let diskProv: string | null = null
  try {
    const row = db
      .prepare(`SELECT provenance_json FROM dataset_versions WHERE id = ?`)
      .get(result.datasetVersionId) as { provenance_json: string | null }
    diskProv = row?.provenance_json ?? null
  } finally {
    db.close()
  }

  if (!diskProv) {
    console.error('[freeze] provenance_json missing after ingest')
    process.exit(1)
  }

  writeFileSync(manifestPath, diskProv + '\n', 'utf8')

  console.log(`[freeze] OK dataset_version_id=${result.datasetVersionId} version_label=${versionLabel}`)
  console.log(`[freeze] wrote ${path.relative(repoRoot, manifestPath)}`)
  console.log(`[freeze] activate=${activate}`)
  console.log(`[freeze] next: npm run data:verify:frozen -- --season=${season}`)
  console.log(`[freeze] versions: npm run data:list-dataset-versions -- --season=${season}`)
  console.log(
    `[freeze] rollback: npm run data:import:effective -- --set-active --season=${season} --version-label=<previous-label>`,
  )
}

main()
