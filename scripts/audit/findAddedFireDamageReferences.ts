/**
 * 4E-1 — Repo-wide reference map for Added_Fire_Damage (read-only scan).
 * Writes docs/debug-added-fire-damage-reference-map.md
 *
 *   npx tsx scripts/audit/findAddedFireDamageReferences.ts
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const CONTEXT_BEFORE = 12
const CONTEXT_AFTER = 12
const MERGE_GAP = 8
const SPELL_WINDOW_CHARS = 12_000
/** Avoid embedding multi‑MB single-line JSON into the markdown report. */
const MAX_LINE_CHARS = 480

const OUTPUT_REL = 'docs/debug-added-fire-damage-reference-map.md'

const SKIP_DIR_NAMES = new Set([
  'node_modules',
  '.git',
  '.next',
  'dist',
  'coverage',
  '.turbo',
])

const TEXT_EXT = new Set([
  '.ts',
  '.tsx',
  '.mts',
  '.cts',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.json',
  '.md',
  '.mdx',
  '.yaml',
  '.yml',
  '.txt',
  '.html',
  '.css',
  '.svg',
])

type Layer =
  | 'Raw page / 原始抓頁層'
  | 'Normalized 層'
  | 'Override 層'
  | 'Effective 層'
  | 'Frozen snapshot 層'
  | 'Runtime bundle / lookup 層'
  | 'ETL / import 腳本'
  | 'Verify / audit / test 腳本'
  | 'Application / lib（非 runtime bundle）'
  | 'Docs'
  | 'Other'

function classifyLayer(relPosix: string): Layer {
  const p = relPosix.replace(/\\/g, '/')
  if (p.startsWith('data/raw/')) return 'Raw page / 原始抓頁層'
  if (p.startsWith('data/normalized/')) return 'Normalized 層'
  if (p.startsWith('data/overrides/')) return 'Override 層'
  if (p.startsWith('data/effective/')) return 'Effective 層'
  if (p.startsWith('data/frozen/')) return 'Frozen snapshot 層'
  if (p.includes('lib/gameData/generated/') || p.endsWith('effective-runtime-bundle.json'))
    return 'Runtime bundle / lookup 層'
  if (p.startsWith('lib/runtime/')) return 'Runtime bundle / lookup 層'
  if (p.startsWith('scripts/etl/') || p.startsWith('scripts/import/')) return 'ETL / import 腳本'
  if (p.startsWith('scripts/verify/') || p.startsWith('scripts/audit/')) return 'Verify / audit / test 腳本'
  if (p.startsWith('docs/')) return 'Docs'
  if (p.startsWith('lib/') || p.startsWith('components/') || p.startsWith('app/') || p.startsWith('selectors/'))
    return 'Application / lib（非 runtime bundle）'
  return 'Other'
}

const PIPELINE_ORDER: Record<Layer, number> = {
  'Raw page / 原始抓頁層': 10,
  'Normalized 層': 20,
  'Override 層': 30,
  'Effective 層': 40,
  'Frozen snapshot 層': 45,
  'Runtime bundle / lookup 層': 50,
  'ETL / import 腳本': 15,
  'Verify / audit / test 腳本': 90,
  'Application / lib（非 runtime bundle）': 80,
  Docs: 95,
  Other: 99,
}

function lineMatches(line: string): boolean {
  if (line.includes('Added_Fire_Damage')) return true
  if (line.includes('skill:Added_Fire_Damage')) return true
  if (line.includes('附加火焰傷害')) return true
  if (/added fire/i.test(line)) return true
  return false
}

function scanFlags(text: string): { requiresSpell: boolean; allowedSkillTags: boolean } {
  return {
    requiresSpell: /requiresSpell/.test(text),
    allowedSkillTags: /allowedSkillTags/.test(text),
  }
}

function mergeIntervals(intervals: Array<{ lo: number; hi: number }>): Array<{ lo: number; hi: number }> {
  if (intervals.length === 0) return []
  const sorted = [...intervals].sort((a, b) => a.lo - b.lo)
  const out: Array<{ lo: number; hi: number }> = []
  let cur = sorted[0]
  for (let i = 1; i < sorted.length; i++) {
    const n = sorted[i]
    if (n.lo <= cur.hi + MERGE_GAP) cur = { lo: cur.lo, hi: Math.max(cur.hi, n.hi) }
    else {
      out.push(cur)
      cur = n
    }
  }
  out.push(cur)
  return out
}

function collectHitLines(lines: string[]): number[] {
  const hits: number[] = []
  for (let i = 0; i < lines.length; i++) {
    if (lineMatches(lines[i])) hits.push(i)
  }
  return hits
}

function intervalsFromHits(hits: number[], nLines: number): Array<{ lo: number; hi: number }> {
  return mergeIntervals(
    hits.map((i) => ({
      lo: Math.max(0, i - CONTEXT_BEFORE),
      hi: Math.min(nLines - 1, i + CONTEXT_AFTER),
    })),
  )
}

