/**
 * 4E-5 — Armor **reduction %** penetration: adjust effective mitigation % for hit damage calc only (E.1–E.3).
 * Does not mutate defender armor stat; mitigation % may go negative per rules.
 */
import { getArmorReductionPenetrationRules, getDamageFormsRules } from '@/lib/runtime/runtimeRulesLookup'
import type { DamageForm } from '@/types/combatRules'
import { armorReductionPenetrationAppliesToForm, trueDamageIgnoresResistAndArmor } from './damageFormApplicability'

export function effectiveArmorMitigationPercentForDamageCalc(
  form: DamageForm,
  baseMitigationPercent: number,
  armorReductionPenetrationPercent: number,
): { effectiveMitigationPercent: number; skipped: boolean; reason?: string } {
  const formsBlock = getDamageFormsRules()
  if (form === 'true_damage' && trueDamageIgnoresResistAndArmor(formsBlock)) {
    return {
      effectiveMitigationPercent: 0,
      skipped: true,
      reason: 'true_damage_ignores_armor',
    }
  }

  const r = getArmorReductionPenetrationRules()
  if (!armorReductionPenetrationAppliesToForm(form, r)) {
    return {
      effectiveMitigationPercent: baseMitigationPercent,
      skipped: true,
      reason: 'armor_reduction_penetration_hit_only',
    }
  }
  if (!r?.reducesDefenderArmorMitigationPercentByPenetration) {
    return {
      effectiveMitigationPercent: baseMitigationPercent,
      skipped: true,
      reason: 'rules_missing',
    }
  }

  return {
    effectiveMitigationPercent: baseMitigationPercent - armorReductionPenetrationPercent,
    skipped: false,
  }
}
