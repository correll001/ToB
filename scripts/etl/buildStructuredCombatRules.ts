/**
 * 4E-2 — Build `StructuredCombatRules` from authoritative manifest + transcripts (offline).
 * No formula evaluation; JSON-serializable. Consumed by `normalizeGlobalRules.ts`.
 */
import type {
  CombatMechanismId,
  CombatRulesBlockedTermId,
  DamageForm,
  DamageType,
  RuleSourceRef,
  StructuredCombatRules,
} from "../../types/combatRules"

const PRIMARY_MANIFEST = "data/raw/ss12/global-rules/screenshot-sources.json"

function src(
  topicId: string,
  sourceId: string,
  transcriptRelativePath: string,
  opts?: { quoteBlockIndices?: number[]; clauseNumbers?: number[] },
): RuleSourceRef {
  return {
    manifestRelativePath: PRIMARY_MANIFEST,
    topicId,
    sourceId,
    transcriptRelativePath,
    quoteBlockIndices: opts?.quoteBlockIndices,
    clauseNumbers: opts?.clauseNumbers,
  }
}

const SECTION_I_BLOCKED: Array<{ termId: CombatRulesBlockedTermId; note?: string }> = [
  { termId: "aggravate", note: "權威來源章節 I — 尚未完整定義演算法" },
  { termId: "reap", note: "權威來源章節 I — 尚未完整定義演算法" },
  { termId: "damage_redirection", note: "權威來源章節 I — 尚未完整定義演算法" },
  { termId: "damage_buffer", note: "權威來源章節 I — 尚未完整定義演算法" },
  { termId: "block", note: "權威來源章節 I — 尚未完整定義演算法" },
  { termId: "damage_avoidance", note: "權威來源章節 I — 尚未完整定義演算法" },
  { termId: "grievous", note: "權威來源章節 I — 尚未完整定義演算法" },
  { termId: "special_fusion_bonus_formula", note: "權威來源章節 I — 完整公式未定；C.7 另有「最多一次」限制詞" },
]

function blockedPartsFromSectionI(): Array<{
  termId: CombatRulesBlockedTermId
  status: "blocked_needs_user_rule"
  note?: string
}> {
  return SECTION_I_BLOCKED.map((b) => ({
    termId: b.termId,
    status: "blocked_needs_user_rule" as const,
    note: b.note,
  }))
}

const ALL_DAMAGE_FORMS: readonly DamageForm[] = ["hit", "dot", "indirect", "reflect", "true_damage"]

/** B.1 五類（任務卡指定列舉順序；與 C.3 優先級順序不同） */
const DAMAGE_TYPES_B1_ORDER: readonly DamageType[] = ["physical", "fire", "cold", "lightning", "corrosion"]

/** C.3 傷害類型優先級由低到高 */
const DAMAGE_TYPE_PRIORITY_LOW_TO_HIGH: readonly DamageType[] = [
  "physical",
  "lightning",
  "cold",
  "fire",
  "corrosion",
]

const HIT_MECH: CombatMechanismId[] = [
  "hit_and_evasion",
  "armor",
  "critical_strike",
  "outgoing_damage_type_conversion_and_added",
  "incoming_damage_type_conversion",
  "double_damage",
  "damage_redirection",
  "damage_buffer",
  "block",
  "damage_avoidance",
  "grievous",
]

const DOT_MECH: CombatMechanismId[] = ["aggravate", "reap", "incoming_damage_type_conversion"]

const DOT_CANNOT: CombatMechanismId[] = [
  "hit_and_evasion",
  "armor",
  "critical_strike",
  "outgoing_damage_type_conversion_and_added",
  "double_damage",
  "damage_redirection",
  "damage_buffer",
  "block",
  "damage_avoidance",
  "grievous",
]

const INDIRECT_MECH: CombatMechanismId[] = ["incoming_damage_type_conversion", "armor", "damage_avoidance"]

/**
 * Authoritative structured combat rules (4E-0 / 4E-1 / 4E-2).
 */
