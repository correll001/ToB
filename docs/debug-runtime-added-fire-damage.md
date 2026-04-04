# Runtime 載入實值 — Added_Fire_Damage / Hammer_of_Ash（4E-3）

Generated: 2026-04-04T11:34:25.332Z

## Bundled dataset meta（getBundledSkillDatasetMeta）

```json
{
  "season": "ss12",
  "datasetVersionId": 9,
  "versionLabel": "ss12-e5f601cf3d334072",
  "effectiveLayer": "overrides@p0-4e2-1",
  "activeCount": 153,
  "supportCount": 122,
  "passiveCount": 55,
  "skillLevelRulesId": "tlidb-skill-level-ss12"
}
```

資料來源說明：`runtimeDataset.ts` 以 **webpack 靜態 import** 載入 `lib/gameData/generated/effective-runtime-bundle.json`，與 `data/effective/ss12/*.json` 是否一致取決於最後一次 `importEffectiveData` / 產 bundle 流程。

## skill:Added_Fire_Damage

- **runtime 是否載到**: 是
- **Spell-only 摘要（supportRules）**: requiresSpell:true, allowedSkillTags:["Spell"]

### Runtime — getSkillDefinitionById + getNormalizedSkillRecord（parseStatus）

```json
{
  "supportRules": {
    "allowedSkillTags": [
      "Spell"
    ],
    "rawRequirementLines": [
      "[override 4E-2] Spell skills (added fire)."
    ],
    "requiresSpell": true
  },
  "tags": [
    "火焰",
    "輔助"
  ],
  "parseStatus": "ok",
  "sourceUrl": "https://tlidb.com/tw/Added_Fire_Damage",
  "rawRequirementLines": [
    "[override 4E-2] Spell skills (added fire)."
  ]
}
```

### Disk bundle — lib/gameData/generated/effective-runtime-bundle.json（同一路徑 import）

```json
{
  "supportRules": {
    "allowedSkillTags": [
      "Spell"
    ],
    "rawRequirementLines": [
      "[override 4E-2] Spell skills (added fire)."
    ],
    "requiresSpell": true
  },
  "tags": [
    "火焰",
    "輔助"
  ],
  "parseStatus": "ok",
  "sourceUrl": "https://tlidb.com/tw/Added_Fire_Damage",
  "rawRequirementLines": [
    "[override 4E-2] Spell skills (added fire)."
  ]
}
```

### Effective 分檔 — data/effective/ss12/support-skills.json

```json
{
  "supportRules": {
    "allowedSkillTags": [
      "Spell"
    ],
    "rawRequirementLines": [
      "[override 4E-2] Spell skills (added fire)."
    ],
    "requiresSpell": true
  },
  "tags": [
    "火焰",
    "輔助"
  ],
  "parseStatus": "ok",
  "sourceUrl": "https://tlidb.com/tw/Added_Fire_Damage",
  "rawRequirementLines": [
    "[override 4E-2] Spell skills (added fire)."
  ]
}
```

#### Support 比對

- **runtime lookup vs disk bundle（lib/gameData/generated/effective-runtime-bundle.json）**: 一致
- **runtime lookup vs data/effective/ss12/support-skills.json**: 一致
- **disk bundle vs effective 分檔**: 一致

## skill:Hammer_of_Ash

- **runtime 是否載到**: 是
- **Spell-only 摘要（supportRules）**: （無 supportRules）

### Runtime — getSkillDefinitionById + getNormalizedSkillRecord（parseStatus）

```json
{
  "supportRules": null,
  "tags": [
    "範圍",
    "火焰",
    "攻擊",
    "投射物",
    "近戰",
    "破擊",
    "直射"
  ],
  "parseStatus": "ok",
  "sourceUrl": "https://tlidb.com/tw/Hammer_of_Ash",
  "rawRequirementLines": null
}
```

### Disk bundle — lib/gameData/generated/effective-runtime-bundle.json（同一路徑 import）

```json
{
  "supportRules": null,
  "tags": [
    "範圍",
    "火焰",
    "攻擊",
    "投射物",
    "近戰",
    "破擊",
    "直射"
  ],
  "parseStatus": "ok",
  "sourceUrl": "https://tlidb.com/tw/Hammer_of_Ash",
  "rawRequirementLines": null
}
```

### Effective 分檔 — data/effective/ss12/active-skills.json

```json
{
  "supportRules": null,
  "tags": [
    "範圍",
    "火焰",
    "攻擊",
    "投射物",
    "近戰",
    "破擊",
    "直射"
  ],
  "parseStatus": "ok",
  "sourceUrl": "https://tlidb.com/tw/Hammer_of_Ash",
  "rawRequirementLines": null
}
```

#### Active 比對

- **runtime lookup vs disk bundle（lib/gameData/generated/effective-runtime-bundle.json）**: 一致
- **runtime lookup vs data/effective/ss12/active-skills.json**: 一致
- **disk bundle vs effective 分檔**: 一致

## 驗收摘要

| 問題 | 答案（請以上方比對區塊為準） |
| --- | --- |
| runtime 是否載到 Added_Fire_Damage？ | 見 Added_Fire_Damage 小節 |
| runtime 看到的 rule？ | 見該小節 `supportRules` |
| runtime 與 generated bundle 是否一致？ | 應一致；若否代表 import 路徑或快取異常 |
| runtime/bundle 與 data/effective 分檔是否一致？ | 若否 → 需重跑產 bundle / import |
