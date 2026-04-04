# Added_Fire_Damage — normalized / override / effective 差異（4E-2）

Generated: 2026-04-04T11:32:43.400Z

## 結論摘要

- **最早出現 Spell-only 的層級**: **Override 層**（`data/overrides/ss12/support-skills.json` 的 `supportRulesMerge` 與 normalized 合併後首次成為 Spell-only）
- **Spell-only 偵測**（`requiresSpell === true` 或 `allowedSkillTags === ["Spell"]`）: normalized=false → merged( norm + overrideMerge )=true → effective=true
- **rawRequirementLines 是否支持 Spell-only 判定**: `rawRequirementLines` 文字與 Spell-only **一致**
- **modifiers 與 rules**: normalized **summaryText** 含「擊中／輔助擊中」語意，與 **Spell-only** 門檻可能語意衝突（實際仍以 `supportRules` 為準）。
- **override 是否把「含 Attack」收窄成 Spell-only**: 是 — normalized `allowedSkillTags` 含 **Attack**，effective 僅 **Spell**（`deepMerge` 以 patch 陣列**整段取代**原陣列）

### 路線判讀

- **路線 2**：normalized 非 Spell-only，override 合併後變 Spell-only → 疑 **人工 override / 套版規則**（`data/overrides/.../support-skills.json`）。

### 合併預覽（驗證 ETL `deepMerge`）

`effective.supportRules` 應等於 `deepMerge(normalized.supportRules ?? {}, override.supportRulesMerge ?? {})`。預覽：

```json
{
  "allowedSkillTags": [
    "Spell"
  ],
  "rawRequirementLines": [
    "[override 4E-2] Spell skills (added fire)."
  ],
  "requiresSpell": true
}
```

- **與 effective.supportRules 結構比對**: 一致

## 跨層欄位對照表

| 欄位 | normalized | override（patch） | effective |
| --- | --- | --- | --- |
| **id** | `skill:Added_Fire_Damage` | `skill:Added_Fire_Damage` *(條目 id)* | `skill:Added_Fire_Damage` |
| **name** | "附加火焰傷害" | — *(override 條目未提供此欄，不覆寫 definition)* | "附加火焰傷害" |
| **family** | "support" | — *(override 條目未提供此欄，不覆寫 definition)* | "support" |
| **supportRules（列內為摘要；全文見下方 §）** | `{"allowedSkillTags":["Attack","Spell"],"rawRequirementLines":["TLIDB: 輔助擊中敵人 → Attack\|Spell"]}` | `{"requiresSpell":true,"allowedSkillTags":["Spell"],"rawRequirementLines":["[override 4E-2] Spell skills (added fire)."]}` | `{"allowedSkillTags":["Spell"],"rawRequirementLines":["[override 4E-2] Spell skills (added fire)."],"requiresSpell":true}` |
| **allowedSkillTags** | `["Attack","Spell"]` | `["Spell"]` | `["Spell"]` |
| **requiresAttack** | `undefined` | `undefined` | `undefined` |
| **requiresSpell** | `undefined` | `true` | `true` |
| **rawRequirementLines** | `["TLIDB: 輔助擊中敵人 → Attack\|Spell"]` | `["[override 4E-2] Spell skills (added fire)."]` | `["[override 4E-2] Spell skills (added fire)."]` |
| **modifiers（摘要）** | 1 modifier(s); first id=? | — *(未 append/replace)* | 1 modifier(s); first id=? |

## supportRules / supportRulesMerge 全文（JSON）

### normalized → `definition.supportRules`

```json
{
  "allowedSkillTags": [
    "Attack",
    "Spell"
  ],
  "rawRequirementLines": [
    "TLIDB: 輔助擊中敵人 → Attack|Spell"
  ]
}
```

### override → `supportRulesMerge`（僅 patch）

```json
{
  "requiresSpell": true,
  "allowedSkillTags": [
    "Spell"
  ],
  "rawRequirementLines": [
    "[override 4E-2] Spell skills (added fire)."
  ]
}
```

### effective → `definition.supportRules`

```json
{
  "allowedSkillTags": [
    "Spell"
  ],
  "rawRequirementLines": [
    "[override 4E-2] Spell skills (added fire)."
  ],
  "requiresSpell": true
}
```

## 其它 `data/overrides` 檔案

以字串 `Added_Fire_Damage` 掃描 `data/overrides/**/*.json`：**1** 個檔案命中。

- `data/overrides/ss12/support-skills.json`

## 參考：ETL 合併實作

- `scripts/etl/applySkillOverride.ts` — `supportRulesMerge` 以 `deepMerge` 寫入 `definition.supportRules`
- `scripts/etl/applyOverrides.ts` — normalized + overrides → effective
- `scripts/import/importEffectiveData.ts` — effective → DB / bundle（本腳本不比對 DB）
