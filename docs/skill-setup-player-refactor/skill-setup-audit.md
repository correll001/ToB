# Skill Setup — 玩家導向重構現況盤點（Audit only）

**範圍**：本文件為 **4E-7 平行之產品／UX audit**，僅盤點與凍結邊界；**未**修改任何程式碼。

**日期基準**：對照 `components/editor/SkillSetupPanel.tsx`、`selectors/skillTabExplanation.ts`、`selectors/buildComputedStats.ts`、`hooks/useBuildComputedStats.ts`、`types/skillTabExplanation.ts`。

---

## 1. SkillSetupPanel 主要區塊盤點

### 1.1 頁首區（標題 + 資料來源 + 檢視槽）

| 區塊內容 | 玩家核心 | 玩家次要 | 進階 | Debug／工程 |
|----------|:--------:|:--------:|:----:|:-----------:|
| 「Skill Setup（技能組）」標題 | ✓ | | | |
| **Debug（canonical tags / raw requirements）** checkbox | | | | ✓ |
| `effective-runtime-bundle`、datasetVersionId、versionLabel、effectiveLayer 說明 | | | ✓ | ✓ |
| 中央 vs 左欄用途差異長文（技能局部 vs 全身 Build） | ✓（概念重要） | | 重複出現易疲勞 | |
| **目前檢視（inspected）**：Slot、技能名、`inspectedPresentationMode` 英文 enum、左欄 DPS 卡語意 | ✓ | ✓ | ✓（mode 字串） | |
| 快速切槽 1–5 + 清除 | ✓ | | | |

### 1.2 主技能槽卡片（每槽一張，含未檢視與檢視中）

| 區塊內容 | 玩家核心 | 玩家次要 | 進階 | Debug／工程 |
|----------|:--------:|:--------:|:----:|:-----------:|
| `#slot`、`family` badge、`parse ok/partial/failed`（英文） | ✓（槽位） | | ✓ | ✓（parse 標籤） |
| 「檢視中」高亮 | ✓ | | | |
| 技能顯示名稱 | ✓ | | | |
| **技能 ID**（mono） | | ✓（查資料） | ✓ | ✓ |
| normalized **Warnings** 條 | ✓（影響信任） | | | |
| **failed** 紅色說明（bundle 解析） | ✓ | | ✓ | |
| 啟用組合、檢查此技能、清空 | ✓ | | | |
| 主技能下拉 | ✓ | | | |
| 主技能 Lv（gem） | ✓ | | | |
| **公式角色: `damaging` 等英文 enum** | | | ✓ | ✓ |
| Tags（effective） | ✓（流派） | | | |
| **Canonical（debug · tagVocabulary）**（debugMode） | | | | ✓ |
| 停用槽提示 | ✓ | | | |

### 1.3 僅「檢視中」槽：技能局部解釋器_lane（①～⑥）

| 區塊（元件／標題） | 玩家核心 | 玩家次要 | 進階 | Debug／工程 |
|--------------------|:--------:|:--------:|:----:|:-----------:|
| **SkillLocalExplainerLaneIntro**（①～⑥ 導覽 + 再強調與左欄不同） | ✓ | | 文案密度高 | |
| **① 技能基底說明**（presentationTags、名稱/ID、族別、標籤、解析、公式角色、技能層/衍生層信賴 chip、等級列來源、baseDamage/魔耗/冷卻/施放/額傷效用/投射物/武器%） | ✓ | ✓ | ✓（信賴、來源、added effectiveness） | |
| **② 連結輔助**（SupportLinksEditorSection `isInspected`）：編輯器 + 每列 **SupportLinkExplanationPanel**（套用/跳過、localStatEffects、**affectedStatKeys mono**、details 內 raw req） | ✓ | ✓ | ✓ | ✓（raw、stat keys） |
| **③ 技能局部數值摘要**（命中/DPS/攻速/資源/技能層攻速施放%、信賴 caveats） | ✓ | ✓ | ✓ | |
| **④ Support 移除／替換差異**（逐 link deltaLines、computedStatDeltas key mono） | | ✓（進階構裝） | ✓ | ✓ |
| **⑤ 被動／光環痕跡**（slot、ID、apply mode、**statKeys** zh 標 + partialHints） | ✓（被動有無命中） | ✓ | ✓ | ✓（registry keys） |
| **⑥ Debug／缺資料說明**（`<details>` 預設收合）：canonical tags、raw requirements、engine/record/instance warnings、level row 除錯列、support skipped、缺資料、trace 摘要 | | | ✓ | ✓ |

### 1.4 非檢視槽：連結區第二份

| 區塊 | 玩家核心 | 玩家次要 | 進階 | Debug／工程 |
|------|:--------:|:--------:|:----:|:-----------:|
| **SupportLinksEditorSection** `isInspected={false}`：標題無「②」編號、**無**每列 SupportLinkExplanationPanel | ✓ | | | |
| 列內 **debugMode** 時 raw requirement 一行 | | | | ✓ |

### 1.5 被動／光環全區

