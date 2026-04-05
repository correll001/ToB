// stores/useEditorUiStore.ts
import { create } from 'zustand'
import type { EditorTab, TalentEditorBoardTab } from '@/types/build'

type PickerType = 'skill' | 'support' | 'item' | 'pactspirit' | null

type EditorUiStore = {
  activeTab: EditorTab
  /** 四塊天賦盤之一；`extraBoards` 同時涵蓋舊版 tree3 + tree4。 */
  talentBoardTab: TalentEditorBoardTab
  selectedNodeId: string | null

  selectedSkillSlot: number | null
  selectedGearSlot: string | null

  pickerType: PickerType
  isShareDialogOpen: boolean

  setActiveTab: (tab: EditorTab) => void
  setTalentBoardTab: (tab: TalentEditorBoardTab) => void
  setSelectedNodeId: (nodeId: string | null) => void
  setSelectedSkillSlot: (slot: number | null) => void
  setSelectedGearSlot: (slot: string | null) => void

  openPicker: (type: PickerType) => void
  closePicker: () => void

  openShareDialog: () => void
  closeShareDialog: () => void
}

export const useEditorUiStore = create<EditorUiStore>((set) => ({
  activeTab: 'heroTalent',
  talentBoardTab: 'godTree',
  selectedNodeId: null,
  selectedSkillSlot: null,
  selectedGearSlot: null,

  pickerType: null,
  isShareDialogOpen: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setTalentBoardTab: (tab) => set({ talentBoardTab: tab }),
  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),
  setSelectedSkillSlot: (slot) => set({ selectedSkillSlot: slot }),
  setSelectedGearSlot: (slot) => set({ selectedGearSlot: slot }),

  openPicker: (type) => set({ pickerType: type }),
  closePicker: () => set({ pickerType: null }),

  openShareDialog: () => set({ isShareDialogOpen: true }),
  closeShareDialog: () => set({ isShareDialogOpen: false }),
}))
