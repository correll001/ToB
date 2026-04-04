import type {
  AggregatedBuckets,
  BuildSidebarCombatStats,
  CombatBreakdown,
  DerivedCombatFieldProvenance,
  DerivedCombatLayerConfidence,
  DerivedCombatFallbackTrace,
  DerivedCombatRulesPrimarySource,
} from '@/types/combat'
import { getDerivedCombatBaseRules } from '@/lib/runtime/runtimeRulesLookup'

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
  const damagePctTotal = agg.damagePct
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

  const p = Math.min(1, Math.max(0, agg.critChancePct / 100))
  const cd = Math.max(0, agg.critDamagePct / 100)
  const multOnCrit = R.critBaseMultiplier * (1 + cd)
  const critExpectedMult = 1 - p + p * multOnCrit

  const dps = hitDamage * attackSpeedFinal * critExpectedMult

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