export function buildStructuredCombatRules(ingestedAt: string): StructuredCombatRules {
  return {
    meta: {
      schemaId: "tob.structuredCombatRules.v1",
      season: "ss12",
      locale: "zh-Hant",
      ingestedAt,
      primaryManifestRelativePath: PRIMARY_MANIFEST,
    },
    rules: {
      extensions: {
        damageForms: {
          status: "partial",
          sources: [
            src("damage_forms", "auth-text-damage-forms-a", "docs/game-rule-transcripts/damage-forms.md", {
              quoteBlockIndices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
              clauseNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            }),
          ],
          blockedParts: blockedPartsFromSectionI(),
          unspecifiedSkillDamageDefaultForm: "hit",
          hitDamage: { typicallyFromAttackOrSpell: true, singleSettlement: true },
          mechanismsAffectingHit: HIT_MECH,
          dotDamage: { overTime: true, mechanismsAffecting: DOT_MECH },
          mechanismsCannotAffectDot: DOT_CANNOT,
          indirectDamage: { neitherHitNorDot: true, mechanismsAffecting: INDIRECT_MECH },
          reflectDamage: { defenderTakesHitOrIndirect: true, dealsReflectToAttacker: true },
          trueDamage: {
            derivedFromFixedProportionOfOtherFormsFinal: true,
            noMostBonusesAgain: true,
            ignoresResistAndArmor: true,
          },
        },
        damageTypes: {
          status: "ready",
          sources: [
            src("damage_types", "auth-text-damage-types-b", "docs/game-rule-transcripts/damage-types.md", {
              quoteBlockIndices: [0, 1],
              clauseNumbers: [1, 2],
            }),
          ],
          types: DAMAGE_TYPES_B1_ORDER,
          nonPhysicalAffectedByMatchingResistance: true,
          resistanceAppliesTo: {
            physical: false,
            fire: true,
            cold: true,
            lightning: true,
            corrosion: true,
          },
        },
        damageConversion: {
          status: "partial",
          sources: [
            src("damage_conversion", "auth-text-damage-conversion-c", "docs/game-rule-transcripts/damage-conversion.md", {
              quoteBlockIndices: [
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
              ],
              clauseNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            }),
          ],
          blockedParts: [
            {
              termId: "special_fusion_bonus_formula",
              status: "blocked_needs_user_rule",
              note: "C.7 僅述及每次傷害計算最多一次加成，無完整演算式",
            },
          ],
          outgoingConversionOnlyAppliesToDamageForm: "hit",
          damageTypePriorityLowToHigh: DAMAGE_TYPE_PRIORITY_LOW_TO_HIGH,
          outgoingConversionDirection: "low_to_high_only",
          sameSourceOutgoingOverCapRedistributesByWeight: true,
          convertedDamageReceivesSourceAndTargetTypeBonuses: true,
          specialFusionTypeBonus: {
            status: "blocked_needs_user_rule",
            atMostOncePerDamageCalculation: true,
          },
          incomingConversionPhase: "defender_mitigation_pipeline",
          mitigateUsingTypeAfterIncomingConversion: true,
          differentIncomingConversionSourcesStack: true,
          incomingOver100PercentRedistributesBySourceProportions: true,
          incomingConversionAppliesToAllDamageForms: true,
          incomingConversionAppliesToDamageForms: ALL_DAMAGE_FORMS,
        },
        resistancePenetration: {
          status: "ready",
          sources: [
            src(
              "resistance_penetration",
              "auth-text-resistance-penetration-d",
              "docs/game-rule-transcripts/resistance-penetration.md",
              { quoteBlockIndices: [0, 1, 2, 3], clauseNumbers: [1, 2, 3, 4] },
            ),
          ],
          appliesToDefenderEffectiveResistance: true,
          subtractsFromMatchingResistanceForDamageCalc: true,
          doesNotChangeActualResistanceValue: true,
          appliesToDamageForms: ["hit", "dot", "indirect", "reflect"],
        },
        armorReductionPenetration: {
          status: "ready",
          sources: [
            src(
              "armor_reduction_penetration",
              "auth-text-armor-reduction-penetration-e",
              "docs/game-rule-transcripts/armor-reduction-penetration.md",
              { quoteBlockIndices: [0, 1, 2], clauseNumbers: [1, 2, 3] },
            ),
          ],
          onlyAppliesWhenComputingHitDamage: true,
          reducesDefenderArmorMitigationPercentByPenetration: true,
          doesNotChangeActualArmorValue: true,
          mayDriveMitigationPercentNegativeToIncreaseDamageTaken: true,
        },
        damageFormula: {
          status: "ready",
          sources: [
            src("damage_formula", "auth-text-damage-formula-f", "docs/game-rule-transcripts/damage-formula-crit-double-damage.md", {
              quoteBlockIndices: [0],
              clauseNumbers: [1],
            }),
          ],
          structure: "base_times_product_of_one_plus_increased_times_product_of_one_plus_more",
        },
        critRules: {
          status: "partial",
          sources: [
            src("crit_rules", "auth-text-crit-rules-g", "docs/game-rule-transcripts/damage-formula-crit-double-damage.md", {
              quoteBlockIndices: [0, 1, 2, 3, 4, 5, 6],
              clauseNumbers: [1, 2, 3, 4, 5, 6, 7],
            }),
          ],
          critAppliesToHitDamage: true,
          multiHitTypicallySingleCritRoll: true,
          weaponBaseCritContributesWhenAttacking: true,
          spellBaseCritContributesWhenCasting: true,
          finalCritValueFormula: {
            status: "partial",
            symbolicShape: "base_sum_times_product_one_plus_non_extra_times_product_one_plus_extra",
          },
          critChanceFromFinalCritValue: "final_crit_value_divided_by_100",
          defaultCritDamagePercent: 150,
        },
        doubleDamageRules: {
          status: "ready",
          sources: [
            src(
              "double_damage_rules",
              "auth-text-double-damage-h",
              "docs/game-rule-transcripts/damage-formula-crit-double-damage.md",
              {
                quoteBlockIndices: [0, 1, 2],
                clauseNumbers: [1, 2, 3],
              },
            ),
          ],
          evaluatedOnHit: true,
          eligibleDoubleDamageChanceStacksThenSingleRoll: true,
          onlyAppliesToHitDamage: true,
        },
      },
    },
  }
}
