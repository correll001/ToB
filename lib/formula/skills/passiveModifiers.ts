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
