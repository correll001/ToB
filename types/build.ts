// types/build.ts

export type TreeName = 'godTree' | 'classTree' | 'tree3' | 'tree4' | 'divinity'

export type MainSkillSlot = 1 | 2 | 3 | 4 | 5

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

/** One support gem in a link group (PoB-style). */
export interface SupportLink {
  supportSkillId: string
  level: number
  enabled: boolean
  /** 1-based link index within the main skill (stable UI / inspection key). */
  linkSlot: number
}

export interface SkillSetup {
  slot: MainSkillSlot
  skillId: string | null
  /** Linked support gems; independent from `meta.level` (character level). */
  supports: SupportLink[]
  /** Main skill gem level — never derived from character level. */
  skillLevel: number
  enabled: boolean
  /** Optional: per-slot hide from inspection UIs (if unset, use global `inspectedMainSkillSlot`). */
  inspectionEnabled?: boolean
  notes?: string
}

export type PassiveApplyMode = 'global' | 'linked'

export interface PassiveSkillSetup {
  slot: 1 | 2 | 3
  skillId: string | null
  enabled: boolean
  applyMode: PassiveApplyMode
  /** When `applyMode === 'linked'`, inject only into these main slots (empty + linked → none). */
  linkedMainSkillSlots: MainSkillSlot[]
  skillLevel: number
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
    /** Character level only — not main skill gem level. */
    level: number
    description: string
    visibility: 'private' | 'unlisted' | 'public'
    /** PoB-style inspected main skill; persisted with share code. */
    inspectedMainSkillSlot: MainSkillSlot | null
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
