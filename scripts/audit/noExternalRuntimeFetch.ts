/**
 * Audit (4C-4): frontend + formula/runtime code must not reference or fetch tlidb.com.
 * Does not scan JSON artifacts, ETL, or import scripts — only shipped TS/TSX under listed dirs.
 *
 *   npm run audit:no-external-runtime-fetch
 */
import path from 'node:path'
import { scanForTlidbHost } from './scanProductSources'

const ROOT = process.cwd()

/** Exact scope from product data-policy (narrow runtime-facing code). */
const RUNTIME_REL_DIRS = ['app', 'components', 'hooks', path.join('lib', 'runtime'), path.join('lib', 'formula'), 'stores']

const allowLineSubstrings = ['data-policy-allow', 'noExternalRuntimeFetch', 'scanProductSources', 'scanForTlidbHost']

function main() {
  const hits = scanForTlidbHost({
    repoRoot: ROOT,
    relDirs: RUNTIME_REL_DIRS,
    allowLineSubstrings,
  })

  if (hits.length) {
    console.error('[audit:no-external-runtime-fetch] Forbidden tlidb.com in runtime paths:\n')
    for (const h of hits) console.error(h)
    process.exit(1)
  }
  console.log('[audit:no-external-runtime-fetch] OK (scope: app, components, hooks, lib/runtime, lib/formula, stores)')
}

main()
