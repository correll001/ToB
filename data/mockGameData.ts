// data/mockGameData.ts
import type { GearSlot, TreeName } from '@/types/build'

export const mockHeroes = [
  { id: 'hero_bing', name: 'Bing' },
  { id: 'hero_carino', name: 'Carino' },
  { id: 'hero_gemma', name: 'Gemma' },
]

export const mockTraits = [
  {
    id: 'trait_blast_nova',
    heroId: 'hero_bing',
    name: 'Blast Nova',
    description: 'Bomb-based projectile trait for explosive mapping.',
  },
  {
    id: 'trait_zealot_of_war',
    heroId: 'hero_carino',
    name: 'Zealot of War',
    description: 'Switch combat modes and apply intense projectile pressure.',
  },
  {
    id: 'trait_frostfire',
    heroId: 'hero_gemma',
    name: 'Frostfire',
    description: 'Hybrid fire-cold casting route with elemental conversion feel.',
  },
]

export const mockSkills = [
  { id: 'skill_bombard', name: 'Bombard' },
  { id: 'skill_blink', name: 'Blink' },
  { id: 'skill_blazing_bullet', name: 'Blazing Bullet' },
  { id: 'skill_chain_lightning', name: 'Chain Lightning' },
  { id: 'skill_rain_of_arrows', name: 'Rain of Arrows' },
  { id: 'skill_frost_terra', name: 'Frost Terra' },
]

/** Dev-only gear bases (not official data). */
export const mockGearBases: { id: string; slot: GearSlot; name: string }[] = [
  { id: 'gear_helmet_01', slot: 'helmet', name: 'Mock 獵人兜帽' },
  { id: 'gear_chest_01', slot: 'chest', name: 'Mock 皮甲' },
  { id: 'gear_gloves_01', slot: 'gloves', name: 'Mock 粗布手套' },
  { id: 'gear_boots_01', slot: 'boots', name: 'Mock 旅者靴' },
  { id: 'gear_necklace_01', slot: 'necklace', name: 'Mock 骨製項鍊' },
  { id: 'gear_belt_01', slot: 'belt', name: 'Mock 皮帶' },
  { id: 'gear_ring_01', slot: 'ring1', name: 'Mock 銅戒' },
  { id: 'gear_ring_02', slot: 'ring2', name: 'Mock 銀戒' },
  { id: 'gear_weapon_bow_01', slot: 'weapon1', name: 'Mock 輕弓' },
  { id: 'gear_weapon_staff_01', slot: 'weapon1', name: 'Mock 短杖' },
  { id: 'gear_weapon_sword_01', slot: 'weapon2', name: 'Mock 副手短劍' },
  { id: 'gear_weapon_focus_01', slot: 'weapon2', name: 'Mock 法器' },
]

/** Dev-only legendary items (not official data). */
export const mockLegendaryItems: { id: string; slot: GearSlot; name: string }[] = [
  { id: 'leg_helmet_01', slot: 'helmet', name: 'Mock 傳奇兜帽 α' },
  { id: 'leg_chest_01', slot: 'chest', name: 'Mock 傳奇胸甲 α' },
  { id: 'leg_gloves_01', slot: 'gloves', name: 'Mock 傳奇手套 α' },
  { id: 'leg_boots_01', slot: 'boots', name: 'Mock 傳奇靴 α' },
  { id: 'leg_necklace_01', slot: 'necklace', name: 'Mock 傳奇項鍊 α' },
  { id: 'leg_belt_01', slot: 'belt', name: 'Mock 傳奇腰帶 α' },
  { id: 'leg_ring_01', slot: 'ring1', name: 'Mock 傳奇戒 α' },
  { id: 'leg_ring_02', slot: 'ring2', name: 'Mock 傳奇戒 β' },
  { id: 'leg_weapon1_01', slot: 'weapon1', name: 'Mock 傳奇主手 α' },
  { id: 'leg_weapon2_01', slot: 'weapon2', name: 'Mock 傳奇副手 α' },
]

