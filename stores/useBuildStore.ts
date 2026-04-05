// stores/useBuildStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type {
  BuildSnapshot,
  GearSlot,
  MainSkillSlot,
  PassiveApplyMode,
  PassiveSkillSetup,
  TalentWallSlotIndex,
  TreeName,
} from '@/types/build'
import { compactSupportLinkSlots, nextSupportLinkSlot, isMainSkillSlot } from '@/lib/build/supportLinks'
import { createEmptyBuildSnapshot } from '@/lib/defaultBuildSnapshot'
import { normalizeBuildSnapshot } from '@/lib/normalizeBuildSnapshot'
import {
  NAMED_GRAND_COLS,
  NAMED_GRAND_TALENT_SLOT_COUNT,
  normalizeNamedGrandAffixSlots,
} from '@/lib/talent/namedGrandTalentCatalog'

function throttle<TArgs extends unknown[]>(fn: (...args: TArgs) => void, waitMs: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let pendingArgs: TArgs | null = null

  return (...args: TArgs) => {
    pendingArgs = args
    if (timeout) return

    timeout = setTimeout(() => {
      timeout = null
      if (!pendingArgs) return
      fn(...pendingArgs)
      pendingArgs = null
    }, waitMs)
  }
}

const createDefaultBuild = createEmptyBuildSnapshot

function touchDivinityBoard(snapshot: BuildSnapshot) {
  const o = snapshot as Partial<BuildSnapshot>
  if (!o.divinityBoard || typeof o.divinityBoard !== 'object') {
    o.divinityBoard = { notes: '', plan: '', selectedBoardIds: [] }
    return
  }
  const d = o.divinityBoard
  if (typeof d.notes !== 'string') d.notes = ''
  if (typeof d.plan !== 'string') d.plan = ''
  if (!Array.isArray(d.selectedBoardIds)) d.selectedBoardIds = []
}

type BuildStore = {
  snapshot: BuildSnapshot
  dirty: boolean
  revision: number
  lastSavedAt: number | null

  setTitle: (title: string) => void
  setLevel: (level: number) => void
  setDescription: (description: string) => void
  setVisibility: (visibility: BuildSnapshot['meta']['visibility']) => void

  setHero: (heroId: string | null) => void
  setTrait: (traitId: string | null) => void
  setRelic: (relicId: string | null) => void
  setSpecialty: (specialtyId: string | null) => void

  toggleTalentNode: (tree: TreeName, nodeId: string) => void
  clearTalentTree: (tree: TreeName) => void
  /** 天賦牆格點：每次點擊 0 → 1 → … → maxRank → 0（四塊盤各一組 ranks） */
  cycleTalentWallNodeRank: (slotIndex: TalentWallSlotIndex, nodeId: string, maxRank: number) => void
  setTalentWallNodeRank: (slotIndex: TalentWallSlotIndex, nodeId: string, rank: number, maxRank: number) => void
  /** 切換該盤所選 30 牆之一；變更時清空該盤階級。 */
  setTalentWallPanel: (slotIndex: TalentWallSlotIndex, panelId: string) => void
  /** 右側 5×2 具名頂級天賦槽（core_talent 詞綴 id 或 null；每排至多五選一）。 */
  setNamedGrandAffixSlot: (
    slotIndex: TalentWallSlotIndex,
    pickIndex: number,
    affixId: string | null,
  ) => void
  /** 一次寫入該階（列）：先清空該排五槽，再於指定欄寫入（或全清）。 */
  setNamedGrandAffixRowPick: (
    slotIndex: TalentWallSlotIndex,
    rowIndex: number,
    pick: { affixId: string; columnIndex: number } | null,
  ) => void

  setInspectedMainSkill: (slot: MainSkillSlot | null) => void
  setSkill: (slot: number, skillId: string | null) => void
  setSkillLevel: (slot: number, level: number) => void
  setSupportLink: (mainSlot: number, linkSlot: number, supportSkillId: string | null) => void
  setSupportLevel: (mainSlot: number, linkSlot: number, level: number) => void
  toggleSupportEnabled: (mainSlot: number, linkSlot: number) => void
  toggleSupportSkill: (mainSlot: number, supportSkillId: string) => void
  clearSkillSupports: (mainSlot: number) => void
  setMainSkillEnabled: (slot: number, enabled: boolean) => void
  clearSkill: (slot: number) => void

  setPassiveSkill: (slot: number, skillId: string | null) => void
  togglePassiveEnabled: (passiveSlot: number) => void
  setPassiveSkillLevel: (passiveSlot: number, level: number) => void
  setPassiveApplyMode: (passiveSlot: number, mode: PassiveApplyMode) => void
  setPassiveLinkedSlots: (passiveSlot: number, slots: MainSkillSlot[]) => void
  clearPassive: (slot: number) => void

  setGearBase: (slot: GearSlot, gearBaseId: string | null) => void
  setLegendaryItem: (slot: GearSlot, legendaryItemId: string | null) => void
  clearGearSlot: (slot: GearSlot) => void

  setPactspirit: (slot: number, pactspiritId: string | null) => void
  setNote: (section: keyof BuildSnapshot['notes'], value: string) => void

  setDivinityBoardNotes: (value: string) => void
  setDivinityBoardPlan: (value: string) => void
  toggleDivinityBoardSelection: (boardId: string) => void

  importSnapshot: (next: BuildSnapshot) => void
  resetBuild: () => void
  markSaved: () => void
  exportSnapshot: () => BuildSnapshot
}

