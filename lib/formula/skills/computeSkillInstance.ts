import type { ModifierDefinition, SkillDefinition } from "@/types/skillData"
import type { AppliedModifierRef, ComputeSkillInstanceInput, SkillInstance } from "@/types/skillInstance"
import { activeCanonicalTagSet } from "./tagVocabulary"
import { evaluateSupportAttachment } from "./applySupportRules"
import {
  defaultGlobalCombatRuleLayer,
  post20DisabledByMechanics,
  post20MoreMultiplier,
  resolvePost20ConfigForSkill,
} from "./applyPost20Scaling"
import { composeSkillModifiers, mergeMoreProducts } from "./composeSkillModifiers"
import { skillInstanceToContribution } from "./skillInstanceAdapter"

function levelRowModifiers(_active: SkillDefinition, _level: number): ModifierDefinition[] {
  /** SkillLevelEntry has no structured modifiers yet — hook for future normalization. */
  return []
}

export function computeSkillInstance(input: ComputeSkillInstanceInput): SkillInstance {
  const { active, level, supports, externalModifiers = [] } = input
  const layer = input.globalLayer ?? defaultGlobalCombatRuleLayer()
  const warnings: string[] = []
  const appliedModifiers: AppliedModifierRef[] = []
  const modBag: ModifierDefinition[] = []

  const canon = activeCanonicalTagSet(active.tags)
  const computedTags = [...new Set([...active.tags, ...[...canon]])]

  for (const m of levelRowModifiers(active, level)) {
    modBag.push(m)
    appliedModifiers.push({ source: "levelRow", refId: active.id, modifier: m })
  }

  for (const m of active.modifiers ?? []) {
    modBag.push(m)
    appliedModifiers.push({ source: "active", refId: active.id, modifier: m })
  }

  const supportAttachments = supports.map((sup) => {
    const ev = evaluateSupportAttachment(active, sup)
    if (!ev.applied) {
      warnings.push(`support_skipped:${sup.id}:${ev.skipReason ?? "unknown"}`)
    } else if (ev.warnings.length) {
      warnings.push(...ev.warnings.map((w) => `support:${sup.id}:${w}`))
    }

    if (ev.applied) {
      for (const m of sup.modifiers ?? []) {
        modBag.push(m)
        appliedModifiers.push({ source: "support", refId: sup.id, modifier: m })
      }
    }

    return {
      supportRefId: sup.id,
      supportName: sup.name,
      supportDefinition: sup,
      applied: ev.applied,
      warnings: ev.warnings,
      skipReason: ev.skipReason,
    }
  })

  for (const m of externalModifiers) {
    modBag.push(m)
    appliedModifiers.push({ source: "external", refId: "external", modifier: m })
  }

  const post20Disabled = post20DisabledByMechanics(active)
  const postCfg = resolvePost20ConfigForSkill(active, layer)
  const post20Mult = post20MoreMultiplier(level, postCfg, { disabled: post20Disabled })
  if (post20Disabled) {
    warnings.push("post20_disabled_by_mechanics")
  }

  const wBundle = (msg: string) => {
    warnings.push(msg)
  }

  const computedStats = composeSkillModifiers(modBag, {}, wBundle)

  if (post20Mult > 1) {
    appliedModifiers.push({
      source: "post20",
      refId: "global:skill-level",
      modifier: {
        selector: { kind: "skill", skillId: active.id },
        operation: "mul",
        stat: "damage.moreFromPost20",
        value: (post20Mult - 1) * 100,
        valueKind: "more",
        sourceText: "Skill_Level post-20 bands (applied in adapter, not double-counted in stats)",
      },
    })
  }

  const instance: SkillInstance = {
    activeId: active.id,
    activeName: active.name,
    activeDefinition: active,
    level: Math.max(1, Math.floor(level)),
    computedTags,
    canonicalTags: [...canon],
    supports: supportAttachments,
    computedStats,
    appliedModifiers,
    warnings,
    post20MoreMultiplier: post20Mult,
    contributionBlock: {},
  }

  instance.contributionBlock = skillInstanceToContribution(instance).block
  return instance
}

export { skillInstanceToContribution } from "./skillInstanceAdapter"
export { appendSkillInstanceContributions } from "@/types/skillInstance"
