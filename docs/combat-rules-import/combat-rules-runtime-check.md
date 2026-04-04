# Combat rules — runtime bundle check（4E-4）

Generated: 2026-04-04T12:52:11.507Z

資料來源：`lib/gameData/generated/effective-runtime-bundle.json` → `getRuntimeDataset().bundle.combatRules`（**無網路**）。

## getBundledStructuredCombatRules()

**結果**：已載入。

```json
{
  "schemaId": "tob.structuredCombatRules.v1",
  "season": "ss12",
  "locale": "zh-Hant",
  "ingestedAt": "2026-04-04T12:46:32.515Z",
  "primaryManifestRelativePath": "data/raw/ss12/global-rules/screenshot-sources.json"
}
```

## Typed getters — 摘要表

| getter | 有資料 | `status` |
| --- | --- | --- |
| `getDamageFormsRules` | 是 | partial |
| `getDamageTypesRules` | 是 | ready |
| `getDamageConversionRules` | 是 | partial |
| `getResistancePenetrationRules` | 是 | ready |
| `getArmorReductionPenetrationRules` | 是 | ready |
| `getDamageFormulaRules` | 是 | ready |
| `getCritRules` | 是 | partial |
| `getDoubleDamageRules` | 是 | ready |

## Block-level provenance（`getStructuredCombatRulesProvenanceSummary`）

| block | `status` | `#sources` | `topicId`(s) |
| --- | --- | --- | --- |
| `damageForms` | partial | 1 | damage_forms |
| `damageTypes` | ready | 1 | damage_types |
| `damageConversion` | partial | 1 | damage_conversion |
| `resistancePenetration` | ready | 1 | resistance_penetration |
| `armorReductionPenetration` | ready | 1 | armor_reduction_penetration |
| `damageFormula` | ready | 1 | damage_formula |
| `critRules` | partial | 1 | crit_rules |
| `doubleDamageRules` | ready | 1 | double_damage_rules |

## 範例結構（damageTypes，JSON 摘要）

```json
{
  "status": "ready",
  "sources": [
    {
      "manifestRelativePath": "data/raw/ss12/global-rules/screenshot-sources.json",
      "topicId": "damage_types",
      "sourceId": "auth-text-damage-types-b",
      "transcriptRelativePath": "docs/game-rule-transcripts/damage-types.md",
      "quoteBlockIndices": [
        0,
        1
      ],
      "clauseNumbers": [
        1,
        2
      ]
    }
  ],
  "types": [
    "physical",
    "fire",
    "cold",
    "lightning",
    "corrosion"
  ],
  "nonPhysicalAffectedByMatchingResistance": true,
  "resistanceAppliesTo": {
    "physical": false,
    "fire": true,
    "cold": true,
    "lightning": true,
    "corrosion": true
  }
}
```

## 驗收對照

- getter 回傳型別為 `types/combatRules.ts` 之 block，**非**自由文字。
- 規則集中於 `runtimeRulesLookup.ts`，**未**散寫於 component。
- 若 `structuredCombatRules` 為 `undefined`，代表 bundle 尚未含 4E-2 ingest。
