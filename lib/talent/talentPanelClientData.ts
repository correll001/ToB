/**
 * Client-safe static imports of normalized talent panel JSON (bundled with the app).
 */
import type { TalentPanelDef, TalentPanelNode, TalentPanelNodesFile, TalentPanelsFile } from '@/types/talentPanel'

import panelsJson from '@/data/normalized/ss12/talent-panels.json'
import nodesJson from '@/data/normalized/ss12/talent-panel-nodes.json'

export const TALENT_PANELS_FILE = panelsJson as TalentPanelsFile
export const TALENT_PANEL_NODES_FILE = nodesJson as TalentPanelNodesFile

export const TALENT_PANEL_SEASON = TALENT_PANELS_FILE.season

/** 神牆 + 職業天賦牆（`sourceKind === 'god_panel'`），依 `canonicalOrder` 排序。 */
export const GOD_PANELS_SORTED: TalentPanelDef[] = [...TALENT_PANELS_FILE.panels]
  .filter((p) => p.sourceKind === 'god_panel')
  .sort((a, b) => (a.canonicalOrder ?? 999) - (b.canonicalOrder ?? 999))

export function nodesForPanel(panelId: string): TalentPanelNode[] {
  return TALENT_PANEL_NODES_FILE.nodes.filter((n) => n.panelId === panelId)
}

export function suggestedTalentNodeId(panelId: string, slotIndex: number, season = TALENT_PANEL_SEASON): string {
  return `talnode:${season}:${panelId}:s${slotIndex}`
}

export const GRID_WIDTH = 8
export const GRID_HEIGHT = 5
