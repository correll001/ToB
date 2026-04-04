/**
 * 4E-5 — Damage form vs structured combat rules (readiness gates only; no numeric invention).
 */
import type {
  ArmorReductionPenetrationRuleBlock,
  CritRuleBlock,
  DamageConversionRuleBlock,
  DamageFormsRuleBlock,
  DamageForm,
  DoubleDamageRuleBlock,
  ResistancePenetrationRuleBlock,
} from '@/types/combatRules'

export function critAppliesToDamageForm(form: DamageForm, rules?: CritRuleBlock | null): boolean {
  if (rules == null) return form === 'hit'
  return rules.critAppliesToHitDamage === true && form === 'hit'
}

export function doubleDamageAppliesToDamageForm(form: DamageForm, rules?: DoubleDamageRuleBlock | null): boolean {
  if (rules == null) return form === 'hit'
  return rules.onlyAppliesToHitDamage === true && form === 'hit'
}

/** C.2 — 造成傷害類型的轉化只針對擊中傷害生效 */
export function outgoingDamageTypeConversionAppliesToForm(
  form: DamageForm,
  rules?: DamageConversionRuleBlock | null,
): boolean {
  if (rules == null) return form === 'hit'
  return rules.outgoingConversionOnlyAppliesToDamageForm === form
}

/** C.12 + 明示列舉（若缺 rules 則保守視為適用，由上游補 ingest） */
export function incomingDamageTypeConversionAppliesToForm(
  form: DamageForm,
  rules?: DamageConversionRuleBlock | null,
): boolean {
  if (rules == null) return true
  if (rules.incomingConversionAppliesToAllDamageForms) {
    const ex = rules.incomingConversionAppliesToDamageForms
    if (ex?.length) return ex.includes(form)
    return true
  }
  return false
}

export function armorReductionPenetrationAppliesToForm(
  form: DamageForm,
  rules?: ArmorReductionPenetrationRuleBlock | null,
): boolean {
  if (rules == null) return form === 'hit'
  return rules.onlyAppliesWhenComputingHitDamage === true && form === 'hit'
}

export function resistancePenetrationAppliesToForm(
  form: DamageForm,
  rules?: ResistancePenetrationRuleBlock | null,
): boolean {
  if (rules == null) return form !== 'true_damage'
  return rules.appliesToDamageForms.includes(form as (typeof rules.appliesToDamageForms)[number])
}

export function trueDamageIgnoresResistAndArmor(rules?: DamageFormsRuleBlock | null): boolean {
  return rules?.trueDamage?.ignoresResistAndArmor === true
}
