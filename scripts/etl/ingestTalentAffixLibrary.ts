/**
 * Fetch TLIDB /tw/Talent (or read local HTML), emit:
 * - data/raw/ss12/talent/talent-affix-source-snapshot.json
 * - data/normalized/ss12/talent-affixes.json
 *
 *   npx tsx scripts/etl/ingestTalentAffixLibrary.ts
 *   npx tsx scripts/etl/ingestTalentAffixLibrary.ts --input=data/raw/ss12/talent/talent-page-cache.html
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, isAbsolute, join } from 'node:path'
import * as cheerio from 'cheerio'
import type {
  TalentAffixAvailability,
  TalentAffixModifierStub,
  TalentAffixNormalized,
  TalentAffixNormalizedFile,
  TalentAffixRawSnapshotEntry,
  TalentAffixRawSnapshotFile,
  TalentAffixSourceKind,
  TalentAffixSourceTab,
} from '../../types/talentAffix'

const SOURCE_URL = 'https://tlidb.com/tw/Talent'
const SEASON = 'ss12'
const REPO_ROOT = join(__dirname, '..', '..')
const OUT_RAW = join(REPO_ROOT, 'data', 'raw', SEASON, 'talent', 'talent-affix-source-snapshot.json')
const OUT_NORM = join(REPO_ROOT, 'data', 'normalized', SEASON, 'talent-affixes.json')

const TAB_CONFIG: {
  key: TalentAffixSourceTab
  label: string
  sourceKind: TalentAffixSourceKind
}[] = [
  { key: 'profession', label: 'Profession', sourceKind: 'profession_overview' },
  { key: 'core_talent', label: '核心天賦點', sourceKind: 'core_talent_node' },
  { key: 'talent_tree', label: '天賦', sourceKind: 'talent_tree_node' },
]

const ROW_MARKER = '<div class="row row-cols-1 row-cols-lg-3 g-2">'

function parseArgs(argv: string[]): { inputPath?: string } {
  const inputArg = argv.find((a) => a.startsWith('--input='))
  return { inputPath: inputArg ? inputArg.slice('--input='.length) : undefined }
}

function extractRowBlocks(html: string): string[] {
  const positions: number[] = []
  let pos = 0
  while (true) {
    const i = html.indexOf(ROW_MARKER, pos)
    if (i === -1) break
    positions.push(i)
    pos = i + ROW_MARKER.length
  }
  const blocks: string[] = []
  for (let k = 0; k < positions.length; k++) {
    const start = positions[k]!
    const end = k + 1 < positions.length ? positions[k + 1]! : html.length
    blocks.push(html.slice(start, end))
  }
  return blocks
}

function normalizeWhitespace(s: string): string {
  return s.replace(/\s+/g, ' ').trim()
}

function extractPercentMods(text: string): TalentAffixModifierStub[] {
  const out: TalentAffixModifierStub[] = []
  const re = /\+(\d+(?:\.\d+)?)\s*%\s*([^%+]*?)(?=\s*\+|$)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    const label = m[2].trim()
    if (!label || label.length > 48) continue
    out.push({
      kind: 'percent_increased',
      value: Number.parseFloat(m[1]!),
      labelZh: label,
      rawSnippet: m[0].trim(),
    })
  }
  return out
}

function slugAscii(s: string): string {
  const ascii = s
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 48)
    .toLowerCase()
  if (ascii.length > 0) return ascii
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  }
  return `u${(h >>> 0).toString(16)}`
}

function buildAffixId(params: {
  tab: TalentAffixSourceTab
  gameDataId: string | null
  sourceOrderIndex: number
  displayName: string
}): string {
  const tabPart = params.tab
  if (params.gameDataId) {
    return `talaffix:${SEASON}:${tabPart}:${params.gameDataId}`
  }
  const slug = slugAscii(params.displayName)
  return `talaffix:${SEASON}:${tabPart}:i${params.sourceOrderIndex}_${slug}`
}

function parseColumnsFromBlock(
  blockHtml: string,
  tab: TalentAffixSourceTab,
  tabLabel: string,
  sourceUrl: string,
  startIndex: number,
): TalentAffixRawSnapshotEntry[] {
  const wrapped = `<div id="talent-parse-root">${blockHtml}</div>`
  const $ = cheerio.load(wrapped)
  const entries: TalentAffixRawSnapshotEntry[] = []
  let local = 0
  $('#talent-parse-root .col').each((_, col) => {
    const $col = $(col)
    const $flex = $col.children('.d-flex').first()
    if (!$flex.length) return
    const $img = $flex.find('> .flex-shrink-0 img').first()
    const iconUrl = $img.attr('src') ?? null
    const iconAlt = $img.attr('alt') ?? null
    const $body = $flex.find('> .flex-grow-1').first()
    if (!$body.length) return

    const $header = $body.find('> .d-flex.justify-content-between').first()
    let rawDisplayName = ''
    let gameDataId: string | null = null
    let deityHref: string | null = null
    let deityLabel: string | null = null

    if ($header.length) {
      const $nameEl = $header.find('span.fw-bold, span[data-id]').first()
      rawDisplayName = normalizeWhitespace($nameEl.text())
      gameDataId = $nameEl.attr('data-id') ?? null
      const $link = $header.find('a[href]').last()
      if ($link.length) {
        deityHref = ($link.attr('href') ?? '').replace(/^\//, '').split('/').pop() ?? null
        deityLabel = normalizeWhitespace($link.text())
      }
    } else {
      const $firstA = $body.find('a[href]').first()
      if ($firstA.length) {
        rawDisplayName = normalizeWhitespace($firstA.text())
        const href = ($firstA.attr('href') ?? '').replace(/^\//, '').split('/').pop() ?? null
        deityHref = href
        deityLabel = rawDisplayName
      } else {
        rawDisplayName = normalizeWhitespace($body.text()).slice(0, 80)
      }
    }

    const rawBodyHtml = $body.html() ?? ''
    const withBreaks = rawBodyHtml.replace(/<br\s*\/?>/gi, '\n').replace(/<\/div>/gi, '\n')
    const $plain = cheerio.load(`<div>${withBreaks}</div>`)('div')
    $plain.find('script, style').remove()
    let rawBodyText = normalizeWhitespace($plain.text())

    if (!rawDisplayName) {
      rawDisplayName = `__unnamed_${startIndex + local}`
    }

    entries.push({
      sourceOrderIndex: startIndex + local,
      sourceTab: tab,
      sourceTabLabel: tabLabel,
      gameDataId,
      rawDisplayName,
      rawBodyText,
      rawBodyHtml,
      iconUrl,
      iconAlt,
      deityOrProfessionHref: deityHref,
      deityOrProfessionLabel: deityLabel,
      sourceUrl,
    })
    local += 1
  })
  return entries
}

function normalizeEntry(
  raw: TalentAffixRawSnapshotEntry,
  sourceKind: TalentAffixSourceKind,
  idCounts: Map<string, number>,
): TalentAffixNormalized {
  let affixId = buildAffixId({
    tab: raw.sourceTab,
    gameDataId: raw.gameDataId,
    sourceOrderIndex: raw.sourceOrderIndex,
    displayName: raw.rawDisplayName,
  })
  const prev = idCounts.get(affixId) ?? 0
  idCounts.set(affixId, prev + 1)
  if (prev > 0) {
    affixId = `${affixId}__dup${prev + 1}`
  }

  const descriptionLines = raw.rawBodyText.split('\n').map((l) => l.trim()).filter(Boolean)
  const rawText = raw.rawBodyText
  const newGodOnly =
    raw.deityOrProfessionHref === 'New_God' || raw.deityOrProfessionLabel === '新神'
  const godGridEffectCapHint = /神格生效上限/.test(rawText)
  const slateMentionHint = /石板/.test(rawText)

  const availability: TalentAffixAvailability[] = []
  if (raw.sourceTab === 'profession') availability.push('profession_meta')
  if (raw.sourceTab === 'core_talent') availability.push('core_talent')
  if (raw.sourceTab === 'talent_tree') availability.push('talent_tree')
  if (newGodOnly) availability.push('new_god_related')
  if (godGridEffectCapHint) availability.push('god_grid_cap_hint')
  if (slateMentionHint) availability.push('slate_related_hint')
  if (availability.length === 0) availability.push('unresolved')

  const mods = extractPercentMods(rawText)
  const modifiers = mods.length > 0 ? mods : []
  const modifiersText = modifiers.length > 0 ? modifiers.map((m) => m.rawSnippet).join('；') : null

  const notes: string[] = []
  if (raw.gameDataId && raw.sourceTab === 'talent_tree' && godGridEffectCapHint) {
    notes.push('同 gameDataId 可能在「核心天賦點」分頁另有條目；描述可能與樹上節點略有差異（含神格生效上限註記）。')
  }

  return {
    affixId,
    displayName: raw.rawDisplayName,
    descriptionLines: descriptionLines.length ? descriptionLines : [rawText],
    rawText,
    iconUrl: raw.iconUrl,
    sourceUrl: raw.sourceUrl,
    sourceKind,
    sourceTab: raw.sourceTab,
    gameDataId: raw.gameDataId,
    sourceOrderIndex: raw.sourceOrderIndex,
    availability,
    newGodOnly,
    godGridEffectCapHint,
    slateMentionHint,
    talentTreeRow: raw.sourceTab === 'talent_tree',
    coreTalentRow: raw.sourceTab === 'core_talent',
    professionRow: raw.sourceTab === 'profession',
    panelHints: [],
    tags: raw.deityOrProfessionHref ? [`deity:${raw.deityOrProfessionHref}`] : [],
    notes,
    modifiersText,
    modifiers,
  }
}

async function fetchHtml(): Promise<string> {
  const res = await fetch(SOURCE_URL, {
    headers: {
      'user-agent': 'ToB-talent-affix-ingest/1.0 (educational; contact: local dev)',
      'accept-language': 'zh-TW,zh;q=0.9',
    },
  })
  if (!res.ok) throw new Error(`Fetch failed ${res.status}`)
  return res.text()
}

async function main() {
  const { inputPath } = parseArgs(process.argv.slice(2))
  const html = inputPath
    ? readFileSync(isAbsolute(inputPath) ? inputPath : join(REPO_ROOT, inputPath), 'utf8')
    : await fetchHtml()

  const blocks = extractRowBlocks(html)
  if (blocks.length !== 3) {
    console.warn(
      `[ingestTalentAffixLibrary] expected 3 row blocks (Profession / Core / Tree), got ${blocks.length}`,
    )
  }

  const allRaw: TalentAffixRawSnapshotEntry[] = []
  let cursor = 0
  for (let b = 0; b < Math.min(blocks.length, TAB_CONFIG.length); b++) {
    const cfg = TAB_CONFIG[b]!
    const chunk = parseColumnsFromBlock(blocks[b]!, cfg.key, cfg.label, SOURCE_URL, cursor)
    allRaw.push(...chunk)
    cursor += chunk.length
  }

  const fetchedAt = new Date().toISOString()
  const snapshot: TalentAffixRawSnapshotFile = {
    schemaVersion: 1,
    sourceUrl: SOURCE_URL,
    fetchedAt,
    locale: 'tw',
    season: SEASON,
    entryCount: allRaw.length,
    entries: allRaw,
  }

  mkdirSync(dirname(OUT_RAW), { recursive: true })
  mkdirSync(dirname(OUT_NORM), { recursive: true })
  writeFileSync(OUT_RAW, JSON.stringify(snapshot, null, 2), 'utf8')

  const idCounts = new Map<string, number>()
  const affixes: TalentAffixNormalized[] = allRaw.map((raw) => {
    const cfg = TAB_CONFIG.find((t) => t.key === raw.sourceTab)
    return normalizeEntry(raw, cfg?.sourceKind ?? 'talent_tree_node', idCounts)
  })

  const normalized: TalentAffixNormalizedFile = {
    schemaVersion: 1,
    season: SEASON,
    sourceUrl: SOURCE_URL,
    generatedAt: fetchedAt,
    affixCount: affixes.length,
    affixes,
  }
  writeFileSync(OUT_NORM, JSON.stringify(normalized, null, 2), 'utf8')

  const withIcon = affixes.filter((a) => a.iconUrl).length
  const withMods = affixes.filter((a) => a.modifiers.length > 0).length
  const newGod = affixes.filter((a) => a.newGodOnly).length
  const capHint = affixes.filter((a) => a.godGridEffectCapHint).length
  console.log(
    `[ingestTalentAffixLibrary] OK entries=${affixes.length} withIcon=${withIcon} withParsedPercentMods=${withMods} newGodFlag=${newGod} godGridCapHint=${capHint}`,
  )
  console.log(`  raw → ${OUT_RAW}`)
  console.log(`  norm → ${OUT_NORM}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
