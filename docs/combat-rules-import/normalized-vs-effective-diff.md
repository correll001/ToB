# Normalized vs Effective — combat-rules（4E-3）

Generated: 2026-04-04T12:49:51.532Z

## 流程

- **Normalized**：`data/normalized/ss12/combat-rules.json`
- **Effective**：`data/effective/ss12/combat-rules.json`（`npm run etl:apply-overrides`）
- **Global override**：`data/overrides/ss12/global-rules.json` → `combatRulesMerge`（deep merge 進 `rules`）

## Override 設定摘要

- **combatRulesMerge**：**無**（本 run 未對 combat 施加 global patch；effective 為 normalized 原樣寫出）。
- **skillLevelRulesMerge**：有（僅影響 skill-level-rules.json，不影響本檔 structured combat blocks）。

## `structuredCombatRules` 整體

- **結論**：normalized 與 effective 的 **`rules.structuredCombatRules` 深層結構一致**（sort-keys 後 JSON 相等）。

## 逐 block 摘要

| block | normalized vs effective | normalized `status` | effective `status` |
| --- | --- | --- | --- |
| `damageForms` | 一致 | partial | partial |
| `damageTypes` | 一致 | ready | ready |
| `damageConversion` | 一致 | partial | partial |
| `resistancePenetration` | 一致 | ready | ready |
| `armorReductionPenetration` | 一致 | ready | ready |
| `damageFormula` | 一致 | ready | ready |
| `critRules` | 一致 | partial | partial |
| `doubleDamageRules` | 一致 | ready | ready |

## `sources` / `status` 完整性（effective）

- **sources**：八個 block 均含非空 `sources[]`。
- **status**：各 block 均帶 `status`（見上表）；**未**在 effective 層被抹除。

## 仍為 blocked / partial 的欄位（effective 快照）

- **damageForms**: block `status` = `partial`
  - `blockedParts`: 8 項（含 section I / 未定演算法）
- **damageConversion**: block `status` = `partial`
  - `blockedParts`: 1 項（含 section I / 未定演算法）
  - `specialFusionTypeBonus.status` = `blocked_needs_user_rule`（damageConversion）
- **critRules**: block `status` = `partial`
  - `finalCritValueFormula.status` = `partial`（critRules）

## 權威語意反轉檢查（驗收）

- **造成傷害類型轉化僅擊中 + 僅低→高**：符合（未反轉）
- **護甲減傷穿透僅擊中計算**：符合
- **雙倍傷害僅擊中**：符合
- **爆擊敘述綁擊中**：符合

## 風險與建議

- **本 run**：無 combat merge → **無 override 風險**；之後新增 `combatRulesMerge` 時應重跑本腳本並確認 `sources` 未被空物件覆蓋。
- **deepMerge 行為**：陣列可能被整段取代；若 future patch 誤傳 `structuredCombatRules: {}`，可能清空子樹 — 建議 override 僅 patch 明確子路徑。

## 卡住三題（本 repo 預設）

1. **衝突**：merge 後單一 effective；若需保留雙方，應在 override 註解 + 報告標 `conflict`（目前無）。
2. **無合理 override 來源**：不自動回退；由 CI/人工比對 normalized；本流程以 normalized 為 baseline。
3. **報告粒度**：本檔 **逐 block 摘要** + 整體 deep-equal；細部逐欄位 diff 可再開工具擴充。
