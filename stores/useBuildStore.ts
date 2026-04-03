// stores/useBuildStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { BuildSnapshot, GearSlot, TreeName } from '@/types/build'
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

function createDefaultBuild(): BuildSnapshot {
  return {
    schemaVersion: '1.0.0',
    gameVersion: 'ss12',
    meta: {
      title: 'New Build',
      level: 1,
      description: '',
      visibility: 'private',
    },
    hero: {
      heroId: null,
      traitId: null,
    },
    talents: {
      godTree: [],
      classTree: [],
      tree3: [],
      tree4: [],
      divinity: [],
    },
    skills: [
      { slot: 1, skillId: null, supports: [], enabled: true },
      { slot: 2, skillId: null, supports: [], enabled: true },
      { slot: 3, skillId: null, supports: [], enabled: true },
      { slot: 4, skillId: null, supports: [], enabled: true },
      { slot: 5, skillId: null, supports: [], enabled: true },
    ],
    gear: {
      helmet: { gearBaseId: null, legendaryItemId: null, customMods: [] },
      chest: { gearBaseId: null, legendaryItemId: null, customMods: [] },
      gloves: { gearBaseId: null, legendaryItemId: null, customMods: [] },
      boots: { gearBaseId: null, legendaryItemId: null, customMods: [] },
      necklace: { gearBaseId: null, legendaryItemId: null, customMods: [] },
      belt: { gearBaseId: null, legendaryItemId: null, customMods: [] },
      ring1: { gearBaseId: null, legendaryItemId: null, customMods: [] },
      ring2: { gearBaseId: null, legendaryItemId: null, customMods: [] },
      weapon1: { gearBaseId: null, legendaryItemId: null, customMods: [] },
      weapon2: { gearBaseId: null, legendaryItemId: null, customMods: [] },
    },
    pactspirits: [
      { slot: 1, pactspiritId: null },
      { slot: 2, pactspiritId: null },
      { slot: 3, pactspiritId: null },
    ],
    notes: {
      gameplay: '',
      leveling: '',
      bossing: '',
    },
  }
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

  toggleTalentNode: (tree: TreeName, nodeId: string) => void
  clearTalentTree: (tree: TreeName) => void

  setSkill: (slot: number, skillId: string | null) => void
  clearSkill: (slot: number) => void

  setGearBase: (slot: GearSlot, gearBaseId: string | null) => void
  setLegendaryItem: (slot: GearSlot, legendaryItemId: string | null) => void
  clearGearSlot: (slot: GearSlot) => void

  setPactspirit: (slot: number, pactspiritId: string | null) => void
  setNote: (section: keyof BuildSnapshot['notes'], value: string) => void

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
      version: 1,
      migrate: (persisted) => {
        if (persisted && typeof persisted === 'object' && persisted !== null && 'snapshot' in persisted) {
          const p = persisted as { snapshot: BuildSnapshot }
          return { snapshot: normalizeBuildSnapshot(p.snapshot) }
        }
        return persisted as { snapshot: BuildSnapshot }
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
