/**
 * 4E-6 — Runtime getters must resolve every structured combat extension from the bundled dataset.
 *
 *   npx tsx scripts/verify/verifyCombatRuleRuntime.ts
 *
 * Uses the same path as the app: `effective-runtime-bundle.json` → `getRuntimeDataset().bundle.combatRules`.
 */
import type { CombatRulesExtensions } from '@/types/combatRules'
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
} from '@/lib/runtime/runtimeRulesLookup'

const LOG = '[verify:combat-rule-runtime]'

type GetterRow = {
  block: keyof CombatRulesExtensions
  get: () => unknown
}

const GETTERS: GetterRow[] = [
  { block: 'damageForms', get: getDamageFormsRules },
  { block: 'damageTypes', get: getDamageTypesRules },
  { block: 'damageConversion', get: getDamageConversionRules },
  { block: 'resistancePenetration', get: getResistancePenetrationRules },
  { block: 'armorReductionPenetration', get: getArmorReductionPenetrationRules },
  { block: 'damageFormula', get: getDamageFormulaRules },
  { block: 'critRules', get: getCritRules },
  { block: 'doubleDamageRules', get: getDoubleDamageRules },
]

function main() {
  const failures: string[] = []

  const root = getBundledStructuredCombatRules()
  if (root == null) {
    console.error(`${LOG} FAILED: getBundledStructuredCombatRules() returned undefined`)
    process.exit(1)
  }

  for (const { block, get } of GETTERS) {
    const v = get()
    if (v == null || typeof v !== 'object') {
      failures.push(`getter for ${String(block)} returned ${v === undefined ? 'undefined' : typeof v}`)
    }
  }

  console.log(`${LOG} exercised ${GETTERS.length} getters on bundled structuredCombatRules`)

  if (failures.length) {
    console.error(`${LOG} FAILED:\n  - ` + failures.join('\n  - '))
    process.exit(1)
  }

  console.log(`${LOG} OK`)
}

main()
