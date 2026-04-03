// selectors/buildComputedStats.ts
/**
 * Dev-only sidebar / panel stats. All combat-related numbers for the left panel
 * are derived here — not game-accurate.
 */
import type { BuildSnapshot } from '@/types/build'
import {
  selectAllocatedTalentCount,
  selectDivinityBoardSelectionCount,
  selectDivinityBoardTextChars,
  selectFilledGearCount,
  selectFilledPactspiritCount,
  selectFilledSkillCount,
  selectValidationErrors,
} from '@/selectors/buildSelectors'
import {
  mockDivinityBoardOptions,
  mockHeroes,
  mockRelics,
  mockSpecialties,
  mockTraits,
} from '@/data/mockGameData'

/** Combat stats (clear names for UI / hooks). */
export type BuildSidebarCombatStats = {
  dps: number
  attackSpeed: number
  hitDamage: number
  strength: number
  dexterity: number
  intelligence: number
  hp: number
  mp: number
}

export type BuildStatsPanelSummaryLabels = {
  heroLabel: string
  traitLabel: string
  relicLabel: string
  specialtyLabel: string
  divinitySummaryLine: string
}

/** Single object consumed by `useBuildComputedStats` / BuildStatsPanel. */
export type BuildStatsPanelDerived = {
  combat: BuildSidebarCombatStats
  validationErrors: string[]
  summary: BuildStatsPanelSummaryLabels
}

function stableMix(seed: number, salt: number): number {
  let x = Math.imul(seed ^ salt, 0x9e3779b1)
  x ^= x >>> 16
  x = Math.imul(x, 0x85ebca6b)
  x ^= x >>> 13
  return x >>> 0
}

export function selectBuildSidebarCombatStats(snapshot: BuildSnapshot): BuildSidebarCombatStats {
  const level = snapshot.meta.level ?? 1
  const talentN = selectAllocatedTalentCount(snapshot)
  const skillN = selectFilledSkillCount(snapshot)
  const gearN = selectFilledGearCount(snapshot)
  const pactN = selectFilledPactspiritCount(snapshot)
  const hasHero = snapshot.hero.heroId ? 1 : 0
  const hasTrait = snapshot.hero.traitId ? 1 : 0
  const hasRelic = snapshot.hero.relicId ? 1 : 0
  const hasSpecialty = snapshot.hero.specialtyId ? 1 : 0
  const divinityPickN = selectDivinityBoardSelectionCount(snapshot)
  const divinityTextN = Math.min(500, selectDivinityBoardTextChars(snapshot))

  const seed =
    level * 7919 +
    talentN * 199 +
    skillN * 307 +
    gearN * 401 +
    pactN * 503 +
    hasHero * 601 +
    hasTrait * 701 +
    hasRelic * 809 +
    hasSpecialty * 811 +
    divinityPickN * 823 +
    divinityTextN * 3

  const atk = 1.2 + (stableMix(seed, 1) % 800) / 1000 + skillN * 0.04 + gearN * 0.02
  const dph = 80 + (stableMix(seed, 2) % 5000) + level * 12 + talentN * 15 + pactN * 40

  const str = 12 + (stableMix(seed, 3) % 200) + level * 2 + talentN + hasHero * 8
  const dex = 12 + (stableMix(seed, 4) % 200) + level * 2 + skillN + hasTrait * 6
  const int =
    12 +
    (stableMix(seed, 5) % 200) +
    level * 2 +
    pactN * 2 +
    divinityPickN * 4

  const hp =
    180 +
    level * 22 +
    str * 3 +
    gearN * 15 +
    divinityPickN * 5 +
    (stableMix(seed, 6) % 120)
  const mp = 80 + level * 8 + int * 2 + divinityTextN * 0.5 + (stableMix(seed, 7) % 80)

  return {
    dps: Math.round(dph * atk * 100) / 100,
    attackSpeed: Math.round(atk * 100) / 100,
    hitDamage: Math.round(dph),
    strength: str,
    dexterity: dex,
    intelligence: int,
    hp: Math.round(hp),
    mp: Math.round(mp),
  }
}

function selectBuildStatsPanelSummary(snapshot: BuildSnapshot): BuildStatsPanelSummaryLabels {
  const divinityPickN = selectDivinityBoardSelectionCount(snapshot)
  const divinitySummaryLine =
    divinityPickN === 0
      ? '未選示意石板'
      : `${divinityPickN} 塊：${snapshot.divinityBoard.selectedBoardIds
          .map((id) => mockDivinityBoardOptions.find((o) => o.id === id)?.name ?? id)
          .join('、')}`

  return {
    heroLabel: mockHeroes.find((h) => h.id === snapshot.hero.heroId)?.name ?? '—',
    traitLabel: mockTraits.find((t) => t.id === snapshot.hero.traitId)?.name ?? '—',
    relicLabel: mockRelics.find((r) => r.id === snapshot.hero.relicId)?.name ?? '—',
    specialtyLabel: mockSpecialties.find((s) => s.id === snapshot.hero.specialtyId)?.name ?? '—',
    divinitySummaryLine,
  }
}

export function selectBuildStatsPanelDerived(snapshot: BuildSnapshot): BuildStatsPanelDerived {
  return {
    combat: selectBuildSidebarCombatStats(snapshot),
    validationErrors: selectValidationErrors(snapshot),
    summary: selectBuildStatsPanelSummary(snapshot),
  }
}

/** @deprecated Prefer selectBuildSidebarCombatStats + BuildStatsPanelDerived */
export type BuildPanelStats = {
  dpsPerSecond: number
  attackSpeed: number
  damagePerHit: number
  strength: number
  dexterity: number
  intelligence: number
  hp: number
  mp: number
}

/** @deprecated Prefer selectBuildStatsPanelDerived */
export function computeBuildPanelStats(snapshot: BuildSnapshot): BuildPanelStats {
  const c = selectBuildSidebarCombatStats(snapshot)
  return {
    dpsPerSecond: c.dps,
    attackSpeed: c.attackSpeed,
    damagePerHit: c.hitDamage,
    strength: c.strength,
    dexterity: c.dexterity,
    intelligence: c.intelligence,
    hp: c.hp,
    mp: c.mp,
  }
}
