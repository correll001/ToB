# Debug baseline — Added_Fire_Damage × Hammer_of_Ash（4E-0）

Generated: 2026-04-04T11:22:01.741Z

## A. 主技能 `skill:Hammer_of_Ash`（effective active-skills）
- **存在性**: 是（name: 灰燼之鎚）
- **原始 tags**: `["範圍","火焰","攻擊","投射物","近戰","破擊","直射"]`
- **canonical 展開（含原文 + 對照）**: `["Area","Attack","Demolish","Fire","Melee","Projectile","投射物","攻擊","火焰","直射","破擊","範圍","近戰"]`
- **含 Attack（canonical）**: true
- **含 Spell（canonical）**: false
- **結論（A）**: 若僅有 Attack、無 Spell，則「主技能被誤標成 Spell」**不是**此組資料下的原因；與 `requiresSpell` 衝突時應往 **support 規則 / override 合併** 追查。

## B. 輔助 `skill:Added_Fire_Damage`（effective support-skills）
- **存在性**: 是（name: 附加火焰傷害）
- **原始 tags**: `["火焰","輔助"]`
- **supportRules（effective 合併後）**:
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
- **record warnings**: `[override-note] 4E-2: spell gem`

## C. 引擎試算：`evaluateSupportAttachment(Hammer_of_Ash, Added_Fire_Damage)`
```json
{
  "applied": false,
  "warnings": [
    "allowedSkillTags_unsatisfied:Spell"
  ],
  "skipReason": "allowedSkillTags_unsatisfied:Spell",
  "rawRequirementLines": [
    "[override 4E-2] Spell skills (added fire)."
  ]
}
```
- **applied**: false；**skipReason**: `allowedSkillTags_unsatisfied:Spell`（與 `applySupportRules` 一致）
- **規則順序備註**：`ruleFailsOnTags` 先檢查 `allowedSkillTags`，再檢查 `requiresSpell`。本例同時設了 `allowedSkillTags: ["Spell"]` 與 `requiresSpell: true`，實際命中的是 **`allowedSkillTags_unsatisfied`**（若僅有後者，會顯示 `requires_spell`）。

## D. `applySupportRules.ts`（`ruleFailsOnTags`）判斷摘要

資料來源：`lib/formula/skills/applySupportRules.ts`（只讀摘要，非修改）。

1. **forbiddenSkillTags**：主技能 canonical tag 集若命中任一禁止 tag → `forbidden_tag:<t>`。
2. **allowedSkillTags**：若陣列非空，主技能須至少命中其中一個（中英對照經 `zhTagToCanonical`）→ 否則 `allowedSkillTags_unsatisfied:...`。
3. **requiresAttack**：`true` 且主技能無 canonical `Attack` → `requires_attack`。
4. **requiresSpell**：`true` 且主技能無 canonical `Spell` → `requires_spell`。
5. **requiresProjectile / requiresChanneled / requiresMelee**：同理對應 canonical 鍵。
6. **無 supportRules 或空物件**：視為相容，`applied: true`（帶 warning）。

主技能 tag 集：`activeCanonicalTagSet(active.tags)` — 同時保留原文與 `zhTagToCanonical` 結果（見 `tagVocabulary.ts`）。


## E. 與 override 層的對照（只讀路徑）

若 effective 中 `Added_Fire_Damage.supportRules` 出現 `requiresSpell` / `allowedSkillTags: ["Spell"]`，請打開 **`data/overrides/ss12/support-skills.json`** 搜尋 `"id": "skill:Added_Fire_Damage"` 的 `supportRulesMerge`（本 repo 目前註記為 **4E-2: spell gem**，會合併進 effective；本輪僅記錄路徑，不修改）。

## F. 回歸缺口

- `scripts/verify/skillRegressionCases.ts` 目前**無** `Added_Fire_Damage` + `Hammer_of_Ash` 的固定案例（後續 4E-x 可補）。