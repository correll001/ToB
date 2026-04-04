# 4E 發版與驗收（技能系統 / Inspected / Support）

本文件對齊 4E-6：**所有列出的 verify／audit 皆可離線執行**（不依賴外網）。ETL／爬蟲不在此發版捷徑內。

## 資料更新流程（與 runtime 分離）

1. **維護期**：在 `data/overrides/ss12/` 調整 P0 active／support／global-rules；必要時跑 ETL（有網路需求時在獨立環境執行，勿把 runtime 路徑接上 TLIDB）。
2. **匯入有效 bundle**：`npm run data:import:effective`（或由團隊固定流程產生 `lib/gameData/generated/effective-runtime-bundle.json`）。
3. **凍結／DB**（若專案使用）：`npm run data:freeze:from-effective`、`npm run data:verify:frozen`。
4. **發版前**：務必跑下方「發版必跑指令」；通過後才視為該版 skill / inspected 行為受控。

## 絕對禁止：Runtime 遠端抓技能資料

- **App / components / hooks / stores / selectors / `lib/runtime` / `lib/formula`** 內不得對 TLIDB 或其它遠端發起技能資料請求。
- 已用 **`npm run audit:no-runtime-remote-skill-fetch`** 與 **`npm run audit:no-external-runtime-fetch`** 掃描；CI／`release:check` 會掛住違規。
- `sourceUrl` 僅可出現在歸檔 JSON／ETL 產物，不得成為客戶端 fetch 目標。

## 發版前必跑指令

**4F 全技能 coverage gate（推薦列為技能釋出主驗收）**：

```bash
npm run verify:4f
```

說明見 **`docs/4f-release-checklist.md`**（全 bundle 門檻、partial 可接受範圍、絕對不可發版條件）。

**單一 4E 技能驗收子集**（無 audit、無資料庫、無 build，適合快速迴歸；內容含舊有 structural / level-row 等）：

```bash
npm run verify:4e
```

**完整發版門檻**（與 `package.json` 內 `release:check` 一致）：

```bash
npm run release:check
```

其內容包含（順序簡述）：

- `audit:no-external-runtime-fetch`
- `check:data-policy`
- `data:verify:local`
- **`verify:4f`**（`verify:full-skill-coverage-gate`、`verify:skill-data-integrity` 含全技能 selector sweep、`verify:skill-regression`、`verify:inspected-skill-selectors`、`verify:p0-active-level-tables`、`audit:no-runtime-remote-skill-fetch`）
- `verify:active-skill-structural`
- `verify:level-row-confidence`
- `check:skill-engine`
- `npm run build`

## P0 合約（由 `verify:skill-data-integrity` + `verify:p0-active-level-tables` 守護）

- **P0 active**（`scripts/verify/p0SkillIds.ts`）：bundle 內需存在，且 **`levelTable` 不可為空**（與 `data/overrides/ss12/active-skills.json` 意圖一致）。
- **P0 support**：**`modifiers` 與 `supportRules` 不可同時為空**（至少一邊要有可結構化配對或數值，见 4E-2 overrides）。

**4F-8 補充**：**全技能**等級列／support hollow／passive inject／parse 比例等，改由 `scripts/verify/fullSkillCoverageContract.ts` 與 **`npm run verify:4f`** 守護；P0 仍保留為「高精度試玩主技能」迴歸。

## partial / unsupported 的 UI 原則（4E-4 / 4E-5）

- **`ready`**：僅在 instance 與 derive 層均就緒時，主 DPS 卡以「權威」呈現。
- **`partial`**：可顯示**估算**，但必須有**缺失／fallback 說明**；不可暗示與客戶端完全一致。
- **`unsupported`**：**不得**用主 DPS 卡冒充精算；改走 `dpsBlocked` 或非傷害說明面板。
- **support-only／aura-only／utility／unknown**：**不得**進入 `damaging` inspected mode；避免純輔助／光環誤顯示假 DPS。

## Release gate 能擋下的典型退化

| 風險 | 守門腳本 |
|------|-----------|
| Runtime 遠端抓技能／TLIDB | `audit:no-runtime-remote-skill-fetch` |
| P0 技能缺 levelTable 或 support 空洞 | `verify:skill-data-integrity` |
| Inspected selector 丟例外 | `verify:skill-data-integrity`、`verify:inspected-skill-selectors` |
| 純輔助誤顯示 DPS、slot 切換不換結果 | `verify:skill-regression`、`verify:inspected-skill-selectors` |
| Share 碼破壞（在有效槽位有技能時）`inspectedMainSkillSlot` | `verify:skill-data-integrity`、`verify:skill-regression` |

**注意**：`normalizeBuildSnapshot` 的 `finalizeInspectedMainSkillSlot` 在「被檢查槽無技能」時會改指向第一個有技能的槽；因此 **share round-trip 對 `inspectedMainSkillSlot` 的測試必須在該槽確實配置技能**（見腳本註解）。

## 與既有文件的關係

- 覆蓋率／結構化比例可另跑 `npm run report:structured-skill-coverage`（報告用，非硬性 gate）。
