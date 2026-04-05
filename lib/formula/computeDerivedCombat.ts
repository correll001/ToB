import type {
  AggregatedBuckets,
  BuildSidebarCombatStats,
  CombatBreakdown,
  DerivedCombatFieldProvenance,
  DerivedCombatLayerConfidence,
  DerivedCombatFallbackTrace,
  DerivedCombatRulesPrimarySource,
} from '@/types/combat'
import type { DamageForm } from '@/types/combatRules'
import {
  getDamageFormulaRules,
  getDamageFormsRules,
  getDerivedCombatBaseRules,
} from '@/lib/runtime/runtimeRulesLookup'
import { trueDamageIgnoresResistAndArmor } from '@/lib/formula/rules/damageFormApplicability'
import { computeCritAndDoubleDamageForForm } from '@/lib/formula/rules/critAndDoubleDamage'
import { incomingConversionEligibility, outgoingConversionEligibility } from '@/lib/formula/rules/damageTypeConversion'
import { effectiveArmorMitigationPercentForDamageCalc } from '@/lib/formula/rules/armorReductionPenetration'
import { effectiveResistancePercentForDamageCalc } from '@/lib/formula/rules/resistancePenetration'
import {
  effectiveIncreasedDamagePctForHit,
  sumMinionDamageIncreasedPct,
  sumTypedDamageIncreasedPct,
} from '@/lib/formula/increasedDamageFromBuckets'

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n))
}

export type ComputeDerivedCombatOptions = {
  /**
   * When set, used as the additive hit base before build `baseDamageFlat` / increased / more.
   * Typically from `SkillLevelEntry.baseDamage` (numeric or averaged min–max).
   */
  skillHitBaseFromLevel?: number | null
  /** Set when `skillHitBaseFromLevel` was (min+max)/2 from a range row. */
  skillHitBaseFromMinMaxAverage?: boolean
  /** Default `hit` — sidebar DPS path; other forms gate crit / outgoing conversion / armor pen per rules. */
  damageForm?: DamageForm
  /** When set, double-damage EV applied (hit-only per rules). Otherwise traced, mult stays 1. */
  doubleDamageChancePct?: number | null
  /**
   * 為真時才把聚合中的 `channeledDamagePct` 併入有效遞增（檢視引導主技能時由呼叫端帶入）。
   * 全建構／無技能語境時應省略或 false。
   */
  skillIsChanneled?: boolean
}

export type DerivedCombatResult = {
  combat: BuildSidebarCombatStats
  breakdown: CombatBreakdown
}

function deriveLayerConfidence(
  primary: DerivedCombatRulesPrimarySource,
  hitProv: DerivedCombatFieldProvenance,
  layerFallbacks: DerivedCombatFallbackTrace[],
): DerivedCombatLayerConfidence {
  /* Only a numeric spell/baseDamage anchor from the level row yields full readiness; weapon% × placeholder stays partial. */
  if (hitProv !== 'skill_level_row') return 'partial'
  if (primary === 'legacy_fallback') return 'partial'
  if (layerFallbacks.length > 0) return 'partial'
  return 'ready'
}

/**
 * Derive panel combat stats from aggregated buckets + level.
 * 4E-4: constants come from bundled rules merge (extension → Character_Build parse → flagged legacy);
 * hit base prefers skill level row when provided — never treat placeholder weapon curve as authoritative.
 */
