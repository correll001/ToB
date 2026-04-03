// lib/defaultBuildSnapshot.ts
/** Single source for empty build shape (store default, legacy merge, tests). */
import type { BuildSnapshot } from '@/types/build'

export function createEmptyBuildSnapshot(): BuildSnapshot {
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
      relicId: null,
      specialtyId: null,
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
    divinityBoard: {
      notes: '',
      plan: '',
      selectedBoardIds: [],
    },
  }
}
