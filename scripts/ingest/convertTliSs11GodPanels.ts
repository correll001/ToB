/**
 * Reads `SS11-talent-tree-master.json` from TLI Compendium data-bundles,
 * converts **all** talent-tree masters (30 張神牆／職業牆) to:
 * - `data/normalized/ss12/talent-panel-nodes.json`
 * - `data/normalized/ss12/talent-panels.json`（面板清單 + 與 talent-affixes 職業列對齊的顯示名）
 *
 *   npx tsx scripts/ingest/convertTliSs11GodPanels.ts [path/to/SS11-talent-tree-master.json]
 *
 * Source: https://tlicompendium.com/data-bundles/SS11-talent-tree-master.json
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import {
  convertTliSs11GodTreeToPanelNodes,
  getTliSs11BundleKeyForStem,
  type TliSs11TalentTreeDoc,
  tliStemToPanelId,
} from '@/lib/talent/tliSs11TalentTree'
import type { TalentAffixNormalized } from '@/types/talentAffix'
import type { TalentPanelDef, TalentPanelNode, TalentPanelNodesFile, TalentPanelsFile } from '@/types/talentPanel'

const ROOT = join(__dirname, '..', '..')
const DEFAULT_BUNDLE = join(ROOT, 'scripts', 'ingest', 'SS11-talent-tree-master.json')
const AFFIX_PATH = join(ROOT, 'data', 'normalized', 'ss12', 'talent-affixes.json')
const OUT_NODES = join(ROOT, 'data', 'normalized', 'ss12', 'talent-panel-nodes.json')
const OUT_PANELS = join(ROOT, 'data', 'normalized', 'ss12', 'talent-panels.json')

type ProfessionMeta = {
  displayName: string
  order: number
  deityTag: string
}

function loadProfessionMetaByPanelId(): Map<string, ProfessionMeta> {
  const raw = readFileSync(AFFIX_PATH, 'utf8')
  const affixData = JSON.parse(raw) as { affixes: TalentAffixNormalized[] }
  const m = new Map<string, ProfessionMeta>()
  for (const a of affixData.affixes) {
    if (!a.professionRow) continue
    const t = a.tags?.find((x): x is string => typeof x === 'string' && x.startsWith('deity:'))
    if (!t) continue
    const panelId = `god_${t.replace(/^deity:/, '')}`
    if (!m.has(panelId)) {
      m.set(panelId, {
        displayName: a.displayName,
        order: typeof a.sourceOrderIndex === 'number' ? a.sourceOrderIndex : 9999,
        deityTag: t,
      })
    }
  }
  return m
}

function stemsFromBundle(bundle: Record<string, unknown>): string[] {
  const stems: string[] = []
  for (const key of Object.keys(bundle)) {
    if (!key.startsWith('talent-tree/') || !key.endsWith('/master')) continue
    const parts = key.split('/')
    const stem = parts[1]
    if (stem) stems.push(stem)
  }
  return stems
}

function main() {
  const bundlePath = process.argv[2] ?? DEFAULT_BUNDLE
  const raw = readFileSync(bundlePath, 'utf8')
  const bundle = JSON.parse(raw) as Record<string, TliSs11TalentTreeDoc>

  const professionMeta = loadProfessionMetaByPanelId()
  const season = 'ss12'
  const nodes: TalentPanelNode[] = []

  const stems = stemsFromBundle(bundle as Record<string, unknown>)
  const stemRows = stems.map((stem) => {
    const panelId = tliStemToPanelId(stem)
    const meta = professionMeta.get(panelId)
    return { stem, panelId, order: meta?.order ?? 9999, meta }
  })
  stemRows.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order
    return a.panelId.localeCompare(b.panelId)
  })

  const panels: TalentPanelDef[] = stemRows.map(({ stem, panelId, meta }, idx) => {
    const displayName =
      meta?.displayName ??
      panelId
        .replace(/^god_/, '')
        .split('_')
        .map((w) => (w === 'of' ? 'of' : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
        .join(' ')
    const tags = meta?.deityTag ? [meta.deityTag] : [`deity:${panelId.replace(/^god_/, '')}`]
    const talentWallGroup: 'base_god' | 'profession' = idx < 6 ? 'base_god' : 'profession'
    const canonicalOrder = (idx + 1) * 10

    return {
      panelId,
      displayName,
      season,
      gridWidth: 8 as const,
      gridHeight: 5 as const,
      sourceKind: 'god_panel' as const,
      manualTopology: true as const,
      canonicalOrder,
      isFixedTree: true,
      talentWallGroup,
      tags,
      notes: [
        `TLI SS11 stem: ${stem} → bundle key talent-tree/${stem}/master.`,
        '節點來自公開 bundle；affixPending 待對應 talent-affixes。',
      ],
    }
  })

  for (const { stem, panelId } of stemRows) {
    const key = getTliSs11BundleKeyForStem(stem)
    const doc = bundle[key]
    if (!doc?.tree?.nodes?.length) {
      console.warn(`[convertTliSs11] skip missing or empty: ${key}`)
      continue
    }
    nodes.push(...convertTliSs11GodTreeToPanelNodes(doc, panelId, season))
    console.log(`[convertTliSs11] ${stem} → ${panelId}: ${doc.tree.nodes.length} nodes`)
  }

  const panelsFile: TalentPanelsFile = {
    schemaVersion: 1,
    season,
    sourceNote:
      'Generated panels list + TLI SS11 topology for all 30 talent-tree masters. Re-run: npx tsx scripts/ingest/convertTliSs11GodPanels.ts',
    panelCount: panels.length,
    panels,
  }

  const nodesOut: TalentPanelNodesFile = {
    schemaVersion: 1,
    season,
    readMeZh: [
      '節點座標與 requires / edges 來自 TLI Compendium 公開的 SS11 `talent-tree/*/master` bundle（與火炬之光官方遊戲資料對應）。',
      '每個節點 `affixPending: true`：`tlidbId` 僅為版面／匯入追蹤（見 `notes` 內 `tli:ss11:…`），請之後對應到 `talent-affixes.json` 的 `affixId` 或 `affixGameDataId` 並移除 `affixPending`。',
      '格線：x = TLI `position`，y = TLI `tier`，`slotIndex = y*8+x`（8×5）。',
    ],
    sourceNote:
      'Generated from TLI SS11 talent-tree master bundle; affix links pending. Re-run: npx tsx scripts/ingest/convertTliSs11GodPanels.ts',
    nodeCount: nodes.length,
    nodes,
  }

  writeFileSync(OUT_PANELS, `${JSON.stringify(panelsFile, null, 2)}\n`, 'utf8')
  writeFileSync(OUT_NODES, `${JSON.stringify(nodesOut, null, 2)}\n`, 'utf8')
  console.log(`[convertTliSs11] wrote ${panels.length} panels → ${OUT_PANELS}`)
  console.log(`[convertTliSs11] wrote ${nodes.length} nodes → ${OUT_NODES}`)
}

main()
