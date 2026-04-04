import type { ContributionEntry } from "@/types/combat"
import type { SkillInstance } from "@/types/skillInstance"
import { mergeMoreProducts } from "./composeSkillModifiers"
import { isNonDamagingAggregateRole } from "./inferDamageRole"

/**
 * Presentation / aggregate bridge: map SkillInstance → StatBlock for Build Layer merge.
 * Empty block when not `damaging` or when confidence is `unsupported` — no cosmetic fake DPS.
 */
export function skillInstanceToContribution(instance: SkillInstance): ContributionEntry {
  if (
    isNonDamagingAggregateRole(instance.damageRole) ||
    instance.calculationConfidence === "unsupported"
  ) {
    return {
      kind: "skill",
      refId: `instance:${instance.activeId}`,
      label: `Skill instance · ${instance.activeName} (Lv${instance.level}, ${instance.damageRole}, ${instance.calculationConfidence} · 不計入聚合 DPS)`,
      block: {},
    }
  }

  const st = instance.computedStats
  const inc = st["damage.increased"] ?? 0
  const { moreDamagePctFromProducts } = mergeMoreProducts(st)
  const post = instance.post20MoreMultiplier
  const combinedMore = post * (1 + moreDamagePctFromProducts / 100)
  const morePct = (combinedMore - 1) * 100

  const weaponEff = st["skill.weaponDamagePct"] ?? 0

  return {
    kind: "skill",
    refId: `instance:${instance.activeId}`,
    label: `Skill instance · ${instance.activeName} (Lv${instance.level})`,
    block: {
      damagePct: inc,
      weaponDamageEffectivenessPct: weaponEff > 0 ? weaponEff : undefined,
      moreDamagePct: morePct,
      attackSpeedPct: st["skill.attackSpeedIncreased"] ?? 0,
      baseDamageFlat: st["skill.addedBaseDamage"] ?? 0,
      critChancePct: st["skill.critChanceIncreased"] ?? 0,
    },
  }
}
