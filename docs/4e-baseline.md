# 4E-0 技能系統基線報告（分析專用）

> 本文件與 `npm run report:structured-skill-coverage` 對齊，僅描述**截至目前 bundled `effective-runtime-bundle.json`** 的量化基線。  
> 4E-0 任務卡：**不修改 React UI、不改 formula 核心、不改 `types/build.ts` schema。**

## 1. 驗證指令結果摘要（2026-04-03 前後之工作區快照）

下列為單次執行成功結果（無對外 HTTP）：

| 指令 | 結果 |
|------|------|
| `npm run audit:no-runtime-remote-skill-fetch` | OK（app, components, hooks, stores, selectors, lib/runtime, lib/formula） |
| `npm run verify:skill-data-integrity` | OK；active 153 / support 122 / passive 55；parseStatus ok=319 partial=11 failed=0 |
| `npm run verify:skill-regression` | OK |
| `npm run report:structured-skill-coverage` | 完成（見第 2 節） |
| `npm run build` | 通過 |

`release:check` 已含前述 audit / verify（不含 coverage report）；需要基線時請手動跑 `report:structured-skill-coverage`。

## 2. Coverage report 核心數字（摘要）

來源：`lib/gameData/generated/effective-runtime-bundle.json`（`effectiveLayer: overrides@demo-1`）。

- **技能筆數**：active 153、support 122、passive 55  
- **parseStatus（全檔合計）**：ok=319、partial=11、failed=0  
- **主動技能缺 `levelTable`（空或缺欄位）**：153（全員；現行 ETL 多依 `modifiers` / 文本，非 bug 單指向，需搭配 3b 解讀）  
- **主動技能 Lv20 `resolveLevelRow` 為 `none`**：140（公式面「無 per-level 列」比例高 → `calculationConfidence` 易為 `partial`）  
- **支援石 `definition.modifiers` 為空**：0  
- **被動：無 modifiers 且無 level-row 衍生 modifiers**：54 / 55  
- **主槽可選 + damaging + `calculationConfidence === partial`**：38（仍顯示 damaging 面板，但精準度標記為 partial）  
- **主槽可選 + damaging + unsupported**：0  
- **主槽技能 `parseStatus=partial`**：11（多為 `unknown` / `utility` / `summon-driver` 等非純 DPS 接線）  
- **參考主技能** `skill:Ice_Shot`：`inspected` 為 `mode=damaging`，但 instance `calculationConfidence=partial`  
- **支援規則 `allowedSkillTags` 僅 `Support` / `輔助`**：91 顆（主動技能通常不含「輔助」tag → `evaluateSupportAttachment` 對全部主技能 **appliedTo=0**）  
- **對 153 顆主技能 attach 率 <10%（skipped≥90%）的支援**：94（與規則資料高度相關，非單純 UI）

## 3. 目前最關鍵缺口 Top 10

1. **支援石相容規則誤用「輔助 / Support」為 allowedSkillTags**：導致大量支援在引擎中永遠無法掛上主技能，與「連結欄有 UI」並存時形成**空效果**體感。  
2. **主動技能幾乎無 `levelTable`，且 Lv20 多無 breakpoint 列**：`levelRow.partial` / `levelSource none` 推升 **partial** 信心，mana / castTime 等欄位常為 null。  
3. **38 個主槽 damaging 技能一律 partial**：沒有「ready」等級的 primary DPS readout（符合「不確定不假裝精準」但產品上仍待資料補齊）。  
4. **11 筆 `parseStatus=partial` 主技能**：需補 parser / 結構化欄位，否則維持 `unknown` / `utility` 等非聚合 DPS 行為。  
5. **被動 54/55 無可結構化注入**：被動欄位 UI 存在，但多數沒有進公式層的 `modifiers` / level 衍生（需 ETL 或明確標為 text-only）。  
6. **Inspected damaging 與 `calculationConfidence` 的呈現落差**：面板可顯示數字，但 instance 仍為 partial（後續 4E 若要產品化需 UX 與資料齊步走）。  
7. **Support level breakpoints 多為 `textLines` + `partial: true`**：與「不從純文字發明數值」一致，但代表 **level 曲線物尚未進引擎**。  
8. **Tag / 規則對齊**：除 Support-only 外，尚須盤點 `requiresProjectile` 等與中文 tag 映射是否覆蓋 TLIDB 新標籤。  
9. **Summon / aura / utility 與 DPS 預期**：部分玩家預期與 `inferDamageRole` 分類不一致時，需靠文案與 explicit unsupported 範圍兜住（見 `docs/skill-data-policy.md`）。  
10. **Frozen DB 與 bundle 版本**：基線僅對 **bundled JSON**；若要比對 `frozenAt` / SQLite，需另跑 `npm run data:verify:frozen`。

## 4. 建議 P0 補齊名單（示例）

以下依「**曝光高、Regression 已覆蓋、或規則錯誤具代表性**」挑選，實際 P0 應以產品主推流派再收斂。

**P0 主動（資料 / level / partial）**

- `skill:Ice_Shot`（回歸基準；仍 partial）  
- `skill:Leap_Attack`（位移 / 武器% 代表）  
- `skill:Whirlwind`、`skill:Rain_of_Arrows`（典型 endgame 流派）  
- **所有 `parseStatus=partial` 主槽技能**（共 11）：Chromatic_Shot、Resurrection_Warcry、Blink、Split_Firebolt、Blizzard、Path_of_Flames、Chain_Lightning、Mind_Control、Ring_of_Ice、Black_Hole、Summon_Machine_Guard  

**P0 支援（規則 / attach）**

- `skill:Increased_Area`（`allowedSkillTags: ["Support"]` 錯配代表）  
- `skill:Multiple_Projectiles`（回歸已用；需維持與 Ice_Shot 相容敘述一致）  
- 其餘 **91 顆 Support-only tag 規則**應分批改為真實技能標籤（Spell / Attack / Area / …）或改為「無 allowed 則相容 + raw trace」策略（屬 4E 決策，不在 4E-0 實作）。

**P0 被動（可注入公式）**

- 優先：`Weapon_Amplification`、`Spell_Amplification`、元素／專注系 `*Focus`（若有完整 modifier 可優先落地）  
- 其餘 54 顆缺結構 modifier：需決定是 **補資料** 或 **明確標為 narrative-only / unsupported**。

## 5. 4E 後續執行順序建議

1. **修正支援石 `supportRules.allowedSkillTags`**（P0，解除「全殺」相容性）— 資料 / ETL 層。  
2. **主力流派主動技能 `levelTable` 或可用 breakpoints（非僅 textLines）** — 讓 Lv20 row 可引用，降 partial 比例。  
3. **被動 modifiers 分批結構化** — 與 `passiveModifiersForActiveSkill` 注入路徑對齊。  
4. **`parseStatus=partial` 11 筆** — parser 升級或降級為 explicit unsupported 文案。  
5. **Inspected UX（後續卡片）** — 在 **不改本卡前提下**，另開任務顯示 `calculationConfidence` / readiness（與 4D 對齊）。  
6. 每波資料合併後固定跑：`verify:skill-data-integrity`、`verify:skill-regression`、`report:structured-skill-coverage` 做 diff。

## 6. migration 說明

**4E-0 無資料庫或 schema migration**；僅新增報告腳本與本文件。

## 7. 新增／修改的檔案

- 新增：`scripts/verify/reportStructuredSkillCoverage.ts`  
- 新增：`docs/4e-baseline.md`  
- 修改：`package.json`（script `report:structured-skill-coverage`）
