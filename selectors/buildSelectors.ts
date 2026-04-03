// selectors/buildSelectors.ts
import type { BuildSnapshot } from '@/types/build'

export function selectAllocatedTalentCount(snapshot: BuildSnapshot) {
  return Object.values(snapshot.talents).reduce((sum, arr) => sum + arr.length, 0)
}

export function selectFilledSkillCount(snapshot: BuildSnapshot) {
  return snapshot.skills.filter((s) => !!s.skillId).length
}

export function selectFilledGearCount(snapshot: BuildSnapshot) {
  return Object.values(snapshot.gear).filter(
    (g) => g.gearBaseId || g.legendaryItemId
  ).length
}

export function selectFilledPactspiritCount(snapshot: BuildSnapshot) {
  return snapshot.pactspirits.filter((p) => !!p.pactspiritId).length
}

export function selectBuildCompletionStats(snapshot: BuildSnapshot) {
  return {
    isHeroSelected: !!snapshot.hero.heroId,
    isTraitSelected: !!snapshot.hero.traitId,
    talentsAllocated: selectAllocatedTalentCount(snapshot),
    skillsEquipped: selectFilledSkillCount(snapshot),
    gearEquipped: selectFilledGearCount(snapshot),
    pactspiritsEquipped: selectFilledPactspiritCount(snapshot),
  }
}

export function selectValidationErrors(snapshot: BuildSnapshot): string[] {
  const errors: string[] = []

  if (!snapshot.hero.heroId) errors.push('尚未選擇 Hero')
  if (!snapshot.hero.traitId) errors.push('尚未選擇 Trait')

  const hasMainSkill = snapshot.skills.some((s) => !!s.skillId)
  if (!hasMainSkill) errors.push('至少需要配置 1 個主技能')

  const weapon1 = snapshot.gear.weapon1
  if (!weapon1.gearBaseId && !weapon1.legendaryItemId) {
    errors.push('Weapon 1 尚未配置')
  }

  return errors
}
