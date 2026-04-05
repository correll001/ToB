/**
 * Types + conversion from TLI Compendium SS11 `SS11-talent-tree-master.json` bundle shape
 * (keys like `talent-tree/god_of_might/master`) into our `TalentPanelNode` grid.
 *
 * Grid mapping (matches in-game 8×5 used in this repo):
 * - `tier`  → `y` (row, 0 = top)
 * - `position` → `x` (column, 0 = left)
 * - `slotIndex` = `y * 8 + x`
 *
 * Affix ids in TLI `tlidbId` (e.g. node_352_80) are layout hints, not `talent-affixes.json` keys —
 * use `affixPending: true` until you map each node to a real affix row.
 */
import type { TalentPanelNode, TalentPanelNodeType } from '@/types/talentPanel'

function suggestedNodeId(season: string, panelId: string, slotIndex: number): string {
  return `talnode:${season}:${panelId}:s${slotIndex}`
}

/** Raw bundle: path key → parsed JSON document */
export type TliSs11TalentTreeMasterBundle = Record<string, TliSs11TalentTreeDoc | unknown>

export type TliSs11TalentTreeDoc = {
  schemaVersion?: number
  seasonId?: string
  tree: TliSs11Tree
}

export type TliSs11Tree = {
  id?: string
  tlidbId?: string
  nodes: TliSs11TreeNode[]
  connections?: unknown[]
}

export type TliSs11TreeNode = {
  id: string
  tlidbId: string
  type: string
  tier: number
  position: number
  ancestor?: unknown
  predecessors: { guid: string; tlidbId: string }[]
  icon?: string
  svgPosition?: { cx: number; cy: number }
  maxPoints: number
  mods?: unknown[]
}

/**
 * TLI bundle stem（蛇形小寫，如 `god_of_might`、`the_brave`）→ `talent-panels.json` 的 `panelId`
 *（與詞綴表 `deity:God_of_Might` 對齊：`god_` + Pascal 片段，`of` 維持小寫）。
 */
export function tliStemToPanelId(stem: string): string {
  const tail = stem
    .split('_')
    .map((w) => (w === 'of' ? 'of' : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join('_')
  return `god_${tail}`
}

/** @deprecated 請用 `tliStemToPanelId`；保留給舊文件／外部腳本參考。 */
export const TLI_SS11_GOD_TREE_TO_PANEL: Record<string, string> = {
  god_of_might: 'god_God_of_Might',
  god_of_war: 'god_God_of_War',
  god_of_machines: 'god_God_of_Machines',
  goddess_of_hunting: 'god_Goddess_of_Hunting',
  goddess_of_knowledge: 'god_Goddess_of_Knowledge',
  goddess_of_deception: 'god_Goddess_of_Deception',
}

export function tliSs11TypeToNodeType(t: string): TalentPanelNodeType {
  const u = t.toLowerCase()
  if (u === 'micro') return 'small'
  if (u === 'medium') return 'medium'
  if (u === 'legendary') return 'keystone'
  if (u.includes('initial') || u === 'entry') return 'entry'
  return 'special'
}

function expectedSlot8x5(x: number, y: number): number {
  return y * 8 + x
}

/**
 * Convert one god-panel tree from the SS11 master bundle into `TalentPanelNode[]`.
 */
export function convertTliSs11GodTreeToPanelNodes(
  treeDoc: TliSs11TalentTreeDoc,
  panelId: string,
  season: string,
): TalentPanelNode[] {
  const nodes = treeDoc.tree?.nodes
  if (!Array.isArray(nodes) || nodes.length === 0) return []

  const byGuid = new Map<string, TliSs11TreeNode>()
  for (const n of nodes) {
    byGuid.set(n.id, n)
  }

  const nodeIdFor = (tn: TliSs11TreeNode): string => {
    const x = tn.position
    const y = tn.tier
    const slot = expectedSlot8x5(x, y)
    return suggestedNodeId(season, panelId, slot)
  }

  const childrenByGuid = new Map<string, TliSs11TreeNode[]>()
  for (const tn of nodes) {
    for (const p of tn.predecessors ?? []) {
      const g = p.guid
      const list = childrenByGuid.get(g) ?? []
      list.push(tn)
      childrenByGuid.set(g, list)
    }
  }

  const presentationFor = (tn: TliSs11TreeNode): { displayLabel?: string; effectLines: string[] } => {
    const mods = Array.isArray(tn.mods) ? tn.mods : []
    const effectLines: string[] = []
    for (const m of mods) {
      if (m && typeof m === 'object') {
        const o = m as Record<string, unknown>
        const desc = typeof o.description === 'string' ? o.description.trim() : ''
        if (desc) effectLines.push(desc)
      }
    }
    const isLegendary = String(tn.type).toLowerCase() === 'legendary'
    let displayLabel: string | undefined
    if (isLegendary && effectLines[0]) {
      const full = effectLines[0]
      displayLabel = full.length > 22 ? `${full.slice(0, 21)}…` : full
    }
    return { displayLabel, effectLines }
  }

  const out: TalentPanelNode[] = []
  for (const tn of nodes) {
    const x = tn.position
    const y = tn.tier
    const slotIndex = expectedSlot8x5(x, y)
    const requiresNodeIds = (tn.predecessors ?? []).map((p) => {
      const parent = byGuid.get(p.guid)
      return parent ? nodeIdFor(parent) : `__missing_parent__:${p.guid}`
    })
    const kids = childrenByGuid.get(tn.id) ?? []
    const edgesTo = kids.map((c) => nodeIdFor(c))
    const { displayLabel, effectLines } = presentationFor(tn)

    out.push({
      panelId,
      affixPending: true,
      x,
      y,
      slotIndex,
      nodeType: tliSs11TypeToNodeType(tn.type),
      maxRank: Math.max(1, Number(tn.maxPoints) || 1),
      requiresNodeIds,
      edgesTo,
      notes: [`tli:ss11:${tn.tlidbId}:${tn.id}`],
      ...(displayLabel ? { displayLabel } : {}),
      ...(effectLines.length > 0 ? { effectLines } : {}),
    })
  }

  return out
}

export function getTliSs11BundleKeyForStem(treeStem: string): string {
  return `talent-tree/${treeStem}/master`
}

/** @deprecated 使用 `getTliSs11BundleKeyForStem` */
export const getTliSs11BundleKeyForGod = getTliSs11BundleKeyForStem
