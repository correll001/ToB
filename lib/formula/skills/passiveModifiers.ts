import type { ModifierDefinition } from '@/types/skillData'

/**
 * Map passive-gem modifiers into the active skill instance fold (minimal v1).
 * Selectors targeting `skill` without `skillId` are bound to the main skill under evaluation.
 */
export function remapPassiveModifiersForActiveSkill(
  activeSkillId: string,
  passiveSkillId: string,
  mods: ModifierDefinition[],
): ModifierDefinition[] {
  return mods.map((m, i) => {
    const baseId = m.id ?? `passive-mod-${i}`
    if (m.selector.kind === 'skill') {
      const sid = m.selector.skillId ?? activeSkillId
      return {
        ...m,
        id: `${baseId}:via:${passiveSkillId}`,
        selector: { kind: 'skill', skillId: sid },
      }
    }
    return {
      ...m,
      id: `${baseId}:via:${passiveSkillId}`,
    }
  })
}
