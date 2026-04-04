import type { ModifierDefinition, SkillDefinition } from "@/types/skillData"
import type { ParseStatus } from "@/types/normalized"
import type { SkillCombatRole } from "@/types/skillDamageRole"
import type {
  AppliedModifierRef,
  CalculationConfidence,
  ComputeSkillInstanceInput,
  SkillInstance,
  SkillInstanceBreakdown,
  SkillInstanceTrace,
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
import {
  levelRowModifiersIndicateHitScaling,
  levelRowWarningAffectsConfidence,
  modifiersFromSkillLevelRow,
  modifiersFromSupportGemLevelRowAppliedToActive,
  resolveLevelRow,
  warningsForSkillLevelRow,
} from "./levelRowModifiers"
import { hasStructuralDamageEvidence, inferSkillCombatRole } from "./inferDamageRole"

function deriveCalculationConfidence(
  role: SkillCombatRole,
  parseStatus: ParseStatus | undefined,
  levelSource: "levelTable" | "breakpoints" | "none",
  levelRowPartial: boolean,
  damagingEvidence: boolean,
  /** When a level row exists, hit scaling must appear in emitted level modifiers (not mana/cooldown alone). 4F-5 */
  levelRowHitScaling: boolean,
  engineWarnings: string[],
): CalculationConfidence {
  if (parseStatus === "failed") return "unsupported"
  if (role === "damaging") {
    if (!damagingEvidence) return "unsupported"
    if (parseStatus === "partial" || levelRowPartial || levelSource === "none") return "partial"
    if (levelSource !== "none" && !levelRowHitScaling) return "partial"
    if (engineWarnings.length > 0) return "partial"
    return "ready"
  }
  if (role === "unknown") return "unsupported"
  if (parseStatus === "partial") return "partial"
  return "ready"
}

/**
 * Skill Instance Layer (4D-4): one active + level row + supports + passive injects + post-20.
 * Build Layer (character aggregate) is combined later in collect/aggregate; Presentation reads `breakdown` only.
 */
export function computeSkillInstance(input: ComputeSkillInstanceInput): SkillInstance {
  const { active, level, supports } = input
  const levelMap = input.supportLevelsById ?? {}
  const passiveMods = input.passiveModifiers ?? []
  const externalMods = input.externalModifiers ?? []
  const layer = input.globalLayer ?? defaultGlobalCombatRuleLayer()
  const warnings: string[] = []
  const appliedModifiers: AppliedModifierRef[] = []
  const modBag: ModifierDefinition[] = []

  const canon = activeCanonicalTagSet(active.tags)
  const computedTags = [...new Set([...active.tags, ...[...canon]])]

  const { source: levelSource, row: levelRowResolved } = resolveLevelRow(active, level)
  const levelMods = modifiersFromSkillLevelRow(active, level)
  const levelRowWarningsFull = warningsForSkillLevelRow(active, level)
  for (const w of levelRowWarningsFull) {
    if (!levelRowWarningAffectsConfidence(w)) continue
    warnings.push(w)
  }

  const structuralDamageEvidence = hasStructuralDamageEvidence(active, level, levelMods)
  const levelRowHitScaling = levelSource === "none" || levelRowModifiersIndicateHitScaling(levelMods)
  const damageRole = inferSkillCombatRole(active, level, {
    parseStatus: input.activeParse?.status,
    levelModsFromRow: levelMods,
  })

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
    const gemLevel = Math.max(1, Math.floor(levelMap[sup.id] ?? 1))
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
      const supRowMods = modifiersFromSupportGemLevelRowAppliedToActive(active.id, sup, gemLevel)
      for (const w of warningsForSkillLevelRow(sup, gemLevel)) {
        if (!levelRowWarningAffectsConfidence(w)) continue
        warnings.push(`support_${sup.id}:${w}`)
      }
      for (const m of supRowMods) {
        modBag.push(m)
        appliedModifiers.push({ source: "support", refId: sup.id, modifier: m })
        appliedSupportModifierCount += 1
      }
    }

    return {
      supportRefId: sup.id,
      supportName: sup.name,
      supportDefinition: sup,
      gemLevel,
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

  let post20RefId: string | undefined
  if (post20Mult > 1) {
    post20RefId = "global:skill-level"
    appliedModifiers.push({
      source: "post20",
      refId: post20RefId,
      modifier: {
        selector: { kind: "skill", skillId: active.id },
        operation: "mul",
        stat: "damage.moreFromPost20",
        value: (post20Mult - 1) * 100,
        valueKind: "more",
        sourceText: "Skill_Level post-20 bands (structured rule; adapter merges into contribution)",
      },
    })
  }

  const calculationConfidence = deriveCalculationConfidence(
    damageRole,
    input.activeParse?.status,
    levelSource,
    levelRowResolved?.partial ?? false,
    structuralDamageEvidence,
    levelRowHitScaling,
    warnings,
  )

  const slotLabel = input.slotLabel ?? `Skill · ${active.name}`
  const mainSlot =
    input.mainSlot != null ? Math.min(5, Math.max(1, Math.floor(input.mainSlot))) : 1

  const trace: SkillInstanceTrace = {
    supportsAcceptedIds: supportAttachments.filter((s) => s.applied).map((s) => s.supportRefId),
    supportsRejected: supportAttachments
      .filter((s) => !s.applied)
      .map((s) => ({ id: s.supportRefId, reason: s.skipReason })),
    passiveInjects: passiveMods.map((m) => ({
      refId: m.id ?? "passive",
      stat: m.stat,
      operation: m.operation,
    })),
    post20Applied: post20Mult > 1 && !post20Disabled,
    post20RefId,
    levelRowSource: levelSource,
    levelRowHitScaling,
    levelRowWarnings: levelRowWarningsFull.length ? levelRowWarningsFull : undefined,
  }

  const breakdown: SkillInstanceBreakdown = {
    activeId: active.id,
    activeName: active.name,
    mainSlot,
    slotLabel,
    level: Math.max(1, Math.floor(level)),
    damageRole,
    calculationConfidence,
    structuralDamageEvidence,
    parseStatus: input.activeParse?.status,
    recordWarnings: input.activeParse?.warnings,
    levelRow: {
      source: levelSource,
      partial: levelRowResolved?.partial ?? false,
      modifierCount: levelMods.length,
      hitScalingFromRow: levelRowHitScaling,
      warnings: levelRowWarningsFull.length ? levelRowWarningsFull : undefined,
      textLineHints:
        levelRowResolved?.textLines && levelRowResolved.textLines.length
          ? levelRowResolved.textLines.slice(0, 3)
          : undefined,
    },
    supports: supportAttachments.map((s) => ({
      id: s.supportRefId,
      name: s.supportName,
      gemLevel: s.gemLevel,
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
    trace,
  }

  const instance: SkillInstance = {
    activeId: active.id,
    activeName: active.name,
    activeDefinition: active,
    level: Math.max(1, Math.floor(level)),
    damageRole,
    calculationConfidence,
    structuralDamageEvidence,
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
