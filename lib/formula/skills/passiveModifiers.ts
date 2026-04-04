import type { ModifierDefinition, Selector } from '@/types/skillData'

/**
 * Remap passive-gem modifiers into the active skill instance fold.
 * - `skill`: always bind to the evaluated main skill (ignore stale/wrong skillId from data).
 * - `supportedSkill` / `self` / `aura` / `target`: treated as buffs that apply to the linked main skill in this context.
 * - `statPath` / `custom`: omitted — not folded by composeSkillModifiers in a defined way (no fabricated stats).
 */
export function remapPassiveModifiersForActiveSkill(
  activeSkillId: string,
  passiveSkillId: string,
  mods: ModifierDefinition[],
): ModifierDefinition[] {
  const out: ModifierDefinition[] = []
  for (let i = 0; i < mods.length; i++) {
    const m = mods[i]
    if (!m?.stat || typeof m.stat !== 'string') continue

    const baseId = m.id ?? `passive-mod-${i}`
    const tagged: ModifierDefinition = {
      ...m,
      id: `${baseId}:via:${passiveSkillId}`,
    }

    const remappedSel = remapPassiveSelectorToEvaluatedSkill(m.selector, activeSkillId)
    if (!remappedSel) continue

    out.push({
      ...tagged,
      selector: remappedSel,
    })
  }
  return out
}

/** Skill-tab traces: same remap rules + foldability bookkeeping (no fabricated stats). */
export function analyzePassiveModifiersForActiveSkill(
  activeSkillId: string,
  passiveSkillId: string,
  mods: ModifierDefinition[],
): {
  remapped: ModifierDefinition[]
  skippedNoStat: number
  skippedNonFoldableSelector: number
  statKeys: string[]
  hasAuraSelector: boolean
} {
  let skippedNoStat = 0
  let skippedNonFoldableSelector = 0
  let hasAuraSelector = false
  for (let i = 0; i < mods.length; i++) {
    const m = mods[i]
    if (!m) continue
    if (m.selector?.kind === 'aura') hasAuraSelector = true
    if (!m?.stat || typeof m.stat !== 'string') {
      skippedNoStat++
      continue
    }
    if (!remapPassiveSelectorToEvaluatedSkill(m.selector, activeSkillId)) {
      skippedNonFoldableSelector++
    }
  }

  const remapped = remapPassiveModifiersForActiveSkill(activeSkillId, passiveSkillId, mods)
  const statKeys = [...new Set(remapped.map((r) => r.stat))].sort((a, b) => a.localeCompare(b, 'en'))
  return {
    remapped,
    skippedNoStat,
    skippedNonFoldableSelector,
    statKeys,
    hasAuraSelector,
  }
}

function remapPassiveSelectorToEvaluatedSkill(sel: Selector, activeSkillId: string): Selector | null {
  switch (sel.kind) {
    case 'skill':
      return { kind: 'skill', skillId: activeSkillId }
    case 'supportedSkill':
    case 'self':
    case 'aura':
    case 'target':
      return { kind: 'skill', skillId: activeSkillId }
    case 'statPath':
    case 'custom':
      return null
  }
}
