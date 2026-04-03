// stores/useEditorUiStore.ts
import { create } from 'zustand'
import type { EditorTab, TreeName } from '@/types/build'

type PickerType = 'skill' | 'support' | 'item' | 'pactspirit' | null

type EditorUiStore = {
  activeTab: EditorTab
  selectedTree: TreeName
  selectedNodeId: string | null

  selectedSkillSlot: number | null
  selectedGearSlot: string | null

  pickerType: PickerType
  isShareDialogOpen: boolean

  setActiveTab: (tab: EditorTab) => void
  setSelectedTree: (tree: TreeName) => void
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
  selectedTree: 'godTree',
  selectedNodeId: null,

  selectedSkillSlot: null,
  selectedGearSlot: null,

  pickerType: null,
  isShareDialogOpen: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedTree: (tree) => set({ selectedTree: tree }),
  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),
  setSelectedSkillSlot: (slot) => set({ selectedSkillSlot: slot }),
  setSelectedGearSlot: (slot) => set({ selectedGearSlot: slot }),

  openPicker: (type) => set({ pickerType: type }),
  closePicker: () => set({ pickerType: null }),

  openShareDialog: () => set({ isShareDialogOpen: true }),
  closeShareDialog: () => set({ isShareDialogOpen: false }),
}))