const bumpMeta = (state: BuildStore) => {
  state.dirty = true
  state.revision += 1
}

function clampGemLv(n: number) {
  const i = Math.floor(n)
  if (!Number.isFinite(i) || i < 1) return 1
  if (i > 99) return 99
  return i
}

export const useBuildStore = create<BuildStore>()(
  persist(
    immer((set, get) => ({
      snapshot: createDefaultBuild(),
      dirty: false,
      revision: 0,
      lastSavedAt: null,

      setTitle: (title) =>
        set((state) => {
          state.snapshot.meta.title = title
          bumpMeta(state)
        }),

      setLevel: (level) =>
        set((state) => {
          const n = Math.floor(level)
          if (!Number.isFinite(n) || n < 1) {
            state.snapshot.meta.level = 1
          } else if (n > 9999) {
            state.snapshot.meta.level = 9999
          } else {
            state.snapshot.meta.level = n
          }
          bumpMeta(state)
        }),

      setDescription: (description) =>
        set((state) => {
          state.snapshot.meta.description = description
          bumpMeta(state)
        }),

      setVisibility: (visibility) =>
        set((state) => {
          state.snapshot.meta.visibility = visibility
          bumpMeta(state)
        }),

      setHero: (heroId) =>
        set((state) => {
          state.snapshot.hero.heroId = heroId
          state.snapshot.hero.traitId = null
          state.snapshot.hero.relicId = null
          state.snapshot.hero.specialtyId = null
          state.snapshot.talents = {
            godTree: [],
            classTree: [],
            tree3: [],
            tree4: [],
            divinity: [],
          }
          state.snapshot.talentWallBoards = createEmptyBuildSnapshot().talentWallBoards.map((b) => ({
            panelId: b.panelId,
            ranks: {},
            namedGrandAffixSlots: [...b.namedGrandAffixSlots],
          }))

          state.snapshot.skills.forEach((skill) => {
            skill.skillId = null
            skill.supports = []
            skill.skillLevel = 20
            skill.enabled = true
            skill.notes = ''
            skill.inspectionEnabled = undefined
          })

          state.snapshot.passives.forEach((p: PassiveSkillSetup) => {
            p.skillId = null
            p.enabled = true
            p.applyMode = 'global'
            p.linkedMainSkillSlots = []
            p.skillLevel = 1
          })

          state.snapshot.meta.inspectedMainSkillSlot = null
          bumpMeta(state)
        }),

      setTrait: (traitId) =>
        set((state) => {
          state.snapshot.hero.traitId = traitId
          bumpMeta(state)
        }),

      setRelic: (relicId) =>
        set((state) => {
          state.snapshot.hero.relicId = relicId
          bumpMeta(state)
        }),

      setSpecialty: (specialtyId) =>
        set((state) => {
          state.snapshot.hero.specialtyId = specialtyId
          bumpMeta(state)
        }),

      toggleTalentNode: (tree, nodeId) =>
        set((state) => {
          if (tree === 'godTree') {
            return
          }
          const list = state.snapshot.talents[tree]
          const exists = list.includes(nodeId)
          state.snapshot.talents[tree] = exists
            ? list.filter((id) => id !== nodeId)
            : [...list, nodeId]
          bumpMeta(state)
        }),

      clearTalentTree: (tree) =>
        set((state) => {
          if (tree === 'godTree') {
            const b = state.snapshot.talentWallBoards[0]
            if (b) b.ranks = {}
          } else {
            state.snapshot.talents[tree] = []
          }
          bumpMeta(state)
        }),

      setTalentWallPanel: (slotIndex, panelId) =>
        set((state) => {
          const b = state.snapshot.talentWallBoards[slotIndex]
          if (!b) return
          if (b.panelId !== panelId) {
            b.panelId = panelId
            b.ranks = {}
            b.namedGrandAffixSlots = normalizeNamedGrandAffixSlots(null)
          }
          bumpMeta(state)
        }),

      setNamedGrandAffixSlot: (slotIndex, pickIndex, affixId) =>
        set((state) => {
          const b = state.snapshot.talentWallBoards[slotIndex]
          if (!b) return
          const i = Math.floor(pickIndex)
          if (i < 0 || i >= NAMED_GRAND_TALENT_SLOT_COUNT) return
          const next: (string | null)[] = [...normalizeNamedGrandAffixSlots(b.namedGrandAffixSlots)]
          while (next.length < NAMED_GRAND_TALENT_SLOT_COUNT) next.push(null)
          const trimmed = affixId && affixId.trim() !== '' ? affixId.trim() : null
          const row = Math.floor(i / NAMED_GRAND_COLS)
          if (trimmed) {
            for (let c = 0; c < NAMED_GRAND_COLS; c++) {
              const j = row * NAMED_GRAND_COLS + c
              if (j !== i) next[j] = null
            }
          }
          next[i] = trimmed
          b.namedGrandAffixSlots = next.slice(0, NAMED_GRAND_TALENT_SLOT_COUNT) as (string | null)[]
          bumpMeta(state)
        }),

      setNamedGrandAffixRowPick: (slotIndex, rowIndex, pick) =>
        set((state) => {
          const b = state.snapshot.talentWallBoards[slotIndex]
          if (!b) return
          const row = Math.floor(rowIndex)
          if (row < 0 || row > 1) return
          const next: (string | null)[] = [...normalizeNamedGrandAffixSlots(b.namedGrandAffixSlots)]
          while (next.length < NAMED_GRAND_TALENT_SLOT_COUNT) next.push(null)
          const base = row * NAMED_GRAND_COLS
          for (let c = 0; c < NAMED_GRAND_COLS; c++) next[base + c] = null
          if (pick && pick.affixId.trim() !== '') {
            const col = Math.floor(pick.columnIndex)
            if (col >= 0 && col < NAMED_GRAND_COLS) {
              next[base + col] = pick.affixId.trim()
            }
          }
          b.namedGrandAffixSlots = next.slice(0, NAMED_GRAND_TALENT_SLOT_COUNT) as (string | null)[]
          bumpMeta(state)
        }),

      cycleTalentWallNodeRank: (slotIndex, nodeId, maxRank) =>
        set((state) => {
          const b = state.snapshot.talentWallBoards[slotIndex]
          if (!b) return
          const cap = Math.max(1, Math.min(99, Math.floor(maxRank)))
          const cur = b.ranks[nodeId] ?? 0
          const next = cur >= cap ? 0 : cur + 1
          if (next <= 0) {
            delete b.ranks[nodeId]
          } else {
            b.ranks[nodeId] = next
          }
          bumpMeta(state)
        }),

      setTalentWallNodeRank: (slotIndex, nodeId, rank, maxRank) =>
        set((state) => {
          const b = state.snapshot.talentWallBoards[slotIndex]
          if (!b) return
          const cap = Math.max(1, Math.min(99, Math.floor(maxRank)))
          const r = Math.min(cap, Math.max(0, Math.floor(rank)))
          if (r <= 0) {
            delete b.ranks[nodeId]
          } else {
            b.ranks[nodeId] = r
          }
          bumpMeta(state)
        }),

      setInspectedMainSkill: (slot) =>
        set((state) => {
          if (slot == null) {
            state.snapshot.meta.inspectedMainSkillSlot = null
          } else if (isMainSkillSlot(slot)) {
            state.snapshot.meta.inspectedMainSkillSlot = slot
          }
          bumpMeta(state)
        }),

      setSkill: (slot, skillId) =>
        set((state) => {
          const target = state.snapshot.skills[slot - 1]
          if (!target) return
          const prev = target.skillId
          target.skillId = skillId
          if (!skillId) target.supports = []
          else if (prev !== skillId) target.supports = []
          bumpMeta(state)
        }),

      setSkillLevel: (slot, level) =>
        set((state) => {
          const target = state.snapshot.skills[slot - 1]
          if (!target) return
          target.skillLevel = clampGemLv(level)
          bumpMeta(state)
        }),

      setSupportLink: (mainSlot, linkSlot, supportSkillId) =>
        set((state) => {
          const target = state.snapshot.skills[mainSlot - 1]
          if (!target || !target.skillId) return
          const ls = Math.min(20, Math.max(1, Math.floor(linkSlot)))
          if (supportSkillId == null) {
            target.supports = target.supports.filter((l) => l.linkSlot !== ls)
          } else {
            const i = target.supports.findIndex((l) => l.linkSlot === ls)
            if (i >= 0) {
              target.supports[i] = {
                ...target.supports[i]!,
                supportSkillId,
                linkSlot: ls,
              }
            } else {
              target.supports.push({
                supportSkillId,
                level: clampGemLv(target.skillLevel),
                enabled: true,
                linkSlot: ls,
              })
            }
          }
          target.supports = compactSupportLinkSlots([...target.supports])
          bumpMeta(state)
        }),

      setSupportLevel: (mainSlot, linkSlot, level) =>
        set((state) => {
          const target = state.snapshot.skills[mainSlot - 1]
          if (!target) return
          const ls = Math.min(20, Math.max(1, Math.floor(linkSlot)))
          const link = target.supports.find((l) => l.linkSlot === ls)
          if (link) link.level = clampGemLv(level)
          bumpMeta(state)
        }),

      toggleSupportEnabled: (mainSlot, linkSlot) =>
        set((state) => {
          const target = state.snapshot.skills[mainSlot - 1]
          if (!target) return
          const ls = Math.min(20, Math.max(1, Math.floor(linkSlot)))
          const link = target.supports.find((l) => l.linkSlot === ls)
          if (link) link.enabled = !link.enabled
          bumpMeta(state)
        }),

      toggleSupportSkill: (mainSlot, supportSkillId) =>
        set((state) => {
          const MAIN = state.snapshot.skills[mainSlot - 1]
          if (!MAIN || !MAIN.skillId) return
          const idx = MAIN.supports.findIndex((l) => l.supportSkillId === supportSkillId)
          if (idx >= 0) {
            MAIN.supports.splice(idx, 1)
          } else {
            const slot = nextSupportLinkSlot(MAIN.supports)
            MAIN.supports.push({
              supportSkillId,
              level: clampGemLv(MAIN.skillLevel),
              enabled: true,
              linkSlot: slot,
            })
          }
          MAIN.supports = compactSupportLinkSlots(MAIN.supports.map((l) => ({ ...l })))
          bumpMeta(state)
        }),

      clearSkillSupports: (mainSlot) =>
        set((state) => {
          const target = state.snapshot.skills[mainSlot - 1]
          if (!target) return
          target.supports = []
          bumpMeta(state)
        }),

      setMainSkillEnabled: (slot, enabled) =>
        set((state) => {
          const target = state.snapshot.skills[slot - 1]
          if (!target) return
          target.enabled = enabled
          bumpMeta(state)
        }),

      clearSkill: (slot) =>
        set((state) => {
          const target = state.snapshot.skills[slot - 1]
          if (!target) return
          target.skillId = null
          target.supports = []
          target.skillLevel = 20
          target.enabled = true
          target.notes = ''
          target.inspectionEnabled = undefined
          bumpMeta(state)
        }),

      setPassiveSkill: (slot, skillId) =>
        set((state) => {
          const target = state.snapshot.passives[slot - 1]
          if (!target) return
          target.skillId = skillId
          bumpMeta(state)
        }),

      togglePassiveEnabled: (passiveSlot) =>
        set((state) => {
          const target = state.snapshot.passives[passiveSlot - 1]
          if (!target) return
          target.enabled = !target.enabled
          bumpMeta(state)
        }),

      setPassiveSkillLevel: (passiveSlot, level) =>
        set((state) => {
          const target = state.snapshot.passives[passiveSlot - 1]
          if (!target) return
          target.skillLevel = clampGemLv(level)
          bumpMeta(state)
        }),

      setPassiveApplyMode: (passiveSlot, mode) =>
        set((state) => {
          const target = state.snapshot.passives[passiveSlot - 1]
          if (!target) return
          target.applyMode = mode
          if (mode === 'global') target.linkedMainSkillSlots = []
          bumpMeta(state)
        }),

      setPassiveLinkedSlots: (passiveSlot, slots) =>
        set((state) => {
          const target = state.snapshot.passives[passiveSlot - 1]
          if (!target) return
          target.linkedMainSkillSlots = [...new Set(slots.filter(isMainSkillSlot))].sort((a, b) => a - b)
          bumpMeta(state)
        }),

      clearPassive: (slot) =>
        set((state) => {
          const target = state.snapshot.passives[slot - 1]
          if (!target) return
          target.skillId = null
          target.enabled = true
          target.applyMode = 'global'
          target.linkedMainSkillSlots = []
          target.skillLevel = 1
          bumpMeta(state)
        }),

      setGearBase: (slot, gearBaseId) =>
        set((state) => {
          state.snapshot.gear[slot].gearBaseId = gearBaseId
          if (gearBaseId) {
            state.snapshot.gear[slot].legendaryItemId = null
          }
          bumpMeta(state)
        }),

      setLegendaryItem: (slot, legendaryItemId) =>
        set((state) => {
          state.snapshot.gear[slot].legendaryItemId = legendaryItemId
          if (legendaryItemId) {
            state.snapshot.gear[slot].gearBaseId = null
          }
          bumpMeta(state)
        }),

      clearGearSlot: (slot) =>
        set((state) => {
          state.snapshot.gear[slot] = {
            gearBaseId: null,
            legendaryItemId: null,
            customMods: [],
          }
          bumpMeta(state)
        }),

      setPactspirit: (slot, pactspiritId) =>
        set((state) => {
          const target = state.snapshot.pactspirits[slot - 1]
          if (!target) return
          target.pactspiritId = pactspiritId
          bumpMeta(state)
        }),

      setNote: (section, value) =>
        set((state) => {
          state.snapshot.notes[section] = value
          bumpMeta(state)
        }),

      setDivinityBoardNotes: (value) =>
        set((state) => {
          touchDivinityBoard(state.snapshot)
          state.snapshot.divinityBoard.notes = value
          bumpMeta(state)
        }),

      setDivinityBoardPlan: (value) =>
        set((state) => {
          touchDivinityBoard(state.snapshot)
          state.snapshot.divinityBoard.plan = value
          bumpMeta(state)
        }),

      toggleDivinityBoardSelection: (boardId) =>
        set((state) => {
          touchDivinityBoard(state.snapshot)
          const list = state.snapshot.divinityBoard.selectedBoardIds
          const i = list.indexOf(boardId)
          if (i === -1) list.push(boardId)
          else list.splice(i, 1)
          bumpMeta(state)
        }),

      importSnapshot: (next) =>
        set((state) => {
          state.snapshot = normalizeBuildSnapshot(next)
          state.dirty = false
          state.revision += 1
        }),

      resetBuild: () =>
        set((state) => {
          state.snapshot = createDefaultBuild()
          state.dirty = true
          state.revision += 1
        }),

      markSaved: () =>
        set((state) => {
          state.dirty = false
          state.lastSavedAt = Date.now()
        }),

      exportSnapshot: () => get().snapshot,
    })),
    {
      name: 'tli-build-editor',
      version: 6,
      migrate: (persistedState, oldVersion) => {
        try {
          const p = persistedState as { snapshot?: unknown; inspectedMainSlot?: number } | null
          if (!p || typeof p !== 'object') {
            return { snapshot: normalizeBuildSnapshot(createEmptyBuildSnapshot()) }
          }
          let snapRaw: unknown = p.snapshot
          if (
            typeof oldVersion === 'number' &&
            oldVersion < 5 &&
            typeof p.inspectedMainSlot === 'number' &&
            p.inspectedMainSlot >= 1 &&
            p.inspectedMainSlot <= 5
          ) {
            const base =
              snapRaw != null && typeof snapRaw === 'object' ? ({ ...snapRaw } as Record<string, unknown>) : {}
            const meta =
              base.meta != null && typeof base.meta === 'object'
                ? ({ ...base.meta } as Record<string, unknown>)
                : {}
            if (meta.inspectedMainSkillSlot == null) meta.inspectedMainSkillSlot = p.inspectedMainSlot
            base.meta = meta
            snapRaw = base
          }
          if (snapRaw != null && typeof snapRaw === 'object') {
            return { snapshot: normalizeBuildSnapshot(snapRaw) }
          }
        } catch {
          /* fall through */
        }
        return { snapshot: normalizeBuildSnapshot(createEmptyBuildSnapshot()) }
      },
      merge: (persistedState, currentState) => {
        const p = persistedState as Partial<Pick<BuildStore, 'snapshot'>> | null | undefined
        const next: BuildStore = {
          ...currentState,
          ...(p && typeof p === 'object' ? p : {}),
        }
        if (p?.snapshot != null && typeof p.snapshot === 'object') {
          try {
            next.snapshot = normalizeBuildSnapshot(p.snapshot)
          } catch {
            next.snapshot = normalizeBuildSnapshot(createEmptyBuildSnapshot())
          }
        }
        return next
      },
      partialize: (state) => ({ snapshot: state.snapshot }),
      storage: (() => {
        const base = createJSONStorage(() => {
          if (typeof window === 'undefined') {
            return {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
          }
          return localStorage
        })
        if (!base) {
          throw new Error('persist storage init failed')
        }
        return {
          getItem: base.getItem.bind(base),
          setItem: throttle(base.setItem.bind(base), 750),
          removeItem: base.removeItem.bind(base),
        }
      })(),
    }
  )
)
