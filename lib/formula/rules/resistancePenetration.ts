/**
 * 4E-5 — Resistance penetration: adjust **effective** resistance for damage calc only (D.2–D.3).
 * Does not mutate or represent "stored" raw resistance on the defender.
 */
import { getDamageFormsRules, getResistancePenetrationRules } from '@/lib/runtime/runtimeRulesLookup'
import type { DamageForm } from '@/types/combatRules'
import { resistancePenetrationAppliesToForm, trueDamageIgnoresResistAndArmor } from './damageFormApplicability'

/**
 * @param rawResistancePct defender's listed resistance % (unchanged in persistence layer)
 * @param penetrationPct attacker's penetration % (subtract from effective only)
 */
export function effectiveResistancePercentForDamageCalc(
  form: DamageForm,
  rawResistancePct: number,
  penetrationPct: number,
): { effective: number; skipped: boolean; reason?: string } {
  const formsBlock = getDamageFormsRules()
  if (form === 'true_damage' && trueDamageIgnoresResistAndArmor(formsBlock)) {
    return { effective: 0, skipped: true, reason: 'true_damage_ignores_resist' }
  }
  const r = getResistancePenetrationRules()
  if (!resistancePenetrationAppliesToForm(form, r)) {
    return { effective: rawResistancePct, skipped: true, reason: 'resistance_penetration_form_excluded' }
  }
  if (!r?.subtractsFromMatchingResistanceForDamageCalc) {
    return { effective: rawResistancePct, skipped: true, reason: 'rules_missing' }
  }
  return { effective: rawResistancePct - penetrationPct, skipped: false }
}
