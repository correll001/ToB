// selectors/buildComputedStats.ts
/**
 * Sidebar stats: summary labels + combat from data-driven formula pipeline
 * (collect → aggregate → derive). No PRNG / stableMix.
 */
import type { BuildSnapshot, MainSkillSlot } from '@/types/build'
import { isMainSkillSlot } from '@/lib/build/supportLinks'
import type { BuildSidebarCombatStats, CombatBreakdown, ContributionEntry } from '@/types/combat'
import type {
  InspectedSkillDamageView,
  SkillInstance,
  SkillInstanceBreakdown,
} from '@/types/skillInstance'
import {
  collectBuildContributions,
  computeSkillInstanceForMainSlot,
  filterContributionsForInspectedMainSkill,
} from '@/lib/formula/collectBuildContributions'
import { selectDivinityBoardTextChars, selectFilledGearCount, selectValidationErrors } from '@/selectors/buildSelectors'
import {
  mockDivinityBoardOptions,
  mockHeroes,
  mockRelics,
  mockSpecialties,
  mockTraits,
} from '@/data/mockGameData'
import { aggregateStatBlocks } from '@/lib/formula/aggregateStats'
import { computeDerivedCombat } from '@/lib/formula/computeDerivedCombat'
import { isDamagingInspectedSkillRole } from '@/lib/formula/skills/inferDamageRole'
import { resolveLevelRow } from '@/lib/formula/skills/levelRowModifiers'
import { getSkillDefinitionById } from '@/lib/runtime/runtimeSkillLookup'
import type { SkillDefinition } from '@/types/skillData'

export type { BuildSidebarCombatStats } from '@/types/combat'

export type BuildStatsPanelSummaryLabels = {
  heroLabel: string
  traitLabel: string
  relicLabel: string
  specialtyLabel: string
  divinitySummaryLine: string
  gearEquippedLine: string
  divinityTextLine: string
}

export type BuildStatsPanelDerived = {
  combat: BuildSidebarCombatStats
  /** Full build pipeline (all skills + gear…) — secondary readout. */
  breakdown: CombatBreakdown
  skillInstanceBreakdowns: SkillInstanceBreakdown[]
  inspectedMainSkillSlot: MainSkillSlot | null
  inspectedSkillBreakdown: SkillInstanceBreakdown | null
  /** Full skill instance for inspected slot (or null). */
  inspectedSkillInstance: SkillInstance | null
  /** PoB-style primary readout for the inspected skill only. */
  inspectedSkillDamageView: InspectedSkillDamageView
  validationErrors: string[]
  summary: BuildStatsPanelSummaryLabels
}

function runCombatPipeline(snapshot: BuildSnapshot): {
  combat: BuildSidebarCombatStats
  breakdown: CombatBreakdown
} {
  const entries = collectBuildContributions(snapshot)
  const agg = aggregateStatBlocks(entries.map((e) => e.block))
  const textChars = selectDivinityBoardTextChars(snapshot)
  const level = snapshot.meta?.level ?? 1
  const { combat, breakdown } = computeDerivedCombat(level, agg, textChars)
  return {
    combat,
    breakdown: { ...breakdown, contributionCount: entries.length },
  }
}

export function selectBuildSidebarCombatStats(snapshot: BuildSnapshot): BuildSidebarCombatStats {
  return runCombatPipeline(snapshot).combat
}

