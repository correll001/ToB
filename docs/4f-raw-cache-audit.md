# 4F-1 技能原始頁快取稽核

> 維護用文件。數字來自 `data/raw/ss12/manifests/raw-cache-audit.json`（由 `npm run etl:skills:audit-cache` 產生）。`skill-urls.json` 與 `pages.manifest.json` 路徑為 `data/raw/ss12/manifests/`。抓取索引與頁面：`npm run etl:skills:index`、`npm run etl:skills:pages`。

## 索引（manifest / skill-urls）

- **skill-urls 筆數（詳細頁 URL 清單，已 dedupe）**：330
- **依 kind（dedupe 後寫入 skill-urls 的分類）**：active 153 · support 122 · passive 55
- **索引頁抽出的原始連結總數（dedupe 前）**：350（與上列差值 **20** 筆為同源 URL 重複；其中跨 kind 第一次保留，另外記 **kind 衝突次數 20**）
- **pages.manifest.json 列數**：330（同源多列視為重複列：**+0** 條冗餘）

## 詳細頁（raw HTML）

- **檔案齊備且內容非明顯 stub**：330
- **缺 manifest 列**：0
- **manifest 標記 HTTP error**：0
- **缺本機 .html 檔**：0
- **疑為錯頁 / 空頁（啟發式）**：0

## 是否可進入 normalize

- **是** — 索引 URL 均有成功快取且無缺檔。後續 normalize / parse / override 應只讀 `data/raw/ss12/pages/**` 與 manifests。

## 索引涵蓋範圍（fetchSkillIndexes）

已固定抓取：**Active_Skill**、**Support_Skill**、**Passive_Skill**（抽出 skill 連結並 dedupe）、**Skill_Level**、**Character_Build**（索引頁儲存，不抽取 skill grid）。詳見 `scripts/etl/fetchSkillIndexes.ts` 的 `TARGETS`。

## 安全邊界

- ETL 僅寫入 `data/raw/**` 與本文件；**不增加 runtime 遠端抓取**。
