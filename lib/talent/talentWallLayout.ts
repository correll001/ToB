/**
 * Main talent grid 8×5（含牆上傳奇節點）；右側 5×2 在 UI 上為「具名頂級天賦」槽，不併入座標過濾。
 */
import type { TalentPanelNode } from '@/types/talentPanel'

export const MAIN_GRID_COLS = 8
export const MAIN_GRID_ROWS = 5
/** 右側具名頂級天賦區（與主格並列顯示）。 */
export const LEGEND_STRIP_COLS = 3
export const LEGEND_STRIP_ROWS = 2
export const LEGEND_STRIP_SLOTS = LEGEND_STRIP_COLS * LEGEND_STRIP_ROWS

export function nodesForMainGrid(nodes: TalentPanelNode[]): TalentPanelNode[] {
  return nodes.filter((n) => n.x >= 0 && n.x < MAIN_GRID_COLS && n.y >= 0 && n.y < MAIN_GRID_ROWS)
}
