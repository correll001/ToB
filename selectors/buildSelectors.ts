// selectors/buildSelectors.ts
import type { BuildSnapshot } from '@/types/build'

/** Legacy / partial snapshots may omit nested objects; keep sidebar selectors crash-free. */
export function selectAllocatedTalentCount(snapshot: BuildSnapshot) {
  const t = snapshot.talents
  let sum = 0
  if (t && typeof t === 'object') {
    for (const [name, arr] of Object.entries(t)) {
      if (name === 'godTree') continue
      if (Array.isArray(arr)) sum += arr.length
    }
  }
  const boards = snapshot.talentWallBoards
  if (Array.isArray(boards)) {
    for (const b of boards) {
      if (!b?.ranks || typeof b.ranks !== 'object') continue
      for (const v of Object.values(b.ranks)) {
        const n = Math.floor(Number(v))
        if (Number.isFinite(n) && n > 0) sum += n
      }
    }
  }
  return sum
}

export function selectFilledSkillCount(snapshot: BuildSnapshot) {
  const s = snapshot.skills
  if (!Array.isArray(s)) return 0
  return s.filter((row) => !!row && !!row.skillId).length
}

export function selectFilledGearCount(snapshot: BuildSnapshot) {
  const g = snapshot.gear
  if (!g || typeof g !== 'object') return 0
  return Object.values(g).filter((row) => !!row && !!(row.gearBaseId || row.legendaryItemId)).length
}

export function selectFilledPactspiritCount(snapshot: BuildSnapshot) {
  const p = snapshot.pactspirits
  if (!Array.isArray(p)) return 0
  return p.filter((row) => !!row && !!row.pactspiritId).length
}

/** Safe for rehydrated / legacy snapshots missing `divinityBoard`. */
export function selectDivinityBoardSelectionCount(snapshot: BuildSnapshot) {
  const ids = snapshot.divinityBoard?.selectedBoardIds
  return Array.isArray(ids) ? ids.length : 0
}

export function selectDivinityBoardTextChars(snapshot: BuildSnapshot) {
  const notes = snapshot.divinityBoard?.notes ?? ''
  const plan = snapshot.divinityBoard?.plan ?? ''
  return notes.length + plan.length
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

  const hero = snapshot.hero
  if (!hero?.heroId) errors.push('尚未選擇 Hero')
  if (!hero?.traitId) errors.push('尚未選擇 Trait')

  const skills = snapshot.skills
  const hasMainSkill = Array.isArray(skills) && skills.some((s) => !!s?.skillId)
  if (!hasMainSkill) errors.push('至少需要配置 1 個主技能')

  const weapon1 = snapshot.gear?.weapon1
  if (!weapon1?.gearBaseId && !weapon1?.legendaryItemId) {
    errors.push('Weapon 1 尚未配置')
  }

  return errors
}
