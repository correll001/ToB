# Talent 詞綴庫 — 匯入說明與驗收（TLIDB /tw/Talent）

**來源（唯一）**：https://tlidb.com/tw/Talent  
**產物**：  
- `data/raw/ss12/talent/talent-affix-source-snapshot.json`（可追溯 raw）  
- `data/normalized/ss12/talent-affixes.json`（扁平詞綴庫）  
**重跑指令**：`npm run etl:talent-affixes`（線上抓取）或  
`npx tsx scripts/etl/ingestTalentAffixLibrary.ts --input=data/raw/ss12/talent/<本機快取>.html`  
**驗證**：`npm run verify:talent-affixes`

---

## 1. 本卡實作了什麼

- 自 TLIDB `Talent` 頁解析 **三個分頁**的扁平列：`Profession /31`、`核心天賦點 /138`、`天賦 /1013`，合計 **1182** 筆可引用列。  
- 產出 **raw snapshot**（保留 HTML 片段、圖示 URL、順序、`data-id` 等）與 **normalized 詞綴庫**（穩定 `affixId`、分類旗標、可選 `%` 修飾符 stub）。  
- **未**實作任何神版節點座標、連線、拓撲、tier 版面或遊戲內點法限制。

---

## 2. 新增／修改了哪些檔案

| 檔案 | 說明 |
|------|------|
| `types/talentAffix.ts` | 型別與 enum |
| `scripts/etl/ingestTalentAffixLibrary.ts` | 抓取／解析／寫入 raw + normalized |
| `scripts/verify/verifyTalentAffixes.ts` | 結構驗證 + 統計 |
| `docs/talent-affixes/schema-notes.md` | affixId／availability／modifiers 規則 |
| `docs/talent-affixes/talent-affix-import-notes.md` | 本文件 |
| `data/raw/ss12/talent/talent-affix-source-snapshot.json` | 必做輸出 |
| `data/normalized/ss12/talent-affixes.json` | 必做輸出 |
| `package.json` | 新增 `etl:talent-affixes`、`verify:talent-affixes` |

**刻意未修改**：左側全局傷害面板、Skill Setup、公式層、combat-rules、runtime combat getter。

---

## 3. Talent 頁實際能提供哪些欄位

**能提供（已收錄）**

- 分頁區塊（Profession／核心天賦點／天賦）  
- 列順序（合併後全域 index）  
- 顯示名稱（核心／天賦多為粗體列名；Profession 為神／職業連結文字）  
- 內文描述（含 `<br>` 轉成換行後的純文字；raw snapshot 另保留 HTML 片段）  
- 圖示 URL（大多數列；少數為占位圖）  
- 部分列的 **TLIDB `data-id`**（遊戲資料列 id，可做穩定 id 主鍵）  
- 神系／職業連結的 **href basename**（如 `New_God`、`God_of_Might`）  
- 內文是否含 **「神格生效上限」** 字樣（做 `godGridEffectCapHint`，**不**推斷實際格位規則）

**無法提供（本卡不處理）**

- 神版／天賦盤上的 **節點座標、圖層、連線、前後置**  
- **實際解鎖順序**、玩家可點格數、面板 layout  
- 詞綴僅出現在「石板／新神石板」的 **權威來源標籤**（頁面未單獨標記時只能依文字線索 + `unresolved`／hint 欄位，見下）

---

## 4. talent affix schema（摘要）

見 `types/talentAffix.ts`。normalized 每筆至少包含：

- `affixId`, `displayName`, `sourceUrl`, `rawText`（及 `descriptionLines`）  
- `sourceKind` / `sourceTab` / `sourceOrderIndex` / `gameDataId`  
- `availability[]`, `newGodOnly`, `godGridEffectCapHint`, `slateMentionHint`  
- `talentTreeRow` / `coreTalentRow` / `professionRow`  
- `panelHints`（v1 恒為 `[]`）  
- `tags`（如 `deity:God_of_Might`）  
- `modifiers` / `modifiersText`（保守解析；可為空）

詳見 [schema-notes.md](./schema-notes.md)。

---

## 5. 數量與分類（最後一次 `verify:talent-affixes` 輸出）

| 指標 | 數量 |
|------|------:|
| 總列數（affix） | 1182 |
| Profession 列 | 31 |
| 核心天賦點 列 | 138 |
| 天賦 列 | 1013 |
| `newGodOnly === true` | 13（含核心＋天賦分頁重複列之新神核心） |
| `godGridEffectCapHint`（含「神格生效上限」） | 245 |
| `slateMentionHint`（含「石板」） | 0（此頁快照中未命中；若改版出現會自動標） |
| 有 `iconUrl` | 1181 |
| 有解析出的 `%` modifiers stub | 859 |
| 僅保留原文、無解析 modifiers | 323 |

「普通／新神／石板」：**不以猜測強制三選一**。改以 `availability` + 布林／hint 表達；新神以 `newGodOnly` 與 `deity:New_God` 標記；石板相關僅在文字可判時用 `slate_related_hint`。

---

## 6. 已結構化 vs 仍原文

- **已結構化**：`+數值% …` 形式之片段 → `modifiers[]`（`labelZh` 仍為中文描述片段，**非**內部 stat id）。  
- **仍原文**：其餘機制（吞噬、祝福、戰意、迷蹤、屏障、條件句、複合句）→ 完整保存在 `rawText`／`descriptionLines`；**不**推斷公式。

---

## 7. 本卡刻意沒做的事

- 任何 **座標、拓撲、連線、panel 佈局** 的猜測或自動生成。  
- 將詞綴 **綁死**到特定神版格位。  
- 把網站未提供的規則寫成 **ready**（解鎖順序、可選格數等）。  
- 碰 **combat-rules／公式／左側面板／Skill Setup**。

---

## 8. 是否可進入下一步（人工位置／panel mapping）

**可以。** 建議後續資料：

- 新增「節點／石板槽位」定義檔，僅存 **`affixId` 外鍵** + 人工輸入之座標或 panel 內 id。  
- 本詞綴庫維持 **內容層** 單一真相來源；位置資料版本獨立 bump。

---

## 卡住時問題的預設（本卡採用）

| 問題 | 採用 |
|------|------|
| 無法判斷屬於哪個神版 | `panelHints: []`，不以弱提示冒充；依分頁與 `deity:` tag 表達已知資訊 |
| 同名、描述略異 | **拆成多筆**（不同列／不同 `sourceTab`／不同 `sourceOrderIndex`）；必要時 `notes` |
| 複雜詞綴暫無法結構化 | **保留 rawText**；僅在可保守擷取時加 `modifiers` |
| 三類區分 | 使用 **`availability` 陣列** + `newGodOnly`／hint 布林，**不**單一 enum 強制互斥 |
