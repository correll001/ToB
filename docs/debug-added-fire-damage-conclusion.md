# Added_Fire_Damage × Hammer_of_Ash — 調查結論封版（4E-5）

**用途**：給下一輪「修復卡」的輸入；**不必**為了同一議題重跑整條調查鏈。  
**最後彙整日期**：2026-04-04（與 4E-0～4E-4 腳本產出對齊；若資料或 override 變更請重跑下方腳本並更新矩陣）。

---

## 一句話給修復卡

**`Added_Fire_Damage` 在 `data/overrides/ss12/support-skills.json` 被 `supportRulesMerge` 覆寫成 Spell-only（`requiresSpell: true` + `allowedSkillTags: ["Spell"]`），與 normalized 層「擊中／Attack+Spell」不一致；runtime / effective / bundle 三者一致載入該覆寫後規則；`evaluateSupportAttachment` 對 `Hammer_of_Ash` 目前命中 `allowedSkillTags_unsatisfied:Spell`（因 `ruleFailsOnTags` 先檢查 allowed 標籤）。**

---

## 資料出處（管線）

| 階段 | 路徑或機制 |
| --- | --- |
| Raw | `data/raw/ss12/pages/tw/Added_Fire_Damage.*` |
| Normalized | `data/normalized/ss12/support-skills.json`（`skill:Added_Fire_Damage`） |
| Override | `data/overrides/ss12/support-skills.json`（`supportRulesMerge`，4E-2 註記） |
| Effective 分檔 | `data/effective/ss12/support-skills.json` |
| Effective → Runtime | `lib/gameData/generated/effective-runtime-bundle.json`（`runtimeDataset.ts` 靜態 import） |
| 規則試算 | `lib/formula/skills/applySupportRules.ts` → `evaluateSupportAttachment` |

---

## 判定鏈（從資料到 skipReason）

1. **ETL**：`applyOverrides` / `applySkillOverrideRecord` 以 `deepMerge` 把 `supportRulesMerge` 合入 `definition.supportRules`（陣列欄位整段取代）。
2. **Runtime**：`getSkillDefinitionById` 讀 bundled effective，無第二來源。
3. **相容性**：`evaluateSupportAttachment(active, support)` → `ruleFailsOnTags`：**先** `allowedSkillTags`，**再** `requiresSpell` 等。  
   - 同時設 `allowedSkillTags: [Spell]` 與 `requiresSpell: true` 時，對無 Spell 的 active 通常先得到 **`allowedSkillTags_unsatisfied:Spell`**，而非 `requires_spell`。

---

## 第一個出現 Spell-only 的層級

**Override 層**（`data/overrides/ss12/support-skills.json` 中 `skill:Added_Fire_Damage` 條目）。  
Normalized 層為 **`allowedSkillTags: ["Attack","Spell"]`** 與 TLIDB 導向之 `rawRequirementLines`，**非** Spell-only。

---

## 最終矩陣（4E-0～4E-4 彙總）

| 層級 | 是否存在（Added_Fire） | requiresSpell | allowedSkillTags（要點） | 結論 |
| --- | ---: | --- | --- | --- |
| **normalized** | 是 | 無（未設 true） | `Attack`, `Spell` | 與「輔助擊中」敘述一致；**非** Spell-only |
| **override** | 是 | **true** | 僅 `Spell` | **首次** Spell-only；覆寫 normalized 陣列 |
| **effective** | 是 | **true** | 僅 `Spell` | 與 override 合併結果一致 |
| **runtime**（bundle） | 是 | **true** | 僅 `Spell` | 與 effective 分檔一致（未發現殘留舊版） |
| **rule eval** | n/a | n/a | n/a | **`skipReason=allowedSkillTags_unsatisfied:Spell`**（對 `Hammer_of_Ash`）；`applied=false` |

---

## 佐證腳本與文件（可重跑）

| 卡片 | 指令 / 產物 |
| --- | --- |
| 4E-0 | `npm run debug:added-fire-damage-path` → `docs/debug-added-fire-damage-baseline.md` |
| 4E-1 | `npm run audit:added-fire-damage-refs` → `docs/debug-added-fire-damage-reference-map.md` |
| 4E-2 | `npm run verify:added-fire-damage-layers` → `docs/debug-added-fire-damage-layer-diff.md` |
| 4E-3 | `npm run debug:runtime-added-fire-damage` → `docs/debug-runtime-added-fire-damage.md` |
| 4E-4 | `npm run verify:repro-added-fire-support` → `docs/debug-repro-added-fire-support-decision.md` |
| 4E-5 | `npm run verify:skill-regression`（含存在性 + console probe）+ **本文件** |

---

## 回歸保護（程式）

`scripts/verify/skillRegressionCases.ts` 內 **4E-5** 區塊：

- **斷言**：`skill:Hammer_of_Ash` 與 `skill:Added_Fire_Damage` 必須存在於 **runtime bundle**（資料缺漏即失敗）。
- **不斷言** `applied` / `skipReason` 的「正確」結果（修資料後可能改為可套用）。
- **記錄**：每次跑 `verify:skill-regression` 會 `console.log` 當下 `applied`、`skipReason`、`rawRequirementLines`、`warnings`。

---

## 建議修法（僅建議，本輪未實作）

1. **對齊語意**：將 override 中 `Added_Fire_Damage` 的 `supportRulesMerge` 改為與 **normalized** 一致（例如恢復 `allowedSkillTags: ["Attack","Spell"]` 並移除不當的 `requiresSpell: true`），或依遊戲實際規格另訂權威規則並同步 **rawRequirementLines**。
2. **文件／註解**：若刻意維持 Spell-only，應在 override 註解與 UI 文案上說明與 TLIDB「擊中」敘述的差異，避免誤報 bug。
3. **修後**：可再把 4E-5 probe 的 log 當作手動驗收；若預期改為可套用，可另加一條 **可選** assert（屆時再開修復卡決定）。

---

## 已知非根因（已排除）

- **非** effective / runtime 漏收或版本漂移（4E-2、4E-3：分檔、bundle、lookup 一致）。
- **非** `applySupportRules` 單顆寶石硬編碼（問題在 **override 資料**）。
- **非** support 從 bundle 消失（4E-3、4E-5 存在性）。
