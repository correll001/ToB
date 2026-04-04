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
  /**
   * Attack skills: % of character weapon hit used as base (from `skill.weaponDamagePct`, summed).
   * Applied in `computeDerivedCombat` only when `skillHitBaseFromLevel` is unset — explicit, not folded into `damagePct`.
   */
  weaponDamageEffectivenessPct?: number
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
  weaponDamageEffectivenessPct: number
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

/** Trace when derive combat used legacy / heuristic instead of bundled structured rules (4E-4). */
export type DerivedCombatFallbackTrace = {
  key: string
  reason: string
  detail?: string
}

/** Where the bulk of derive constants came from (audit). */
export type DerivedCombatRulesPrimarySource =
  | 'bundle_extension'
  | 'character_build_parsed'
  | 'legacy_fallback'

/** Per-axis provenance for hit damage base / panel placeholders. */
export type DerivedCombatFieldProvenance =
  | 'bundle_extension'
  | 'character_build'
  | 'skill_level_row'
  | 'skill_weapon_effectiveness' // weaponDamagePct from skill aggregate × placeholder weapon base
  | 'legacy_placeholder'
  | 'panel_heuristic'

/** Confidence for the derive *layer* only (independent of skill-instance confidence). */
export type DerivedCombatLayerConfidence = 'ready' | 'partial' | 'unsupported'

/** Resolved numeric constants for `computeDerivedCombat` (merged extension → Character_Build parse → legacy). */
export type DerivedCombatBaseValues = {
  hpBaseFlat: number
  hpPerLevel: number
  hpPerStrength: number
  mpBaseFlat: number
  mpPerLevel: number
  mpPerIntelligence: number
  mpFromDivinityMax: number
  mpFromDivinityPerChar: number
  baseAttrStart: number
  baseAttrPerLevel: number
  weaponDamageBase: number
  weaponDamagePerLevel: number
  attackSpeedBase: number
  attackSpeedPerLevel: number
  attackSpeedClampMin: number
  attackSpeedClampMax: number
  critBaseMultiplier: number
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

  /** 4E-4 — rules-first derive; never pretend fallbacks are authoritative. */
  derivedRulesPrimarySource: DerivedCombatRulesPrimarySource
  derivedCombatFallbacks: DerivedCombatFallbackTrace[]
  derivedCombatConfidence: DerivedCombatLayerConfidence
  hitDamageBaseProvenance: DerivedCombatFieldProvenance
  /** Short human-readable note (e.g. "skill level row numeric", "placeholder weapon curve"). */
  hitDamageBaseNote: string
  /** Sum from skill StatBlocks: % multiplier on placeholder weapon base when no level-row spell anchor. */
  weaponDamageEffectivenessPct: number
}
