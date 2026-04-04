# 4C — 商業版資料與法務防線（離線資產）

**主文件（含 release checklist、稽核指令、維運邊界）請見：** [data-governance.md](./data-governance.md)

## 產品保證

- **正式前端與 runtime** 只讀 **`lib/gameData/generated/effective-runtime-bundle.json`**（由離線匯入產生）；**不得**在瀏覽器載入 `better-sqlite3`，也**不得**在線上存取 `tlidb.com`。
- **SQLite**（`data/local/game.db`）為資料資產與驗證／後台用途；產品 UI 之客戶端 bundle **不依賴** DB 檔案路徑。
- **更新流程（人工）**：`data/effective/{season}`（ETL 產物）→ `npm run data:import:effective` → 更新 bundle + DB → 提交 → `npm run build`。
- **ETL**（`scripts/etl/*`）僅供內部／離線維運。**禁止**將 ETL 掛在 `postinstall`、`next build` 或應用啟動路徑上。

## 合規檢查

```bash
npm run audit:no-external-runtime-fetch
npm run check:data-policy
```

前者限定 runtime 相關子路徑；後者涵蓋整個 `lib/` 等。若某行確屬說明註解，可於該行加上 `data-policy-allow`。

## 資料來源聲明

目前 `effective` JSON 係由內部工具自公開網頁產生之**結構化衍生資料**；商業發行前應由法務確認：授權範圍、是否需另行取得資料授權、以及展示文案與衍生數值之歸屬。本 repo **不提供**對外即時轉載 HTML 之能力，以降低「整頁重製」風險。

## 賽季更新

1. 離線執行 ETL / normalize / `etl:apply-overrides`  
2. 產出之 `data/effective/{season}` 納入版控或建置 artifact  
3. `npm run data:import:effective -- --season=ss13`（會寫入 DB 並重新產生 `effective-runtime-bundle.json`）  
4. 更新 `RUNTIME_GAME_DATA_SEASON`（`lib/gameData/gameDataConfig.ts`）與 bundle 內 season 一致  
5. `npm run data:verify:local`、`npm run audit:no-external-runtime-fetch`、`npm run build`、`npm run check:data-policy`（或一次 `npm run release:check`）  

### 切換 active dataset（同季多版本）

- 匯入時預設 **`--activate`** 會將該 `version_label` 設為唯一 `is_active=1`。  
- 僅切換指標、不重新匯入：`npm run data:import:effective -- --set-active --season=ss12 --version-label=<label>`
