// lib/normalizeBuildSnapshot.ts
import type {
  BuildSnapshot,
  DivinityBoardState,
  GearSlot,
  HeroSelection,
  MainSkillSlot,
  PassiveApplyMode,
  PassiveSkillSetup,
  SkillSetup,
  SupportLink,
  TreeName,
} from '@/types/build'
import { compactSupportLinkSlots, isMainSkillSlot } from '@/lib/build/supportLinks'
import { createEmptyBuildSnapshot } from '@/lib/defaultBuildSnapshot'
import { normalizeNamedGrandAffixSlots } from '@/lib/talent/namedGrandTalentCatalog'

const TREE_NAMES: TreeName[] = ['godTree', 'classTree', 'tree3', 'tree4', 'divinity']

const DEFAULT_LEVEL = 1

function clampGemLevel(n: number): number {
  const i = Math.floor(n)
  if (!Number.isFinite(i) || i < 1) return 1
  if (i > 99) return 99
  return i
}

function clampLevel(n: unknown): number {
  if (typeof n !== 'number' || !Number.isFinite(n)) return DEFAULT_LEVEL
  const i = Math.floor(n)
  if (i < 1) return DEFAULT_LEVEL
  if (i > 9999) return 9999
  return i
}

function parseInspectedMainSkillSlot(raw: unknown): MainSkillSlot | null {
  if (raw === null || raw === undefined) return null
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    const s = Math.floor(raw)
    if (isMainSkillSlot(s)) return s
  }
  return null
}

function normalizeSupportsFromUnknown(
  o: Record<string, unknown>,
  skillLevel: number,
): SupportLink[] {
  const sl = skillLevel
  const asLinks = (items: unknown[]): SupportLink[] => {
    const out: SupportLink[] = []
    let slot = 1
    for (const item of items) {
      if (item == null || typeof item !== 'object') continue
      const x = item as Record<string, unknown>
      const sid =
        (typeof x.supportSkillId === 'string' ? x.supportSkillId : null) ??
        (typeof x.skillId === 'string' ? x.skillId : null)
      if (!sid) continue
      const level =
        typeof x.level === 'number' && Number.isFinite(x.level) ? clampGemLevel(x.level) : clampGemLevel(sl)
      const enabled = typeof x.enabled === 'boolean' ? x.enabled : true
      const linkSlot =
        typeof x.linkSlot === 'number' && Number.isFinite(x.linkSlot)
          ? Math.min(20, Math.max(1, Math.floor(x.linkSlot)))
          : slot
      out.push({ supportSkillId: sid, level, enabled, linkSlot })
      slot += 1
    }
    return compactSupportLinkSlots(out)
  }

  if (Array.isArray(o.supports)) {
    const arr = o.supports as unknown[]
    if (arr.length === 0) return []
    if (typeof arr[0] === 'string') {
      return asLinks((arr as string[]).map((supportSkillId) => ({ supportSkillId })))
    }
    return asLinks(arr)
  }

  if (Array.isArray(o.supportLinks)) {
    return asLinks(o.supportLinks as unknown[])
  }

  return []
}

function normalizePassive(
  row: unknown,
  base: PassiveSkillSetup,
  o: Record<string, unknown>,
): PassiveSkillSetup {
  const skillLevel =
    typeof o.skillLevel === 'number' && Number.isFinite(o.skillLevel)
      ? clampGemLevel(o.skillLevel)
      : typeof o.skillGemLevel === 'number' && Number.isFinite(o.skillGemLevel)
        ? clampGemLevel(o.skillGemLevel)
        : base.skillLevel

  let applyMode: PassiveApplyMode = 'global'
  let linkedMainSkillSlots: MainSkillSlot[] = []

  if (o.applyMode === 'global' || o.applyMode === 'linked') {
    applyMode = o.applyMode
    if (Array.isArray(o.linkedMainSkillSlots)) {
      linkedMainSkillSlots = (o.linkedMainSkillSlots as unknown[])
        .map((x) => (typeof x === 'number' ? Math.floor(x) : NaN))
        .filter((x): x is MainSkillSlot => isMainSkillSlot(x))
      linkedMainSkillSlots = [...new Set(linkedMainSkillSlots)].sort((a, b) => a - b)
    }
  } else if (typeof o.linkedMainSlot === 'number' && Number.isFinite(o.linkedMainSlot)) {
    const sn = Math.floor(o.linkedMainSlot)
    if (isMainSkillSlot(sn)) {
      applyMode = 'linked'
      linkedMainSkillSlots = [sn]
    }
  }

  return {
    slot: base.slot,
    skillId: (o.skillId as string | null | undefined) ?? null,
    enabled: typeof o.enabled === 'boolean' ? o.enabled : true,
    applyMode,
    linkedMainSkillSlots,
    skillLevel,
  }
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

function normalizeGodTalentRanks(
  raw: unknown,
  talentsIn: Partial<Record<TreeName, unknown>>,
): Record<string, number> {
  const out: Record<string, number> = {}

  if (raw && typeof raw === 'object') {
    for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
      if (typeof k !== 'string' || k.trim() === '') continue
      if (typeof v !== 'number' || !Number.isFinite(v)) continue
      const n = Math.floor(v)
      if (n < 1) continue
      out[k] = Math.min(99, n)
    }
  }

  const godArr = talentsIn.godTree
  if (Array.isArray(godArr)) {
    for (const id of godArr) {
      if (typeof id === 'string' && id.trim() !== '' && out[id] == null) {
        out[id] = 1
      }
    }
  }

  return out
}

