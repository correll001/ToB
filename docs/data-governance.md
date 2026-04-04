# 資料治理與商業化邊界（Data governance）

技能／戰鬥資料與 **凍結 (freeze)** 細則：**[skill-data-policy.md](./skill-data-policy.md)**。

本文件定義正式產品與維運管線的分界：**runtime 與 build 不依賴外部網站**；第三方站點僅能出現在**離線、人工觸發**的 ETL 流程中，且不得被解讀為官方授權或合作關係。

---

## 1. 運行時資料政策

| 層級 | 行為 |
|------|------|
| **瀏覽器 / Next.js 客戶端** | 只讀已打包之 `lib/gameData/generated/effective-runtime-bundle.json`。不可載入 `better-sqlite3`、不可對賽季資料發起任意線上抓取。 |
| **伺服端（若擴充）** | 僅讀本地資產或已內建之 bundle；不得將 TLIDB 等第三方作為線上依賴服務。 |
| **SQLite**（`data/local/game.db`） | 離線匯入後之驗證、比對或內部工具用途；**不**作為給終端使用者的線上 API 後端契約。 |

**ETL**（`scripts/etl/*`）只做離線資料整理：可存取曾經抓取的快照與公開頁面（依內部法務政策），但**不是** production dependency。禁止把 ETL 掛在 `postinstall`、`next build` 或應用啟動路徑上。

**Season 更新**：由維運以人工流程執行（離線 ETL → normalize → apply overrides → 匯入本地 DB 與 bundle → 提交版本控管）。

---

## 2. 技術防線（稽核指令）

| 指令 | 目的 |
|------|------|
| `npm run audit:no-external-runtime-fetch` | 掃描 `app/`、`components/`、`hooks/`、`lib/runtime/`、`lib/formula/`、`stores/` 內 TS/TSX，禁止出現 `tlidb.com`（註解逃逸：`data-policy-allow`）。 |
| `npm run check:data-policy` | 較廣：含整個 `lib/`、`selectors/` 等，同樣禁止未標註之 `tlidb.com`。 |
| `npm run data:verify:local` | 驗證 `data/effective/{season}/manifest.json` 筆數與 JSON 檔一致；SQLite active dataset 與來源 skills 列數一致；`global_rules` 齊備；`effective-runtime-bundle.json` 之 `datasetVersion` 與 DB active 列一致；`RUNTIME_GAME_DATA_SEASON` 與 bundle season 一致。 |

產品建置與執行**不得**在 CI 中對外站做賽季抓取；若需更新資料，在維運環境離線跑 ETL 後再提交產物。

---

## 3. 維運-only 腳本

以下目錄之腳本標為 **MAINTENANCE-ONLY**，不構成 runtime 依賴：

- `scripts/etl/*` — 索引/頁面抓取、normalize、apply overrides、diff
- `scripts/import/*` — 將 `data/effective/{season}` 寫入 SQLite 與生成 bundle

應用程式碼**不得** `import` 上述模組進可上架 bundle 之路徑。

---

## 4. 內部溯源 UI

- 路徑：**`/debug/dataset`**（`robots: noindex`）
- 顯示：bundled `schemaVersion`、`datasetVersionId`、`season`、`versionLabel`、`imported_at`、`sourceKind`、override 報告之 schema 版本與時間（若有）
- 文案避免「官方授權」「合作夥伴資料庫」等易誤解用語；僅陳述**本產品使用已匯入之本地結構化衍生資料**

開發模式下，編輯器頁首可提供連往此頁之內部連結（不對一般使用者宣傳）。

---

## 5. Release / 賽季迴歸檢查清單（Regression checklist）

新賽季或大幅資料更新時，建議依序執行：

1. 離線執行 ETL / 更新 raw 快照（僅維運環境）
2. `npm run etl:normalize`（或專案既有 normalize 指令）
3. `npm run etl:apply-overrides`
4. 確認 `data/effective/{season}` 已齊備（含 `manifest.json`、`override-report.json` 若適用）
5. `npm run data:import:effective -- --season=<season>`（產生 bundle + 寫入 DB）
6. 更新 `lib/gameData/gameDataConfig.ts` 之 `RUNTIME_GAME_DATA_SEASON` 與實際 season 一致
7. `npm run data:verify:local -- --season=<season>`
8. `npm run check:skill-engine`
9. `npm run audit:no-external-runtime-fetch`
10. `npm run check:data-policy`
11. `npm run build`（確認不依賴外站）

進階一次驗證：`npm run release:check`（含上述多數步驟與 production build）。

---

## 6. 法務 / 公關內部備忘（非對外文案）

- 公開資料來自**曾抓取之網頁經內部結構化整理**之衍生資料集；**非**即時轉載或官方 API 綁定。
- 商業發行前應自確認：衍生使用範圍、是否需另行授權、展示之數值/名稱是否觸及商標或不實關聯。
- 對外溝通應避免暗示「官方授權資料庫」；技術上亦**不**對該站點產生終端用戶請求負載。

更簡要條列可併見：[4C-commercial-data-safeguards.md](./4C-commercial-data-safeguards.md)（本檔為**主文件**）。

---

## 7. 已知剩餘風險（須由業務/法務把關）

- Bundle 內 skill **溯源欄位**（例如歷史 `sourceUrl`）仍可能含有第三方網址字串；屬**靜態留存**，不觸發連線。若法務要求，可在匯出給對外的 build 前做 strip 或改內部 ID。
- ETL 歷史與 `data/raw` 中可能含原始 HTML；repo 釋出範圍與保存政策須內部決策。
- 產品描述行銷文案與遊戲本體之區隔，需 PR 審核，與本 repo 技術邊界無關但影響整體風險。
