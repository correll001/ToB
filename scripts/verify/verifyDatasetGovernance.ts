/**
 * 4F-9 — Verify dataset version switch API works (SQLite SAVEPOINT; no net effect).
 *
 *   npm run data:verify:dataset-governance
 *   npm run data:verify:dataset-governance -- --season=ss12
 */
import { openLocalDatabase } from '@/lib/db/openLocalDatabase'
import {
  getActiveDatasetVersionId,
  listDatasetVersions,
  setActiveDatasetByVersionLabel,
} from '@/lib/data/localSkillRepository'
import { parseArgs } from '../etl/shared'

function main() {
  const args = parseArgs(process.argv.slice(2))
  const season = typeof args.season === 'string' ? args.season : 'ss12'

  const db = openLocalDatabase()
  try {
    const all = listDatasetVersions(db).filter((r) => r.season === season)
    if (all.length === 0) {
      console.error(`[data:verify:dataset-governance] no dataset_versions for season=${season}`)
      process.exit(1)
    }

    const activeIdBefore = getActiveDatasetVersionId(db)
    if (activeIdBefore == null) {
      console.error('[data:verify:dataset-governance] no active dataset')
      process.exit(1)
    }

    const activeRow = all.find((r) => r.id === activeIdBefore)
    const other = all.find((r) => r.id !== activeIdBefore)

    if (!other) {
      console.log(
        `[data:verify:dataset-governance] OK (skip switch test: only one version for ${season}; add another freeze/import to test rollback path)`,
      )
      return
    }

    db.exec('SAVEPOINT dataset_gov_verify')
    try {
      const ok1 = setActiveDatasetByVersionLabel(db, season, other.version_label)
      if (!ok1) {
        throw new Error(`setActive(${other.version_label}) returned false`)
      }
      const mid = getActiveDatasetVersionId(db)
      if (mid !== other.id) {
        throw new Error(`expected active id ${other.id} got ${mid}`)
      }
      if (!activeRow) throw new Error('missing active row')
      const ok2 = setActiveDatasetByVersionLabel(db, season, activeRow.version_label)
      if (!ok2) {
        throw new Error(`restore active(${activeRow.version_label}) returned false`)
      }
      const restored = getActiveDatasetVersionId(db)
      if (restored !== activeIdBefore) {
        throw new Error(`expected restore id ${activeIdBefore} got ${restored}`)
      }
    } finally {
      db.exec('ROLLBACK TO SAVEPOINT dataset_gov_verify')
      db.exec('RELEASE SAVEPOINT dataset_gov_verify')
    }

    const activeIdAfter = getActiveDatasetVersionId(db)
    if (activeIdAfter !== activeIdBefore) {
      console.error(
        `[data:verify:dataset-governance] FATAL: active id changed ${activeIdBefore} → ${activeIdAfter} after rollback`,
      )
      process.exit(1)
    }

    console.log(`[data:verify:dataset-governance] OK (switch + rollback exercised in SAVEPOINT)`)
  } finally {
    db.close()
  }
}

main()
