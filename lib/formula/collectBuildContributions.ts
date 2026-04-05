/**
 * Formula layering (4D-4):
 * - Build Layer: this module merges all contribution StatBlocks (hero, gear, talents, skills…).
 * - Skill Instance Layer: see `computeSkillInstance` / `computeSkillInstanceForMainSlot`.
 * - Presentation Layer: selectors + panels read snapshots + derived combat only.
 */
import type { BuildSnapshot, GearSlot, MainSkillSlot, SkillSetup, TreeName } from '@/types/build'
import type { ContributionEntry, StatBlock } from '@/types/combat'
import type { ModifierDefinition, SkillDefinition } from '@/types/skillData'
import type { SkillInstance } from '@/types/skillInstance'
import { bundledGlobalCombatRuleLayer } from '@/lib/runtime/runtimeRulesLookup'
import {
  getSkillDefinitionById,
  getNormalizedSkillRecord,
  isMainSlotSkillFamily,
} from '@/lib/runtime/runtimeSkillLookup'
import { isMainSkillSlot } from '@/lib/build/supportLinks'
import { computeSkillInstance } from '@/lib/formula/skills'
import { modifiersFromSkillLevelRow } from '@/lib/formula/skills/levelRowModifiers'
import { remapPassiveModifiersForActiveSkill } from '@/lib/formula/skills/passiveModifiers'

import {
  DIVINITY_BOARD_OPTION_CONTRIBUTIONS,
  GEAR_BASE_CONTRIBUTIONS,
  HERO_CONTRIBUTIONS,
  LEGENDARY_CONTRIBUTIONS,
  PACTSPIRIT_CONTRIBUTIONS,
  RELIC_CONTRIBUTIONS,
  SPECIALTY_CONTRIBUTIONS,
  TALENT_NODE_CONTRIBUTIONS,
  TRAIT_CONTRIBUTIONS,
} from '@/data/combatContributions'
import {
  mockDivinityBoardOptions,
  mockGearBases,
  mockHeroes,
  mockLegendaryItems,
  mockRelics,
  mockSpecialties,
  mockTraits,
} from '@/data/mockGameData'

const TREE_NAMES: TreeName[] = ['godTree', 'classTree', 'tree3', 'tree4', 'divinity']

const globalLayerSingleton = bundledGlobalCombatRuleLayer()

function push(
  out: ContributionEntry[],
  kind: ContributionEntry['kind'],
  refId: string,
  label: string,
  block: StatBlock | undefined
) {
  if (!block || Object.keys(block).length === 0) return
  out.push({ kind, refId, label, block })
}

function blockFor(table: Record<string, StatBlock>, id: string | null | undefined): StatBlock | undefined {
  if (!id) return undefined
  return table[id]
}

/** Keep build-wide contributions plus at most one main-skill row (PoB inspected scope). */
export function filterContributionsForInspectedMainSkill(
  entries: ContributionEntry[],
  slot: MainSkillSlot,
): ContributionEntry[] {
  const prefix = `Skill slot ${slot} ·`
  return entries.filter((e) => e.kind !== 'skill' || e.label.startsWith(prefix))
}

export function passiveModifiersForActiveSkill(
  activeId: string,
  snapshot: BuildSnapshot,
  /** Main skill slot 1–5; `applyMode === 'linked'` limits which slots receive passive mods. */
  mainSlot: number,
): ModifierDefinition[] {
  const out: ModifierDefinition[] = []
  for (const p of snapshot.passives ?? []) {
    if (!p?.skillId || p.enabled === false) continue
    const mode = p.applyMode ?? 'global'
    if (mode === 'linked') {
      const linked = p.linkedMainSkillSlots ?? []
      if (linked.length === 0) continue
      if (!isMainSkillSlot(mainSlot) || !linked.includes(mainSlot)) continue
    }
    /* applyMode === 'global' (default): inject into every main skill slot. */
    const def = getSkillDefinitionById(p.skillId)
    if (def?.family !== 'passive') continue
    const pLv = Math.max(1, Math.floor(p.skillLevel ?? 1))
    const passiveMods = [...(def.modifiers ?? []), ...modifiersFromSkillLevelRow(def, pLv)]
    out.push(...remapPassiveModifiersForActiveSkill(activeId, def.id, passiveMods))
  }
  return out
}

/** One main-slot skill row → full instance (or null if empty / not in dataset / wrong family). */
export function computeSkillInstanceForMainSlot(row: SkillSetup, snapshot: BuildSnapshot): SkillInstance | null {
  if (!row?.skillId || row.enabled === false) return null
  const def = getSkillDefinitionById(row.skillId)
  if (!def || !isMainSlotSkillFamily(def.family)) return null

  const skillLevel = Math.max(1, Math.floor(row.skillLevel ?? 1))
  const supDefs: SkillDefinition[] = []
  const supportLevelsById: Record<string, number> = {}
  for (const link of row.supports ?? []) {
    if (link.enabled === false) continue
    const s = getSkillDefinitionById(link.supportSkillId)
    if (s?.family === 'support') {
      supDefs.push(s)
      supportLevelsById[link.supportSkillId] = Math.max(1, Math.floor(link.level ?? 1))
    }
  }

  const rec = getNormalizedSkillRecord(row.skillId)
  const passiveMods = passiveModifiersForActiveSkill(def.id, snapshot, row.slot)

  return computeSkillInstance({
    active: def,
    level: skillLevel,
    supports: supDefs,
    supportLevelsById,
    globalLayer: globalLayerSingleton,
    passiveModifiers: passiveMods,
    activeParse: rec ? { status: rec.parseStatus, warnings: rec.warnings } : undefined,
    slotLabel: `Skill slot ${row.slot}`,
    mainSlot: row.slot,
  })
}

