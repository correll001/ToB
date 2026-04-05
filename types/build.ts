// types/build.ts

export type TreeName = 'godTree' | 'classTree' | 'tree3' | 'tree4' | 'divinity'

/** 天賦頁頂層四塊盤（人物可切換編輯的 4 個天賦版面）。 */
export type TalentEditorBoardTab = 'godTree' | 'classTree' | 'extraBoards' | 'divinity'

export type TalentWallSlotIndex = 0 | 1 | 2 | 3

/** 單塊天賦盤：自 30 牆擇一，並記錄節點階級。 */
export interface TalentWallBoardState {
  panelId: string
  ranks: Record<string, number>
  /**
   * 右側 5×2「具名頂級天賦」槽（`talent-affixes` 的 core_talent_node）；每排至多五選一；與牆面傳奇格座標無關。
   */
  namedGrandAffixSlots: (string | null)[]
}

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
  /**
   * 四塊天賦盤（與頁籤：神系／職業／第三四盤／神格 對應），每塊各選 30 牆之一並記錄 nodeId→階級。
   * 舊版 `godTalentRanks` 於 normalize 時併入 [0]。
   */
  talentWallBoards: TalentWallBoardState[]
  skills: SkillSetup[]
  passives: PassiveSkillSetup[]
  gear: Record<GearSlot, GearSelection>
  pactspirits: PactspiritSelection[]
  notes: BuildNotes
  divinityBoard: DivinityBoardState
}