| 區塊內容 | 玩家核心 | 玩家次要 | 進階 | Debug／工程 |
|----------|:--------:|:--------:|:----:|:-----------:|
| passive 選擇、啟用、清空、等級 | ✓ | | | |
| parse / family / **mechBadges**（aura、utility 等） | ✓ | ✓ | ✓ | |
| Tags + debug canonical | ✓ | | | ✓ |
| 套用模式（全域／僅連結槽）+ 連結主槽 checkbox | ✓ | ✓ | | |

---

## 2. 資料欄位映射：現有 selector 能否支撐目標敘事

以下 **不新增假設性數值來源**，只對照已存在欄位。

### 2.1 Skill Summary（技能摘要）

| 目標 | 主要來源 | 足夠度 |
|------|----------|--------|
| 名稱、槽位、是否檢視中 | `SkillSetup` + store | ✓ UI 已有 |
| 等級（gem）、族別 | `skillRow` + `getSkillDefinitionById` | ✓ |
| 核心數值一眼（魔耗/冷卻/施放/傷害基礎） | `SkillTabExplanation.levelRowFacts` | ✓ 已在 ① |
| 資料健康度（解析狀態） | `parseStatus`、`presentationTags` | ✓；呈現偏工程 |
| 輸出向與否 | `damageRole`、`inspectedDamageViewMode` | ✓；`damageRole` 在 UI 仍英文 |

### 2.2 Support Results（輔助結果）

| 目標 | 主要來源 | 足夠度 |
|------|----------|--------|
| 每顆連結套用與否、原因 | `SkillTabSupportLinkExplanation`（`applied`、`skipReasonZh`、`localStatEffects`） | ✓ |
| 與引擎一致 | `SkillInstance.supports` + `buildSupportLinkExplanations` | ✓ |
| 略過清單（稽核） | `supportSkippedDetail`、`debugFoldout.supportSkippedRows` | ✓；後者偏 debug |

### 2.3 完整加成過程（Base → Supports → Passives/Aura → Final）

| 階段 | 已有資料 | 是否已在 Skill Setup **畫面上成線性敘事** |
|------|----------|---------------------------------------------|
| Base | `levelRowFacts`、`baseSkillLines`（含 definition modifiers 摘要）、`levelRowLines` | **部分**：① 顯示 level row 欄位；**`baseSkillLines` / `levelRowLines` 未作為玩家主敘事區塊渲染**（多在 ⑥ 或未用） |
| Supports | `supportLinkExplanations`、`supportAppliedDetail` / `supportSkippedDetail` | ✓ ②；無單一「時間軸」標題 |
| Passives/Aura | `passiveImpactTraces`、`passiveAuraLines`（selector 內建，**左欄 damage view** 也用） | **⑤ 有 traces**；與 `passiveAuraLines` 文字列表 **未在 SkillSetupPanel 對照呈現**（避免本 audit 要求改左欄） |
| Final（局部命中/DPS） | `localNumericSummary` ← `selectInspectedSkillDamageView` + `CombatBreakdown` | ✓ ③；明確標「非左欄定論」 |

**結論**：資料層 **大致夠** 支撐重構後的「分段故事」，但 **Base 的完整 modifier 列表**與 **與 passiveAuraLines 的對齊** 目前多留在 **未渲染欄位** 或 **Debug／左欄**；下一張卡若只做 Skill Setup UI，可在**不改公式**前提下做「呈現映射」（讀既有 `SkillTabExplanation` 欄位）。

### 2.4 Advanced Details

| 需求 | 來源 | 足夠度 |
|------|------|--------|
| 信賴度、衍生層合併 | `calculationConfidence`、`effectiveCalculationConfidence`、`damagingPresentation`、`confidenceCaveats` | ✓ |
| 等級列來源 / partial | `levelRowFacts.source`、`rowPartial` | ✓ |
| Counterfactual（拔輔助） | `supportRemovalDeltas`、`stripAllSupportsDelta` | ✓ |
| Registry／引擎痕跡 | `debugFoldout`、`localPreviewMetrics.computedStatSample`（selector 有，**Panel 未用**） | ✓ 供進階 |

### 2.5 buildComputedStats.ts 與本頁的關係

- `useBuildComputedStats()` → **`selectBuildStatsPanelDerived`**：為 **左欄** 主資料源；Skill Setup **僅使用**其中與 inspected 切片相關欄位：`inspectedTargetSlot`、`inspectedPresentationMode`、`inspectedSkillDamageView`（後者由 `selectInspectedSkillDamageView` 計算）。
- **技能解釋本體**來自 **`selectSkillTabExplanation(snapshot)`**（與 `selectBuildStatsPanelDerived` 並行，不取代左欄 pipeline）。

---

## 3. 目前最干擾玩家閱讀的項目（主觀 UX audit）