export function collectBuildContributions(snapshot: BuildSnapshot): ContributionEntry[] {
  const out: ContributionEntry[] = []

  const heroId = snapshot.hero?.heroId
  if (heroId) {
    const name = mockHeroes.find((h) => h.id === heroId)?.name ?? heroId
    push(out, 'hero', heroId, `Hero · ${name}`, HERO_CONTRIBUTIONS[heroId])
  }

  const traitId = snapshot.hero?.traitId
  if (traitId) {
    const name = mockTraits.find((t) => t.id === traitId)?.name ?? traitId
    push(out, 'trait', traitId, `Trait · ${name}`, blockFor(TRAIT_CONTRIBUTIONS, traitId))
  }

  const relicId = snapshot.hero?.relicId
  if (relicId) {
    const name = mockRelics.find((r) => r.id === relicId)?.name ?? relicId
    push(out, 'relic', relicId, `Relic · ${name}`, blockFor(RELIC_CONTRIBUTIONS, relicId))
  }

  const specId = snapshot.hero?.specialtyId
  if (specId) {
    const name = mockSpecialties.find((s) => s.id === specId)?.name ?? specId
    push(out, 'specialty', specId, `Specialty · ${name}`, blockFor(SPECIALTY_CONTRIBUTIONS, specId))
  }

  const gear = snapshot.gear
  if (gear && typeof gear === 'object') {
    for (const slot of Object.keys(gear) as GearSlot[]) {
      const row = gear[slot]
      if (!row) continue
      if (row.gearBaseId) {
        const name = mockGearBases.find((g) => g.id === row.gearBaseId)?.name ?? row.gearBaseId
        push(
          out,
          'gearBase',
          row.gearBaseId,
          `Gear ${slot} (base) · ${name}`,
          GEAR_BASE_CONTRIBUTIONS[row.gearBaseId]
        )
      }
      if (row.legendaryItemId) {
        const name =
          mockLegendaryItems.find((g) => g.id === row.legendaryItemId)?.name ?? row.legendaryItemId
        push(
          out,
          'legendary',
          row.legendaryItemId,
          `Gear ${slot} (leg) · ${name}`,
          LEGENDARY_CONTRIBUTIONS[row.legendaryItemId]
        )
      }
    }
  }

  const talentWallBoards = snapshot.talentWallBoards
  if (Array.isArray(talentWallBoards)) {
    for (const board of talentWallBoards) {
      if (!board?.ranks || typeof board.ranks !== 'object') continue
      for (const [nodeId, raw] of Object.entries(board.ranks)) {
        const r = Math.floor(Number(raw))
        if (!Number.isFinite(r) || r < 1) continue
        push(
          out,
          'talent',
          nodeId,
          `Talent · ${nodeId} ×${r}`,
          TALENT_NODE_CONTRIBUTIONS[nodeId],
        )
      }
    }
  }

  const talents = snapshot.talents
  if (talents && typeof talents === 'object') {
    for (const tree of TREE_NAMES) {
      if (tree === 'godTree') continue
      const ids = talents[tree]
      if (!Array.isArray(ids)) continue
      for (const nodeId of ids) {
        push(out, 'talent', nodeId, `Talent · ${nodeId}`, TALENT_NODE_CONTRIBUTIONS[nodeId])
      }
    }
  }

  const skills = snapshot.skills
  if (Array.isArray(skills)) {
    for (const row of skills) {
      const inst = computeSkillInstanceForMainSlot(row, snapshot)
      if (!inst) continue
      push(out, 'skill', row.skillId!, `Skill slot ${row.slot} · ${inst.activeName}`, inst.contributionBlock)
    }
  }

  const boards = snapshot.divinityBoard?.selectedBoardIds
  const ids = Array.isArray(boards) ? boards : []
  for (const bid of ids) {
    const name = mockDivinityBoardOptions.find((o) => o.id === bid)?.name ?? bid
    push(out, 'divinityBoard', bid, `Divinity · ${name}`, DIVINITY_BOARD_OPTION_CONTRIBUTIONS[bid])
  }

  const pacts = snapshot.pactspirits
  if (Array.isArray(pacts)) {
    for (const row of pacts) {
      if (!row?.pactspiritId) continue
      push(
        out,
        'pactspirit',
        row.pactspiritId,
        `Pact ${row.slot} · ${row.pactspiritId}`,
        PACTSPIRIT_CONTRIBUTIONS[row.pactspiritId]
      )
    }
  }

  return out
}
