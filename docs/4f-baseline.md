# 4F-0 全量技能工程基線

> 本文件與 **`npm run report:full-skill-coverage`** 配套：數字以該報表在 **目前 bundled `effective-runtime-bundle.json`** 上的一次執行為準；換季／換 bundle 後請重跑並更新下表。

## 1. 現況摘要（代表性一次執行）

| 維度 | 數值 |
|------|------|
| Active / Support / Passive 筆數 | 153 / 122 / 55 |
| 全檔 parseStatus（ok / partial / failed） | 323 / 7 / 0 |
| Active 缺 `levelTable`（空或無） | **142** |
| Active `resolveLevelRow(Lv20) === none` | **129** |
| Active：`damaging` 但 isolated instance `calculationConfidence !== ready` | **31** |
| Support：`modifiers` 全空 | 0 |
| Support：`supportRules` 不具結構化訊號 | 0 |
| Support：modifiers 與 rules「雙空」 | 0 |
| Passive：無 def.modifiers 且 level-row 無衍生 modifier | **49** |
| Passive：有敘述文字但無可套用結構化 inject | **49**（與上列高度重疊） |
| Inspected：`damaging` 但 `effective !== ready`（estimate） | 若干（含 P0 冰系等） |
| Inspected：`dpsBlocked`（derive / instance 擋下主 DPS 卡） | **30**（與 partial damaging 重疊） |
| Inspected：`instance` conf 為 partial \| unsupported（任意 role） | **115** |

**結論一句話**：多數 active **沒有完整 levelTable**，導致 Lv20 等級列斷裂、大量 `unknown`/utility 與 **formula 層只能 partial**；P0／overrides 已把 **support 規則與少量主戰技能**拉齊，但 **全量 active/passive 結構化仍是大坑**。

## 2. 全量技能工程的主要風險

1. **Level table / 等級列缺口**：沒有表或 Lv20 對不上列 → `resolveLevelRow` 無法穩定餵給 modifier／inspected derive → **.partial / dpsBlocked 常態化**。
2. **Unknown 洪流**：無結構化傷害證據時 inference 保守標 `unknown` → **inspected 不給 damaging 視角**；與「玩家期望每招都有數字」張力大。
3. **Passive 近全無可注入數值**：49/55 在報表定義下「無適用 modifier」→ **linked/global 被動在公式面近乎裝飾**，除非後續補 ETL／modifiers。
4. **Parser partial（7 筆）**：筆數少但會 **永久污染**該技能在 engine 的信心與報表標籤，需優先修復或 override。
5. **Support 面**：目前 bundle 抽樣下規則與 modifiers 已非空；**長期風險**在於新增技能若未跑 overrides／ETL，可能退回「雙空」支援石（**4E P0 合約**已擋發版，但資料擴張仍要靠流程）。

## 3. 建議批次（A / B / C / D）

| 批次 | 範圍 | 目的 |
|------|------|------|
| **A** | P0 active 清單 + 高流量弓/近戰招（已部分完成） | 保證 **P0 + inspected 主路徑**可演示、可發版 |
| **B** | `resolveLevelRow(Lv20)=none` 的多數 active | **補 levelTable 或 breakpoints**，降低 partial／unknown |
| **C** | Parser `partial` 的 7 筆 + 敘事型 active | **修 parser 或 targeted override**，避免永難 partial |
| **D** | Passive：49 筆無 inject | **補 modifiers 或正式標記「僅光环/敘述」**以免誤以為有公式贡献 |

## 4. 缺口分桶（`report:full-skill-coverage` §8，技能可複標）

| 分桶 | 技能數（約） | 說明 |
|------|----------------|------|
| parser | 7 | `parseStatus` 非 ok |
| override_level | 142 | active 缺可用 `levelTable`（parse 仍可能 ok） |
| level_row | 129 | Lv20 `resolveLevelRow === none` |
| support_rule | 0 | `supportRules` 無結構化訊號（本 bundle 抽樣為 0） |
| passive_inject | 49 | 無 def.modifiers 且無 level-row 衍生 modifier／敘述無法映射公式 |
| formula_engine | 31 | damaging 但 isolated instance `calculationConfidence !== ready` |

## 5. 最需要優先處理的四個缺口群組（依影響面）

以下順序兼顧 **覆蓋人數** 與 **對 inspected／公式管道的阻塞**：

1. **override_level（142）** — 補齊或正規化 active 的 `levelTable`，否則多數技能長期停在「有描述、無可解析等級曲線」。
2. **level_row（129）** — 與上一項重疊度高但指標不同：重點是 **Lv20（與 P0 合約等級）能對到列**，直接決定 `resolveLevelRow` 與 downstream modifier。
3. **passive_inject（49）** — 近九成被動在結構上 **無可注入 modifier**；全技能戰力模型若仰賴被動，此塊會系統性偏低。
4. **formula_engine（31）** — 已標 damaging 但引擎仍 `!== ready`；影響 **面板可信度與 batch C 之前的 UX**。

**補充**：**parser（7）** 筆數少，但會讓對應技能長期 `partial`／`unsupported`，建議與 **batch C** 一併清掉，避免永遠污染 Top 20 清單。

## 6. Top 20 多重缺口技能（報表「標籤數」排序）

重跑後見 **`report:full-skill-coverage` 第 9 節**。典型模式：**override_level + level_row + formula_engine** 同時標在「看起來像主力輸出」的 active 上（例：各種 Shot/Slash 系）；另有 **parser** 與 **level_row** 疊加（如 `Black_Hole`, `Path_of_Flames`）。

## 7. 與既有指令的關係

| 指令 | 用途 |
|------|------|
| `npm run report:full-skill-coverage` | **4F 全量矩陣 + 缺口分桶**（本卡新增） |
| `npm run report:structured-skill-coverage` | 結構化／support 穿透抽樣 |
| `npm run verify:skill-data-integrity` | P0 合約 + selector 不 throw |
| `npm run verify:skill-regression` | 連結／inspected／share 行為 |
| `npm run verify:4e` | 4E 子集合離線驗收 |
| `npm run audit:no-runtime-remote-skill-fetch` | Runtime 不可遠端抓技能 |

---

**維護**：更新 bundle 後請執行 `report:full-skill-coverage` 並視需要同步本檔「§1 現況摘要」與「§4 缺口分桶」表格中的數字。
