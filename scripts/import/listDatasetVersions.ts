/**
 * List SQLite dataset_versions (maintenance / rollback planning).
 *
 *   npm run data:list-dataset-versions
 *   npm run data:list-dataset-versions -- --season=ss12
 */
import { listDatasetVersions } from '@/lib/data/localSkillRepository'
import { openLocalDatabase } from '@/lib/db/openLocalDatabase'
import { parseArgs } from '../etl/shared'

function main() {
  const args = parseArgs(process.argv.slice(2))
  const seasonFilter = typeof args.season === 'string' ? args.season : null

  const db = openLocalDatabase()
  try {
    const rows = listDatasetVersions(db)
    const filtered = seasonFilter ? rows.filter((r) => r.season === seasonFilter) : rows
    if (filtered.length === 0) {
      console.log(`[data:list-dataset-versions] (no rows${seasonFilter ? ` for season=${seasonFilter}` : ''})`)
      return
    }
    console.log(
      `[data:list-dataset-versions] ${filtered.length} row(s)${seasonFilter ? ` · season=${seasonFilter}` : ''}`,
    )
    for (const r of filtered) {
      const star = r.is_active === 1 ? '*' : ' '
      console.log(
        `${star} id=${r.id}  season=${r.season}  label=${r.version_label}  imported=${r.imported_at}`,
      )
    }
    console.log('')
    console.log('Switch active (`set-active` updates SQLite; re-run bundle export/import per team SOP):')
    const inactiveHints = seasonFilter
      ? filtered.filter((r) => r.is_active !== 1)
      : rows.filter((r) => {
          const activeSeason = rows.find((x) => x.is_active === 1)?.season
          return activeSeason != null && r.season === activeSeason && r.is_active !== 1
        })
    for (const r of inactiveHints) {
      console.log(
        `  npm run data:import:effective -- --set-active --season=${r.season} --version-label=${r.version_label}`,
      )
    }
    if (inactiveHints.length === 0) {
      console.log(
        '  (no alternate version in scope — freeze/import again to keep a rollback target, or pass --season=)',
      )
    }
    if (!seasonFilter) {
      console.log('  Tip: pass --season=<s> to list all inactive labels for that season.')
    }
  } finally {
    db.close()
  }
}

main()
