/**
 * 4E-5 — Damage type conversion policy from bundled rules (structure + caps; no undisclosed fusion math).
 */
import { getDamageConversionRules } from '@/lib/runtime/runtimeRulesLookup'
import type { DamageForm, DamageType } from '@/types/combatRules'
import { incomingDamageTypeConversionAppliesToForm, outgoingDamageTypeConversionAppliesToForm } from './damageFormApplicability'

export type OutgoingConversionEligibility = {
  applies: boolean
  /** When rules missing from bundle */
  rulesMissing?: true
}

/** Outgoing conversion pipeline allowed only for hit per C.2 */
export function outgoingConversionEligibility(form: DamageForm): OutgoingConversionEligibility {
  const r = getDamageConversionRules()
  if (!r) return { applies: false, rulesMissing: true }
  return { applies: outgoingDamageTypeConversionAppliesToForm(form, r) }
}

export function incomingConversionEligibility(form: DamageForm): {
  applies: boolean
  rulesMissing?: true
} {
  const r = getDamageConversionRules()
  if (!r) return { applies: false, rulesMissing: true }
  return { applies: incomingDamageTypeConversionAppliesToForm(form, r) }
}

export function damageTypePriorityLowToHighFromRules(): readonly DamageType[] | undefined {
  return getDamageConversionRules()?.damageTypePriorityLowToHigh
}

/**
 * C.5 — same-source ratios over 100% → cap at 100% total, redistribute by weight.
 * Returns `blocked` when rules forbid or block status prevents implementation.
 */
export function redistributeSameSourceOutgoingPercents(
  percents: number[],
): { ok: true; redistributed: number[] } | { ok: false; blocked: true; reason: string } {
  const r = getDamageConversionRules()
  if (!r) return { ok: false, blocked: true, reason: 'damage_conversion_rules_missing' }
  if (r.status === 'blocked_needs_user_rule') {
    return { ok: false, blocked: true, reason: 'damage_conversion_block_status' }
  }
  if (!r.sameSourceOutgoingOverCapRedistributesByWeight) {
    return { ok: false, blocked: true, reason: 'same_source_cap_rule_not_enabled' }
  }
  if (percents.length === 0) return { ok: true, redistributed: [] }
  const sum = percents.reduce((a, b) => a + b, 0)
  if (sum <= 100) return { ok: true, redistributed: percents }
  const scaled = percents.map((x) => (x / sum) * 100)
  return { ok: true, redistributed: scaled }
}

/** C.7 — no numeric fusion formula until user rule supplied */
export function specialFusionTypeBonusBlocked(): boolean {
  const r = getDamageConversionRules()?.specialFusionTypeBonus
  return r?.status === 'blocked_needs_user_rule'
}