1. **「與左欄不同」類免責聲明**在頁首、① 前言、②、③、④ 多處重複，資訊重複率高。  
2. **頂部 Debug checkbox** 與 **bundle 版本技術字串**並列，第一眼像開發者工具。  
3. **`parse ok/partial/failed`、`damaging`、`inspectedPresentationMode` 英文**混在中文介面，玩家需翻譯。  
4. **技能 ID、Link slot、registry stat key（mono）**密度高，削弱「我在玩什麼流派」的掃讀。  
5. **①～⑥ 編號 + 長標題**（ uppercase、多色邊框）視覺噪音大，階層與「我下一步該做什麼」不夠清晰。  
6. **③ 同時展示**命中/DPS/攻速與**技能層攻速/施放%**，對一般玩家不易分辨「全局 vs 技能局部」差異（虽有文案）。  
7. **④ 移除差異**對只想配裝的玩家偏進階，卻與核心編輯區同權重垂直排列。  
8. **非檢視槽**仍顯示 parse/family/英文公式角色等，**未檢視**時資訊量與 **檢視中** 差異大，易造成「為什麼我這槽沒有下面那些卡」的困惑。

---

## 4. 「保留／降級／折疊／隱藏」對照表（建議，非實作）

| 項目 | 建議 | 備註 |
|------|------|------|
| 主技能選擇、等級、啟用、連結編輯、被動選擇與連結模式 | **保留**（核心） | 不得依賴左欄改動 |
| 檢視槽、快速切槽 | **保留** | 與左欄 inspected 單一來源一致 |
| ① 基底：名稱、等級、魔耗/冷卻/施放/傷害相關列 | **保留** | 可精簡子標題 |
| ② 每顆輔助：套用/跳過 + 人話效果列 | **保留** | `affectedStatKeys`、raw → **折疊或預設隱藏** |
| ③ 局部命中/DPS/攻速 | **保留**（輸出向） | caveats 可 **折疊** |
| 頁首 bundle 版本、effectiveLayer | **降級** | 移至頁尾或「關於資料」 |
| 與左欄差異說明 | **保留一處** + 其餘 **降級／折疊** | 避免五連擊 |
| Debug checkbox + canonical + raw | **隱藏或預設關閉**（已部分如此） | 可改為「開發者選項」進階區 |
| ④ 移除差異 | **折疊**（預設收） | 進階／實驗構裝 |
| ⑤ 被動痕跡 | **折疊**或精簡為「影響本技能的被動：N」 | stat key 細節進階 |
| ⑥ Debug foldout | **維持折疊** | 已是良好模式 |
| `parse` 英文標籤 | **保留資訊、改玩家語彙**（下張卡文案） | 不變更計算 |
| `damaging` 等公式角色 | **玩家標籤**（對照現有 `skillTabDamageRoleLabel` 僅部分使用） | ① 外層卡片仍顯示英文 → 可統一 |

---

## 5. 重構邊界（凍結）

### 5.1 禁止觸碰（本專案紅線）

| 區域 | 路徑／說明 |
|------|------------|
| **左側全局傷害面板** | `components/editor/BuildStatsPanel.tsx` — **UI、資料流、文案、計算皆不可變**（含其依賴的 `selectBuildStatsPanelDerived` 之 **輸出語意與數值結果**；若僅拆檔亦須另開卡且不改行為）。 |
| **全局 combat 管道** | `computeDerivedCombat`、aggregate、combat-rules、verify 腳本等（與本 audit 任務一致：不動）。 |
| **技能資料來源** | 不重做 bundle／normalized 管線；不新增數值計算邏輯。 |

### 5.2 下一張「UI 重構卡」可動範圍（建議）

| 區域 | 說明 |
|------|------|
| `components/editor/SkillSetupPanel.tsx` | 版面、折疊、文案映射、資訊層級（僅顯示既有 props／selector 結果）。 |
| `types/skillTabExplanation.ts` | 僅在**不增加新計算**前提下擴充「呈現用」欄位（若需要）。 |
| `selectors/skillTabExplanation.ts` | **僅**重新打包／排序／預計算顯示字串（**不改** `selectInspectedSkillDamageView` / `computeSkillInstanceForMainSlot` 的數學結果）。 |
| `lib/format/*` | 新增玩家向標籤函式（純展示）。 |

### 5.3 需協調但不屬「Skill Setup 單檔」

- **`selectors/buildComputedStats.ts`**：若僅為 Skill Setup **新增**不影響左欄的 selector 可另議；**預設仍避免觸碰** `selectBuildStatsPanelDerived` 與 `runCombatPipeline` 行為。
- **`hooks/useBuildComputedStats.ts`**：左欄唯一源註解仍在；Skill Setup 可繼續自存 `selectSkillTabExplanation`（現狀）。

---

## 6. 驗收對照（本 audit 卡）

- [x] 現況區塊盤點  
- [x] 資料欄位映射（含 `SkillTabExplanation` 未渲染欄位註記）  
- [x] 玩家／進階／debug 分層  
- [x] 左側全局面板不可碰邊界  

---

## 7. 卡住時必問（請產品／使用者決策）

1. **哪些技術資訊要留在 Advanced？**（例如：registry stat keys、raw requirement、level row source）  
2. **Debug：完全隱藏 vs 預設折疊可展開？**（現狀：⑥ 折疊；頂部 Debug 開關）  
3. **玩家首屏最重要的 3 個欄位**為何？（建議候選：技能名+等級、魔耗/冷卻、局部 DPS 或「是否可精算」— 待你拍板。）