function normalizeTalentWallBoards(
  raw: unknown,
  legacyGodRanks: unknown,
  talentsIn: Partial<Record<TreeName, unknown>>,
): BuildSnapshot['talentWallBoards'] {
  const DEFAULT_PANEL = 'god_God_of_Might'
  const emptyBoard = (pid: string): BuildSnapshot['talentWallBoards'][number] => ({
    panelId: pid,
    ranks: {},
    namedGrandAffixSlots: normalizeNamedGrandAffixSlots(null),
  })
  const boards: BuildSnapshot['talentWallBoards'] = [
    emptyBoard(DEFAULT_PANEL),
    emptyBoard(DEFAULT_PANEL),
    emptyBoard(DEFAULT_PANEL),
    emptyBoard(DEFAULT_PANEL),
  ]

  if (Array.isArray(raw)) {
    for (let i = 0; i < 4 && i < raw.length; i++) {
      const row = raw[i]
      if (!row || typeof row !== 'object') continue
      const o = row as Record<string, unknown>
      const pid =
        typeof o.panelId === 'string' && o.panelId.trim() !== '' ? o.panelId.trim() : DEFAULT_PANEL
      const ranks: Record<string, number> = {}
      if (o.ranks && typeof o.ranks === 'object') {
        for (const [k, v] of Object.entries(o.ranks as Record<string, unknown>)) {
          if (typeof k !== 'string' || k.trim() === '') continue
          if (typeof v !== 'number' || !Number.isFinite(v)) continue
          const n = Math.floor(v)
          if (n >= 1) ranks[k] = Math.min(99, n)
        }
      }
      const rawGrand = o.namedGrandAffixSlots
      const grand = normalizeNamedGrandAffixSlots(rawGrand)
      boards[i] = { panelId: pid, ranks, namedGrandAffixSlots: grand }
    }
  }

  const legacy = normalizeGodTalentRanks(legacyGodRanks, talentsIn)
  for (const [k, v] of Object.entries(legacy)) {
    if (boards[0]!.ranks[k] == null) {
      boards[0]!.ranks[k] = v
    }
  }

  return boards
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

function finalizeInspectedMainSkillSlot(snapshot: BuildSnapshot): MainSkillSlot | null {
  let s = snapshot.meta.inspectedMainSkillSlot
  if (s != null) {
    const row = snapshot.skills[s - 1]
    if (!row?.skillId) s = null
  }
  if (s != null) return s
  for (let i = 0; i < snapshot.skills.length; i++) {
    if (snapshot.skills[i]!.skillId) return (i + 1) as MainSkillSlot
  }
  return null
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

  const legacyGodRanks = (s as Partial<BuildSnapshot> & { godTalentRanks?: unknown }).godTalentRanks
  const talentWallBoards = normalizeTalentWallBoards(
    (s as Partial<BuildSnapshot>).talentWallBoards,
    legacyGodRanks,
    talentsIn,
  )
  talents.godTree = []

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

  const skills: SkillSetup[] =
    Array.isArray(s.skills) && s.skills.length === 5
      ? s.skills.map((row, i) => {
          const base = b.skills[i]!
          if (!row || typeof row !== 'object') return base
          const o = row as unknown as Record<string, unknown>

          const skillLevel =
            typeof o.skillLevel === 'number' && Number.isFinite(o.skillLevel)
              ? clampGemLevel(o.skillLevel)
              : typeof o.skillGemLevel === 'number' && Number.isFinite(o.skillGemLevel)
                ? clampGemLevel(o.skillGemLevel)
                : 20

          const supports = normalizeSupportsFromUnknown(o, skillLevel)

          const inspectionEnabled =
            typeof o.inspectionEnabled === 'boolean' ? o.inspectionEnabled : undefined

          return {
            slot: base.slot,
            skillId: (o.skillId as string | null | undefined) ?? null,
            supports,
            skillLevel,
            enabled: typeof o.enabled === 'boolean' ? o.enabled : true,
            inspectionEnabled,
            notes: typeof o.notes === 'string' ? o.notes : base.notes,
          }
        })
      : b.skills

  const passives: PassiveSkillSetup[] =
    Array.isArray(s.passives) && s.passives.length === 3
      ? s.passives.map((row, i) => {
          const base = b.passives[i]!
          if (!row || typeof row !== 'object') return base
          return normalizePassive(row, base, row as unknown as Record<string, unknown>)
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

  const inspectedFromInput =
    'inspectedMainSkillSlot' in metaIn
      ? parseInspectedMainSkillSlot((metaIn as { inspectedMainSkillSlot?: unknown }).inspectedMainSkillSlot)
      : undefined

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
      inspectedMainSkillSlot:
        inspectedFromInput !== undefined ? inspectedFromInput : b.meta.inspectedMainSkillSlot,
    },
    hero: {
      ...b.hero,
      heroId: (heroIn as { heroId?: string | null }).heroId ?? null,
      traitId: (heroIn as { traitId?: string | null }).traitId ?? null,
      relicId: (heroIn as { relicId?: string | null }).relicId ?? null,
      specialtyId: (heroIn as { specialtyId?: string | null }).specialtyId ?? null,
    },
    talents,
    talentWallBoards,
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
  const inspected = finalizeInspectedMainSkillSlot(merged)

  return {
    ...merged,
    meta: {
      ...merged.meta,
      level: clampLevel(rawLevel),
      inspectedMainSkillSlot: inspected,
    },
    hero: normalizeHero(merged.hero),
    divinityBoard: normalizeDivinityBoard(merged.divinityBoard),
  }
}
