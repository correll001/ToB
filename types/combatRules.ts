/**
 * 4E-1 — Machine-readable combat rules schema (authoritative transcripts → typed blocks).
 * JSON-serializable. No runtime / formula coupling.
 */

/** Lifecycle of a rule block or sub-clause for ingest & engine gating. */
export type RuleStatus = "ready" | "partial" | "blocked_needs_user_rule"

/**
 * Provenance back to `screenshot-sources.json` + transcript clauses.
 * Required for every block (`sources`); do not replace with unstructured prose.
 */
export type RuleSourceRef = {
  /** Repo-relative path, e.g. `data/raw/ss12/global-rules/screenshot-sources.json` */
  manifestRelativePath: string
  /** `topicId` inside the manifest */
  topicId: string
  /** `sources[].sourceId` when applicable */
  sourceId?: string
  /** Redundant human-stable path to markdown transcript */
  transcriptRelativePath?: string
  /** 0-based indices into manifest `quoteBlocks` for that source */
  quoteBlockIndices?: number[]
  /** Authoritative clause numbers (e.g. section C → 7) */
  clauseNumbers?: number[]
}

/** Canonical damage forms (4E-1). Runtime string `true_damage` per task card. */
export type DamageForm = "hit" | "dot" | "indirect" | "reflect" | "true_damage"

/** Element / physical pipeline keys (4E-1). */
export type DamageType = "physical" | "fire" | "cold" | "lightning" | "corrosion"

/**
 * Named mechanisms referenced in damage-form rules (structured keys; display copy lives in transcripts).
 * Subset marked blocked in section I of authoritative text — see `CombatRulesBlockedTermId`.
 */
export type CombatMechanismId =
  | "hit_and_evasion"
  | "armor"
  | "critical_strike"
  | "outgoing_damage_type_conversion_and_added"
  | "incoming_damage_type_conversion"
  | "double_damage"
  | "damage_redirection"
  | "damage_buffer"
  | "block"
  | "damage_avoidance"
  | "grievous"
  | "aggravate"
  | "reap"

/** Terms explicitly listed as “尚未完整定義演算法” in authoritative section I. */
export type CombatRulesBlockedTermId =
  | "aggravate"
  | "reap"
  | "damage_redirection"
  | "damage_buffer"
  | "block"
  | "damage_avoidance"
  | "grievous"
  | "special_fusion_bonus_formula"

export type CombatRulesBlockBase = {
  status: RuleStatus
  sources: RuleSourceRef[]
  /**
   * Mechanisms or formulas acknowledged in prose but blocked for implementation.
   * Must not be omitted when status is `blocked_needs_user_rule` or `partial` due to I-list items.
   */
  blockedParts?: Array<{
    termId: CombatRulesBlockedTermId | string
    status: "blocked_needs_user_rule"
    note?: string
  }>
}

export type DamageFormsRuleBlock = CombatRulesBlockBase & {
  /** A.1 — 沒有特別說明時，技能造成的傷害都是擊中傷害 */
  unspecifiedSkillDamageDefaultForm: "hit"
  /** A.2 — 擊中：攻擊或法術、單次結算 */
  hitDamage: {
    typicallyFromAttackOrSpell: true
    singleSettlement: true
  }
  /** A.3 — mechanisms that may affect 擊中傷害 */
  mechanismsAffectingHit: CombatMechanismId[]
  /** A.4–A.5 */
  dotDamage: {
    overTime: true
    mechanismsAffecting: CombatMechanismId[]
  }
  /** A.6 — 無法影響持續傷害 */
  mechanismsCannotAffectDot: CombatMechanismId[]
  /** A.7 */
  indirectDamage: {
    neitherHitNorDot: true
    mechanismsAffecting: CombatMechanismId[]
  }
  /** A.9 — 反射 */
  reflectDamage: {
    defenderTakesHitOrIndirect: true
    dealsReflectToAttacker: true
  }
  /** A.10–A.11 — 真實傷害 */
  trueDamage: {
    derivedFromFixedProportionOfOtherFormsFinal: true
    noMostBonusesAgain: true
    ignoresResistAndArmor: true
  }
}

export type DamageTypesRuleBlock = CombatRulesBlockBase & {
  /** B.1 — exactly five types */
  types: readonly DamageType[]
  /** B.2 — 除了物理傷害以外，其餘…受到對應抗性 */
  nonPhysicalAffectedByMatchingResistance: true
  /**
   * B.2 explicit matrix (normalize ingest): 物理不適用「元素抗性減免同一套」之敘述；其四類受對應抗性。
   * 與 `nonPhysicalAffectedByMatchingResistance` 同義互補，供機讀不歧義。
   */
  resistanceAppliesTo: Record<DamageType, boolean>
}

