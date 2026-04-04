# Skill Setup 玩家導向重構 — 驗收與回歸檢查報告（4E-S6）

**驗收日期基準**：2026-04-03  
**範圍**：對照 `docs/skill-setup-player-refactor/skill-setup-audit.md` 與本輪實作，做**靜態驗收 + 指令回歸**；未執行瀏覽器 E2E 錄影。

---

## 1. 本卡完成了什麼

- 依任務卡要求產出本驗收報告，並以**可重複的檢查項**（檔案路徑、元件階層、`git diff` 範圍、`npm run verify:skill-tab-explainer`）佐證結論。
- **未**新增產品功能；**未**修改本卡禁區內檔案。

---

## 2. 新增／修改了哪些檔案（與本驗收卡直接相關）

| 檔案 | 變更性質 |
|------|----------|
| `docs/skill-setup-player-refactor/skill-setup-acceptance-report.md` | **本卡新增**：驗收與回歸紀錄 |

> 註：工作樹中另有多個與「Skill Setup 玩家導向重構」相關的既有變更（例如 `SkillSetupPanel.tsx`、`selectors/skillSetupPlayerView.ts`、`components/editor/skill-setup/*` 等），屬於前序卡片實作；**本 S6 卡僅保證新增上述驗收文件**，不擴大程式修改範圍。

---

## 3. 驗收案例與結果

以下每一列均對應**具體檢查方式**與**靜態驗收結果**。瀏覽器內「肉眼確認」建議作為補強（本報告未附截圖）。

### 3.1 情境矩陣

| # | 情境 | 如何驗（靜態／指令） | 結果 |
|---|------|----------------------|------|
| A | **Damaging skill**（輸出向、可看預覽傷害） | `ContributionFlowCard` 最終層在 `previewKind === 'full_scoped_combat'` 時會列出「單下傷害／DPS／攻速」等（資料來自既有 `localNumericSummary`，見 `selectors/skillSetupContributionFlow.ts` → `buildFinalMetricsAndExtras`）。`SkillSummaryCard` 顯示 `damageRoleLabelZh`、表上傷害、攻速預覽等欄位。 | **通過**（主線可讀：摘要 + 流程④有預覽數字路徑） |
| B | **有 applied supports 的技能** | `buildSupportsLayer` 僅迭代 `applied && !editorDisabled` 的 `supportLinkExplanations`；`SupportResultsCard`「已套用」區塊列出 `impactSummaryLines`；`ContributionFlowCard` ② 僅顯示已生效連結與 `effectLines`。 | **通過** |
| C | **有 skipped supports 的技能** | `SupportResultsCard`「未生效／已關閉」使用 `r.skipPlainLanguage`（selector 對應 `skipReasonZh`）。`selectors/skillTabExplanation.ts` 內 `skipReasonZh` 經 `formatSupportSkipReasonZh`。略過列**不進** `ContributionFlowCard` ②（程式註解與 `emptyHint` 一致）。 | **通過** |
| D | **有 passive／aura traces 的技能** | `buildPassivesLayer` 使用 `ex.passiveAuraLines` 與 `ex.passiveImpactTraces`；主流程③顯示敘述 + 若有 traces 則提示進階詳情；完整 trace 在 `AdvancedDetailsCard` 的「⑥ 被動／光環 · 詳列」。 | **通過** |
| E | **有 missingDataHints 或 parse warning 的技能** | `SkillSummaryCard`：`parseStatus === 'partial'` 時主摘要僅一行導向「進階詳情」。`AdvancedDetailsCard` 內多組 `AdvancedFold` 承載 top-level warnings、缺資料、`SkillTabDebugFoldoutPanel` 等。槽位標題區仍保留 **norm 筆數提示**與 **parse failed** 紅框（`SkillSetupPanel.tsx`），與 audit 1.2「信任／失敗」訊息層級一致。 | **通過（含已知殘留，見 §5）** |

### 3.2 主畫面四區塊可見性（檢視中槽）

| 區塊 | 元件 | 驗證 | 結果 |
|------|------|------|------|
| Skill Summary | `SkillSummaryCard` | `SkillSetupPanel.tsx` 在 `isInspected` 時依序渲染，標題文案來自 `SKILL_SETUP_SECTION_SKILL_SUMMARY`（`skillSetupCopy`）。 | **可見** |
| Support Results | `SupportResultsCard` | 同上；內嵌 `SupportLinksEditorSection` 作為編輯子區。 | **可見** |
| Contribution Flow | `ContributionFlowCard` | `flow={skillSetupPlayerView.contributionFlow}`；四層標籤 ①–④。 | **可見** |
| Advanced Details | `AdvancedDetailsCard` | 外層 `<details>` **無** `open`／`defaultOpen`（預設收合）。 | **可見且預設折疊** |

### 3.3 Skipped support 文案（玩家語）

