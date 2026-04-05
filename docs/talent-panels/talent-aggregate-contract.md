# Talent aggregate contract（純資料）

輸入：`TalentAggregateInput`（`types/talentAggregate.ts`）

- `season`
- `ranksByNodeId`: 已點 nodeId → 階級（≥1 才計入）
- `nodes`: 完整 `TalentPanelNode[]`（需含 `mappingStatus` / `affixId` 等）
- `affixById`: `Map<affixId, TalentAffixNormalized>`

輸出：`TalentAggregateResult`

| 欄位 | 意義 |
|------|------|
| `selectedNodes` | 成功納入的節點條目（含 rank、`mappingResolutionSource`: `auto` \| `manual`、affix、modifier 貢獻列表） |
| `resolvedAffixes` | 去重後的 affix 列 |
| `unresolvedNodes` | `mappingStatus` 為 unresolved 或缺 affix 的節點（`mappingResolutionSource: unresolved`） |
| `totals.structuredBuckets` | `aggregateStatBlocks` 合併後的 `AggregatedBuckets` |
| `totals.bucketLinesZh` | 人讀摘要（與 talent wall rollup 同源 helper） |
| `totals.rawUnbucketed` | 未入引擎桶：node 英文行、無 stub 的 affix 描述、pending 節點效果等 |
| `perPanel` | 分面板桶與 raw 行；`nodeIdsByMappingSource` 區分 auto / manual / unresolved |
| `perNode` | 與 `selectedNodes` 相同參考（明細） |

**非目標**：最終 DPS、技能 hit、combat-rules blocked 項。

實作：`lib/talent/aggregateSelectedTalents.ts`  
煙霧：`npm run verify:talent-aggregate-smoke`