export type DamageConversionRuleBlock = CombatRulesBlockBase & {
  /** C.2 — 造成傷害類型的轉化只針對擊中傷害生效 */
  outgoingConversionOnlyAppliesToDamageForm: "hit"
  /** C.3 — low → high priority order */
  damageTypePriorityLowToHigh: readonly DamageType[]
  /** C.4 — only low → high */
  outgoingConversionDirection: "low_to_high_only"
  /** C.5 — >100% same source: cap + redistribute by weight */
  sameSourceOutgoingOverCapRedistributesByWeight: true
  /** C.6 — source + target type bonuses */
  convertedDamageReceivesSourceAndTargetTypeBonuses: true
  /** C.7 — special fusion: at most once per damage calc; full formula still blocked */
  specialFusionTypeBonus: {
    status: RuleStatus
    atMostOncePerDamageCalculation?: true
  }
  /** C.8 */
  incomingConversionPhase: "defender_mitigation_pipeline"
  /** C.9 */
  mitigateUsingTypeAfterIncomingConversion: true
  /** C.10 */
  differentIncomingConversionSourcesStack: true
  /** C.11 */
  incomingOver100PercentRedistributesBySourceProportions: true
  /** C.12 — 所有形式的傷害 */
  incomingConversionAppliesToAllDamageForms: true
  /**
   * C.12 明示列舉（含 `true_damage`）；與 `incomingConversionAppliesToAllDamageForms` 一致時應列滿五種 damage form。
   */
  incomingConversionAppliesToDamageForms?: readonly DamageForm[]
}

/** D.4 lists 擊中、持續、間接、反射 — 真實傷害於 B/A 另述無視抗性，不納入此列。 */
export type ResistancePenetrationAppliesToDamageForm = Exclude<DamageForm, "true_damage">

export type ResistancePenetrationRuleBlock = CombatRulesBlockBase & {
  /** D.1 — 有效抗性 */
  appliesToDefenderEffectiveResistance: true
  /** D.2 */
  subtractsFromMatchingResistanceForDamageCalc: true
  /** D.3 — 不改變實際的抗性值 */
  doesNotChangeActualResistanceValue: true
  /** D.4 — 擊中、持續、間接、反射 */
  appliesToDamageForms: readonly ResistancePenetrationAppliesToDamageForm[]
}

export type ArmorReductionPenetrationRuleBlock = CombatRulesBlockBase & {
  /** E.1 — 在計算擊中傷害時 */
  onlyAppliesWhenComputingHitDamage: true
  /** E.1 */
  reducesDefenderArmorMitigationPercentByPenetration: true
  /** E.2 — 不改變實際的護甲值 */
  doesNotChangeActualArmorValue: true
  /** E.3 — 可低於零並加傷 */
  mayDriveMitigationPercentNegativeToIncreaseDamageTaken: true
}

/** Symbolic structure for F — no numeric evaluation here. */
export type DamageFormulaRuleBlock = CombatRulesBlockBase & {
  /** 基礎 × (1+inc%) × (1+more1) × (1+more2) × … */
  structure: "base_times_product_of_one_plus_increased_times_product_of_one_plus_more"
}

export type CritRuleBlock = CombatRulesBlockBase & {
  /** G.1 — 造成擊中傷害時 */
  critAppliesToHitDamage: true
  /** G.2 — 多次擊中往往單次判定 */
  multiHitTypicallySingleCritRoll: true
  /** G.3 */
  weaponBaseCritContributesWhenAttacking: true
  /** G.4 */
  spellBaseCritContributesWhenCasting: true
  /**
   * G.5 — 乘算式已於轉寫給出；與其他系統交錯順序未給 → 整體可標 `partial`。
   * 不使用自由文字；以 enum 描述已鎖定的符號形狀。
   */
  finalCritValueFormula: {
    status: RuleStatus
    /** Transcript G.5: 基礎爆擊值之和 × (1+非額外%) × (1+額外1) × … */
    symbolicShape?: "base_sum_times_product_one_plus_non_extra_times_product_one_plus_extra"
  }
  /** G.6 */
  critChanceFromFinalCritValue: "final_crit_value_divided_by_100"
  /** G.7 */
  defaultCritDamagePercent: 150
}

export type DoubleDamageRuleBlock = CombatRulesBlockBase & {
  /** H.1 — 擊中時 */
  evaluatedOnHit: true
  /** H.2 */
  eligibleDoubleDamageChanceStacksThenSingleRoll: true
  /** H.3 — 雙倍傷害機率只對擊中傷害生效 */
  onlyAppliesToHitDamage: true
}

/** Optional extensions bag — keys reserved for forward-compatible ingest. */
export type CombatRulesExtensions = {
  damageForms?: DamageFormsRuleBlock
  damageTypes?: DamageTypesRuleBlock
  damageConversion?: DamageConversionRuleBlock
  resistancePenetration?: ResistancePenetrationRuleBlock
  armorReductionPenetration?: ArmorReductionPenetrationRuleBlock
  damageFormula?: DamageFormulaRuleBlock
  critRules?: CritRuleBlock
  doubleDamageRules?: DoubleDamageRuleBlock
}

export type StructuredCombatRulesMeta = {
  /** e.g. `tob.structuredCombatRules.v1` */
  schemaId: string
  season: string
  locale?: string
  ingestedAt?: string
  /** Primary manifest driving this document */
  primaryManifestRelativePath: string
}

/**
 * Root document: `rules.extensions.*` matches task naming for normalize / DB mirror.
 */
export type StructuredCombatRules = {
  meta: StructuredCombatRulesMeta
  rules: {
    extensions: CombatRulesExtensions
  }
}
