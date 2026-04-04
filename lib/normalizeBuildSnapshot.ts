// lib/normalizeBuildSnapshot.ts
import type { BuildSnapshot, DivinityBoardState, GearSlot, HeroSelection, TreeName } from '@/types/build'
import { createEmptyBuildSnapshot } from '@/lib/defaultBuildSnapshot'

const TREE_NAMES: TreeName[] = ['godTree', 'classTree', 'tree3', 'tree4', 'divinity']

const DEFAULT_LEVEL = 1

function clampLevel(n: unknown): number {
  if (typeof n !== 'number' || !Number.isFinite(n)) return DEFAULT_LEVEL
  const i = Math.floor(n)
  if (i < 1) return DEFAULT_LEVEL
  if (i > 9999) return 9999
  return i
}

function normalizeHero(raw: HeroSelection | undefined): HeroSelection {
  if (!raw) {
    return { heroId: null, traitId: null, relicId: null, specialtyId: null }
  }
  return {
    heroId: raw.heroId ?? null,
    traitId: raw.traitId ?? null,
    relicId: raw.relicId ?? null,
    specialtyId: raw.specialtyId ?? null,
  }
}

function normalizeDivinityBoard(raw: DivinityBoardState | undefined): DivinityBoardState {
  if (!raw) {
    return { notes: '', plan: '', selectedBoardIds: [] }
  }
  return {
    notes: typeof raw.notes === 'string' ? raw.notes : '',
    plan: typeof raw.plan === 'string' ? raw.plan : '',
    selectedBoardIds: Array.isArray(raw.selectedBoardIds)
      ? raw.selectedBoardIds.filter((x): x is string => typeof x === 'string')
      : [],
  }
}

/**
 * Merge parsed / partial snapshot with defaults so older share codes missing
 * nested keys never break the app.
 */
export function mergeSnapshotWithDefaults(raw: unknown): BuildSnapshot {
  const b = createEmptyBuildSnapshot()
  if (!raw || typeof raw !== 'object') {
    return b
  }
  const s = raw as BuildSnapshot

  const metaIn = s.meta && typeof s.meta === 'object' ? s.meta : {}
  const heroIn = s.hero && typeof s.hero === 'object' ? s.hero : {}
  const talentsIn = (
    s.talents && typeof s.talents === 'object' ? s.talents : {}
  ) as Partial<Record<TreeName, unknown>>
  const notesIn = s.notes && typeof s.notes === 'object' ? s.notes : {}
  const divIn = (
    s.divinityBoard && typeof s.divinityBoard === 'object' ? s.divinityBoard : {}
  ) as Partial<DivinityBoardState>

  const talents: BuildSnapshot['talents'] = { ...b.talents }
  for (const key of TREE_NAMES) {
    const arr = talentsIn[key as TreeName]
    talents[key as TreeName] = Array.isArray(arr) ? arr.filter((x): x is string => typeof x === 'string') : b.talents[key as TreeName]
  }

  const gear: BuildSnapshot['gear'] = { ...b.gear }
  if (s.gear && typeof s.gear === 'object') {
    for (const slot of Object.keys(b.gear) as GearSlot[]) {
      const inc = s.gear[slot]
      if (inc && typeof inc === 'object') {
        gear[slot] = {
          gearBaseId: inc.gearBaseId ?? null,
          legendaryItemId: inc.legendaryItemId ?? null,
          customMods: Array.isArray(inc.customMods) ? inc.customMods : b.gear[slot].customMods,
        }
      }
    }
  }

  const skills =
    Array.isArray(s.skills) && s.skills.length === 5
      ? s.skills.map((row, i) => {
          const base = b.skills[i]!
          if (!row || typeof row !== 'object') return base
          return {
            slot: base.slot,
            skillId: row.skillId ?? null,
            supports: Array.isArray(row.supports)
              ? row.supports.filter((x): x is string => typeof x === 'string')
              : [],
            enabled: typeof row.enabled === 'boolean' ? row.enabled : true,
            notes: typeof row.notes === 'string' ? row.notes : base.notes,
          }
        })
      : b.skills

  const passives =
    Array.isArray(s.passives) && s.passives.length === 3
      ? s.passives.map((row, i) => {
          const base = b.passives[i]!
          if (!row || typeof row !== 'object') return base
          return {
            slot: base.slot,
            skillId: row.skillId ?? null,
            enabled: typeof row.enabled === 'boolean' ? row.enabled : true,
          }
        })
      : b.passives

  const pactspirits =
    Array.isArray(s.pactspirits) && s.pactspirits.length === 3
      ? s.pactspirits.map((p, i) => {
          const base = b.pactspirits[i]!
          if (!p || typeof p !== 'object') return base
          return {
            slot: base.slot,
            pactspiritId: p.pactspiritId ?? null,
          }
        })
      : b.pactspirits

  const metaMerged = { ...b.meta, ...metaIn } as BuildSnapshot['meta']

  return {
    schemaVersion: s.schemaVersion === '1.0.0' ? '1.0.0' : b.schemaVersion,
    gameVersion: typeof s.gameVersion === 'string' ? s.gameVersion : b.gameVersion,
    meta: {
      ...metaMerged,
      title: typeof metaMerged.title === 'string' ? metaMerged.title : b.meta.title,
      description: typeof metaMerged.description === 'string' ? metaMerged.description : b.meta.description,
      visibility: metaMerged.visibility ?? b.meta.visibility,
      level:
        typeof metaMerged.level === 'number' && Number.isFinite(metaMerged.level)
          ? metaMerged.level
          : b.meta.level,
    },
    hero: {
      ...b.hero,
      heroId: (heroIn as { heroId?: string | null }).heroId ?? null,
      traitId: (heroIn as { traitId?: string | null }).traitId ?? null,
      relicId: (heroIn as { relicId?: string | null }).relicId ?? null,
      specialtyId: (heroIn as { specialtyId?: string | null }).specialtyId ?? null,
    },
    talents,
    skills,
    passives,
    gear,
    pactspirits,
    notes: {
      ...b.notes,
      ...notesIn,
    },
    divinityBoard: {
      ...b.divinityBoard,
      notes: typeof divIn.notes === 'string' ? divIn.notes : b.divinityBoard.notes,
      plan: typeof divIn.plan === 'string' ? divIn.plan : b.divinityBoard.plan,
      selectedBoardIds: Array.isArray(divIn.selectedBoardIds)
        ? divIn.selectedBoardIds.filter((x): x is string => typeof x === 'string')
        : b.divinityBoard.selectedBoardIds,
    },
  }
}

/** Coerce optional fields after structural merge (same rules for persist & share code). */
export function normalizeBuildSnapshot(raw: unknown): BuildSnapshot {
  let merged: BuildSnapshot
  try {
    merged = mergeSnapshotWithDefaults(raw)
  } catch {
    merged = createEmptyBuildSnapshot()
  }
  const rawLevel = (merged.meta as { level?: number }).level

  return {
    ...merged,
    meta: {
      ...merged.meta,
      level: clampLevel(rawLevel),
    },
    hero: normalizeHero(merged.hero),
    divinityBoard: normalizeDivinityBoard(merged.divinityBoard),
  }
}
