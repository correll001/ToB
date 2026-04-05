# 未入桶與資料缺口盤點（talent / passive / source）

本報告依 **repo 內實際檔案**（2026-04-05 狀態）歸類，並標 **必做 / 次要 / 可延後**。**本卡未改** `computeDerivedCombat`、`combat-rules`、左側全局傷害面板、Skill Setup。

---

## 1. Talent：node ↔ affix mapping

| 現況 | 證據 |
|------|------|
| 875 nodes 已寫入 `mappingStatus`；自動層 + **人工裁決**後 resolved 數見最新 `talent-node-affix-map-report.json`（含 `resolvedByManualAdjudication`） | 同左 + `data/manual/ss12/talent-node-affix-adjudications.json` |
| 主因 `no_affix_text_match`（**515**） | 英文 `effectLines` → 中文譯句與 TLIDB 繁中正文無法逐行包含關係，或譯表缺行 |
| 次因 `multiple_candidates_same_text_modifiers_tie`（**56**） | 多筆 affix 共享可通過子字串測試的模板化描述 |
| `missing_effect_lines_anchor`（**58**） | 節點無 `effectLines`（無法做確定性文字錨點） |
| `normalized_text_talent_tree` **244**；`constrained_fallback_unique` **2** | 同報告 `byConfidence` |

**優先級**

- **必做**：擴充可驗證的 `EXACT_LINE_ZH` / `PHRASE`（`lib/talent/talentEffectLineZh.ts`），並重跑 apply；對 `multiple_candidates_*` 使用 **`talent-node-affix-adjudications.json` 人工裁決**或外部 id 表（非模糊匹配）。未決清單：`npm run review:talent-node-affix-unresolved`。
- **次要**：在 `notes` 或獨立 manifest 中保留 TLI `tlidbId` 與未來官方 id 的對照欄位（**不**刪現有追溯字串）。
- **可延後**：跨 season SS11→SS12 全文自動對齊（僅在官方對照表齊備後）。

---

## 2. Talent：canonical stat bucket（結構化加成）

| 現況 | 證據 |
|------|------|
| `affix.modifiers` → `statBlocksFromAffixModifiers` 僅覆蓋少數 label 規則 | `lib/talent/affixModifiersToStatBlocks.ts` |
| 無 stub 或 stub 未入桶的 affix 正文進 `rawUnbucketed` | `lib/talent/aggregateSelectedTalents.ts`（`descriptionLines` 後備列） |
| 聚合器**不**宣稱等價最終 DPS | `types/talentAggregate.ts` + `aggregateSelectedTalents` 註解 |

**優先級**

- **必做**：為高頻 `labelZh` 增量補規則前，先維持 **rawUnbucketed**；任何新 bucket 規則須可重現、可測。
- **次要**：將 `TalentAffixModifierStub.kind === 'unknown'` 與條件句效果統一標記為未入桶。
- **可延後**：與 `combat-rules` 的細節對齊（見下「禁止合併範圍」）。

---

## 3. Tag normalization

| 現況 | 證據 |
|------|------|
| Panel / affix 使用 `deity:God_of_Might` 與 `god_God_of_Might` 兩套命名；mapping 以程式轉換對齊 | `deityTagFromPanelId`、`convertTliSs11GodPanels.ts` |
| `talent-affixes` 另有 `profession` / `new_god_related` 等 availability；**未**與 node 強綁 | `types/talentAffix.ts` |

**優先級**

- **次要**：文件化「panelId ↔ deity tag」單一函式為準，避免第二套 ad-hoc 字串。
- **可延後**：全庫 tag 統一命名（影響面大）。

---

## 4. Source mapping（sourceTab / sourceKind）

| 現況 | 證據 |
|------|------|
| Node 預設對應樹上列；僅在樹上無命中時嘗試 `core_talent_node` | `mapTalentNodesToAffixes.ts` |
| 同 gameDataId 多列（樹/核心）**不**自動合併 | `talent-affixes.json` notes、`mapTalentNodesToAffixes` 策略 |

**優先級**

- **必做**：多候選時維持 unresolved；若將來引入外部錨點，須寫入 `affixSourceTab` / `affixId` 並更新 verify。
- **可延後**：自動偵測 sourceTab 衝突報表 UI。

---

## 5. Passive skills（broader repo）

| 現況 | 證據 |
|------|------|
| `passive-skills.json` manifest 摘要：**0 ok，55 partial** | `data/normalized/ss12/manifest.json` |

**優先級**

- **必做（被動線）**：與本 talent 卡**分離**；本卡不處理。
- **可延後**：被動與 talent 聚合統一 UI。

---

## 6. Combat rules（blocked / gap）

| 現況 | 證據 |
|------|------|
| 大量機制在 `combat-rules-gap-list.md` 列為 blocked / partial | `docs/combat-rules-import/combat-rules-gap-list.md` |

**優先級**

- **禁止本卡處理**：不改 combat rules 管線、不補 blocked 演算法。
- **可延後**：talent 聚合結果僅作「展示用加成」，與 4E 引擎分軌。

---

## 7. 禁止改動範圍（重申）

- 不重做戰鬥引擎、不改 `computeDerivedCombat`、不改左側全局傷害面板、不改 Skill Setup。
- 不重爬 TLIDB、不重寫 `etl:talent-affixes` 主鏈；僅允許**最小**增量（如譯表、schema 欄位）。
- 不丟失 TLI `notes` 追溯、不將 8×5 拓撲改回 3×6。

---

## 8. 驗收對照（本 repo 指令）

| 指令 | 用途 |
|------|------|
| `npm run verify:talent-node-affix-mapping` | 每 node 必為 resolved（合法 affixId）或 unresolved（有 reason） |
| `npm run verify:talent-panels` | 拓撲與引用一致性 |
| `npx tsx scripts/verify/talentAggregateSmokeTest.ts` | 聚合器結構煙霧測試 |
