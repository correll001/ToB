# Combat rules — gap list（4E-7）

本文件列出**權威轉寫已承認、但演算法或事件模型尚未足以實作**的項目。目的：**防止後續開發在無正式規格時自行腦補數值或順序**。

- **Repo 內對應**：`types/combatRules.ts` 的 `CombatRulesBlockedTermId`、`DamageFormsRuleBlock.blockedParts`、`DamageConversionRuleBlock.specialFusionTypeBonus`、`CritRuleBlock.finalCritValueFormula`、`trueDamage` 結構欄位等。
- **資料快照**：`data/effective/ss12/combat-rules.json` → `rules.structuredCombatRules`（與 normalized 對照見 `normalized-vs-effective-diff.md`）。
- **驗證**：`npm run verify:combat-rules`（4E-6）**不**覆蓋下列 gap 的數值正確性；`BLOCK_C7` 僅確保 C.7 維持 blocked。

---

## 總覽表（blocked / 未定演算法）

| # | 主題（中文） | `termId` / 錨點 | 所在 block / 欄位 | 目前狀態（資料層） |
|---|----------------|-----------------|-------------------|---------------------|
| 1 | 加劇 | `aggravate` | `damageForms.blockedParts` | `blocked_needs_user_rule` |
| 2 | 收割 | `reap` | `damageForms.blockedParts` | `blocked_needs_user_rule` |
| 3 | 受傷轉移 | `damage_redirection` | `damageForms.blockedParts` | `blocked_needs_user_rule` |
| 4 | 受傷緩衝 | `damage_buffer` | `damageForms.blockedParts` | `blocked_needs_user_rule` |
| 5 | 格擋 | `block` | `damageForms.blockedParts` | `blocked_needs_user_rule` |
| 6 | 避免傷害 | `damage_avoidance` | `damageForms.blockedParts` | `blocked_needs_user_rule` |
| 7 | 重創 | `grievous` | `damageForms.blockedParts` | `blocked_needs_user_rule` |
| 8 | 特殊融合類加成（完整公式） | `special_fusion_bonus_formula` | `damageForms.blockedParts`；`damageConversion.specialFusionTypeBonus`、`blockedParts` | `specialFusionTypeBonus.status` = `blocked_needs_user_rule` |
| 9 | 爆擊：多次擊中通常只判定一次 | （機制敘述，非 section I 同名 term） | `critRules.multiHitTypicallySingleCritRoll`；`finalCritValueFormula` | block `partial`；公式子區 `partial` |
| 10 | 真實傷害：不再受大多數加成影響 | （schema：`trueDamage.noMostBonusesAgain`） | `damageForms.trueDamage` | 結構欄位已有；**排除名單未機讀定義** |

---

## 分項說明（已知 / 未知 / 需補資料）

### 1. 加劇（aggravate）

| 欄位 | 內容 |
|------|------|
| **已知規則** | 權威文本 section I 列為「尚未完整定義演算法」；在 damage form 語境中與 DoT 等機制並列（見 `mechanismsAffecting` / `mechanismsCannotAffectDot` 等結構與轉寫）。 |
| **未知規則** | 傷害計算順序、與 DoT / 其他減免的交互、數值堆疊規則、PVP/PVE 是否一致等。 |
| **目前狀態** | `extensions.damageForms.status` = `partial`；`blockedParts` 含 `aggravate`。無公式 helper、無 golden。 |
| **需要使用者提供的補充標準** | 官方或可追溯來源的：**完整演算式或逐步結算規則**、適用 damage form、與現有 A–H 章節的優先級關係。 |

### 2. 收割（reap）

| 欄位 | 內容 |
|------|------|
| **已知規則** | 同 section I 未定演算法；結構上與 DoT 相關列舉並存。 |
| **未知規則** | 觸發條件、結算時點、與擊中/持續/間接傷害的合成方式。 |
| **目前狀態** | `damageForms.blockedParts` 含 `reap`；無實作。 |
| **需要使用者提供的補充標準** | 可實作的**狀態機或公式**、範例數值表（含邊界例）。 |

### 3. 受傷轉移（damage_redirection）

| 欄位 | 內容 |
|------|------|
| **已知規則** | 列為未定演算法；語意上屬傷害路徑重導。 |
| **未知規則** | 分攤比例、多目標順序、與 reflect / buffer 的先後。 |
| **目前狀態** | `damageForms.blockedParts` 含 `damage_redirection`；無實作。 |
| **需要使用者提供的補充標準** | **分攤與結算順序**的明確規格（圖或逐步偽代碼）。 |

### 4. 受傷緩衝（damage_buffer）

