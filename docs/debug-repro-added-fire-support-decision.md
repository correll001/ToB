# 最小重現 — Hammer_of_Ash × Added_Fire_Damage（4E-4）

Generated: 2026-04-04T15:28:50.411Z

資料來源：`getSkillDefinitionById`（與 runtime bundle 一致）。

## 輸入

- **active**: `skill:Hammer_of_Ash` → found (灰燼之鎚)
- **support**: `skill:Added_Fire_Damage` → found (附加火焰傷害)

## evaluateSupportAttachment(active, support)

```json
{
  "applied": true,
  "warnings": [
    "support_raw_requirements_trace:TLIDB: 輔助擊中敵人 → Attack|Spell"
  ],
  "rawRequirementLines": [
    "TLIDB: 輔助擊中敵人 → Attack|Spell"
  ]
}
```

### 欄位摘要（驗收用）

- **applied**: `true`
- **skipReason**: `—`
- **warnings**: ["support_raw_requirements_trace:TLIDB: 輔助擊中敵人 → Attack|Spell"]
- **rawRequirementLines**: ["TLIDB: 輔助擊中敵人 → Attack|Spell"]
- **active 原始 tags**: ["範圍","火焰","攻擊","投射物","近戰","破擊","直射"]
- **active canonical tags**（`activeCanonicalTagSet`）: ["Area","Attack","Demolish","Fire","Melee","Projectile","投射物","攻擊","火焰","直射","破擊","範圍","近戰"]

### `support.supportRules`（評估當下）

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

## 分類（A / B / C）

- **A** — support missing → 資料載入，不在規則
- **B** — `skipReason === requires_spell`
- **C** — `skipReason` 為 `allowedSkillTags_unsatisfied:…`（本例常為 Spell）

**本 run 分類**: `applied`

## 明確結論（驗收一句）

> 此 case **可套用**（`applied: true`，無 skipReason）。

## 備註

`applySupportRules.ts` 的 `ruleFailsOnTags` **先**檢查 `allowedSkillTags`，**再**檢查 `requiresSpell`。若兩者同時為 Spell 門檻，通常會先得到 `allowedSkillTags_unsatisfied:Spell`，而不是 `requires_spell`。