function selectBuildStatsPanelSummary(snapshot: BuildSnapshot): BuildStatsPanelSummaryLabels {
  const boardIds = snapshot.divinityBoard?.selectedBoardIds
  const ids = Array.isArray(boardIds) ? boardIds : []
  const divinityPickN = ids.length
  const divinitySummaryLine =
    divinityPickN === 0
      ? '未選示意石板'
      : `${divinityPickN} 塊：${ids
          .map((id) => mockDivinityBoardOptions.find((o) => o.id === id)?.name ?? id)
          .join('、')}`

  const gearN = selectFilledGearCount(snapshot)
  const gearEquippedLine = `${gearN} / 10 欄已配置`

  const textChars = selectDivinityBoardTextChars(snapshot)
  const divinityTextLine =
    textChars === 0 ? '補充文字：無' : `補充文字：共 ${textChars} 字（示意）`

  return {
    heroLabel: mockHeroes.find((h) => h.id === snapshot.hero?.heroId)?.name ?? '—',
    traitLabel: mockTraits.find((t) => t.id === snapshot.hero?.traitId)?.name ?? '—',
    relicLabel: mockRelics.find((r) => r.id === snapshot.hero?.relicId)?.name ?? '—',
    specialtyLabel: mockSpecialties.find((s) => s.id === snapshot.hero?.specialtyId)?.name ?? '—',
    divinitySummaryLine,
    gearEquippedLine,
    divinityTextLine,
  }
}

function formatModifierLines(def: SkillDefinition): string[] {
  return (def.modifiers ?? []).slice(0, 18).map((m) => {
    const id = m.id ? `${m.id} · ` : ''
    return `${id}${m.stat} ${m.operation} ${String(m.value)}`
  })
}

function passiveContextLines(snapshot: BuildSnapshot, mainSlot: MainSkillSlot): string[] {
  const lines: string[] = []
  for (const p of snapshot.passives ?? []) {
    if (!p.skillId || p.enabled === false) continue
    const def = getSkillDefinitionById(p.skillId)
    const name = def?.name ?? p.skillId
    if (p.applyMode === 'global') {
      lines.push(`${name} · 全域（modifiers 會注入包含 Slot ${mainSlot} 的主技能实例）`)
    } else {
      const linked = p.linkedMainSkillSlots ?? []
      if (linked.length === 0) {
        lines.push(`${name} · linked 模式但未選槽（對任何主技能不生效）`)
        continue
      }
      if (linked.includes(mainSlot)) {
        lines.push(`${name} · 僅連結槽 [${linked.join(', ')}]（命中此檢查槽）`)
      } else {
        lines.push(`${name} · 僅連結槽 [${linked.join(', ')}]（未命中此檢查槽）`)
      }
    }
  }
  return lines
}

function buildNonDamagingInspectedView(
  snapshot: BuildSnapshot,
  mainSlot: MainSkillSlot,
  inst: SkillInstance,
  supportApplied: number,
  supportSkipped: number,
): InspectedSkillDamageView {
  const def = inst.activeDefinition
  const otherMainSkills = snapshot.skills
    .filter((r) => r.slot !== mainSlot && r.skillId && r.enabled !== false)
    .map((r) => ({
      slot: r.slot,
      skillId: r.skillId!,
      name: getSkillDefinitionById(r.skillId)?.name ?? r.skillId!,
    }))
  const rawReq = def.supportRules?.rawRequirementLines ?? []
  const summaryHints = (def.summaryText ?? []).slice(0, 4).map((s) => `概述: ${s}`)
  return {
    mode: 'nonDamaging',
    role: inst.damageRole,
    tags: [...def.tags],
    otherMainSkills,
    passiveAuraLines: passiveContextLines(snapshot, mainSlot),
    modifierLines: formatModifierLines(def),
    requirementLines: [...rawReq, ...summaryHints],
    supportApplied,
    supportSkipped,
  }
}

/**
 * Skill instance for `snapshot.meta.inspectedMainSkillSlot` (enabled main skill with valid family).
 */
export function selectInspectedSkillInstance(snapshot: BuildSnapshot): SkillInstance | null {
  const slotRaw = snapshot.meta.inspectedMainSkillSlot
  if (slotRaw == null || !isMainSkillSlot(slotRaw)) return null
  const row = snapshot.skills[slotRaw - 1]
  if (!row?.skillId || row.enabled === false) return null
  return computeSkillInstanceForMainSlot(row, snapshot)
}

/**
 * Primary left-panel combat readout scoped to the inspected skill + rest-of-build;
 * non-damaging roles omit fake single-line DPS.
 */
