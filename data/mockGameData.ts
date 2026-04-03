// data/mockGameData.ts
import type { TreeName } from '@/types/build'

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

export const mockGearBases = [
  { id: 'gear_weapon_bow_01', slot: 'weapon1', name: 'Basic Bow' },
  { id: 'gear_weapon_staff_01', slot: 'weapon1', name: 'Basic Staff' },
  { id: 'gear_helmet_01', slot: 'helmet', name: 'Hunter Hood' },
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
    treeName: 'godTree',
    label: 'God Tree',
    nodes: [
      { id: 'god_001', name: 'Projectile Force', description: '+Projectile themed node' },
      { id: 'god_002', name: 'Swift Casting', description: '+Cast speed themed node' },
      { id: 'god_003', name: 'Bomb Focus', description: '+Bomb damage themed node' },
      { id: 'god_004', name: 'Critical Route', description: '+Critical themed node' },
      { id: 'god_005', name: 'Survival Sense', description: '+Defense themed node' },
      { id: 'god_006', name: 'Resource Flow', description: '+Energy themed node' },
    ],
  },
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
