// selectors/buildComputedStats.ts
/**
 * Sidebar stats: summary labels + combat from data-driven formula pipeline
 * (collect → aggregate → derive). No PRNG / stableMix.
 */
import type { BuildSnapshot } from '@/types/build'
import type { BuildSidebarCombatStats, CombatBreakdown } from '@/types/combat'
import { selectDivinityBoardTextChars, selectFilledGearCount, selectValidationErrors } from '@/selectors/buildSelectors'
import {
  mockDivinityBoardOptions,
  mockHeroes,
  mockRelics,
  mockSpecialties,
  mockTraits,
} from '@/data/mockGameData'
import { collectBuildContributions } from '@/lib/formula/collectBuildContributions'
import { aggregateStatBlocks } from '@/lib/formula/aggregateStats'
import { computeDerivedCombat } from '@/lib/formula/computeDerivedCombat'

export type { BuildSidebarCombatStats } from '@/types/combat'

export type BuildStatsPanelSummaryLabels = {
  heroLabel: string
  traitLabel: string
  relicLabel: string
  specialtyLabel: string
  divinitySummaryLine: string
  gearEquippedLine: string
  divinityTextLine: string
}

export type BuildStatsPanelDerived = {
  combat: BuildSidebarCombatStats
  /** 可解釋的中間值（近真實引擎 v1）。 */
  breakdown: CombatBreakdown
  validationErrors: string[]
  summary: BuildStatsPanelSummaryLabels
}

function runCombatPipeline(snapshot: BuildSnapshot): {
  combat: BuildSidebarCombatStats
  breakdown: CombatBreakdown
} {
  const entries = collectBuildContributions(snapshot)
  const agg = aggregateStatBlocks(entries.map((e) => e.block))
  const textChars = selectDivinityBoardTextChars(snapshot)
  const level = snapshot.meta?.level ?? 1
  const { combat, breakdown } = computeDerivedCombat(level, agg, textChars)
  return {
    combat,
    breakdown: { ...breakdown, contributionCount: entries.length },
  }
}

export function selectBuildSidebarCombatStats(snapshot: BuildSnapshot): BuildSidebarCombatStats {
  return runCombatPipeline(snapshot).combat
}

function selectBuildStatsPanelSummary(snapshot: BuildSnapshot): BuildStatsPanelSummaryLabels {
  const boardIds = snapshot.divinityBoard?.selectedBoardIds
  const ids = Array.isArray(boardIds) ? boardIds : []
  const divinityPickN = ids.length
  const divinitySummaryLine =
    divinityPickN === 0
      ? '未選示意石板'
      : `${divinityPickN} 塊：${ids
          .map((id) => mockDivinityBoardOptions.find((o) => o.id === id)?.name ?? id)
          .join('、')}`

  const gearN = selectFilledGearCount(snapshot)
  const gearEquippedLine = `${gearN} / 10 欄已配置`

  const textChars = selectDivinityBoardTextChars(snapshot)
  const divinityTextLine =
    textChars === 0 ? '補充文字：無' : `補充文字：共 ${textChars} 字（示意）`

  return {
    heroLabel: mockHeroes.find((h) => h.id === snapshot.hero?.heroId)?.name ?? '—',
    traitLabel: mockTraits.find((t) => t.id === snapshot.hero?.traitId)?.name ?? '—',
    relicLabel: mockRelics.find((r) => r.id === snapshot.hero?.relicId)?.name ?? '—',
    specialtyLabel: mockSpecialties.find((s) => s.id === snapshot.hero?.specialtyId)?.name ?? '—',
    divinitySummaryLine,
    gearEquippedLine,
    divinityTextLine,
  }
}

export function selectBuildStatsPanelDerived(snapshot: BuildSnapshot): BuildStatsPanelDerived {
  const { combat, breakdown } = runCombatPipeline(snapshot)
  return {
    combat,
    breakdown,
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
