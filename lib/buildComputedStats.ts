// lib/buildComputedStats.ts
/**
 * Dev / placeholder combat & attribute numbers derived from build configuration.
 * Replace this module with real formulas when data is available — not game-accurate.
 */
import type { BuildSnapshot } from '@/types/build'
import {
  selectAllocatedTalentCount,
  selectFilledGearCount,
  selectFilledPactspiritCount,
  selectFilledSkillCount,
} from '@/selectors/buildSelectors'

export type BuildPanelStats = {
  /** 每秒 DPS（開發版示意） */
  dpsPerSecond: number
  /** 攻擊速度（次／秒，示意） */
  attackSpeed: number
  /** 每下傷害（示意） */
  damagePerHit: number
  strength: number
  dexterity: number
  intelligence: number
  hp: number
  mp: number
}

function stableMix(seed: number, salt: number): number {
  let x = Math.imul(seed ^ salt, 0x9e3779b1)
  x ^= x >>> 16
  x = Math.imul(x, 0x85ebca6b)
  x ^= x >>> 13
  return x >>> 0
}

/**
 * Deterministic pseudo-stats from level, allocation counts, and hero/trait flags.
 */
export function computeBuildPanelStats(snapshot: BuildSnapshot): BuildPanelStats {
  const level = snapshot.meta.level ?? 1
  const talentN = selectAllocatedTalentCount(snapshot)
  const skillN = selectFilledSkillCount(snapshot)
  const gearN = selectFilledGearCount(snapshot)
  const pactN = selectFilledPactspiritCount(snapshot)
  const hasHero = snapshot.hero.heroId ? 1 : 0
  const hasTrait = snapshot.hero.traitId ? 1 : 0

  const seed =
    level * 7919 +
    talentN * 199 +
    skillN * 307 +
    gearN * 401 +
    pactN * 503 +
    hasHero * 601 +
    hasTrait * 701

  const atk = 1.2 + (stableMix(seed, 1) % 800) / 1000 + skillN * 0.04 + gearN * 0.02
  const dph = 80 + (stableMix(seed, 2) % 5000) + level * 12 + talentN * 15 + pactN * 40

  const str = 12 + (stableMix(seed, 3) % 200) + level * 2 + talentN + hasHero * 8
  const dex = 12 + (stableMix(seed, 4) % 200) + level * 2 + skillN + hasTrait * 6
  const int = 12 + (stableMix(seed, 5) % 200) + level * 2 + pactN * 2

  const hp = 180 + level * 22 + str * 3 + gearN * 15 + (stableMix(seed, 6) % 120)
  const mp = 80 + level * 8 + int * 2 + (stableMix(seed, 7) % 80)

  return {
    dpsPerSecond: Math.round(dph * atk * 100) / 100,
    attackSpeed: Math.round(atk * 100) / 100,
    damagePerHit: Math.round(dph),
    strength: str,
    dexterity: dex,
    intelligence: int,
    hp: Math.round(hp),
    mp: Math.round(mp),
  }
}
