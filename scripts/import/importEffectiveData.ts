/**
 * MAINTENANCE-ONLY — not a production or `next build` dependency.
 * Offline import: `data/effective/{season}` → SQLite + webpack bundle JSON.
 * Does not fetch networks. Run manually after ETL / apply-overrides.
 *
 * For an explicit “freeze” with provenance + disk manifest, use:
 *   npm run data:freeze:from-effective
 *
 * Usage:
 *   npm run data:import:effective -- --season=ss12
 *   npm run data:import:effective -- --season=ss12 --version-label=my-label
 *   npm run data:import:effective -- --season=ss12 --no-activate
 *   npm run data:import:effective -- --set-active --season=ss12 --version-label=<label>
 */
import { parseArgs } from '../etl/shared'
import { runEffectiveDirectoryIngest, runSetActiveDataset } from './effectiveIngestShared'

function main() {
  const args = parseArgs(process.argv.slice(2))
  const season = typeof args.season === 'string' ? args.season : null

  if (args['set-active'] === true) {
    if (!season || typeof args['version-label'] !== 'string') {
      console.error('[importEffectiveData] --set-active requires --season and --version-label=<label>')
      process.exit(1)
    }
    const ok = runSetActiveDataset(season, args['version-label'])
    if (!ok) {
      console.error('[importEffectiveData] dataset version not found')
      process.exit(1)
    }
    console.log('[importEffectiveData] active dataset switched')
    return
  }

  if (!season) {
    console.error('[importEffectiveData] required: --season=ss12')
    process.exit(1)
  }

  const activate = args['no-activate'] !== true && args['no-activate'] !== ''
  const versionLabel = typeof args['version-label'] === 'string' ? args['version-label'] : undefined

  try {
    const result = runEffectiveDirectoryIngest({ season, versionLabel, activate })
    console.log(
      `[importEffectiveData] OK season=${result.season} version_label=${result.versionLabel} dataset_version_id=${result.datasetVersionId} activate=${result.activate}`,
    )
  } catch (e) {
    console.error('[importEffectiveData]', e)
    process.exit(1)
  }
}

main()
