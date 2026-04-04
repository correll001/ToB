import type { AggregatedBuckets, BuildSidebarCombatStats, CombatBreakdown } from '@/types/combat'

/** Level-only bases (explicit, not from random). */
const HP_PER_STR = 4
const MP_PER_INT = 3

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n))
}

export type DerivedCombatResult = {
  combat: BuildSidebarCombatStats
  breakdown: CombatBreakdown
}

/**
 * Derive panel combat stats from aggregated buckets + level.
 * MP 額外来自 divinity 文字長度（明示規則，非隨機）。
 */
export function computeDerivedCombat(
  level: number,
  agg: AggregatedBuckets,
  divinityTextCharCount: number
): DerivedCombatResult {
  const lv = Number.isFinite(level) ? Math.max(1, Math.floor(level)) : 1

  const baseStr = 8 + lv * 1.5
  const baseDex = 8 + lv * 1.5
  const baseInt = 8 + lv * 1.5

  const bonusStr = agg.strength
  const bonusDex = agg.dexterity
  const bonusInt = agg.intelligence

  const strTotal = baseStr + bonusStr
  const dexTotal = baseDex + bonusDex
  const intTotal = baseInt + bonusInt

  const hpBeforePctRaw = 120 + lv * 18 + strTotal * HP_PER_STR + agg.hpFlat
  const hpBeforePct = Math.max(1, hpBeforePctRaw)
  const hpPctTotal = agg.hpPct
  const hp = hpBeforePct * (1 + hpPctTotal / 100)

  const mpFromDivinityText = Math.min(50, Math.floor(divinityTextCharCount * 0.1))
  const mpBeforePctRaw = 40 + lv * 6 + intTotal * MP_PER_INT + agg.mpFlat + mpFromDivinityText
  const mpBeforePct = Math.max(1, mpBeforePctRaw)
  const mpPctTotal = agg.mpPct
  const mp = mpBeforePct * (1 + mpPctTotal / 100)

  const baseWeaponDamage = 25 + lv * 3
  const damageBeforePct = baseWeaponDamage + agg.baseDamageFlat
  const damagePctTotal = agg.damagePct
  const afterInc = damageBeforePct * (1 + damagePctTotal / 100)
  const moreDamageMult = agg.moreDamageMult
  const damageAfterMore = afterInc * moreDamageMult
  const hitDamage = Math.max(1, damageAfterMore)

  const baseAttackSpeed = 1 + lv * 0.002
  const attackSpeedPctTotal = agg.attackSpeedPct
  const attackSpeedFinal = clamp(baseAttackSpeed * (1 + attackSpeedPctTotal / 100), 0.35, 6)

  const p = Math.min(1, Math.max(0, agg.critChancePct / 100))
  const cd = Math.max(0, agg.critDamagePct / 100)
  /** 基礎暴擊 1.5x，critDamagePct 為「暴擊時額外乘區」的簡化加成。 */
  const multOnCrit = 1.5 * (1 + cd)
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
  }

  return { combat, breakdown }
}
