# 4F 發版驗收（全技能 coverage gate / Inspected）

本文件對齊 **4F-8**：release gate **不再只保護 P0**，而是以 **effective-runtime-bundle 全量 active / support / passive** 加上引擎探針作為硬性門檻。ETL／parser 實作變更不在此重述；此處只定義 **離線驗收與不可發版條件**。

## 資料更新流程（與 runtime 分離）

1. **維護**：在 `data/overrides/ss12/` 等路徑調整資料；若跑 ETL，在**有網路**的環境執行，產物回到 repo 內嵌 bundle。（**首次抓取與週期性更新**只發生在這裡；**上線產品 runtime 不讀即時站點** — 見 `docs/skill-data-policy.md` 4F-9。）
2. **匯入有效 bundle**：`npm run data:import:effective`（或團隊既有流程），目標產物為 `lib/gameData/generated/effective-runtime-bundle.json`。
3. **凍結／DB**（若使用）：`npm run data:freeze:from-effective`、`npm run data:verify:frozen`。
4. **發版前**：必跑 **`npm run verify:4f`** 與（完整釋出）**`npm run release:check`**（已含 `data:verify:dataset-governance`）。

### 4F-9 — Dataset freeze / governance（固定動線）

| 步驟 | 指令 / 目的 |
|------|-------------|
| 列出版本與備援標籤 | `npm run data:list-dataset-versions -- --season=ss12`（`*` = 目前 active） |
| 凍結 effective → SQLite + `data/frozen/...` | `npm run data:freeze:from-effective -- --season=ss12`（可選 `--version-label=`） |
| 驗證凍結鏈（`frozen_at`、disk manifest、`provenance_json` 一致） | `npm run data:verify:frozen -- --season=ss12` |
| 驗證 bundle 與 DB active 列一致 | `npm run data:verify:local` |
| 驗證 active 切換 / 回滾 API（≥2 筆版本時實測；僅一筆時跳過切換） | `npm run data:verify:dataset-governance -- --season=ss12` |
| 實際回滾（人工作業） | `npm run data:import:effective -- --set-active --season=ss12 --version-label=<先前標籤>` → 再依 SOP 重產 bundle |

產品對外敘述：**runtime 只吃本地 frozen / effective / bundle**；provenance（`season`、`versionLabel`、`importedAt`、`sourceKind`、`overrideReport` / `provenance.override`）可追溯，見 policy 表。

## 全技能驗收指令（4F-8）

```bash
npm run verify:4f
```

建議至少在以下時機執行：

- 更新 bundle 或任何會影響 normalized 技能 JSON 的變更之後。
- 修改 `lib/formula`、`selectors/buildComputedStats`、inspected 相關邏輯之後。

`verify:4f` 內含（順序簡述）：

| 步驟 | 指令 / 作用 |
|------|-------------|
| Coverage gate（硬性門檻） | `verify:full-skill-coverage-gate` — 讀取 `fullSkillCoverageContract.ts` 閾值 |
| Integrity + P0 + 全技能 selector sweep | `verify:skill-data-integrity` |
| 技能迴歸 | `verify:skill-regression` |
| Inspected 快速案例 | `verify:inspected-skill-selectors` |
| P0 深度等級列 | `verify:p0-active-level-tables`（精選主技能 L10/L20 差分） |
| Runtime 遠端抓技能稽核 | `audit:no-runtime-remote-skill-fetch` |

**報表（非硬性 gate，輔助看退步）**：

```bash
npm run report:full-skill-coverage
```

## Gate 條件摘要（`fullSkillCoverageContract.ts`）

以下任一惡化超過閾值 → **`verify:full-skill-coverage-gate` / `verify:skill-data-integrity` 失敗**：

- **`parseStatus === failed'` 筆數 > 0**（絕不可發版）。
- **全檔 `ok` 比例**低於約 **82%**（抓大量 parser 退步；與目前 bundle baseline 留有緩衝）。
- **任意 active** 缺少可接受的等級表面（空 `levelTable` 且無 breakpoints／無文件化 opt-out）。
- **任意 active** 在 Lv20 **無法 resolve 等級列**（且無 `unsupportedLevelDataReason`）。
- **任一 support** 同時 **無 modifiers 且無有效 `supportRules`**（無法配對／無結構化效果 — 「both hollow」）。
- **任一 `damaging` 主技能** 在隔離 Lv20 探針下 **instance 非 `ready`**。
- **任一 passive** `parseStatus === ok` 但 **無可注入 modifier 路徑**（與引擎 passive 注入合約衝突）。

警告（**不中斷**，但應在報告中追蹤）：例如大量 support 仅有 modifiers 而 **weak rules**、大量 partial passive 無結構 inject 等 — 見 gate 輸出 `WARN`。

## 哪些 partial 可接受

- **Partial parse**：允許存在於大量被動／輔助／邊角技能；但 **不可** 因此讓 **`failed`** 變多；且 **ok 比例不得低於 gate**。
- **Inspected `damaging` + `estimate` / effective `partial`**：產品上可接受，**只要** UI 不標為權威、且 **不以** `support-only` / `aura-only` 等模式顯示主 DPS 卡（由 `verify:inspected-skill-selectors` + `skillRegressionCases` + 全量 sweep 守護）。
- **P0 深度表**：`verify:p0-active-level-tables` 僅涵蓋精選 ID；**全量結構**以 **`fullSkillCoverageContract`** 為準。

## 絕對不可發版（與 4E 對齊處強調）

- **`parse failed`** 出現在任何技能列上。
- **Support `both hollow`**（無 modifier、無規則）新增或上升超過閾值。
- **Active 等級列結構**大面積消失（缺表、Lv20 無列）。
- **Remote fetch** 進入 runtime 讀技能（`audit:no-runtime-remote-skill-fetch` 失敗）。
- **全技能 inspected selector** 對任一主技能／任一 support 假主槽 **throw**，或 **support 主槽誤顯 `damaging` 主卡**（fabrication）。

## 與 4E checklist 的關係

- **4E**：見 `docs/4e-release-checklist.md`（舊有敘述與 UI 原則）。
- **4F**：以本文 **`verify:4f` + 全量 contract** 為技能資料與公式層 release 主軸；`release:check` 已改為在資料驗證段落依賴 **`verify:4f`**，並在 **`data:verify:local` 之後執行 `data:verify:dataset-governance`**（4F-9）。