| 欄位 | 內容 |
|------|------|
| **已知規則** | 列為未定演算法。 |
| **未知規則** | 緩衝池容量、消耗規則、溢出後是否重算下游減免。 |
| **目前狀態** | `damageForms.blockedParts` 含 `damage_buffer`；無實作。 |
| **需要使用者提供的補充標準** | **池子語意**與與 Life/ES 的交互順序。 |

### 5. 格擋（block）

| 欄位 | 內容 |
|------|------|
| **已知規則** | 列為未定演算法；與命中/閃避等機制區分需以官方文本為準。 |
| **未知規則** | 格擋率計算、與 armor / resist 的先後、是否二次檢定。 |
| **目前狀態** | `damageForms.blockedParts` 含 `block`；無實作。 |
| **需要使用者提供的補充標準** | **檢定流程**與與 `hit_and_evasion` 的明確邊界。 |

### 6. 避免傷害（damage_avoidance）

| 欄位 | 內容 |
|------|------|
| **已知規則** | 列為未定演算法；間接傷害等 form 的 `mechanismsAffecting` 中可能出現。 |
| **未知規則** | 與 evasion、閃避類詞條是否同構；堆疊方式。 |
| **目前狀態** | `damageForms.blockedParts` 含 `damage_avoidance`；無實作。 |
| **需要使用者提供的補充標準** | **定義與公式**（含與其他 avoidance 來源的合併規則）。 |

### 7. 重創（grievous）

| 欄位 | 內容 |
|------|------|
| **已知規則** | 列為未定演算法；與擊中傷害可影響機制列表相關。 |
| **未知規則** | 對治療/回復/傷害的具體修正方式與上限。 |
| **目前狀態** | `damageForms.blockedParts` 含 `grievous`；無實作。 |
| **需要使用者提供的補充標準** | **影響維度**（只影響回復？是否影響護盾？）與算式。 |

### 8. 特殊融合類加成 — 完整公式（C.7）

| 欄位 | 內容 |
|------|------|
| **已知規則** | 轉寫載明：每次傷害計算最多一次類似加成；**完整演算式未給**。`specialFusionTypeBonus.status` = `blocked_needs_user_rule`。`specialFusionTypeBonusBlocked()` 為真。 |
| **未知規則** | 融合判斷條件、加成數值形狀（inc/more/flat）、與 conversion 後類型加成的合併方式。 |
| **目前狀態** | `damageConversion` block `partial`；golden **BLOCK_C7** 要求維持 blocked，不可假裝已解。 |
| **需要使用者提供的補充標準** | **正式公式**或官方範例結算表；更新 ingest 前不得實作數值。 |

### 9. 爆擊：多次擊中通常只判定一次（G.2）

| 欄位 | 內容 |
|------|------|
| **已知規則** | `critRules.multiHitTypicallySingleCritRoll` = true（敘述層）；`finalCritValueFormula` 為 `partial`（G.5 與其他系統交錯順序未完全鎖死）。 |
| **未知規則** | 單次技能多 hit 時 crit roll 綁在技能層 / hit 層 / 帧層；與 channel、地雷、連鎖的差異。 |
| **目前狀態** | 公式層僅 EV 近似；註解 TODO，未接技能事件模型。 |
| **需要使用者提供的補充標準** | **事件模型規格**（每個 damaging event 如何掛 roll）或官方 FAQ 截圖+轉寫。 |

### 10. 真實傷害：不再受大多數加成影響

| 欄位 | 內容 |
|------|------|
| **已知規則** | `trueDamage.noMostBonusesAgain`、`ignoresResistAndArmor` 已結構化；golden **N** 驗證略過抗性/護甲。 |
| **未知規則** | 「大多數」的**完整 modifier 分類排除表**（哪些 increased/more/flat 仍適用）。 |
| **目前狀態** | 不實作排除名單；避免臆測。 |
| **需要使用者提供的補充標準** | **白名單或黑名單**（建議官方表格或逐條 tag 規則）。 |

---

## 與 `RuleStatus` 的關係（禁止偷偷升級）

- `blocked_needs_user_rule`：**不可**在未更新權威來源與 ingest 的情況下改為 `ready`。
- `partial`：**不可**在未補條款與使用者確認下，把子條款「預設成完整實作」。
- 若僅有 **applicability**（適用哪些 form / type）而無 **algorithm**，依 `combat-rules-import-sop.md` 的**提問閘門**處理 — **不得**自行撰寫數值公式。

---

## 維護

- 新增或解除 gap 時：同步更新本檔、`combat-rules-import-sop.md`（若流程變更）、以及 `types/combatRules.ts` / ETL（若 schema 變更）。
- 解除 gap 的最小證據：**新 source + 轉寫段落 +（必要時）新 golden case**，且通過 `verify:combat-rules`。
