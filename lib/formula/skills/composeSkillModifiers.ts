import type { ModifierDefinition } from "@/types/skillData"
import type { SkillComputedStats } from "@/types/skillInstance"

function numValue(m: ModifierDefinition): number | null {
  if (typeof m.value === "number" && Number.isFinite(m.value)) return m.value
  return null
}

/**
 * Fold modifiers into SkillComputedStats. Only numeric values; strings get skipped.
 * - add: stats[stat] += v
 * - mul + increased: accumulate additive % into stats[stat]
 * - mul + more/unknown or flat mul: multiply stats[stat] (default base 1 for mult scale stats)
 */
export function composeSkillModifiers(
  mods: ModifierDefinition[],
  into: SkillComputedStats,
  onWarning?: (w: string) => void,
): SkillComputedStats {
  const out = { ...into }

  for (const m of mods) {
    const v = numValue(m)
    if (v == null) {
      onWarning?.(`skip_non_numeric:${m.stat}`)
      continue
    }

    if (m.operation === "add") {
      out[m.stat] = (out[m.stat] ?? 0) + v
      continue
    }

    if (m.operation === "mul") {
      if (m.valueKind === "increased" || m.stat.includes("increased")) {
        out[m.stat] = (out[m.stat] ?? 0) + v
      } else if (m.valueKind === "more") {
        const key = `${m.stat}:moreProduct`
        out[key] = (out[key] ?? 1) * (1 + v / 100)
      } else {
        out[m.stat] = (out[m.stat] ?? 1) * v
      }
      continue
    }

    if (m.operation === "override") {
      out[m.stat] = v
      continue
    }

    onWarning?.(`skip_operation:${m.operation}`)
  }

  return out
}

export function mergeMoreProducts(stats: SkillComputedStats): { moreDamagePctFromProducts: number } {
  let product = 1
  for (const [k, val] of Object.entries(stats)) {
    if (k.endsWith(":moreProduct") && typeof val === "number") {
      product *= val
    }
  }
  if (product <= 1) return { moreDamagePctFromProducts: 0 }
  return { moreDamagePctFromProducts: (product - 1) * 100 }
}
