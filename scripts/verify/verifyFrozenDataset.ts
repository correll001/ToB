/**
 * Verify the active SQLite dataset row has freeze provenance (4D-0).
 *
 *   npm run data:verify:frozen -- --season=ss12
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import type { FrozenDatasetProvenance } from '@/lib/data/datasetProvenance'
import { openLocalDatabase } from '@/lib/db/openLocalDatabase'
import { getActiveDatasetVersionId } from '@/lib/data/localSkillRepository'
import { parseArgs, repoRoot } from '../etl/shared'

function safeFilePart(s: string) {
  return s.replace(/[/\\:*?"<>|]/g, '_').slice(0, 120)
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const season = typeof args.season === 'string' ? args.season : 'ss12'

  const db = openLocalDatabase()
  try {
    const vid = getActiveDatasetVersionId(db)
    if (vid == null) {
      console.error('[data:verify:frozen] no active dataset_versions row')
      process.exit(1)
    }

    const row = db
      .prepare(
        `SELECT id, season, source_kind, version_label, imported_at, frozen_at, source_snapshot_manifest, provenance_json, is_active
         FROM dataset_versions WHERE id = ?`,
      )
      .get(vid) as {
      id: number
      season: string
      source_kind: string
      version_label: string
      imported_at: string
      frozen_at: string | null
      source_snapshot_manifest: string | null
      provenance_json: string | null
      is_active: number
    } | undefined

    if (!row) {
      console.error('[data:verify:frozen] missing row')
      process.exit(1)
    }

    if (row.season !== season) {
      console.error(`[data:verify:frozen] active season ${row.season} !== --season=${season}`)
      process.exit(1)
    }

    const issues: string[] = []
    if (!row.frozen_at) issues.push('frozen_at is null (run data:freeze:from-effective for a full freeze)')
    if (!row.source_snapshot_manifest) issues.push('source_snapshot_manifest is null')
    if (!row.provenance_json) issues.push('provenance_json is null')

    let prov: FrozenDatasetProvenance | null = null
    if (row.provenance_json) {
      try {
        prov = JSON.parse(row.provenance_json) as FrozenDatasetProvenance
        if (prov.schemaVersion !== 1) issues.push('provenance schemaVersion !== 1')
        if (!prov.sourceUrls?.length) issues.push('provenance.sourceUrls empty')
        if (!prov.recordCounts) issues.push('provenance.recordCounts missing')
        if (prov.season !== row.season) issues.push(`provenance.season ${prov.season} !== row.season ${row.season}`)
        if (prov.frozenDatasetVersion !== row.version_label) {
          issues.push(
            `provenance.frozenDatasetVersion ${prov.frozenDatasetVersion} !== row.version_label ${row.version_label}`,
          )
        }
        if (prov.datasetVersionId !== row.id) {
          issues.push(`provenance.datasetVersionId ${prov.datasetVersionId} !== row.id ${row.id}`)
        }
      } catch {
        issues.push('provenance_json not valid JSON')
      }
    }

    if (!row.source_kind) {
      issues.push('source_kind is empty')
    }

    const frozenPath = path.join(repoRoot, 'data', 'frozen', season, `frozen-${safeFilePart(row.version_label)}.json`)
    const diskOk = existsSync(frozenPath)
    if (!diskOk) {
      const altDir = path.join(repoRoot, 'data', 'frozen', season)
      issues.push(
        `disk manifest not at expected path ${path.relative(repoRoot, frozenPath)} (check data/frozen/${season}/)`,
      )
      if (existsSync(altDir)) {
        console.error('[data:verify:frozen] available files:', readdirSync(altDir))
      }
    } else if (row.provenance_json) {
      const disk = readFileSync(frozenPath, 'utf8').trim()
      if (disk !== row.provenance_json.trim()) {
        issues.push('disk frozen manifest differs from DB provenance_json (re-run freeze or fix drift)')
      }
    }

    console.log(`[data:verify:frozen] active id=${row.id} season=${row.season} version_label=${row.version_label}`)
    console.log(`  imported_at: ${row.imported_at}`)
    console.log(`  source_kind: ${row.source_kind}`)
    console.log(`  frozen_at: ${row.frozen_at ?? '—'}`)
    const overrideLine =
      prov?.override != null
        ? `override layer schema=${prov.override.overridesSchemaVersion ?? '—'} at=${prov.override.generatedAt ?? '—'}`
        : 'override: (none in provenance — OK if no override-report in effective/)'
    console.log(`  ${overrideLine}`)
    console.log(`  provenance: ${prov ? `urls=${prov.sourceUrls.length} counts=active ${prov.recordCounts.activeSkills}` : '—'}`)

    if (issues.length) {
      console.error('[data:verify:frozen] FAILED:\n  - ' + issues.join('\n  - '))
      process.exit(1)
    }
    console.log('[data:verify:frozen] OK')
  } finally {
    db.close()
  }
}

main()
