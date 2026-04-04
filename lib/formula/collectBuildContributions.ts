import type { BuildSnapshot, GearSlot, SkillSetup, TreeName } from '@/types/build'
import type { ContributionEntry, StatBlock } from '@/types/combat'
import type { ModifierDefinition, SkillDefinition } from '@/types/skillData'
import type { SkillInstance } from '@/types/skillInstance'
import { bundledGlobalCombatRuleLayer } from '@/lib/runtime/runtimeRulesLookup'
import {
  getSkillDefinitionById,
  getNormalizedSkillRecord,
  isMainSlotSkillFamily,
} from '@/lib/runtime/runtimeSkillLookup'
import { computeSkillInstance } from '@/lib/formula/skills'
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

export function passiveModifiersForActiveSkill(
  activeId: string,
  snapshot: BuildSnapshot,
): ModifierDefinition[] {
  const out: ModifierDefinition[] = []
  for (const p of snapshot.passives ?? []) {
    if (!p?.skillId || p.enabled === false) continue
    const def = getSkillDefinitionById(p.skillId)
    if (def?.family !== 'passive') continue
    out.push(...remapPassiveModifiersForActiveSkill(activeId, def.id, def.modifiers ?? []))
  }
  return out
}

/** One main-slot skill row → full instance (or null if empty / not in dataset / wrong family). */
export function computeSkillInstanceForMainSlot(row: SkillSetup, snapshot: BuildSnapshot): SkillInstance | null {
  if (!row?.skillId || row.enabled === false) return null
  const def = getSkillDefinitionById(row.skillId)
  if (!def || !isMainSlotSkillFamily(def.family)) return null

  const skillGemLevel = Math.max(1, Math.floor(snapshot.meta?.level ?? 1))
  const supDefs: SkillDefinition[] = []
  for (const sid of row.supports ?? []) {
    const s = getSkillDefinitionById(sid)
    if (s?.family === 'support') supDefs.push(s)
  }

  const rec = getNormalizedSkillRecord(row.skillId)
  const passiveMods = passiveModifiersForActiveSkill(def.id, snapshot)

  return computeSkillInstance({
    active: def,
    level: skillGemLevel,
    supports: supDefs,
    globalLayer: globalLayerSingleton,
    passiveModifiers: passiveMods,
    activeParse: rec ? { status: rec.parseStatus, warnings: rec.warnings } : undefined,
    slotLabel: `Skill slot ${row.slot}`,
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

  const talents = snapshot.talents
  if (talents && typeof talents === 'object') {
    for (const tree of TREE_NAMES) {
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
