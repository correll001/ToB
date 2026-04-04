import type { ModifierDefinition, SkillDefinition } from "@/types/skillData"
import type {
  AppliedModifierRef,
  ComputeSkillInstanceInput,
  SkillInstance,
  SkillInstanceBreakdown,
} from "@/types/skillInstance"
import { activeCanonicalTagSet } from "./tagVocabulary"
import { evaluateSupportAttachment } from "./applySupportRules"
import {
  defaultGlobalCombatRuleLayer,
  post20DisabledByMechanics,
  post20MoreMultiplier,
  resolvePost20ConfigForSkill,
} from "./applyPost20Scaling"
import { composeSkillModifiers } from "./composeSkillModifiers"
import { skillInstanceToContribution } from "./skillInstanceAdapter"
import { modifiersFromSkillLevelRow, resolveLevelRow, warningsForSkillLevelRow } from "./levelRowModifiers"

export function computeSkillInstance(input: ComputeSkillInstanceInput): SkillInstance {
  const { active, level, supports } = input
  const passiveMods = input.passiveModifiers ?? []
  const externalMods = input.externalModifiers ?? []
  const layer = input.globalLayer ?? defaultGlobalCombatRuleLayer()
  const warnings: string[] = []
  const appliedModifiers: AppliedModifierRef[] = []
  const modBag: ModifierDefinition[] = []

  const canon = activeCanonicalTagSet(active.tags)
  const computedTags = [...new Set([...active.tags, ...[...canon]])]

  const { source: levelSource } = resolveLevelRow(active, level)
  const levelMods = modifiersFromSkillLevelRow(active, level)
  warnings.push(...warningsForSkillLevelRow(active, level))

  for (const m of levelMods) {
    modBag.push(m)
    appliedModifiers.push({ source: "levelRow", refId: active.id, modifier: m })
  }

  for (const m of active.modifiers ?? []) {
    modBag.push(m)
    appliedModifiers.push({ source: "active", refId: active.id, modifier: m })
  }

  let appliedSupportModifierCount = 0

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
        appliedSupportModifierCount += 1
      }
    }

    return {
      supportRefId: sup.id,
      supportName: sup.name,
      supportDefinition: sup,
      applied: ev.applied,
      warnings: ev.warnings,
      skipReason: ev.skipReason,
      rawRequirementLines: ev.rawRequirementLines,
    }
  })

  for (const m of passiveMods) {
    modBag.push(m)
    appliedModifiers.push({ source: "passive", refId: m.id ?? "passive", modifier: m })
  }

  for (const m of externalMods) {
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

  const levelRowResolved = resolveLevelRow(active, level).row
  const slotLabel = input.slotLabel ?? `Skill · ${active.name}`

  const breakdown: SkillInstanceBreakdown = {
    activeId: active.id,
    activeName: active.name,
    slotLabel,
    level: Math.max(1, Math.floor(level)),
    parseStatus: input.activeParse?.status,
    recordWarnings: input.activeParse?.warnings,
    levelRow: {
      source: levelSource,
      partial: levelRowResolved?.partial ?? false,
      modifierCount: levelMods.length,
      textLineHints:
        levelRowResolved?.textLines && levelRowResolved.textLines.length
          ? levelRowResolved.textLines.slice(0, 3)
          : undefined,
    },
    supports: supportAttachments.map((s) => ({
      id: s.supportRefId,
      name: s.supportName,
      applied: s.applied,
      skipReason: s.skipReason,
      warnings: s.warnings,
      rawRequirementLines: s.rawRequirementLines,
    })),
    post20: {
      multiplier: post20Mult,
      tier21to30PerLevelMorePct: postCfg.tier21to30PerLevelMorePct,
      tier31PlusPerLevelMorePct: postCfg.tier31PlusPerLevelMorePct,
      disabledByMechanic: post20Disabled,
    },
    passiveModifierCount: passiveMods.length,
    externalModifierCount: externalMods.length,
    levelModifierCount: levelMods.length,
    activeBaseModifierCount: active.modifiers?.length ?? 0,
    appliedSupportModifierCount,
    computedStats: { ...computedStats },
    engineWarnings: [...warnings],
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
    breakdown,
  }

  instance.contributionBlock = skillInstanceToContribution(instance).block
  return instance
}

export { skillInstanceToContribution } from "./skillInstanceAdapter"
export { appendSkillInstanceContributions } from "@/types/skillInstance"
