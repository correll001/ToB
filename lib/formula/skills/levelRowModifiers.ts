import type { ModifierDefinition, SkillDefinition, SkillLevelEntry } from '@/types/skillData'

/** Keep local to avoid circular import with inferDamageRole (same rules as modifierSuggestsDirectDamage). */
function levelModSuggestsHitScaling(m: ModifierDefinition): boolean {
  const s = m.stat.toLowerCase()
  if (s.includes('damage') && !s.includes('mana') && !s.includes('cost')) return true
  if (s === 'skill.addedbasedamage') return true
  if (s.includes('skill.weapon')) return true
  return false
}

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

/** Auditable fallback only — must not downgrade calculationConfidence to partial (4F-5). */
export const LEVEL_ROW_INFO_ONLY_WARNINGS = new Set<string>(['level_row:baseDamage_range_midpoint_fallback'])

export function levelRowWarningAffectsConfidence(w: string): boolean {
  return !LEVEL_ROW_INFO_ONLY_WARNINGS.has(w)
}

/** Min–max interval on the row: when unsafe, do not emit a numeric modifier (stay partial / trace only). */
export function tryResolveBaseDamageRangeMidpoint(range: { min: number; max: number }): {
  midpoint: number
} | null {
  const min = range.min
  const max = range.max
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null
  if (min > max) return null
  if (min < 0 || max < 0) return null
  const mean = (min + max) / 2
  if (mean <= 0) return null
  const spread = max - min
  if (min > 0 && max / min > 80) return null
  if (spread / mean > 2.5) return null
  return { midpoint: mean }
}

/** True when resolved level-row modifiers include hit / damage scaling (not mana, cooldown, cast time, projectiles alone). */
export function levelRowModifiersIndicateHitScaling(levelMods: ModifierDefinition[]): boolean {
  return levelMods.some((m) => levelModSuggestsHitScaling(m))
}

function levelRowTraceWarnings(row: SkillLevelEntry, emittedFromRangeMidpoint: boolean, rangeRejected: boolean): string[] {
  const w: string[] = []
  if (row.partial) {
    w.push('level_row:parse_partial')
  }
  if (emittedFromRangeMidpoint) {
    w.push('level_row:baseDamage_range_midpoint_fallback')
  }
  if (rangeRejected) {
    w.push('level_row:baseDamage_range_unsafe_or_skipped')
  }
  const bd = row.baseDamage
  if (bd != null && typeof bd === 'object' && 'min' in bd && !('max' in bd)) {
    w.push('level_row:baseDamage_range_missing_max')
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

type RowEmitFlags = { baseDamageFromRangeMidpoint: boolean; baseDamageRangeRejected: boolean }

function pushLevelRowModifiersFromRow(
  row: SkillLevelEntry,
  sid: string,
  refs: ModifierDefinition[],
  flags: RowEmitFlags,
): void {
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

  if (row.weaponDamagePct != null && typeof row.weaponDamagePct === 'number' && Number.isFinite(row.weaponDamagePct)) {
    refs.push({
      selector: { kind: 'skill', skillId: sid },
      operation: 'add',
      stat: 'skill.weaponDamagePct',
      value: row.weaponDamagePct,
      valueKind: 'flat',
      sourceText: row.textLines?.[0] ?? `level ${row.level} weaponDamagePct`,
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
    } else if (typeof row.baseDamage === 'object' && row.baseDamage !== null && 'min' in row.baseDamage && 'max' in row.baseDamage) {
      const resolved = tryResolveBaseDamageRangeMidpoint(row.baseDamage as { min: number; max: number })
      if (resolved) {
        flags.baseDamageFromRangeMidpoint = true
        refs.push({
          selector: { kind: 'skill', skillId: sid },
          operation: 'add',
          stat: 'skill.addedBaseDamage',
          value: resolved.midpoint,
          valueKind: 'flat',
          sourceText: `${row.textLines?.[0] ?? `level ${row.level}`} · addedBaseDamage (min+max)/2 fallback`,
        })
      } else {
        flags.baseDamageRangeRejected = true
      }
    }
  }

  if (
    row.supportMoreDamageIncreasedPct != null &&
    typeof row.supportMoreDamageIncreasedPct === 'number' &&
    Number.isFinite(row.supportMoreDamageIncreasedPct)
  ) {
    refs.push({
      selector: { kind: 'skill', skillId: sid },
      operation: 'mul',
      stat: 'damage.increased',
      value: row.supportMoreDamageIncreasedPct,
      valueKind: 'increased',
      sourceText: row.textLines?.[0] ?? `level ${row.level} supportMoreDamageIncreasedPct`,
    })
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
}

function buildLevelRowModifierEmit(row: SkillLevelEntry, sid: string): {
  mods: ModifierDefinition[]
  flags: RowEmitFlags
} {
  const refs: ModifierDefinition[] = []
  const flags: RowEmitFlags = { baseDamageFromRangeMidpoint: false, baseDamageRangeRejected: false }
  pushLevelRowModifiersFromRow(row, sid, refs, flags)
  return { mods: refs, flags }
}

export function modifiersFromSkillLevelRow(active: SkillDefinition, level: number): ModifierDefinition[] {
  const { row } = resolveLevelRow(active, level)
  if (!row) return []
  return buildLevelRowModifierEmit(row, active.id).mods
}

/** Warnings for level row traceability (partial / skipped structured fields / range fallback). */
export function warningsForSkillLevelRow(active: SkillDefinition, level: number): string[] {
  const { row } = resolveLevelRow(active, level)
  if (!row) return []
  const { flags } = buildLevelRowModifierEmit(row, active.id)
  return levelRowTraceWarnings(row, flags.baseDamageFromRangeMidpoint, flags.baseDamageRangeRejected)
}

/**
 * Spell hit anchor for `computeDerivedCombat` — same policy as level-row modifiers (`tryResolveBaseDamageRangeMidpoint`).
 * Does not include weaponDamagePct (that flows via `weaponDamageEffectivenessPct` on StatBlock).
 */
export function skillHitBaseAnchorFromLevelRow(row: SkillLevelEntry | undefined): {
  value: number | null
  fromMinMaxAverage: boolean
} {
  if (!row || row.baseDamage == null) return { value: null, fromMinMaxAverage: false }
  const bd = row.baseDamage
  if (typeof bd === 'number' && Number.isFinite(bd) && bd > 0) {
    return { value: bd, fromMinMaxAverage: false }
  }
  if (typeof bd === 'object' && bd !== null && 'min' in bd && 'max' in bd) {
    const resolved = tryResolveBaseDamageRangeMidpoint(bd as { min: number; max: number })
    if (resolved) return { value: resolved.midpoint, fromMinMaxAverage: true }
  }
  return { value: null, fromMinMaxAverage: false }
}
