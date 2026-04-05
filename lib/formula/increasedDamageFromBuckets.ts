import type { AggregatedBuckets } from '@/types/combat'

/** 元素／物理／腐蝕／持續（不含純「傷害」、不含攻擊／法術專屬）。 */
export function sumTypedDamageIncreasedPct(agg: AggregatedBuckets): number {
  return (
    agg.physicalDamagePct +
    agg.erosionDamagePct +
    agg.fireDamagePct +
    agg.lightningDamagePct +
    agg.coldDamagePct +
    agg.elementalDamagePct +
    agg.dotDamagePct
  )
}

export function sumMinionDamageIncreasedPct(agg: AggregatedBuckets): number {
  return (
    agg.minionDamagePct +
    agg.minionFireDamagePct +
    agg.minionLightningDamagePct +
    agg.minionColdDamagePct +
    agg.minionErosionDamagePct +
    agg.minionPhysicalDamagePct
  )
}

/**
 * 兩邊命中都會吃到的遞增：純「傷害」、屬性傷害、召喚物／哨衛類、投射物（攻擊與法術皆可投射物）。
 */
export function sumSharedIncreasedDamagePct(agg: AggregatedBuckets): number {
  return (
    agg.damagePct +
    sumTypedDamageIncreasedPct(agg) +
    sumMinionDamageIncreasedPct(agg) +
    agg.projectileDamagePct
  )
}

/**
 * 左側 DPS 簡化：法術錨點命中加 spell；武器／攻擊路徑加 attack+melee。
 * `channeledDamagePct` 僅在 `skillIsChanneled` 為真時併入（引導攻擊／引導法術皆可）。
 */
export function effectiveIncreasedDamagePctForHit(
  agg: AggregatedBuckets,
  hasSpellHitAnchor: boolean,
  skillIsChanneled: boolean,
): number {
  const shared = sumSharedIncreasedDamagePct(agg)
  const ch = skillIsChanneled ? agg.channeledDamagePct : 0
  if (hasSpellHitAnchor) {
    return shared + agg.spellDamagePct + ch
  }
  return shared + agg.attackDamagePct + agg.meleeDamagePct + ch
}
