import type { SkillDefinition, SupportRule } from "@/types/skillData"
import type { SupportAttachment } from "@/types/skillInstance"
import { activeCanonicalTagSet, zhTagToCanonical } from "./tagVocabulary"

function ruleFailsOnTags(activeCanon: Set<string>, rule: SupportRule): string | null {
  if (rule.forbiddenSkillTags?.length) {
    for (const t of rule.forbiddenSkillTags) {
      const c = zhTagToCanonical(t)
      if (activeCanon.has(t) || activeCanon.has(c)) {
        return `forbidden_tag:${t}`
      }
    }
  }

  if (rule.allowedSkillTags?.length) {
    let any = false
    for (const t of rule.allowedSkillTags) {
      const c = zhTagToCanonical(t)
      if (activeCanon.has(t) || activeCanon.has(c)) {
        any = true
        break
      }
    }
    if (!any) return `allowedSkillTags_unsatisfied:${rule.allowedSkillTags.join(",")}`
  }

  if (rule.requiresAttack && !activeCanon.has("Attack")) {
    return "requires_attack"
  }
  if (rule.requiresSpell && !activeCanon.has("Spell")) {
    return "requires_spell"
  }
  if (rule.requiresProjectile && !activeCanon.has("Projectile")) {
    return "requires_projectile"
  }
  if (rule.requiresChanneled && !activeCanon.has("Channeled")) {
    return "requires_channeled"
  }

  return null
}

export function evaluateSupportAttachment(
  active: SkillDefinition,
  support: SkillDefinition,
): Pick<SupportAttachment, "applied" | "warnings" | "skipReason" | "rawRequirementLines"> {
  const warnings: string[] = []

  if (support.family !== "support") {
    return {
      applied: false,
      warnings: ["support_family_mismatch"],
      skipReason: "not_support_family",
    }
  }

  const rule = support.supportRules
  if (!rule || Object.keys(rule).length === 0) {
    warnings.push("support_missing_supportRules_treated_as_compatible")
    return { applied: true, warnings }
  }

  const rawLines = rule.rawRequirementLines?.length ? [...rule.rawRequirementLines] : undefined
  if (rawLines?.length) {
    warnings.push(`support_raw_requirements_trace:${rawLines.join(" │ ")}`)
  }

  const activeCanon = activeCanonicalTagSet(active.tags)
  const fail = ruleFailsOnTags(activeCanon, rule)
  if (fail) {
    return { applied: false, warnings: [fail], skipReason: fail, rawRequirementLines: rawLines }
  }

  return { applied: true, warnings, rawRequirementLines: rawLines }
}
