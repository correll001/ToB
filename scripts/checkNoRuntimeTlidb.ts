/**
 * CI guard: broader product paths must not reference tlidb.com (offline / license-safe builds).
 * ETL under scripts/etl is excluded; JSON bundles may contain archival sourceUrl — not scanned here.
 *
 * For the narrow 4C-4 scope, also run: npm run audit:no-external-runtime-fetch
 */
import { scanForTlidbHost } from './audit/scanProductSources'

const ROOT = process.cwd()

const REL_DIRS = ['app', 'components', 'lib', 'stores', 'hooks', 'selectors']

const allowLineSubstrings = ['checkNoRuntimeTlidb', 'data-policy-allow', 'scanProductSources', 'scanForTlidbHost']

function main() {
  const hits = scanForTlidbHost({
    repoRoot: ROOT,
    relDirs: REL_DIRS,
    allowLineSubstrings,
  })

  if (hits.length) {
    console.error('[check:data-policy] Forbidden tlidb.com references in product code:\n')
    for (const h of hits) console.error(h)
    process.exit(1)
  }
  console.log('[check:data-policy] OK')
}

main()
