# Combat rules — import SOP（4E-7）

本 SOP 描述**未來新增或修訂**全局戰鬥規則時的建議流程，與 4E-0～4E-6 產物對齊。**不得**跳過「權威來源 → 機讀結構 → 驗證」鏈而直接在公式或 UI 腦補。

---

## 適用範圍

- **在範圍內**：`rules.structuredCombatRules`（`tob.structuredCombatRules.v1`）、其 `extensions` 各 block、`data/normalized|effective/ss12/combat-rules.json`、runtime bundle、`scripts/verify` 內 combat 驗證。
- **不在本 SOP 的強制步驟**：左側全局傷害面板、任意 React UI（4E 刻意不綁 UI 驗證）。

---

## 流程總覽（順序建議）

```
新增 source（截圖/官方文本索引）
    → 建立或更新轉寫（docs/game-rule-transcripts/*.md）
    → 更新 schema（types/combatRules.ts 等，僅在必要時）
    → ETL 產出 normalized（data/normalized/ss12/combat-rules.json）
    → apply-overrides 產出 effective（data/effective/ss12/combat-rules.json）
    → 匯入 runtime bundle（effective-runtime-bundle.json）
    → 接 runtime getter（runtimeRulesLookup 等，僅暴露資料、不偷加公式）
    → 建立或更新 golden cases（scripts/verify/combatGoldenCases.ts）
    → npm run verify:combat-rules（含 sources / runtime / golden）
```

---

## 步驟 1 — 新增 source

1. 在 `data/raw/ss12/global-rules/screenshot-sources.json`（或當季對應 manifest）新增 **可追蹤條目**：`topicId`、`sourceId`、`quoteBlocks` 等。
2. 每個後續出現在 JSON `sources[]` 的區塊必須能指回 **manifest +（建議）轉寫檔**。
3. **禁止**：無 manifest 條目、無法對照截圖/官方頁的「口頭規則」直接進 schema。

---

## 步驟 2 — 建立轉寫

1. 在 `docs/game-rule-transcripts/` 新增或更新對應 **markdown**（條號、原文摘要、譯註需可對回 manifest）。
2. 轉寫中若出現「尚未完整定義演算法」等語句，必須在 ingest 時反映為：
   - `blockedParts` 條目，和/或
   - 子欄位 `status: "blocked_needs_user_rule"` / `"partial"`，
   而**不可**在缺公式時寫死假數字。

---

## 步驟 3 — 更新 schema（若必要）

1. 僅當新規則無法以現有 `CombatRulesExtensions` 表達時，才修改 `types/combatRules.ts`（與相關型別）。
2. 新增欄位時：**預設**應可序列化進 JSON；避免把「僅適用於某引擎內部」的型別塞進 global rules file。
3. **不可**為了「讓 CI 綠」把 `blocked_needs_user_rule` 改成 `ready` 而無新權威條款支撐。

---

## 步驟 4 — 產出 normalized

1. 執行 ETL：`npm run etl:normalize:rules`（實作入口：`scripts/etl/normalizeGlobalRules.ts`，其中會呼叫 `buildStructuredCombatRules` 等）。
2. 產物：`data/normalized/ss12/combat-rules.json`（含 `rules.structuredCombatRules`）。
3. 檢查：每個受影響的 extension block 具 **非空 `sources[]`** 與合法 **`status`**（之後由 `verifyCombatRuleSources` 對 **effective** 再驗一次；normalized 與 effective 差異可用 `npm run report:combat-rules-norm-eff`）。

---

## 步驟 5 — 產出 effective

1. 執行：`npm run etl:apply-overrides`（見 `docs/combat-rules-import/normalized-vs-effective-diff.md`）。
2. 產物：`data/effective/ss12/combat-rules.json`。
3. **注意**：`data/overrides/.../global-rules.json` 的 deep merge 可能覆寫整段陣列；對 `structuredCombatRules` 做 patch 時應**只改明確子路徑**，避免清空子樹。

---

## 步驟 6 — 接 runtime（bundle）

1. 將 effective 資料納入專案慣用之 bundle 流程（例如 `npm run data:import:effective`，詳見 `scripts/verify/debugRuntimeStructuredCombatRules.ts` 註解）。
2. 確認 `lib/gameData/generated/effective-runtime-bundle.json` 內 `combatRules.rules.structuredCombatRules` 存在且與預期一致。
3. **runtime 層**：僅透過 `lib/runtime/runtimeRulesLookup.ts` 等 **getter 暴露資料**；新規則若仍 blocked，**不可**在 getter 內嵌「預設數值公式」。

---

## 步驟 7 — Golden cases

1. 對**已具可驗算條款**的規則，在 `scripts/verify/combatGoldenCases.ts` 新增案例（參考 `combat-rules-golden-cases.md`）。
2. 案例應：
   - 指向明確 **block** 與 **case id**；
   - 優先使用**比例/邏輯**斷言，避免脆弱浮點偶然值；
   - 對仍 **blocked** 的條款：可新增「維持 blocked」類守門（如 `BLOCK_C7`），**不可**假裝已完整實作。
3. 執行：`npm run verify:combat-rules`（已含於 `npm run verify:4e`）。

---

## 提問閘門（強制）

以下情況**必須先取得使用者/規格負責人確認**，不可自行合併：

1. **只知適用性、不知演算法**  
   - 不得在 `lib/formula/**` 撰寫**數值公式**或預設係數。  
   - 允許：`status` / `blockedParts` / helper 內 **TODO + blocked gate**（與 4E-5 一致）。

2. **來源文字與現有實作或舊轉寫衝突**  
   - **不可**默默覆寫程式或舊 JSON。  
   - 應：記錄衝突點、更新轉寫與 manifest、**回問使用者**以哪一版為權威。

3. **想把子條款從 blocked 改為 ready**  
   - 必須同時具備：**新 source + 轉寫條號 +（若可驗）golden case**。  
   - 並更新 `docs/combat-rules-import/combat-rules-gap-list.md` 對應項狀態。

4. **與 gap list 所列機制相關的任何「完整實作」**  
   - 先對照 `combat-rules-gap-list.md`；若該項仍列為未知演算法，**先補規格**再寫程式。

---

## 相關文件與指令（快速索引）

| 資源 | 路徑 / 指令 |
|------|-------------|
| Gap 清單 | `docs/combat-rules-import/combat-rules-gap-list.md` |
| Golden 案例說明 | `docs/combat-rules-import/combat-rules-golden-cases.md` |
| Norm / Eff 差異報告 | `npm run report:combat-rules-norm-eff` |
| 驗證 | `npm run verify:combat-rules` |
| Schema 註記 | `docs/combat-rules-import/schema-notes.md` |

---

## 版本與收斂

- 本 SOP 與 gap list 為 **4E-7** 交付物；後續若季別目錄變更（非 `ss12`），請在複製本流程時更新路徑與 season 變數。
- **4E 系列收斂**：資料鏈、型別、runtime getter、verify 與 gap/SOP 已就緒；**未解項目**僅能透過**補權威規格**推進，不得由實作端發明。
