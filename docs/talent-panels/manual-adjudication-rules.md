# 人工裁決（manual adjudication）規則

## 定位

人工裁決是**資料治理工具**，用來在**自動對應層**（`mapTalentNodesToAffixes.ts`）無法安全唯一決定時，由人類以**可審計**方式補上 `nodeId → affixId`。

- **不是**遊戲內建真值，也**不可**偽裝成自動 exact match。
- 套用後節點標記為 `mappingConfidence: manual_adjudicated`，並寫入 `mappingAdjudicationId`。

## 資料檔

- 裁決表：`data/manual/ss12/talent-node-affix-adjudications.json`
- 套用腳本：`scripts/ingest/applyTalentNodeAffixMapping.ts`（先跑自動層，再套 approved 列）
- 驗證：`scripts/verify/verifyTalentNodeAffixMapping.ts`
- 未決清單產出：`scripts/verify/reviewTalentNodeAffixUnresolved.ts` → `talent-node-affix-unresolved-review.{json,md}`

## 何時允許人工裁決

- 節點在自動層為 **unresolved**（例如 `multiple_candidates_*`、`no_affix_text_match`），且你能提出**至少一條可核對的 evidence**（例如：候選 A 多了一條節點沒有的屬性、TLIDB 列與 TLI 英文行可逐句對上、官方對照表截圖／連結等）。
- 已為 **manual_adjudicated** 的節點：可**更新**裁決列（同 `nodeId` 僅能有一筆 **approved**，且與節點狀態一致）。

## 何時必須維持 unresolved

- 多個候選在文字與結構化欄位上**無法用 evidence 排除**，只剩「看起來像」或 displayName 聯想。
- 只有語意相似、沒有**可重現**錨點（effectLines、TLIDB 正文差異、官方 id）時。
- 任何會**覆蓋**自動層已 `normalized_text_*` / `constrained_fallback_unique` 的情況（腳本會 **fail**，禁止靜默覆寫）。

## 與自動層的優先順序

1. 每次 ingest **重新計算**自動對應（依目前 `effectLines` / `panelId`）。
2. 僅對 **unresolved** 或 **已是 manual_adjudicated** 的節點套用 approved 裁決。
3. 若裁決列與「自動高信心 resolved」衝突 → **整批 ingest 失敗**，不寫入 `talent-panel-nodes.json`。

## 新增 / 修改 / 作廢裁決

- **新增**：在裁決表新增一筆，`reviewStatus: approved`，填滿 `sourceAnchor`（應與當時節點一致）、`evidence`、`reviewedBy`、`updatedAt`。
- **修改**：同一 `adjudicationId` 更新內容並 bump `updatedAt`；或作廢舊 id、建新 id（節點上 `mappingAdjudicationId` 需同步）。
- **作廢**：將列改為 `rejected`，並重跑 ingest；節點會回到自動層結果（若仍 unresolved 則維持 unresolved）。

## 有效證據（evidence）示例

- 「候選 `10050100` 的 `rawText` 含 `+2% 移動速度`，節點 `effectLines` 僅 `+9% Attack Damage`，故排除。」
- 「TLIDB core talent `10001300` 正文含 `+1 堅韌祝福層數上限`，與 TLI 英文 `+1 to Max Tenacity Blessing Stacks` 機制一致。」

## 未來若有外部 node↔gameDataId 表

- 應**優先**把該表納入自動層或獨立「exact key」步驟，使人工裁決列可逐步刪減。
- 過渡期可並存：外部鍵 resolved 標為自動 confidence（未來實作），與 `manual_adjudicated` 分開統計。

## 重申（本卡邊界）

- 不改 TLI 拓撲、`effectLines`、`notes` 原意；不重做 talent-affix ETL；不碰戰鬥引擎與左側全局傷害面板。