| 檢查項 | 證據 | 結果 |
|--------|------|------|
| 對應函式 | `lib/format/supportLinkExplanationFormat.ts` → `formatSupportSkipReasonZh` | 已將常見 token 對應為中文短句（例如 `link_disabled` →「這格連結關著…」） |
| 未映射 token | `return \`沒套用（${reason}）\`` | **仍可能露出工程字串**（列為後續項，見 §5） |

### 3.4 Advanced 預設折疊與主流程無 debug 污染

| 檢查項 | 證據 | 結果 |
|--------|------|------|
| 進階區外層 | `AdvancedDetailsCard.tsx` 約 L235：`<details ...>` 無預設展開 | **通過** |
| 內層折疊 | `AdvancedFold`：`defaultOpen = false` | **通過** |
| Debug foldout | `SkillTabDebugFoldoutPanel` 僅出現在 `AdvancedFold`「⑦ 引擎診斷」內 | **通過**（主線 1–4 卡不含該面板） |
| Contribution 主線 | `ContributionFlowCard` ② 不渲染移除試算／counterfactual 數列，改以一句導向進階 | **通過** |

### 3.5 自動化回歸

| 指令 | 結果 |
|------|------|
| `npm run verify:skill-tab-explainer` | **OK**（2026-04-03 執行） |

---

## 4. 有沒有碰到禁區

| 禁區 | 驗證方式 | 結果 |
|------|----------|------|
| **不得修改** `components/editor/BuildStatsPanel.tsx` | `git diff --name-only HEAD` 未包含該路徑；對 `BuildStatsPanel` 路徑範圍 diff 為空 | **未碰** |
| **不得修改公式層與 combat-rules** | 同上，工作樹 diff 未包含 `**/combat-rules/**`、`computeDerivedCombat*`、`runtimeRulesLookup*`、`buildComputedStats*` 等（於 repo 根目錄執行路徑過濾 diff） | **未碰** |
| **不得把驗收寫成純主觀** | 本報告以元件、selector、函式與指令輸出為檢查項 | **符合** |

**補充（資料／runtime）**：`selectors/skillSetupPlayerView.ts` 註明僅組裝 `selectSkillTabExplanation` 的呈現視圖；`skillSetupContributionFlow.ts` 註明無 combat derivation、僅字串組裝。與「不重做資料層／公式層」一致（靜態閱讀 + 路徑未觸及禁區）。

---

## 5. 尚存問題清單（後續項，不模糊帶過）

1. **`formatSupportSkipReasonZh` 後備句**：未列舉的 `reason` 仍顯示 `沒套用（${reason}）`，玩家可能看到英文 token 或內部字串。
2. **槽位標題區仍顯示 norm 提示與 parse failed 區塊**（`SkillSetupPanel.tsx`）：與「摘要／進階分離」相比，主流程**上方**仍有一層信任提示；若產品希望「槽位標題極簡」，需另開卡討論是否全收斂進 Advanced（**本輪未改**）。
3. **被動層③「影響項目」**：流程層使用 `skillLocalStatLabelZh`；若 registry 缺映射，仍可能偏技術向——與 skip 文案要求相比，屬**不同欄位**，建議後續若玩家投訴再收斂。
4. **瀏覽器手動驗收未執行**：本報告無法附「實機截圖／錄影」證明字級與捲動體感；建議以任一含 ②③④ 量資料的 build 做一次 smoke。

---

## 6. 是否可視為本輪完成

- **驗收文件產出**：**是**（本檔）。
- **禁區**：**是**（`git diff` 與路徑過濾佐證左欄與公式／combat-rules 未改）。
- **玩家主線「完整加成過程」**：**靜態驗收判定為達標**——檢視中槽可依序看到 **摘要 → 輔助結果（含略過說明）→ 基底→輔助→被動／光環→結果 → 進階（預設關）**；試算與引擎診斷集中在 Advanced。
- **整體**：在接受 §5 所列後續項前提下，**可視為本輪 Skill Setup 玩家導向重構之驗收回合完成**。

---

## 附錄：卡住時三問（預設取向，供產品決策）

1. **代表案例優先序**：建議每類各抽一顆技能 smoke（輸出向／多輔助／全略過／多被動／partial parse）。
2. **是否另列「仍無法量化的步驟」**：可；例如「實機捲動距離」「實際 DPS 與遊戲內是否一致」等本輪未驗。
3. **玩家流程 vs 工程完整性衝突**：與前序卡片一致時，**優先玩家主線可讀**；工程細節收斂至 Advanced。

---

## 與 `skill-setup-audit.md` 的對照摘要

| Audit 關注點 | 本輪驗收結論 |
|--------------|--------------|
| ①～⑥ _lane 資訊過載 | 主線改為四卡 + 進階折疊；與 audit「進階／Debug 分流」方向一致 |
| 左欄全身 Build vs 右欄局部 | **未改** `BuildStatsPanel`；職責分離維持 |
| Selector 欄位是否支撐敘事 | `selectSkillTabExplanation` 仍為單一真相來源；player view 為投影層 |
