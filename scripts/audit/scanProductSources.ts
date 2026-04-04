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