export function computeDerivedCombat(
  level: number,
  agg: AggregatedBuckets,
  divinityTextCharCount: number,
  opts?: ComputeDerivedCombatOptions,
): DerivedCombatResult {
  const lv = Number.isFinite(level) ? Math.max(1, Math.floor(level)) : 1
  const rulesRes = getDerivedCombatBaseRules()
  const R = rulesRes.values
  const layerFallbacks = [...rulesRes.fallbacks]
  const form: DamageForm = opts?.damageForm ?? 'hit'

  const formulaRules = getDamageFormulaRules()
  if (!formulaRules) {
    layerFallbacks.push({ key: 'damage_formula', reason: 'structured_rules_missing' })
  } else if (formulaRules.status === 'blocked_needs_user_rule') {
    layerFallbacks.push({ key: 'damage_formula', reason: 'blocked_needs_user_rule' })
  } else if (
    formulaRules.structure !== 'base_times_product_of_one_plus_increased_times_product_of_one_plus_more'
  ) {
    layerFallbacks.push({ key: 'damage_formula', reason: 'structure_mismatch_with_bundle' })
  }

  const outConv = outgoingConversionEligibility(form)
  if (outConv.rulesMissing) {
    layerFallbacks.push({ key: 'outgoing_damage_type_conversion', reason: 'rules_missing' })
  }

  const inConv = incomingConversionEligibility(form)
  if (inConv.rulesMissing) {
    layerFallbacks.push({ key: 'incoming_damage_type_conversion', reason: 'rules_missing' })
  } else if (!inConv.applies) {
    layerFallbacks.push({ key: 'incoming_damage_type_conversion', reason: 'form_excluded', detail: form })
  }

  if (form === 'true_damage' && trueDamageIgnoresResistAndArmor(getDamageFormsRules())) {
    layerFallbacks.push({
      key: 'mitigation',
      reason: 'true_damage_ignores_resist_and_armor_per_structured_rules',
    })
  }

  const neutralResistPipe = effectiveResistancePercentForDamageCalc(form, 0, 0)
  const neutralArmorPipe = effectiveArmorMitigationPercentForDamageCalc(form, 0, 0)
  if (neutralResistPipe.skipped && neutralResistPipe.reason === 'rules_missing') {
    layerFallbacks.push({ key: 'resistance_penetration', reason: 'rules_missing_or_disabled' })
  }
  if (neutralArmorPipe.skipped && neutralArmorPipe.reason === 'rules_missing') {
    layerFallbacks.push({ key: 'armor_reduction_penetration', reason: 'rules_missing_or_disabled' })
  }

  const baseStr = R.baseAttrStart + lv * R.baseAttrPerLevel
  const baseDex = R.baseAttrStart + lv * R.baseAttrPerLevel
  const baseInt = R.baseAttrStart + lv * R.baseAttrPerLevel

  const bonusStr = agg.strength
  const bonusDex = agg.dexterity
  const bonusInt = agg.intelligence

  const strTotal = baseStr + bonusStr
  const dexTotal = baseDex + bonusDex
  const intTotal = baseInt + bonusInt

  const hpBeforePctRaw = R.hpBaseFlat + lv * R.hpPerLevel + strTotal * R.hpPerStrength + agg.hpFlat
  const hpBeforePct = Math.max(1, hpBeforePctRaw)
  const hpPctTotal = agg.hpPct
  const hp = hpBeforePct * (1 + hpPctTotal / 100)

  const mpFromDivinityText = Math.min(
    R.mpFromDivinityMax,
    Math.floor(divinityTextCharCount * R.mpFromDivinityPerChar),
  )
  const mpBeforePctRaw =
    R.mpBaseFlat + lv * R.mpPerLevel + intTotal * R.mpPerIntelligence + agg.mpFlat + mpFromDivinityText
  const mpBeforePct = Math.max(1, mpBeforePctRaw)
  const mpPctTotal = agg.mpPct
  const mp = mpBeforePct * (1 + mpPctTotal / 100)

  let hitDamageBaseProvenance: DerivedCombatFieldProvenance = 'legacy_placeholder'
  let hitDamageBaseNote = `placeholder weapon base + per level (${R.weaponDamageBase}+${R.weaponDamagePerLevel}×Lv)`
  let baseWeaponDamage = R.weaponDamageBase + lv * R.weaponDamagePerLevel

  const skillBase = opts?.skillHitBaseFromLevel
  const fromMinMaxAvg = opts?.skillHitBaseFromMinMaxAverage === true
  if (skillBase != null && Number.isFinite(skillBase) && skillBase > 0) {
    baseWeaponDamage = skillBase
    hitDamageBaseProvenance = 'skill_level_row'
    hitDamageBaseNote = fromMinMaxAvg
      ? 'skill level row · baseDamage (min–max average)'
      : 'skill level row · baseDamage (numeric)'
    if (fromMinMaxAvg) {
      layerFallbacks.push({
        key: 'hit_damage_base',
        reason: 'averaged_min_max_from_level_row',
      })
    }
  } else {
    layerFallbacks.push({
      key: 'hit_damage_base',
      reason: 'no_numeric_skill_base_used_weapon_placeholder',
      detail: hitDamageBaseNote,
    })
  }

  const wEffRaw = agg.weaponDamageEffectivenessPct
  const wEffAgg = Math.max(0, Number.isFinite(wEffRaw) ? wEffRaw : 0)

  let weaponDamageEffectivenessApplied = 0
  let weaponPortion = baseWeaponDamage

  const hasSpellHitAnchor =
    skillBase != null && Number.isFinite(skillBase) && skillBase > 0

  if (!hasSpellHitAnchor && wEffAgg > 0) {
    weaponPortion = baseWeaponDamage * (wEffAgg / 100)
    weaponDamageEffectivenessApplied = wEffAgg
    hitDamageBaseProvenance = 'skill_weapon_effectiveness'
    hitDamageBaseNote = `${wEffAgg}% weapon effectiveness (skill data) × ${hitDamageBaseNote}`
  }

  const damageBeforePct = weaponPortion + agg.baseDamageFlat
  const damagePctGeneric = agg.damagePct
  const damagePctTypedPhysicalElemental = sumTypedDamageIncreasedPct(agg)
  const damagePctMinion = sumMinionDamageIncreasedPct(agg)
  const skillIsChanneled = opts?.skillIsChanneled === true
  const damagePctTotal = effectiveIncreasedDamagePctForHit(agg, hasSpellHitAnchor, skillIsChanneled)
  const afterInc = damageBeforePct * (1 + damagePctTotal / 100)
  const moreDamageMult = agg.moreDamageMult
  const damageAfterMore = afterInc * moreDamageMult
  const hitDamage = Math.max(1, damageAfterMore)

  const baseAttackSpeed = R.attackSpeedBase + lv * R.attackSpeedPerLevel
  const attackSpeedPctTotal = agg.attackSpeedPct
  const attackSpeedFinal = clamp(
    baseAttackSpeed * (1 + attackSpeedPctTotal / 100),
    R.attackSpeedClampMin,
    R.attackSpeedClampMax,
  )

  const critDouble = computeCritAndDoubleDamageForForm(form, agg, {
    legacyCritBaseMultiplier: R.critBaseMultiplier,
    doubleDamageChancePct: opts?.doubleDamageChancePct,
  })
  const pushCritTrace = (t: (typeof critDouble.traces)[number]) => {
    layerFallbacks.push({ key: t.key, reason: t.reason, detail: t.detail })
  }
  for (const t of critDouble.traces) {
    if (
      t.reason === 'blocked_needs_user_rule' ||
      t.reason === 'structured_default_crit_damage_pct_missing_used_legacy_panel' ||
      t.reason === 'final_crit_value_formula_blocked_needs_user_rule'
    ) {
      pushCritTrace(t)
    }
  }
  const critExpectedMult = critDouble.critExpectedMult
  const doubleDamageExpectedMult = critDouble.doubleDamageExpectedMult

  const dps = hitDamage * attackSpeedFinal * critExpectedMult * doubleDamageExpectedMult

  const combat: BuildSidebarCombatStats = {
    dps: Math.round(dps * 100) / 100,
    attackSpeed: Math.round(attackSpeedFinal * 100) / 100,
    hitDamage: Math.round(hitDamage),
    strength: Math.round(strTotal),
    dexterity: Math.round(dexTotal),
    intelligence: Math.round(intTotal),
    hp: Math.round(hp),
    mp: Math.round(mp),
  }

  const derivedCombatConfidence = deriveLayerConfidence(
    rulesRes.primarySource,
    hitDamageBaseProvenance,
    layerFallbacks,
  )

  const breakdown: CombatBreakdown = {
    level: lv,
    baseStr,
    baseDex,
    baseInt,
    bonusStr,
    bonusDex,
    bonusInt,
    strTotal,
    dexTotal,
    intTotal,
    hpBeforePct,
    hpPctTotal,
    mpBeforePct,
    mpPctTotal,
    mpFromDivinityText,
    damageBeforePct,
    damagePctGeneric,
    spellDamagePct: agg.spellDamagePct,
    attackDamagePct: agg.attackDamagePct,
    meleeDamagePct: agg.meleeDamagePct,
    projectileDamagePct: agg.projectileDamagePct,
    damagePctTypedPhysicalElemental,
    elementalDamagePct: agg.elementalDamagePct,
    damagePctMinion,
    channeledDamagePct: agg.channeledDamagePct,
    channeledDamageIncludedInEffective: skillIsChanneled,
    damagePctTotal,
    moreDamageMult,
    damageAfterMore,
    baseAttackSpeed,
    attackSpeedPctTotal,
    attackSpeedFinal,
    hitDamage: combat.hitDamage,
    critChancePct: agg.critChancePct,
    critDamagePct: agg.critDamagePct,
    critExpectedMult: Math.round(critExpectedMult * 1000) / 1000,
    dps: combat.dps,
    contributionCount: 0,
    derivedRulesPrimarySource: rulesRes.primarySource,
    derivedCombatFallbacks: layerFallbacks,
    derivedCombatConfidence,
    hitDamageBaseProvenance,
    hitDamageBaseNote,
    weaponDamageEffectivenessPct: weaponDamageEffectivenessApplied,
  }

  return { combat, breakdown }
}
