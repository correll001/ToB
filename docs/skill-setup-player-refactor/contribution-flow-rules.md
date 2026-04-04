# Contribution flow（完整加成過程）— 呈現規則

## 目的

在 **不新增公式、不重算戰鬥** 的前提下，把 `SkillTabExplanation` 既有欄位組成單一路徑：

**Base → Supports（僅已套用且啟用）→ Passives / Aura → Final**

## 資料來源（實作：`selectors/skillSetupContributionFlow.ts`）

| 層級 | 主要欄位 |
|------|-----------|
| Base | `baseSkillLines`, `levelRowLines`, `levelRowFacts`（僅格式化為文字） |
| Supports | `supportLinkExplanations` 中 `applied && !editorDisabled`；對照列來自 `supportRemovalDeltas`（同 linkSlot） |
| Passives / Aura | `passiveAuraLines`, `passiveImpactTraces` |
| Final | `localNumericSummary` |

## 刻意不做的事

- **略過／停用**的連結：不進入 Supports 層（留在 Support Results 區）。
- **被動／光環**：此 TAB 型別無「每顆 passive 加多少」的差額；層內固定顯示 **未量化差額** 說明，只列痕跡與屬性鍵。
- **無 `supportRemovalDeltas` 或 combat 對照不支援**：只顯示效果文字；不補算命中／DPS 差。
- 不修改 `computeDerivedCombat`、`runtimeRulesLookup`、`buildComputedStats` 計算邏輯。

## UI

由 `ContributionFlowCard.tsx` 依 `SkillSetupContributionFlow` 結構渲染四層與箭頭提示。
