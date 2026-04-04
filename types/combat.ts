/**
 * Data-driven combat contributions / aggregation (non-official, extensible).
 * Snapshot 仍只存 id；實際數值由此處與資料表 lookup。
 */

/** Single additive / multiplicative slice from one game object (hero, gear, talent…). */
export type StatBlock = {
  strength?: number
  dexterity?: number
  intelligence?: number

  hpFlat?: number
  /** Additive "increased HP %" buckets, summed then applied as (1 + total/100). */
  hpPct?: number
  mpFlat?: number
  mpPct?: number

  attackSpeedPct?: number

  baseDamageFlat?: number
  damagePct?: number
  /** "More" damage: per source multiplies as ∏(1 + pct/100). */
  moreDamagePct?: number

  critChancePct?: number
  /** Bonus to crit effect (increased damage on crit), additive %; pairs with crit formula in engine. */
  critDamagePct?: number
}

/** One row collected from snapshot + lookup. */
export type ContributionEntry = {
  kind: ContributionKind
  refId: string
  label: string
  block: StatBlock
}

export type ContributionKind =
  | 'hero'
  | 'trait'
  | 'relic'
  | 'specialty'
  | 'gearBase'
  | 'legendary'
  | 'talent'
  | 'skill'
  | 'divinityBoard'
  | 'pactspirit'

/** After summing flats / additive % / folding more damage. */
export type AggregatedBuckets = {
  strength: number
  dexterity: number
  intelligence: number
  hpFlat: number
  hpPct: number
  mpFlat: number
  mpPct: number
  attackSpeedPct: number
  baseDamageFlat: number
  damagePct: number
  moreDamageMult: number
  critChancePct: number
  critDamagePct: number
}

/** Final numbers shown on the left combat readout. */
export type BuildSidebarCombatStats = {
  dps: number
  attackSpeed: number
  hitDamage: number
  strength: number
  dexterity: number
  intelligence: number
  hp: number
  mp: number
}

/** Explainable intermediate values for sidebar / debug. */
export type CombatBreakdown = {
  level: number
  baseStr: number
  baseDex: number
  baseInt: number
  bonusStr: number
  bonusDex: number
  bonusInt: number
  strTotal: number
  dexTotal: number
  intTotal: number
  hpBeforePct: number
  hpPctTotal: number
  mpBeforePct: number
  mpPctTotal: number
  mpFromDivinityText: number
  damageBeforePct: number
  damagePctTotal: number
  moreDamageMult: number
  damageAfterMore: number
  baseAttackSpeed: number
  attackSpeedPctTotal: number
  attackSpeedFinal: number
  hitDamage: number
  critChancePct: number
  critDamagePct: number
  critExpectedMult: number
  dps: number
  contributionCount: number
}
