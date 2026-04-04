import type { SkillDefinition, JsonValue } from "@/types/skillData"
import type { GlobalCombatRuleLayer, Post20ScalingConfig } from "@/types/skillInstance"

function numFromJson(v: JsonValue | undefined): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v
  return undefined
}

export const TLIDB_DEFAULT_POST20: Post20ScalingConfig = {
  tier21to30PerLevelMorePct: 10,
  tier31PlusPerLevelMorePct: 8,
}

export function defaultGlobalCombatRuleLayer(): GlobalCombatRuleLayer {
  return {
    getPost20Scaling: () => TLIDB_DEFAULT_POST20,
    getResourceScalingHint: () => ({
      hpFlatPerLevel: 13,
      mpFlatPerLevel: 5,
      strToHp: 0.2,
      intToMp: 0.5,
    }),
    getDamageBucketKeys: () => ["hit", "dot", "ailment", "secondary"],
  }
}

/** Per Skill_Level wiki: bands 21–30 (+10% more / level), 31+ (+8% more / level), multiplicative across levels. */
export function post20MoreMultiplier(
  level: number,
  config: Post20ScalingConfig,
  opts?: { disabled?: boolean },
): number {
  if (opts?.disabled || level <= 20) return 1
  const lv = Math.floor(level)
  const over20 = lv - 20
  const steps21to30 = Math.min(over20, 10)
  const steps31plus = Math.max(0, over20 - 10)
  const a = (1 + config.tier21to30PerLevelMorePct / 100) ** steps21to30
  const b = (1 + config.tier31PlusPerLevelMorePct / 100) ** steps31plus
  return a * b
}

export function post20DisabledByMechanics(active: SkillDefinition): boolean {
  return (
    active.mechanics?.some(
      (m) =>
        m.hookId === "override:post20" &&
        (m.parameters?.skip === true || m.parameters?.disabled === true),
    ) ?? false
  )
}

/** Last `override:post20` hook wins for tier overrides; base from global layer. */
export function resolvePost20ConfigForSkill(
  active: SkillDefinition,
  layer: GlobalCombatRuleLayer,
): Post20ScalingConfig {
  const base = layer.getPost20Scaling()
  const hooks = active.mechanics?.filter((m) => m.hookId === "override:post20") ?? []
  if (hooks.length === 0) return base
  const p = hooks[hooks.length - 1]!.parameters ?? {}
  const t21 = numFromJson(p.tier21to30PerLevelMorePct)
  const t31 = numFromJson(p.tier31PlusPerLevelMorePct)
  return {
    tier21to30PerLevelMorePct: t21 ?? base.tier21to30PerLevelMorePct,
    tier31PlusPerLevelMorePct: t31 ?? base.tier31PlusPerLevelMorePct,
  }
}
