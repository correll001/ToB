/**
 * 4E-4 — Minimal repro: Hammer_of_Ash × Added_Fire_Damage → evaluateSupportAttachment (exact skipReason).
 * Read-only; writes docs/debug-repro-added-fire-support-decision.md
 *
 *   npx tsx scripts/verify/reproAddedFireDamageSupportDecision.ts
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { evaluateSupportAttachment } from '@/lib/formula/skills/applySupportRules'
import { activeCanonicalTagSet } from '@/lib/formula/skills/tagVocabulary'
import { getSkillDefinitionById } from '@/lib/runtime/runtimeSkillLookup'
import type { SkillDefinition } from '@/types/skillData'

const ACTIVE_ID = 'skill:Hammer_of_Ash'
const SUPPORT_ID = 'skill:Added_Fire_Damage'
const OUT_REL = 'docs/debug-repro-added-fire-support-decision.md'

function sortedCanonTags(active: SkillDefinition): string[] {
  return [...activeCanonicalTagSet(active.tags)].sort((a, b) => a.localeCompare(b, 'en'))
}

function verdict(
  active: SkillDefinition | undefined,
  support: SkillDefinition | undefined,
  ev: ReturnType<typeof evaluateSupportAttachment> | null,
): string {
  if (!support) return '此 case 是 **support 缺失**（`SUPPORT_MISSING_BEFORE_RULE_EVAL`，問題在資料載入，不在規則）。'
  if (!active) return '此 case 是 **active 缺失**（`ACTIVE_MISSING_BEFORE_RULE_EVAL`）。'
  if (!ev) return '（未評估）'
  if (ev.applied) return '此 case **可套用**（`applied: true`，無 skipReason）。'

  const sr = ev.skipReason ?? ''
  if (sr === 'requires_spell') {
    return '此 case 是 **requiresSpell gate**（`skipReason === requires_spell`）。'
  }
  if (sr.startsWith('allowedSkillTags_unsatisfied:')) {
    const tail = sr.slice('allowedSkillTags_unsatisfied:'.length)
    if (tail.split(',').map((s) => s.trim()).includes('Spell')) {
      return '此 case 是 **allowedSkillTags Spell-only gate**（`skipReason` 為 `allowedSkillTags_unsatisfied:…`，允許標籤未命中）。'
    }
    return `此 case 是 **allowedSkillTags gate**（\`${sr}\`）。`
  }
  return `此 case 的 skipReason 為 \`${sr}\`（非上述 A/B/C 範本）。`
}

function bucket(
  active: SkillDefinition | undefined,
  support: SkillDefinition | undefined,
  ev: ReturnType<typeof evaluateSupportAttachment> | null,
): 'A' | 'B' | 'C' | 'applied' | 'other' {
  if (!support) return 'A'
  if (!active || !ev) return 'other'
  if (ev.applied) return 'applied'
  if (ev.skipReason === 'requires_spell') return 'B'
  if (ev.skipReason?.startsWith('allowedSkillTags_unsatisfied:')) return 'C'
  return 'other'
}

function main() {
  const active = getSkillDefinitionById(ACTIVE_ID)
  const support = getSkillDefinitionById(SUPPORT_ID)

  const md: string[] = []
  const out = (s: string) => {
    console.log(s)
    md.push(s)
  }

  md.push('# 最小重現 — Hammer_of_Ash × Added_Fire_Damage（4E-4）')
  md.push('')
  md.push(`Generated: ${new Date().toISOString()}`)
  md.push('')
  md.push('資料來源：`getSkillDefinitionById`（與 runtime bundle 一致）。')
  md.push('')

  out('## 輸入')
  out('')
  out(`- **active**: \`${ACTIVE_ID}\` → ${active ? `found (${active.name})` : '**MISSING**'}`)
  out(`- **support**: \`${SUPPORT_ID}\` → ${support ? `found (${support.name})` : '**MISSING**'}`)
  out('')

  let ev: ReturnType<typeof evaluateSupportAttachment> | null = null
  if (!support) {
    out('## evaluateSupportAttachment')
    out('')
    out('**未呼叫** `evaluateSupportAttachment`（support 不存在）。')
    out('')
    out('```')
    out('SUPPORT_MISSING_BEFORE_RULE_EVAL')
    out('```')
    out('')
  } else if (!active) {
    out('## evaluateSupportAttachment')
    out('')
    out('**未呼叫** `evaluateSupportAttachment`（active 不存在）。')
    out('')
    out('```')
    out('ACTIVE_MISSING_BEFORE_RULE_EVAL')
    out('```')
    out('')
  } else {
    ev = evaluateSupportAttachment(active, support)
    const canon = sortedCanonTags(active)
    out('## evaluateSupportAttachment(active, support)')
    out('')
    out('```json')
    out(JSON.stringify(ev, null, 2))
    out('```')
    out('')
    out('### 欄位摘要（驗收用）')
    out('')
    out(`- **applied**: \`${ev.applied}\``)
    out(`- **skipReason**: \`${ev.skipReason ?? '—'}\``)
    out(`- **warnings**: ${JSON.stringify(ev.warnings)}`)
    out(`- **rawRequirementLines**: ${JSON.stringify(ev.rawRequirementLines ?? null)}`)
    out(`- **active 原始 tags**: ${JSON.stringify(active.tags)}`)
    out(`- **active canonical tags**（\`activeCanonicalTagSet\`）: ${JSON.stringify(canon)}`)
    out('')
    out('### `support.supportRules`（評估當下）')
    out('')
    out('```json')
    out(JSON.stringify(support.supportRules ?? null, null, 2))
    out('```')
    out('')
  }

  const b = bucket(active, support, ev)
  out('## 分類（A / B / C）')
  out('')
  out('- **A** — support missing → 資料載入，不在規則')
  out('- **B** — `skipReason === requires_spell`')
  out('- **C** — `skipReason` 為 `allowedSkillTags_unsatisfied:…`（本例常為 Spell）')
  out('')
  out(`**本 run 分類**: \`${b}\``)
  out('')

  out('## 明確結論（驗收一句）')
  out('')
  out(`> ${verdict(active, support, ev)}`)
  out('')

  out('## 備註')
  out('')
  out('`applySupportRules.ts` 的 `ruleFailsOnTags` **先**檢查 `allowedSkillTags`，**再**檢查 `requiresSpell`。若兩者同時為 Spell 門檻，通常會先得到 `allowedSkillTags_unsatisfied:Spell`，而不是 `requires_spell`。')
  out('')

  writeFileSync(join(process.cwd(), OUT_REL), md.join('\n'), 'utf8')
  console.log(`\nWrote ${OUT_REL}`)
}

main()
