import type { ModifierDefinition, SkillDefinition, SkillLevelEntry } from '@/types/skillData'

export function resolveLevelRow(
  active: SkillDefinition,
  level: number,
): { row: SkillLevelEntry | undefined; source: 'levelTable' | 'breakpoints' | 'none' } {
  const lv = Math.max(1, Math.floor(level))
  if (active.levelTable?.[lv]) {
    return { row: active.levelTable[lv], source: 'levelTable' }
  }
  const bps = active.levelBreakpoints
  if (!bps?.length) {
    return { row: undefined, source: 'none' }
  }
  const exact = bps.filter((b) => b.level === lv)
  if (exact.length) {
    return { row: exact[exact.length - 1], source: 'breakpoints' }
  }
  const atOrBelow = bps.filter((b) => b.level <= lv).sort((a, b) => b.level - a.level)
  if (atOrBelow[0]) {
    return { row: atOrBelow[0], source: 'breakpoints' }
  }
  return { row: undefined, source: 'none' }
}

function levelRowTraceWarnings(row: SkillLevelEntry): string[] {
  const w: string[] = []
  if (row.partial) {
    w.push('level_row:parse_partial')
  }
  if (row.baseDamage != null && typeof row.baseDamage === 'object' && 'min' in row.baseDamage) {
    w.push('level_row:baseDamage_range_not_numeric_skipped')
  }
  return w
}

/**
 * Per-level row → numeric modifiers. Does not invent values from textLines alone.
 *
 * Support-gem level row stats that target the support's own id are re-attached to the active skill id
 * so composeSkillModifiers folds them into the inspected main skill.
 */
export function modifiersFromSupportGemLevelRowAppliedToActive(
  activeSkillId: string,
  supportDef: SkillDefinition,
  level: number,
): ModifierDefinition[] {
  return modifiersFromSkillLevelRow(supportDef, level).map((m) => {
    if (m.selector.kind === 'skill' && m.selector.skillId === supportDef.id) {
      return { ...m, selector: { kind: 'skill', skillId: activeSkillId } }
    }
    return m
  })
}

export function modifiersFromSkillLevelRow(active: SkillDefinition, level: number): ModifierDefinition[] {
  const { row } = resolveLevelRow(active, level)
  if (!row) return []

  const refs: ModifierDefinition[] = []
  const sid = active.id

  if (row.projectileCount != null && typeof row.projectileCount === 'number' && row.projectileCount !== 0) {
    refs.push({
      selector: { kind: 'skill', skillId: sid },
      operation: 'add',
      stat: 'projectileCount',
      value: row.projectileCount,
      valueKind: 'flat',
      sourceText: row.textLines?.[0] ?? `level ${row.level} projectileCount`,
    })
  }

  if (row.manaCost != null && typeof row.manaCost === 'number') {
    refs.push({
      selector: { kind: 'skill', skillId: sid },
      operation: 'override',
      stat: 'skill.manaCost',
      value: row.manaCost,
      sourceText: row.textLines?.[0] ?? `level ${row.level} mana`,
    })
  }

  if (row.cooldown != null && typeof row.cooldown === 'number') {
    refs.push({
      selector: { kind: 'skill', skillId: sid },
      operation: 'override',
      stat: 'skill.cooldownSec',
      value: row.cooldown,
      sourceText: `level ${row.level} cooldown`,
    })
  }

  if (row.castTime != null && typeof row.castTime === 'number') {
    refs.push({
      selector: { kind: 'skill', skillId: sid },
      operation: 'override',
      stat: 'skill.castTimeSec',
      value: row.castTime,
      sourceText: `level ${row.level} castTime`,
    })
  }

  if (row.baseDamage != null) {
    if (typeof row.baseDamage === 'number' && Number.isFinite(row.baseDamage)) {
      refs.push({
        selector: { kind: 'skill', skillId: sid },
        operation: 'add',
        stat: 'skill.addedBaseDamage',
        value: row.baseDamage,
        valueKind: 'flat',
        sourceText: row.textLines?.[0] ?? `level ${row.level} baseDamage`,
      })
    }
  }

  if (row.addedDamageEffectiveness != null && typeof row.addedDamageEffectiveness === 'number') {
    refs.push({
      selector: { kind: 'skill', skillId: sid },
      operation: 'add',
      stat: 'skill.addedDamageEffectiveness',
      value: row.addedDamageEffectiveness,
      valueKind: 'flat',
      sourceText: row.textLines?.[0] ?? `level ${row.level} addedDamageEffectiveness`,
    })
  }

  return refs
}

/** Warnings for level row traceability (partial / skipped structured fields). */
export function warningsForSkillLevelRow(active: SkillDefinition, level: number): string[] {
  const { row } = resolveLevelRow(active, level)
  if (!row) return []
  return levelRowTraceWarnings(row)
}