export function selectInspectedSkillDamageView(snapshot: BuildSnapshot): InspectedSkillDamageView {
  const slotRaw = snapshot.meta.inspectedMainSkillSlot
  if (slotRaw == null || !isMainSkillSlot(slotRaw)) {
    return { mode: 'none', reason: 'no_slot' }
  }
  const slot = slotRaw
  const row = snapshot.skills[slot - 1]
  if (!row?.skillId) {
    return { mode: 'none', reason: 'empty_slot' }
  }
  if (row.enabled === false) {
    return { mode: 'none', reason: 'disabled' }
  }
  const inst = computeSkillInstanceForMainSlot(row, snapshot)
  if (!inst) {
    return { mode: 'none', reason: 'empty_slot' }
  }

  const supportApplied = inst.supports.filter((s) => s.applied).length
  const supportSkipped = inst.supports.filter((s) => !s.applied).length

  if (!isDamagingInspectedSkillRole(inst.damageRole, inst.calculationConfidence)) {
    return buildNonDamagingInspectedView(snapshot, slot, inst, supportApplied, supportSkipped)
  }

  const entries: ContributionEntry[] = collectBuildContributions(snapshot)
  const filtered = filterContributionsForInspectedMainSkill(entries, slot)
  const agg = aggregateStatBlocks(filtered.map((e) => e.block))
  const textChars = selectDivinityBoardTextChars(snapshot)
  const level = snapshot.meta?.level ?? 1
  const { combat, breakdown } = computeDerivedCombat(level, agg, textChars)
  const skillBreakdown: CombatBreakdown = { ...breakdown, contributionCount: filtered.length }

  const { row: lvRow } = resolveLevelRow(inst.activeDefinition, inst.level)
  return {
    mode: 'damaging',
    role: inst.damageRole,
    combat,
    skillBreakdown,
    supportApplied,
    supportSkipped,
    manaCost: lvRow?.manaCost ?? null,
    cooldownSec: lvRow?.cooldown ?? null,
    castTimeSec: lvRow?.castTime ?? null,
  }
}

export function selectBuildStatsPanelDerived(
  snapshot: BuildSnapshot,
  inspectedMainSkillSlot: MainSkillSlot | null = null,
): BuildStatsPanelDerived {
  const { combat, breakdown } = runCombatPipeline(snapshot)
  const slot =
    inspectedMainSkillSlot != null && isMainSkillSlot(inspectedMainSkillSlot)
      ? inspectedMainSkillSlot
      : null
  const skillInstanceBreakdowns = snapshot.skills
    .map((row) => computeSkillInstanceForMainSlot(row, snapshot))
    .filter((i): i is NonNullable<typeof i> => i != null)
    .map((i) => i.breakdown)
  const inspectedSkillBreakdown =
    slot != null ? (skillInstanceBreakdowns.find((b) => b.mainSlot === slot) ?? null) : null

  const inspectedSkillInstance = selectInspectedSkillInstance(snapshot)
  const inspectedSkillDamageView = selectInspectedSkillDamageView(snapshot)

  return {
    combat,
    breakdown,
    skillInstanceBreakdowns,
    inspectedMainSkillSlot: slot,
    inspectedSkillBreakdown,
    inspectedSkillInstance,
    inspectedSkillDamageView,
    validationErrors: selectValidationErrors(snapshot),
    summary: selectBuildStatsPanelSummary(snapshot),
  }
}

/** @deprecated Prefer selectBuildSidebarCombatStats + BuildStatsPanelDerived */
export type BuildPanelStats = {
  dpsPerSecond: number
  attackSpeed: number
  damagePerHit: number
  strength: number
  dexterity: number
  intelligence: number
  hp: number
  mp: number
}

/** @deprecated Prefer selectBuildStatsPanelDerived */
export function computeBuildPanelStats(snapshot: BuildSnapshot): BuildPanelStats {
  const c = selectBuildSidebarCombatStats(snapshot)
  return {
    dpsPerSecond: c.dps,
    attackSpeed: c.attackSpeed,
    damagePerHit: c.hitDamage,
    strength: c.strength,
    dexterity: c.dexterity,
    intelligence: c.intelligence,
    hp: c.hp,
    mp: c.mp,
  }
}
