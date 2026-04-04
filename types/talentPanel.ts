/**
 * Manual talent / god-panel topology (structure layer).
 * References `talent-affixes.json` by `affixId` only — no coordinates in affix library.
 * @see docs/talent-panels/manual-input-rules.md
 */

export type TalentPanelSourceKind = 'god_panel' | 'special_panel' | 'unresolved'

/**
 * Node role on the 3×6 grid. Use `special` when unsure until manual data clarifies.
 */
export type TalentPanelNodeType =
  | 'entry'
  | 'small'
  | 'medium'
  | 'major'
  | 'keystone'
  | 'special'

export type TalentPanelDef = {
  panelId: string
  displayName: string
  season: string
  gridWidth: 3
  gridHeight: 6
  sourceKind: TalentPanelSourceKind
  /** True: coordinates and edges are hand-authored, not inferred from TLIDB. */
  manualTopology: true
  /** Long-form author notes (e.g. partial coverage, TBD boards). */
  notes: string[]
  /** Optional stable ordering for UI or docs (lower first). */
  canonicalOrder?: number
  /** Whether this panel is a fixed in-game tree (expected true for god boards). */
  isFixedTree?: boolean
  /** Free tags, e.g. deity:God_of_Might */
  tags?: string[]
}

export type TalentPanelNode = {
  /** Stable id; recommended: talnode:{season}:{panelId}:s{slotIndex} */
  nodeId: string
  panelId: string
  affixId: string
  x: number
  y: number
  slotIndex: number
  nodeType: TalentPanelNodeType
  /** Points / ranks allocatable on this node; must be >= 1. */
  maxRank: number
  /** Direct prerequisite nodes on the same panel only (immediate parents). */
  requiresNodeIds: string[]
  /** Directed edges to other nodes on the same panel (graph hints; no cross-panel). */
  edgesTo: string[]
  notes: string[]
}

export type TalentPanelsFile = {
  schemaVersion: 1
  season: string
  /** Human-readable provenance; not fetched from TLIDB in this layer. */
  sourceNote: string
  panelCount: number
  panels: TalentPanelDef[]
}

export type TalentPanelNodesFile = {
  schemaVersion: 1
  season: string
  sourceNote: string
  nodeCount: number
  nodes: TalentPanelNode[]
}
