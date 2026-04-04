/**
 * Skill combat role + damage evidence — tags / family / parsed level row / modifiers / mechanics only.
 * No invented base damage, mana, or cooldown when absent from structured data.
 */
import type { ModifierDefinition, SkillDefinition } from '@/types/skillData'
import type { ParseStatus } from '@/types/normalized'
import type { SkillCombatRole, SkillDamageRole } from '@/types/skillDamageRole'
import { modifiersFromSkillLevelRow, resolveLevelRow } from '@/lib/formula/skills/levelRowModifiers'

export type { SkillCombatRole, SkillDamageRole } from '@/types/skillDamageRole'

const norm = (s: string) => s.trim().toLowerCase()

function modifierSuggestsDirectDamage(m: ModifierDefinition): boolean {
  const s = m.stat.toLowerCase()
  if (s.includes('damage') && !s.includes('mana') && !s.includes('cost')) return true
  if (s === 'skill.addedbasedamage') return true
  if (s.includes('skill.weapon')) return true
  return false
}

function mechanicsSuggestDamage(def: SkillDefinition): boolean {
  for (const h of def.mechanics ?? []) {
    const id = (h.hookId ?? '').toLowerCase()
    const cat = (h.category ?? '').toLowerCase()
    if (id.includes('damage') || id.includes('hit') || cat.includes('damage')) return true
  }
  return false
}

/**
 * True only when structured data (not textLines alone) implies a direct damage pipeline.
 */
export function hasStructuralDamageEvidence(
  def: SkillDefinition,
  level: number,
  levelModsFromRow: ModifierDefinition[],
): boolean {
  const { row } = resolveLevelRow(def, level)
  if (row?.baseDamage != null && typeof row.baseDamage === 'number' && Number.isFinite(row.baseDamage)) {
    return true
  }
  if (
    row?.addedDamageEffectiveness != null &&
    typeof row.addedDamageEffectiveness === 'number' &&
    Number.isFinite(row.addedDamageEffectiveness)
  ) {
    return true
  }
  for (const m of def.modifiers ?? []) {
    if (modifierSuggestsDirectDamage(m)) return true
  }
  for (const m of levelModsFromRow) {
    if (modifierSuggestsDirectDamage(m)) return true
  }
  if (mechanicsSuggestDamage(def)) return true
  return false
}

export type InferSkillCombatRoleContext = {
  parseStatus?: ParseStatus
  /** When set, avoids a second `modifiersFromSkillLevelRow` pass inside inference. */
  levelModsFromRow?: ModifierDefinition[]
}

/**
 * Infer `SkillCombatRole` from real dataset fields only. `parseStatus === 'failed'` forces `unknown`.
 */
export function inferSkillCombatRole(
  def: SkillDefinition,
  level: number,
  ctx: InferSkillCombatRoleContext = {},
): SkillCombatRole {
  if (ctx.parseStatus === 'failed') return 'unknown'

  const levelMods = ctx.levelModsFromRow ?? modifiersFromSkillLevelRow(def, level)
  const evidence = hasStructuralDamageEvidence(def, level, levelMods)

  const tags = (def.tags ?? []).map(norm)
  const hay = tags.join(' ')

  if (def.family === 'support') return 'support-only'

  const summonTag =
    tags.some((t) => t.includes('圖騰') || t.includes('totem')) ||
    tags.some((t) => t.includes('召喚') || t.includes('minion') || hay.includes('minion'))
  if (summonTag) return 'summon-driver'

  const auraTag = tags.some((t) => t.includes('光環') || t.includes('aura'))
  if (auraTag && !evidence) return 'aura-only'

  const utilityTags =
    tags.some((t) => t.includes('詛咒') || t.includes('curse')) ||
    tags.some((t) => t.includes('位移') || t.includes('travel') || t.includes('movement')) ||
    tags.some((t) => t.includes('護盾') || t.includes('治療') || t.includes('guard') || t.includes('heal'))
  const warcry = tags.some((t) => t.includes('戰吼') || t.includes('warcry'))
  if (utilityTags && !evidence) return 'utility'
  if (warcry && !evidence) return 'utility'

  if (evidence) return 'damaging'

  return 'unknown'
}

/** Back-compat: uses Lv20 and no parse hint — prefer `inferSkillCombatRole(def, gemLevel, { parseStatus })`. */
export function inferSkillDamageRole(def: SkillDefinition): SkillCombatRole {
  const mods = modifiersFromSkillLevelRow(def, 20)
  return inferSkillCombatRole(def, 20, { levelModsFromRow: mods })
}

/** Aggregate DPS: only `damaging` with structured contribution should merge hit scaling (adapter may still block). */
export function isNonDamagingAggregateRole(role: SkillDamageRole): boolean {
  return role !== 'damaging'
}

/**
 * Inspected-skill primary damage card: damaging role AND calculation pipeline not marked unsupported.
 */
export function isDamagingInspectedSkillRole(
  role: SkillDamageRole,
  calculationConfidence?: 'ready' | 'partial' | 'unsupported',
): boolean {
  return role === 'damaging' && calculationConfidence !== 'unsupported'
}
