/**
 * Shared filesystem scan for banned substrings in product TypeScript sources.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

export type ScanOptions = {
  repoRoot: string
  relDirs: string[]
  /** If line matches any of these substrings, it is allowed (e.g. script name, escape hatch). */
  allowLineSubstrings: string[]
}

const SKIP_DIRS = new Set(['node_modules', '.next', 'dist', 'coverage'])
const EXT = new Set(['.ts', '.tsx'])

function walk(dir: string, out: string[]) {
  let st
  try {
    st = statSync(dir)
  } catch {
    return
  }
  if (!st.isDirectory()) return
  const base = path.basename(dir)
  if (SKIP_DIRS.has(base)) return

  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p, out)
    else if (ent.isFile() && EXT.has(path.extname(ent.name))) out.push(p)
  }
}

/** Case-insensitive match for tlidb.com and www.tlidb.com */
const TLIDB_HOST = /tlidb\.com/i

/** Runtime must not initiate HTTP(S) fetches to skill-database sites (commercial / ToS risk). */
const BANNED_SKILL_DATA_HOSTS =
  /tlidb\.com|poedb\.tw|pathofexile\.com|pathofexile\.tw|maxroll\.gg|poe\.ninja|craftofexile|mobdb\.net/i

/** Dynamic or static remote call sites — `fetch(` / `axios.` / remote `import()`. */
const REMOTE_FETCH_HINT =
  /\bfetch\s*\(|\baxios\.(get|post|put|delete|request)\s*\(|\bimport\s*\(\s*['"`]https?:\/\//

export function scanForTlidbHost(opts: ScanOptions): string[] {
  const files: string[] = []
  for (const rel of opts.relDirs) {
    walk(path.join(opts.repoRoot, rel), files)
  }

  const hits: string[] = []
  for (const file of files) {
    const text = readFileSync(file, 'utf8')
    if (!TLIDB_HOST.test(text)) continue
    const lines = text.split(/\r?\n/)
    lines.forEach((line, i) => {
      if (!TLIDB_HOST.test(line)) return
      if (opts.allowLineSubstrings.some((a) => line.includes(a))) return
      hits.push(`${path.relative(opts.repoRoot, file)}:${i + 1}: ${line.trim()}`)
    })
  }
  return hits
}

/**
 * Flags lines that likely call remote HTTP APIs from product runtime paths.
 * Does not analyze string concatenation / variables — only obvious literals on the same line.
 */
export function scanForRemoteSkillDataFetch(opts: ScanOptions): string[] {
  const files: string[] = []
  for (const rel of opts.relDirs) {
    walk(path.join(opts.repoRoot, rel), files)
  }

  const hits: string[] = []
  for (const file of files) {
    const text = readFileSync(file, 'utf8')
    const lines = text.split(/\r?\n/)
    lines.forEach((line, i) => {
      const trimmed = line.trim()
      if (trimmed.startsWith('//') || trimmed.startsWith('*')) return
      if (opts.allowLineSubstrings.some((a) => line.includes(a))) return
      if (!REMOTE_FETCH_HINT.test(line)) return
      if (/https?:\/\//i.test(line) && BANNED_SKILL_DATA_HOSTS.test(line)) {
        hits.push(`${path.relative(opts.repoRoot, file)}:${i + 1}: ${line.trim()}`)
      }
    })
  }
  return hits
}
