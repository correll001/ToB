/**
 * 4E-4 — Print bundled structured combat rules (runtime getters); writes combat-rules-runtime-check.md
 *
 *   npx tsx scripts/verify/debugRuntimeStructuredCombatRules.ts
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  getArmorReductionPenetrationRules,
  getBundledStructuredCombatRules,
  getCritRules,
  getDamageConversionRules,
  getDamageFormulaRules,
  getDamageFormsRules,
  getDamageTypesRules,
  getDoubleDamageRules,
  getResistancePenetrationRules,
  getStructuredCombatRulesProvenanceSummary,
} from '@/lib/runtime/runtimeRulesLookup'

const OUT = 'docs/combat-rules-import/combat-rules-runtime-check.md'

function main() {
  const root = getBundledStructuredCombatRules()
  const md: string[] = []
  const log = (s: string) => {
    console.log(s)
    md.push(s)
  }

  md.push('# Combat rules — runtime bundle check（4E-4）')
  md.push('')
  md.push(`Generated: ${new Date().toISOString()}`)
  md.push('')
  md.push('資料來源：`lib/gameData/generated/effective-runtime-bundle.json` → `getRuntimeDataset().bundle.combatRules`（**無網路**）。')
  md.push('')

  log('## getBundledStructuredCombatRules()')
  log('')
  if (!root) {
    log('**結果**：`undefined` — bundle 內 `rules.structuredCombatRules` 缺失。請執行 `npm run data:import:effective -- --season=ss12`（或含 `--no-activate`）自 `data/effective/ss12/combat-rules.json` 重新產生 bundle。')
    log('')
  } else {
    log('**結果**：已載入。')
    log('')
    log('```json')
    log(JSON.stringify(root.meta, null, 2))
    log('```')
    log('')
  }

  log('## Typed getters — 摘要表')
  log('')
  log('| getter | 有資料 | `status` |')
  log('| --- | --- | --- |')
  const rows = [
    ['getDamageFormsRules', getDamageFormsRules()],
    ['getDamageTypesRules', getDamageTypesRules()],
    ['getDamageConversionRules', getDamageConversionRules()],
    ['getResistancePenetrationRules', getResistancePenetrationRules()],
    ['getArmorReductionPenetrationRules', getArmorReductionPenetrationRules()],
    ['getDamageFormulaRules', getDamageFormulaRules()],
    ['getCritRules', getCritRules()],
    ['getDoubleDamageRules', getDoubleDamageRules()],
  ].map(([name, block]) => ({
    name: name as string,
    block: block as { status?: string } | undefined,
  }))
  for (const r of rows) {
    log(`| \`${r.name}\` | ${r.block ? '是' : '否'} | ${r.block?.status ?? '—'} |`)
  }
  log('')

  log('## Block-level provenance（`getStructuredCombatRulesProvenanceSummary`）')
  log('')
  log('| block | `status` | `#sources` | `topicId`(s) |')
  log('| --- | --- | --- | --- |')
  for (const row of getStructuredCombatRulesProvenanceSummary()) {
    log(
      `| \`${row.block}\` | ${row.status ?? '—'} | ${row.sourceRefCount} | ${row.topicIds.join(', ') || '—'} |`,
    )
  }
  log('')

  log('## 範例結構（damageTypes，JSON 摘要）')
  log('')
  const dt = getDamageTypesRules()
  log('```json')
  log(dt ? JSON.stringify(dt, null, 2) : 'null')
  log('```')
  log('')

  log('## 驗收對照')
  log('')
  log('- getter 回傳型別為 `types/combatRules.ts` 之 block，**非**自由文字。')
  log('- 規則集中於 `runtimeRulesLookup.ts`，**未**散寫於 component。')
  log('- 若 `structuredCombatRules` 為 `undefined`，代表 bundle 尚未含 4E-2 ingest。')
  log('')

  writeFileSync(join(process.cwd(), OUT), md.join('\n'), 'utf8')
  console.log(`\nWrote ${OUT}`)
}

main()
