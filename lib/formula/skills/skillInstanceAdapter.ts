import type { ContributionEntry } from "@/types/combat"
import type { SkillInstance } from "@/types/skillInstance"
import { mergeMoreProducts } from "./composeSkillModifiers"

/**
 * Adapter (B): map SkillInstance → ContributionEntry for aggregateStatBlocks / computeDerivedCombat.
 * Bridge keys are approximate — panel DPS is still global, not per-skill simulation.
 */
export function skillInstanceToContribution(instance: SkillInstance): ContributionEntry {
  const st = instance.computedStats
  const inc = st["damage.increased"] ?? 0
  const { moreDamagePctFromProducts } = mergeMoreProducts(st)
  const post = instance.post20MoreMultiplier
  const combinedMore = post * (1 + moreDamagePctFromProducts / 100)
  const morePct = (combinedMore - 1) * 100

  const weapon = st["skill.weaponDamagePct"] ?? 0
  /** Rough bridge: weapon % efficacy → panel increased% (tune when hit pipeline matures). */
  const bridgeDamagePct = inc + weapon * 0.12

  return {
    kind: "skill",
    refId: `instance:${instance.activeId}`,
    label: `Skill instance · ${instance.activeName} (Lv${instance.level})`,
    block: {
      damagePct: bridgeDamagePct,
      moreDamagePct: morePct,
      attackSpeedPct: st["skill.attackSpeedIncreased"] ?? 0,
      baseDamageFlat: st["skill.addedBaseDamage"] ?? 0,
      critChancePct: st["skill.critChanceIncreased"] ?? 0,
    },
  }
}
