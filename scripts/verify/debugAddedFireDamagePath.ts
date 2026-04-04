/**
 * 4E-0 — Baseline evidence: Added_Fire_Damage vs Hammer_of_Ash (Spell-only diagnosis).
 * Read-only: loads effective JSON + summarizes applySupportRules; writes docs/debug-added-fire-damage-baseline.md
 *
 *   npx tsx scripts/verify/debugAddedFireDamagePath.ts
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { evaluateSupportAttachment } from '@/lib/formula/skills/applySupportRules'
import { activeCanonicalTagSet } from '@/lib/formula/skills/tagVocabulary'
import type { SkillDefinition } from '@/types/skillData'

const MAIN_ID = 'skill:Hammer_of_Ash'
const SUPPORT_ID = 'skill:Added_Fire_Damage'

type EffectiveSkillFile = {
  meta?: Record<string, unknown>
  skills: Array<{ parseStatus?: string; definition: SkillDefinition; warnings?: string[] }>
}

function loadEffectiveJson(rel: string): EffectiveSkillFile {
  const p = join(process.cwd(), 'data', 'effective', 'ss12', rel)
  const raw = readFileSync(p, 'utf8')
  return JSON.parse(raw) as EffectiveSkillFile
}

function findDef(file: EffectiveSkillFile, id: string): SkillDefinition | null {
  const row = file.skills.find((s) => s.definition?.id === id)
  return row?.definition ?? null
}

function applySupportRulesSummaryMd(): string {
  return [
    '資料來源：`lib/formula/skills/applySupportRules.ts`（只讀摘要，非修改）。',
    '',
    '1. **forbiddenSkillTags**：主技能 canonical tag 集若命中任一禁止 tag → `forbidden_tag:<t>`。',
    '2. **allowedSkillTags**：若陣列非空，主技能須至少命中其中一個（中英對照經 `zhTagToCanonical`）→ 否則 `allowedSkillTags_unsatisfied:...`。',
    '3. **requiresAttack**：`true` 且主技能無 canonical `Attack` → `requires_attack`。',
    '4. **requiresSpell**：`true` 且主技能無 canonical `Spell` → `requires_spell`。',
    '5. **requiresProjectile / requiresChanneled / requiresMelee**：同理對應 canonical 鍵。',
    '6. **無 supportRules 或空物件**：視為相容，`applied: true`（帶 warning）。',
    '',
    '主技能 tag 集：`activeCanonicalTagSet(active.tags)` — 同時保留原文與 `zhTagToCanonical` 結果（見 `tagVocabulary.ts`）。',
    '',
  ].join('\n')
}

function main() {
  const activeFile = loadEffectiveJson('active-skills.json')
  const supportFile = loadEffectiveJson('support-skills.json')

  const hammer = findDef(activeFile, MAIN_ID)
  const addedFire = findDef(supportFile, SUPPORT_ID)

  const lines: string[] = []
  const md: string[] = []

  md.push('# Debug baseline — Added_Fire_Damage × Hammer_of_Ash（4E-0）')
  md.push('')
  md.push(`Generated: ${new Date().toISOString()}`)
  md.push('')
  md.push('## A. 主技能 `skill:Hammer_of_Ash`（effective active-skills）')
  if (!hammer) {
    lines.push(`NOT_FOUND_IN_EFFECTIVE_ACTIVES: ${MAIN_ID}`)
    md.push(`- **存在性**: 否 → \`NOT_FOUND_IN_EFFECTIVE_ACTIVES\``)
  } else {
    lines.push(`FOUND: ${MAIN_ID} name=${hammer.name}`)
    md.push(`- **存在性**: 是（name: ${hammer.name}）`)
    md.push(`- **原始 tags**: \`${JSON.stringify(hammer.tags)}\``)
    const canon = [...activeCanonicalTagSet(hammer.tags)]
    canon.sort((a, b) => a.localeCompare(b, 'en'))
    md.push(`- **canonical 展開（含原文 + 對照）**: \`${JSON.stringify(canon)}\``)
    const hasSpellCanon = canon.includes('Spell')
    const hasAttackCanon = canon.includes('Attack')
    md.push(`- **含 Attack（canonical）**: ${hasAttackCanon}`)
    md.push(`- **含 Spell（canonical）**: ${hasSpellCanon}`)
    md.push(
      `- **結論（A）**: 若僅有 Attack、無 Spell，則「主技能被誤標成 Spell」**不是**此組資料下的原因；與 \`requiresSpell\` 衝突時應往 **support 規則 / override 合併** 追查。`,
    )
  }
  md.push('')

  md.push('## B. 輔助 `skill:Added_Fire_Damage`（effective support-skills）')
  if (!addedFire) {
    lines.push(`NOT_FOUND_IN_EFFECTIVE_SUPPORTS: ${SUPPORT_ID}`)
    md.push(`- **存在性**: 否 → \`NOT_FOUND_IN_EFFECTIVE_SUPPORTS\`（問題含資料缺漏或 runtime 未吃 effective）`)
  } else {
    lines.push(`FOUND: ${SUPPORT_ID} name=${addedFire.name}`)
    md.push(`- **存在性**: 是（name: ${addedFire.name}）`)
    md.push(`- **原始 tags**: \`${JSON.stringify(addedFire.tags)}\``)
    const rules = addedFire.supportRules
    if (!rules || Object.keys(rules).length === 0) {
      md.push('- **supportRules**: `{}` 或缺漏（引擎會視為相容）')
    } else {
      md.push(`- **supportRules（effective 合併後）**:`)
      md.push('```json')
      md.push(JSON.stringify(rules, null, 2))
      md.push('```')
    }
    const wr = supportFile.skills.find((s) => s.definition?.id === SUPPORT_ID)
    if (wr?.warnings?.length) {
      md.push(`- **record warnings**: ${wr.warnings.map((w) => `\`${w}\``).join(', ')}`)
    }
  }
  md.push('')

  md.push('## C. 引擎試算：`evaluateSupportAttachment(Hammer_of_Ash, Added_Fire_Damage)`')
  if (hammer && addedFire) {
    const ev = evaluateSupportAttachment(hammer, addedFire)
    md.push('```json')
    md.push(JSON.stringify(ev, null, 2))
    md.push('```')
    md.push(
      `- **applied**: ${ev.applied}；**skipReason**: \`${ev.skipReason ?? '—'}\`（與 \`applySupportRules\` 一致）`,
    )
    md.push(
      '- **規則順序備註**：`ruleFailsOnTags` 先檢查 `allowedSkillTags`，再檢查 `requiresSpell`。本例同時設了 `allowedSkillTags: [\"Spell\"]` 與 `requiresSpell: true`，實際命中的是 **`allowedSkillTags_unsatisfied`**（若僅有後者，會顯示 `requires_spell`）。',
    )
  } else {
    md.push('- （略：缺主技能或輔助定義）')
  }
  md.push('')

  md.push('## D. `applySupportRules.ts`（`ruleFailsOnTags`）判斷摘要')
  md.push('')
  md.push(applySupportRulesSummaryMd())
  md.push('')

  md.push('## E. 與 override 層的對照（只讀路徑）')
  md.push('')
  md.push(
    '若 effective 中 `Added_Fire_Damage.supportRules` 出現 `requiresSpell` / `allowedSkillTags: [\"Spell\"]`，請打開 **`data/overrides/ss12/support-skills.json`** 搜尋 `\"id\": \"skill:Added_Fire_Damage\"` 的 `supportRulesMerge`（本 repo 目前註記為 **4E-2: spell gem**，會合併進 effective；本輪僅記錄路徑，不修改）。',
  )
  md.push('')

  md.push('## F. 回歸缺口')
  md.push('')
  md.push(
    '- `scripts/verify/skillRegressionCases.ts` 目前**無** `Added_Fire_Damage` + `Hammer_of_Ash` 的固定案例（後續 4E-x 可補）。',
  )

  const outPath = join(process.cwd(), 'docs', 'debug-added-fire-damage-baseline.md')
  writeFileSync(outPath, md.join('\n'), 'utf8')

  console.log('[debug:added-fire-damage-path] wrote', outPath)
  for (const l of lines) console.log(l)
  console.log('[debug:added-fire-damage-path] OK')
}

main()
