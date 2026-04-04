/**
 * 4E-5 — Crit / double damage: applicability from structured rules + minimal expected-value trunk.
 * Multi-hit crit roll & full crit value composition stay TODO / blocked per ingest status.
 */
import { getCritRules, getDoubleDamageRules } from '@/lib/runtime/runtimeRulesLookup'
import type { DamageForm } from '@/types/combatRules'
import { critAppliesToDamageForm, doubleDamageAppliesToDamageForm } from './damageFormApplicability'

export type CritDoubleAggregateSlice = {
  critChancePct: number
  critDamagePct: number
}

export type CritDoubleComputeOpts = {
  /** Panel merge fallback when structured `defaultCritDamagePercent` absent */
  legacyCritBaseMultiplier: number
  /** When unset, double-damage EV stays 1 (no invented chance). */
  doubleDamageChancePct?: number | null
}

export type CritDoubleTrace = { key: string; reason: string; detail?: string }

export type CritDoubleResult = {
  critExpectedMult: number
  doubleDamageExpectedMult: number
  traces: CritDoubleTrace[]
}

function clampChanceUnit(p: number) {
  return Math.min(1, Math.max(0, p))
}

/**
 * Crit EV: 1 - p + p × (critBase × (1 + increasedCritDamage)).
 * `defaultCritDamagePercent` from rules = 150 → base 1.5 (G.7).
 */
export function computeCritAndDoubleDamageForForm(
  form: DamageForm,
  agg: CritDoubleAggregateSlice,
  opts: CritDoubleComputeOpts,
): CritDoubleResult {
  const traces: CritDoubleTrace[] = []
  const critRules = getCritRules()
  const doubleRules = getDoubleDamageRules()

  let critExpectedMult = 1

  if (!critAppliesToDamageForm(form, critRules)) {
    traces.push({ key: 'crit', reason: 'not_applicable_to_damage_form' })
  } else if (critRules?.status === 'blocked_needs_user_rule') {
    traces.push({ key: 'crit', reason: 'blocked_needs_user_rule' })
  } else {
    const defaultPct = critRules?.defaultCritDamagePercent
    const baseMult =
      typeof defaultPct === 'number' && Number.isFinite(defaultPct) && defaultPct > 0
        ? defaultPct / 100
        : opts.legacyCritBaseMultiplier
    if (defaultPct == null || !Number.isFinite(defaultPct)) {
      traces.push({
        key: 'crit_base',
        reason: 'structured_default_crit_damage_pct_missing_used_legacy_panel',
        detail: String(opts.legacyCritBaseMultiplier),
      })
    }

    const p = clampChanceUnit(agg.critChancePct / 100)
    const cd = Math.max(0, agg.critDamagePct / 100)
    const multOnCrit = baseMult * (1 + cd)
    critExpectedMult = 1 - p + p * multOnCrit

    if (critRules?.finalCritValueFormula?.status === 'blocked_needs_user_rule') {
      traces.push({ key: 'crit_final_value', reason: 'final_crit_value_formula_blocked_needs_user_rule' })
    }
    // G.2 — multi-hit single crit roll: TODO / skill event model; not pushed to layer fallbacks (noise).
  }

  let doubleDamageExpectedMult = 1

  if (!doubleDamageAppliesToDamageForm(form, doubleRules)) {
    traces.push({ key: 'double_damage', reason: 'not_applicable_to_damage_form' })
  } else if (doubleRules?.status === 'blocked_needs_user_rule') {
    traces.push({ key: 'double_damage', reason: 'blocked_needs_user_rule' })
  } else {
    const qIn = opts.doubleDamageChancePct
    if (qIn == null || !Number.isFinite(qIn)) {
      traces.push({
        key: 'double_damage',
        reason: 'double_damage_chance_pct_not_available_no_numeric_invention',
      })
    } else {
      const q = clampChanceUnit(qIn / 100)
      doubleDamageExpectedMult = 1 - q + q * 2
    }
  }

  return { critExpectedMult, doubleDamageExpectedMult, traces }
}
