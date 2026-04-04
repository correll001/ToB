// types/build.ts

export type TreeName = 'godTree' | 'classTree' | 'tree3' | 'tree4' | 'divinity'

export type GearSlot =
  | 'helmet'
  | 'chest'
  | 'gloves'
  | 'boots'
  | 'necklace'
  | 'belt'
  | 'ring1'
  | 'ring2'
  | 'weapon1'
  | 'weapon2'

/** Main workspace tabs (Chinese labels in UI). */
export type EditorTab =
  | 'heroTalent'
  | 'talents'
  | 'skills'
  | 'gear'
  | 'divinityBoard'

export interface HeroSelection {
  heroId: string | null
  traitId: string | null
  /** 遺物（MVP mock，非官方資料） */
  relicId: string | null
  /** 英雄特性（MVP mock） */
  specialtyId: string | null
}

/** 神格石板補充（MVP：文字 + 多選示意石板） */
export interface DivinityBoardState {
  notes: string
  plan: string
  selectedBoardIds: string[]
}

export interface SkillSetup {
  slot: 1 | 2 | 3 | 4 | 5
  skillId: string | null
  supports: string[]
  enabled: boolean
  notes?: string
}

/** Passive / aura gems applied to the build (minimal v1 — inject into main skill instances). */
export interface PassiveSkillSetup {
  slot: 1 | 2 | 3
  skillId: string | null
  enabled: boolean
}

export interface GearSelection {
  gearBaseId: string | null
  legendaryItemId: string | null
  customMods: Array<{
    modCode: string
    value: number | string
  }>
}

export interface PactspiritSelection {
  slot: 1 | 2 | 3
  pactspiritId: string | null
}

export interface BuildNotes {
  gameplay: string
  leveling: string
  bossing: string
}

export interface BuildSnapshot {
  schemaVersion: '1.0.0'
  gameVersion: string
  meta: {
    title: string
    /** 角色等級；與流派碼一併匯出／持久化 */
    level: number
    description: string
    visibility: 'private' | 'unlisted' | 'public'
  }
  hero: HeroSelection
  talents: Record<TreeName, string[]>
  skills: SkillSetup[]
  passives: PassiveSkillSetup[]
  gear: Record<GearSlot, GearSelection>
  pactspirits: PactspiritSelection[]
  notes: BuildNotes
  divinityBoard: DivinityBoardState
}
