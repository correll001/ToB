/**
 * Pure-data contract for aggregating selected talent-panel nodes (no DPS / combat engine).
 * @see lib/talent/aggregateSelectedTalents.ts
 */

import type { TalentAffixNormalized } from '@/types/talentAffix'
import type { TalentPanelNode } from '@/types/talentPanel'
import type { AggregatedBuckets } from '@/types/combat'

/** 節點→affix 對應來源（聚合層不重算 mapping，只讀 node 欄位）。 */
export type TalentAggregateMappingSource = 'auto' | 'manual' | 'unresolved'

/** 單一節點在聚合中的條目。 */
export type TalentAggregateNodeEntry = {
  nodeId: string
  panelId: string
  slotIndex: number
  rank: number
  /** auto = 自動層 resolved；manual = manual_adjudicated；unresolved 不會進此條目。 */
  mappingResolutionSource: Extract<TalentAggregateMappingSource, 'auto' | 'manual'>
  rawNode: TalentPanelNode
  affix: TalentAffixNormalized | null
  /** 可進引擎桶的 StatBlock 路徑已嘗試；此處保留 affix 原始 stub 與倍率。 */
  modifierContributions: Array<{
    affixId: string
    modifierIndex: number
    effectiveWeight: number
    stubKind: string
    labelZh: string
    value?: number
  }>
}

export type TalentAggregateRawLine = {
  source: 'node_effect' | 'affix_unbucketed_modifier' | 'unresolved_node'
  nodeId: string
  panelId: string
  lineZh: string
  detail?: string
}

export type TalentAggregatePerPanel = {
  panelId: string
  nodeIds: string[]
  /** 本 panel 內已選節點 id，依 mapping 來源分（僅統計有 rank 且進入聚合流程者）。 */
  nodeIdsByMappingSource?: {
    auto: string[]
    manual: string[]
    unresolved: string[]
  }
  structuredBuckets: AggregatedBuckets
  bucketLinesZh: string[]
  rawUnbucketedLines: TalentAggregateRawLine[]
}

export type TalentAggregatePerNode = TalentAggregateNodeEntry

export type TalentAggregateTotals = {
  structuredBuckets: AggregatedBuckets
  bucketLinesZh: string[]
  rawUnbucketed: TalentAggregateRawLine[]
}

export type TalentAggregateInput = {
  season: string
  /** 已點節點 id → 階級（至少為 1 才視為投入）。 */
  ranksByNodeId: Record<string, number>
  nodes: TalentPanelNode[]
  affixById: Map<string, TalentAffixNormalized>
}

export type TalentAggregateResult = {
  selectedNodes: TalentAggregateNodeEntry[]
  resolvedAffixes: TalentAffixNormalized[]
  unresolvedNodes: Array<{
    nodeId: string
    panelId: string
    reason: string | null
    mappingResolutionSource: Extract<TalentAggregateMappingSource, 'unresolved'>
    rawNode: TalentPanelNode
  }>
  totals: TalentAggregateTotals
  perPanel: TalentAggregatePerPanel[]
  perNode: TalentAggregatePerNode[]
}