/** MVP 遺物選項（mock） */
export const mockRelics = [
  { id: 'relic_mock_alpha', heroId: 'hero_bing', name: 'Mock 遺物·爆裂' },
  { id: 'relic_mock_beta', heroId: 'hero_bing', name: 'Mock 遺物·堅韌' },
  { id: 'relic_mock_gamma', heroId: 'hero_carino', name: 'Mock 遺物·戰熱' },
  { id: 'relic_mock_delta', heroId: 'hero_carino', name: 'Mock 遺物·專注' },
  { id: 'relic_mock_eps', heroId: 'hero_gemma', name: 'Mock 遺物·霜火' },
  { id: 'relic_mock_zeta', heroId: 'hero_gemma', name: 'Mock 遺物·秘能' },
]

/** MVP 英雄特性（mock） */
export const mockSpecialties = [
  { id: 'spec_mock_1', heroId: 'hero_bing', name: 'Mock 特性·投擲專精' },
  { id: 'spec_mock_2', heroId: 'hero_bing', name: 'Mock 特性·範圍擴張' },
  { id: 'spec_mock_3', heroId: 'hero_carino', name: 'Mock 特性·連射' },
  { id: 'spec_mock_4', heroId: 'hero_carino', name: 'Mock 特性·戰意' },
  { id: 'spec_mock_5', heroId: 'hero_gemma', name: 'Mock 特性·元素調和' },
  { id: 'spec_mock_6', heroId: 'hero_gemma', name: 'Mock 特性·魔力迴響' },
]

/** 神格石板示意選項（多選用，非真實石板表） */
export const mockDivinityBoardOptions = [
  { id: 'db_mock_1', name: '示意石板·節奏 I' },
  { id: 'db_mock_2', name: '示意石板·暴擊 I' },
  { id: 'db_mock_3', name: '示意石板·範圍 I' },
  { id: 'db_mock_4', name: '示意石板·防護 I' },
  { id: 'db_mock_5', name: '示意石板·能量 I' },
  { id: 'db_mock_6', name: '示意石板·混合 I' },
]

export const mockPactspirits = [
  { id: 'pact_iron_lion', name: 'Iron Lion' },
  { id: 'pact_alice_1', name: 'Alice 1' },
  { id: 'pact_cloudgatherer', name: 'Cloudgatherer' },
]

export type MockTalentNode = {
  id: string
  name: string
  description: string
}

export type MockTalentTree = {
  treeName: TreeName
  label: string
  nodes: MockTalentNode[]
}

export const mockTalentTrees: MockTalentTree[] = [
  {
    treeName: 'classTree',
    label: 'Class Tree',
    nodes: [
      { id: 'class_001', name: 'Rapid Fire', description: 'Attack speed route' },
      { id: 'class_002', name: 'Long Shot', description: 'Ranged precision route' },
      { id: 'class_003', name: 'Glass Cannon', description: 'High risk high reward' },
      { id: 'class_004', name: 'Steady Motion', description: 'Utility movement route' },
      { id: 'class_005', name: 'Sharp Instinct', description: 'Crit / accuracy route' },
      { id: 'class_006', name: 'Battle Reserve', description: 'Resource sustain route' },
    ],
  },
  {
    treeName: 'tree3',
    label: 'Tree 3',
    nodes: [
      { id: 'tree3_001', name: 'Node A', description: 'Placeholder node A' },
      { id: 'tree3_002', name: 'Node B', description: 'Placeholder node B' },
      { id: 'tree3_003', name: 'Node C', description: 'Placeholder node C' },
      { id: 'tree3_004', name: 'Node D', description: 'Placeholder node D' },
    ],
  },
  {
    treeName: 'tree4',
    label: 'Tree 4',
    nodes: [
      { id: 'tree4_001', name: 'Node E', description: 'Placeholder node E' },
      { id: 'tree4_002', name: 'Node F', description: 'Placeholder node F' },
      { id: 'tree4_003', name: 'Node G', description: 'Placeholder node G' },
      { id: 'tree4_004', name: 'Node H', description: 'Placeholder node H' },
    ],
  },
  {
    treeName: 'divinity',
    label: 'Divinity',
    nodes: [
      { id: 'div_001', name: 'Divinity Spark', description: 'Divinity placeholder node' },
      { id: 'div_002', name: 'Divinity Pulse', description: 'Divinity placeholder node' },
      { id: 'div_003', name: 'Divinity Core', description: 'Divinity placeholder node' },
    ],
  },
]
