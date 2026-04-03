// stores/useBuildStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { BuildSnapshot, GearSlot, TreeName } from '@/types/build'
import { createEmptyBuildSnapshot } from '@/lib/defaultBuildSnapshot'
import { normalizeBuildSnapshot } from '@/lib/normalizeBuildSnapshot'

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

/** Runtime guard for legacy / corrupted snapshots missing `divinityBoard` fields. */
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

  setSkill: (slot: number, skillId: string | null) => void
  clearSkill: (slot: number) => void

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

          state.snapshot.skills.forEach((skill) => {
            skill.skillId = null
            skill.supports = []
            skill.enabled = true
            skill.notes = ''
          })

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
          const list = state.snapshot.talents[tree]
          const exists = list.includes(nodeId)
          state.snapshot.talents[tree] = exists
            ? list.filter((id) => id !== nodeId)
            : [...list, nodeId]
          bumpMeta(state)
        }),

      clearTalentTree: (tree) =>
        set((state) => {
          state.snapshot.talents[tree] = []
          bumpMeta(state)
        }),

      setSkill: (slot, skillId) =>
        set((state) => {
          const target = state.snapshot.skills[slot - 1]
          if (!target) return
          target.skillId = skillId
          if (!skillId) target.supports = []
          bumpMeta(state)
        }),

      clearSkill: (slot) =>
        set((state) => {
          const target = state.snapshot.skills[slot - 1]
          if (!target) return
          target.skillId = null
          target.supports = []
          target.enabled = true
          target.notes = ''
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
      /** Bump when persisted snapshot shape needs migration (e.g. new `divinityBoard`). */
      version: 2,
      migrate: (persistedState, _oldVersion) => {
        try {
          const p = persistedState as { snapshot?: unknown } | null
          if (p && typeof p === 'object' && p.snapshot != null && typeof p.snapshot === 'object') {
            return { snapshot: normalizeBuildSnapshot(p.snapshot) }
          }
        } catch {
          /* use empty below */
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
