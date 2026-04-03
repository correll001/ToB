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

export type EditorTab = 'talent' | 'skills' | 'gear' | 'pactspirit' | 'notes'

export interface HeroSelection {
  heroId: string | null
  traitId: string | null
}

export interface SkillSetup {
  slot: 1 | 2 | 3 | 4 | 5
  skillId: string | null
  supports: string[]
  enabled: boolean
  notes?: string
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
    description: string
    visibility: 'private' | 'unlisted' | 'public'
  }
  hero: HeroSelection
  talents: Record<TreeName, string[]>
  skills: SkillSetup[]
  gear: Record<GearSlot, GearSelection>
  pactspirits: PactspiritSelection[]
  notes: BuildNotes
}