function truncateForReport(s: string): string {
  if (s.length <= MAX_LINE_CHARS) return s
  const half = Math.floor((MAX_LINE_CHARS - 24) / 2)
  return `${s.slice(0, half)} … [truncated ${s.length - MAX_LINE_CHARS} chars] … ${s.slice(-half)}`
}

function formatSnippet(lines: string[], lo: number, hi: number): string {
  const parts: string[] = []
  for (let i = lo; i <= hi; i++) {
    parts.push(`${String(i + 1).padStart(6, ' ')} | ${truncateForReport(lines[i])}`)
  }
  return parts.join('\n')
}

function walkFiles(root: string): string[] {
  const out: string[] = []
  const stack = [root]
  while (stack.length) {
    const dir = stack.pop()!
    let entries: string[]
    try {
      entries = readdirSync(dir)
    } catch {
      continue
    }
    for (const name of entries) {
      const full = join(dir, name)
      if (SKIP_DIR_NAMES.has(name)) continue
      let st: ReturnType<typeof statSync>
      try {
        st = statSync(full)
      } catch {
        continue
      }
      if (st.isDirectory()) stack.push(full)
      else {
        const ext = name.includes('.') ? name.slice(name.lastIndexOf('.')).toLowerCase() : ''
        if (TEXT_EXT.has(ext)) out.push(full)
      }
    }
  }
  return out
}

/** True if this file appears to tie Added_Fire_Damage to Spell-only rules in one JSON-ish window. */
function spellOnlyForAddedFireInFile(content: string): boolean {
  const anchor = 'skill:Added_Fire_Damage'
  const idx = content.indexOf(anchor)
  if (idx < 0) return false
  const slice = content.slice(idx, idx + SPELL_WINDOW_CHARS)
  const hasSpellGate =
    /"requiresSpell"\s*:\s*true/.test(slice) ||
    /"allowedSkillTags"\s*:\s*\[[^\]]*"Spell"/.test(slice) ||
    /Spell skills \(added fire\)/.test(slice)
  return hasSpellGate
}

type FileHit = {
  rel: string
  layer: Layer
  regions: Array<{ lo: number; hi: number; snippet: string }>
  flagsInFile: { requiresSpell: boolean; allowedSkillTags: boolean }
  flagsInRegions: Array<{ requiresSpell: boolean; allowedSkillTags: boolean }>
  spellOnlyForGem: boolean
}

