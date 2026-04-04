# 4F-2 Active Skills 全量結構化

## 做了什麼

- **`scripts/etl/skillPageParser.ts`**：改為只解析 **`.card-header` 含「成長」** 區塊内的 `table.DataTable`，避免誤吞 **Minion / skill_level** 等分頁表格。
  - **四欄表**（level / 傷害倍率 / damage / Descript）：抽出 `weaponDamagePct`、`baseDamage`（法術區間取中點）、`projectileCount`、`addedDamageEffectiveness`，並寫入 `definition.levelTable`。
  - **二欄表**（僅數值／敘述成長，如位移、戰吼、詛咒印記）：每級寫入 `textLines`，滿足 **level row 可解析**。
  - 卡片上的 **魔力消耗 / 施法或攻擊速度 / 冷卻** 對應合併進 **卡片等級**列（預設 Lv20）。
  - 無成長表時：`unsupportedLevelDataReason: "no_growth_table_in_snapshot"`（wiki 頁面在快照中確實沒有成長區塊）。
  - **有成長表且列上已有武器 %** 時，不再從 card 重複掃 `extractActiveWeaponPct`，避免雙計武器傷害。
- **`types/skillData.ts`**：`SkillLevelEntry.weaponDamagePct`、`SkillDefinition.unsupportedLevelDataReason`。
- **`lib/formula/skills/levelRowModifiers.ts`**：level row 上的 `weaponDamagePct` → `skill.weaponDamagePct` modifier。
- **`lib/formula/skills/inferDamageRole.ts`**：`hasStructuralDamageEvidence` 認列上的 `weaponDamagePct`。
- **`scripts/etl/shared.ts`**：`NORMALIZE_PARSER_VERSION` **1 → 2**。
- **`scripts/verify/verifyActiveSkillStructuralCoverage.ts`**：結構合約 + `npm run verify:4e` 鏈。
- **`report*`**：`missingLevelTable` / Lv20 缺口統計 **納入** `unsupportedLevelDataReason`（與 4F-2 verify 一致）。

## 建置指令（維護）

```bash
npm run etl:normalize:skills
npm run etl:apply-overrides
npx tsx scripts/import/importEffectiveData.ts --season=ss12
npx tsx scripts/import/freezeEffectiveDataset.ts --season=ss12
npm run verify:active-skill-structural
npm run verify:4e
```

## 改善前後對照（coverage 矩陣）

| 指標（active） | 4F-2 前（約，`report:full-skill-coverage`） | 4F-2 後 |
|----------------|---------------------------------------------|---------|
| `parseStatus` partial（全檔） | 7 | **0** |
| missing `levelTable`（未計入明確 unsupported） | 142 | **0** |
| Lv20 `resolveLevelRow === none`（未計入明確 unsupported） | 129 | **0** |
| damaging 但 isolated instance confidence ≠ ready | 31 | **0** |

> 註：「missing levelTable」在 4F-2 後若仅有 `unsupportedLevelDataReason` 而無表，**不**再計入結構缺口（仍無 Lv20 數值列可給公式用）。

## 現況數字（effective bundle，一次執行）

| 項目 | 數值 |
|------|------|
| Active 總數 | **153** |
| `parseStatus`（active） | **ok=153** |
| Instance `calculationConfidence` @ Lv20（`verify:active-skill-structural`） | **ready=107** · **partial=0** · **unsupported=46** |
| `inferSkillCombatRole` @ Lv20 | damaging **79** · utility **17** · summon-driver **10** · aura-only **1** · **unknown 46** |
| 明確 `unsupportedLevelDataReason`（頁面无「成長」表） | **37** |

### 仍為 `unknown` / instance `unsupported` 的常見原因

- **無成長表**（37 顆）：已標 `unsupportedLevelDataReason`，無 Lv20 列；多戰吼／印記／輔助型主動，或 TLIDB 未放成長表之頁。
- **其餘**：無法從 tag 排除 utility/summon、且無結構化傷害證據（例如僅敘述、無表、無武器%/基底傷害列）— 請後續用 **override** 補表或補 modifier，勿在 runtime hardcode。

### `parseStatus` 仍 partial 的 active

- **無**：目前 **153 / 153** 均為 **ok**。

---

維護：parser 或快照格式變更後請重跑 **normalize → apply-overrides → import --season=ss12 → freeze** 並更新上表。
