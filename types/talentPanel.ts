/**
 * Manual talent / god-panel topology (structure layer).
 * References `talent-affixes.json` by `affixId` / `affixGameDataId`, or `affixPending` for topology-only rows.
 * @see docs/talent-panels/manual-input-rules.md
 */

export type TalentPanelSourceKind = 'god_panel' | 'special_panel' | 'unresolved'

/**
 * Node role on the 8×5 grid. Use `special` when unsure until manual data clarifies.
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
  gridWidth: 8
  gridHeight: 5
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
  /** UI 分組：六神牆 vs 進階職業牆（可選）。 */
  talentWallGroup?: 'base_god' | 'profession'
}

export type TalentAffixSourceTabForNode = 'core_talent' | 'talent_tree'

export type TalentPanelNode = {
  /**
   * Stable id. Omit to auto-use `talnode:{season}:{panelId}:s{slotIndex}` (recommended for hand entry).
   */
  nodeId?: string
  panelId: string
  /**
   * Full key into `talent-affixes.json`. Omit if using `affixGameDataId` (+ disambiguation).
   */
  affixId?: string
  /**
   * TLIDB `gameDataId` from a talent affix row (shorter than `affixId`).
   * If it maps to both core + tree rows, set `affixSourceTab`.
   */
  affixGameDataId?: string | null
  /** Required when `affixGameDataId` matches more than one affix (typically core vs tree). */
  affixSourceTab?: TalentAffixSourceTabForNode | null
  /**
   * When true: no `affixId` / `affixGameDataId` required yet (topology-only ingest, e.g. TLI SS11 → grid).
   * Remove once each node is linked to `talent-affixes.json`.
   */
  affixPending?: boolean
  x: number
  y: number
  slotIndex: number
  nodeType: TalentPanelNodeType
  /** Points / ranks allocatable on this node; must be >= 1. */
  maxRank: number
  /**
   * 格上顯示用短標題（如傳奇／傳奇天賦節點的獨特效果摘要開頭）。
   * 一般節點可省略，仍以類型縮寫顯示。
   */
  displayLabel?: string
  /** 滑鼠懸浮提示：效果條列（多為 TLI `mods.description`）。 */
  effectLines?: string[]
  /** Direct prerequisite nodes on the same panel only (immediate parents). */
  requiresNodeIds: string[]
  /** Directed edges to other nodes on the same panel (graph hints; no cross-panel). */
  edgesTo: string[]
  /** 維護者備註即可，常為 []；顯示用說明請從 talent-affixes 依 affix 引用取得。 */
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
  /**
   * 可選：給維護者的中文說明段落（驗證會忽略；前端顯示詞綴時應讀 `talent-affixes.json`，不必展示此欄）。
   */
  readMeZh?: string[]
  sourceNote: string
  nodeCount: number
  nodes: TalentPanelNode[]
}
