// components/editor/editorTabRegistry.tsx
import type { EditorTab } from '@/types/build'
import type { ComponentType } from 'react'
import DivinityBoardPanel from '@/components/editor/DivinityBoardPanel'
import GearPanel from '@/components/editor/GearPanel'
import HeroTalentPanel from '@/components/editor/HeroTalentPanel'
import SkillSetupPanel from '@/components/editor/SkillSetupPanel'
import TalentTreePanel from '@/components/editor/TalentTreePanel'

export const EDITOR_TAB_ROWS: { id: EditorTab; label: string }[] = [
  { id: 'heroTalent', label: '英雄天賦' },
  { id: 'talents', label: '天賦' },
  { id: 'skills', label: '技能' },
  { id: 'gear', label: '裝備' },
  { id: 'divinityBoard', label: '神格石板補充' },
]

export const EDITOR_TAB_PANELS: Record<EditorTab, ComponentType> = {
  heroTalent: HeroTalentPanel,
  talents: TalentTreePanel,
  skills: SkillSetupPanel,
  gear: GearPanel,
  divinityBoard: DivinityBoardPanel,
}