function main() {
  const cwd = process.cwd()
  const absFiles = walkFiles(cwd)
  const hits: FileHit[] = []

  for (const abs of absFiles) {
    const rel = relative(cwd, abs)
    if (rel.split(sep).some((s) => SKIP_DIR_NAMES.has(s))) continue
    let content: string
    try {
      content = readFileSync(abs, 'utf8')
    } catch {
      continue
    }
    const lines = content.split(/\r?\n/)
    const hitLines = collectHitLines(lines)
    if (hitLines.length === 0) continue

    const intervals = intervalsFromHits(hitLines, lines.length)
    const regions = intervals.map(({ lo, hi }) => ({
      lo,
      hi,
      snippet: formatSnippet(lines, lo, hi),
    }))
    const relPosix = rel.split(sep).join('/')
    if (relPosix === OUTPUT_REL) continue
    const layer = classifyLayer(relPosix)
    const flagsInFile = scanFlags(content)
    const flagsInRegions = regions.map((r) => scanFlags(r.snippet))
    const spellOnlyForGem = spellOnlyForAddedFireInFile(content)

    hits.push({
      rel: relPosix,
      layer,
      regions,
      flagsInFile,
      flagsInRegions,
      spellOnlyForGem,
    })
  }

  hits.sort((a, b) => {
    const oa = PIPELINE_ORDER[a.layer]
    const ob = PIPELINE_ORDER[b.layer]
    if (oa !== ob) return oa - ob
    return a.rel.localeCompare(b.rel, 'en')
  })

  const byLayer = new Map<Layer, FileHit[]>()
  for (const h of hits) {
    const arr = byLayer.get(h.layer) ?? []
    arr.push(h)
    byLayer.set(h.layer, arr)
  }

  const layerOrder: Layer[] = [
    'Raw page / 原始抓頁層',
    'Normalized 層',
    'Override 層',
    'Effective 層',
    'Frozen snapshot 層',
    'Runtime bundle / lookup 層',
    'ETL / import 腳本',
    'Verify / audit / test 腳本',
    'Application / lib（非 runtime bundle）',
    'Docs',
    'Other',
  ]

  const firstSpellSteer = hits.filter((h) => h.spellOnlyForGem).sort((a, b) => PIPELINE_ORDER[a.layer] - PIPELINE_ORDER[b.layer] || a.rel.localeCompare(b.rel, 'en'))[0]

  const md: string[] = []
  md.push('# Added_Fire_Damage — 全專案引用分層圖（4E-1）')
  md.push('')
  md.push(`Generated: ${new Date().toISOString()}`)
  md.push('')
  md.push('掃描關鍵字：`Added_Fire_Damage`、`skill:Added_Fire_Damage`、`added fire`（不分大小寫）、`附加火焰傷害`。')
  md.push('')
  md.push('## 比對摘要（資料管線）')
  md.push('')
  const inNorm = hits.some((h) => h.layer === 'Normalized 層')
  const inEff = hits.some((h) => h.layer === 'Effective 層')
  const inRt = hits.some((h) => h.layer === 'Runtime bundle / lookup 層')
  const rawOnly = hits.some((h) => h.layer === 'Raw page / 原始抓頁層')
  md.push(`- **Raw 層有命中**: ${rawOnly ? '是' : '否'}`)
  md.push(`- **Normalized 層有命中**: ${inNorm ? '是' : '否'}`)
  md.push(`- **Effective 層有命中**: ${inEff ? '是' : '否'}`)
  md.push(`- **Runtime bundle 層有命中**: ${inRt ? '是' : '否'}`)
  md.push('')
  md.push('### 情境對照（A / B / C）')
  md.push('')
  md.push('- **情況 A**（只在 raw/normalized，未進 effective）：若 effective 無此 id 相關列 → ETL / override / import 鏈斷裂。本 repo 目前 effective 與 runtime 皆有 `Added_Fire_Damage` 命中 → **非 A**。')
  md.push('- **情況 B**（override / effective 內 `supportRules` 被標成 Spell-only）：若在同一檔案視窗內同時出現 `skill:Added_Fire_Damage` 與 `requiresSpell` / `allowedSkillTags: Spell` → **偏向 B**。')
  md.push('- **情況 C**（effective 正確但 runtime 吃到別版）：若 effective 與 generated bundle 規則不一致 → 打包/啟用層問題。需比對兩檔片段（下方各層區塊）。')
  md.push('')
  md.push('## 第一個把此輔助導向 Spell-only 的資料來源（腳本判定）')
  md.push('')
  if (firstSpellSteer) {
    md.push(
      `依「管線層級由先到後」且在同一檔案視窗內（錨點 \`skill:Added_Fire_Damage\` 後 ${SPELL_WINDOW_CHARS} 字元）同時出現 Spell 門檻欄位，**第一個命中檔案**為：`,
    )
    md.push('')
    md.push(`- **路徑**: \`${firstSpellSteer.rel}\``)
    md.push(`- **層級**: ${firstSpellSteer.layer}`)
    md.push(
      `- **說明**: 此檔在錨點附近可見 \`requiresSpell: true\`、或 \`allowedSkillTags\` 含 \`Spell\`、或文案 \`Spell skills (added fire)\` → 即為把規則鎖成 Spell-only 的**最早可觀測層**（normalized 大檔若無此共現，則不會被判為早于 override）。`,
    )
  } else {
    md.push('腳本未在任何檔案中找到「`skill:Added_Fire_Damage` + Spell 門檻」共現視窗；請人工檢查拆檔或非 JSON 來源。')
  }
  md.push('')
  md.push('## 依層級分組 — 命中檔案總表')
  md.push('')

  for (const layer of layerOrder) {
    const group = byLayer.get(layer)
    if (!group?.length) continue
    md.push(`### ${layer}`)
    md.push('')
    for (const h of group) {
      md.push(`#### \`${h.rel}\``)
      md.push('')
      md.push(
        `- **全檔含 \`requiresSpell\` 字樣**: ${h.flagsInFile.requiresSpell ? '是' : '否'}；**全檔含 \`allowedSkillTags\` 字樣**: ${h.flagsInFile.allowedSkillTags ? '是' : '否'}`,
      )
      md.push(`- **錨點視窗內 Spell-only（Added_Fire_Damage）**: ${h.spellOnlyForGem ? '是' : '否'}`)
      md.push('')
      h.regions.forEach((r, i) => {
        const rf = h.flagsInRegions[i]
        md.push(`##### 片段 ${i + 1}（行 ${r.lo + 1}–${r.hi + 1}）`)
        md.push('')
        md.push(
          `- 本片段含 \`requiresSpell\`: ${rf.requiresSpell ? '是' : '否'}；含 \`allowedSkillTags\`: ${rf.allowedSkillTags ? '是' : '否'}`,
        )
        md.push('')
        md.push('```text')
        md.push(r.snippet)
        md.push('```')
        md.push('')
      })
    }
  }

  md.push('## 扁平清單（路徑 + 層級）')
  md.push('')
  md.push('| 層級 | 路徑 | 錨點視窗 Spell-only |')
  md.push('| --- | --- | --- |')
  for (const h of hits) {
    md.push(`| ${h.layer} | \`${h.rel}\` | ${h.spellOnlyForGem ? '是' : '否'} |`)
  }
  md.push('')

  const outPath = join(cwd, 'docs', 'debug-added-fire-damage-reference-map.md')
  writeFileSync(outPath, md.join('\n'), 'utf8')
  console.log(`Wrote ${relative(cwd, outPath)} (${hits.length} files)`)
}

main()
