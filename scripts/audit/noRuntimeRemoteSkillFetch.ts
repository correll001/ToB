/**
 * 4D-5: Shipped runtime + formula code must not fetch third-party skill DBs (ToS / reliability).
 *
 *   npm run audit:no-runtime-remote-skill-fetch
 *
 * Scans TS/TSX only (not JSON bundles — archival sourceUrl may cite TLIDB).
 */
import path from 'node:path'
import { scanForRemoteSkillDataFetch, scanForTlidbHost } from './scanProductSources'

const ROOT = process.cwd()

const RUNTIME_REL_DIRS = [
  'app',
  'components',
  'hooks',
  'stores',
  'selectors',
  path.join('lib', 'runtime'),
  path.join('lib', 'formula'),
]

const allowLineSubstrings = [
  'data-policy-allow',
  'noRuntimeRemoteSkillFetch',
  'noExternalRuntimeFetch',
  'scanProductSources',
  'scanForTlidbHost',
  'scanForRemoteSkillDataFetch',
]

function main() {
  const tlidb = scanForTlidbHost({ repoRoot: ROOT, relDirs: RUNTIME_REL_DIRS, allowLineSubstrings })
  const remote = scanForRemoteSkillDataFetch({ repoRoot: ROOT, relDirs: RUNTIME_REL_DIRS, allowLineSubstrings })

  if (tlidb.length || remote.length) {
    if (tlidb.length) {
      console.error('[audit:no-runtime-remote-skill-fetch] Forbidden tlidb.com in runtime paths:\n')
      for (const h of tlidb) console.error(h)
    }
    if (remote.length) {
      console.error(
        '\n[audit:no-runtime-remote-skill-fetch] Forbidden remote fetch / import to skill-data hosts:\n',
      )
      for (const h of remote) console.error(h)
    }
    process.exit(1)
  }

  console.log(
    '[audit:no-runtime-remote-skill-fetch] OK (app, components, hooks, stores, selectors, lib/runtime, lib/formula)',
  )
}

main()
