# Combat rules schema notes（4E-1）

## 與 4E-0 的對應

- **Manifest**：`data/raw/ss12/global-rules/screenshot-sources.json` 的 `topicId` ↔ `RuleSourceRef.topicId`。
- **轉寫**：`docs/game-rule-transcripts/*.md` 路徑可寫入 `RuleSourceRef.transcriptRelativePath`。
- **根文件型別**：`StructuredCombatRules` → 可掛在 `GlobalCombatRuleSet.structuredCombatRules`（見 `types/rules.ts`）。

## Canonical key 決策（實作本卡時的預設）

| 議題 | 決策 |
| --- | --- |
| `true_damage` vs `trueDamage` | **保留 `true_damage`** 作為 `DamageForm` 字面量，與任務卡一致；JSON 穩定鍵。 |
| 中文別名 | **型別層只用英文 canonical**（`DamageType`、`CombatMechanismId` 等）；中文顯示留在轉寫檔與 manifest `titleZh` / `quoteBlocks`，避免同一概念雙鍵分叉。 |
| `blocked_needs_user_rule` 細分 | 本階段使用 **`RuleStatus` + `blockedParts[]`（`CombatRulesBlockedTermId`）**；不另拆 `blocked_reason` enum，下一張卡若需可擴充。 |

## Block 共同欄位

- 每個 `*RuleBlock` 延伸 `CombatRulesBlockBase`：**`status`**、**`sources`**（`RuleSourceRef[]`）、選填 **`blockedParts`**。
- 子句若僅部分可實作（例如爆擊與其他系統的順序），將 **整 block** 標為 `partial` 或將子欄位標 `blocked_needs_user_rule`（見 `DamageConversionRuleBlock.specialFusionTypeBonus`、`CritRuleBlock.finalCritValueFormula`）。

## `CombatMechanismId` 與 section I

- 出現在 **A.3 / A.5 / A.6 / A.8** 的機制均以 **結構化 id** 列入對應陣列。
- **Section I** 列為不可腦補者：同時出現在 **`CombatRulesBlockedTermId`**，並應在相關 block 的 **`blockedParts`** 或 **`specialFusionTypeBonus.status`** 反映，**不得**以單一長字串取代。

## 取樣填入預期（供 normalize 卡）

- `ResistancePenetrationRuleBlock.appliesToDamageForms`：**僅** `hit` | `dot` | `indirect` | `reflect`（`ResistancePenetrationAppliesToDamageForm`），與 D.4 原文一致。
- `DamageTypesRuleBlock.types`：固定五元組，順序建議與 **C.3 優先級無關**之列舉順序（字母或物理→…）由 ingest 決定，但 **集合必須等同**五類。

## TypeScript

- 定義於 **`types/combatRules.ts`**；**不** import 任何 formula / runtime 模組。
