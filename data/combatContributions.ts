/**
 * Explicit StatBlock lookup tables by id (mock, data-driven).
 * 負面效果只允許出現在資料中（如玻璃大砲），公式本身不引入隨機或不可解釋的落差。
 */
import type { StatBlock } from '@/types/combat'

const _ = (b: StatBlock): StatBlock => b

export const HERO_CONTRIBUTIONS: Record<string, StatBlock> = {
  hero_bing: _({ strength: 6, dexterity: 4, intelligence: 3, baseDamageFlat: 8, hpFlat: 25 }),
  hero_carino: _({ strength: 4, dexterity: 8, intelligence: 3, attackSpeedPct: 6, baseDamageFlat: 6 }),
  hero_gemma: _({ strength: 3, dexterity: 4, intelligence: 9, mpFlat: 20, baseDamageFlat: 5, damagePct: 4 }),
}

export const TRAIT_CONTRIBUTIONS: Record<string, StatBlock> = {
  trait_blast_nova: _({ baseDamageFlat: 14, damagePct: 8, intelligence: 4 }),
  trait_zealot_of_war: _({ attackSpeedPct: 10, dexterity: 6, baseDamageFlat: 10 }),
  trait_frostfire: _({ intelligence: 8, damagePct: 6, mpPct: 5, baseDamageFlat: 8 }),
}

export const RELIC_CONTRIBUTIONS: Record<string, StatBlock> = {
  relic_mock_alpha: _({ baseDamageFlat: 12, damagePct: 6, moreDamagePct: 4 }),
  relic_mock_beta: _({ hpFlat: 80, hpPct: 6, strength: 5 }),
  relic_mock_gamma: _({ attackSpeedPct: 8, dexterity: 5, baseDamageFlat: 8 }),
  relic_mock_delta: _({ mpFlat: 35, intelligence: 4, critChancePct: 3 }),
  relic_mock_eps: _({ intelligence: 6, damagePct: 8, baseDamageFlat: 10 }),
  relic_mock_zeta: _({ mpFlat: 45, mpPct: 8, baseDamageFlat: 6 }),
}

export const SPECIALTY_CONTRIBUTIONS: Record<string, StatBlock> = {
  spec_mock_1: _({ baseDamageFlat: 8, dexterity: 3 }),
  spec_mock_2: _({ damagePct: 5, intelligence: 2 }),
  spec_mock_3: _({ attackSpeedPct: 7, dexterity: 4 }),
  spec_mock_4: _({ strength: 4, hpFlat: 35 }),
  spec_mock_5: _({ intelligence: 5, damagePct: 4, mpFlat: 15 }),
  spec_mock_6: _({ mpPct: 6, mpFlat: 25, baseDamageFlat: 5 }),
}

/** Trade-off 範例：數值全由資料聲明。 */
const GLASS_CANNON: StatBlock = _({
  damagePct: 14,
  baseDamageFlat: 18,
  attackSpeedPct: 6,
  hpFlat: -85,
  hpPct: -8,
})

export const TALENT_NODE_CONTRIBUTIONS: Record<string, StatBlock> = {
  god_001: _({ baseDamageFlat: 5, dexterity: 2 }),
  god_002: _({ attackSpeedPct: 4, intelligence: 2 }),
  god_003: _({ baseDamageFlat: 8, damagePct: 3 }),
  god_004: _({ critChancePct: 5, critDamagePct: 10, dexterity: 3 }),
  god_005: _({ hpFlat: 45, strength: 3 }),
  god_006: _({ mpFlat: 28, mpPct: 4 }),
  class_001: _({ attackSpeedPct: 8, dexterity: 4 }),
  class_002: _({ baseDamageFlat: 10, damagePct: 4 }),
  class_003: GLASS_CANNON,
  class_004: _({ dexterity: 5, mpFlat: 15 }),
  class_005: _({ critChancePct: 4, critDamagePct: 8, baseDamageFlat: 6 }),
  class_006: _({ hpFlat: 40, mpFlat: 20 }),
  tree3_001: _({ strength: 3, hpFlat: 20 }),
  tree3_002: _({ intelligence: 3, mpFlat: 18 }),
  tree3_003: _({ baseDamageFlat: 6 }),
  tree3_004: _({ attackSpeedPct: 4 }),
  tree4_001: _({ damagePct: 3, baseDamageFlat: 5 }),
  tree4_002: _({ hpFlat: 30 }),
  tree4_003: _({ mpPct: 4 }),
  tree4_004: _({ dexterity: 4 }),
  div_001: _({ intelligence: 4, damagePct: 3 }),
  div_002: _({ hpFlat: 25, mpFlat: 15 }),
  div_003: _({ moreDamagePct: 6, baseDamageFlat: 8 }),
}

export const SKILL_CONTRIBUTIONS: Record<string, StatBlock> = {
  skill_bombard: _({ baseDamageFlat: 22, damagePct: 4 }),
  skill_blink: _({ mpFlat: 10, dexterity: 2 }),
  skill_blazing_bullet: _({ baseDamageFlat: 18, attackSpeedPct: 3 }),
  skill_chain_lightning: _({ intelligence: 4, baseDamageFlat: 20, mpFlat: -5 }),
  skill_rain_of_arrows: _({ dexterity: 4, baseDamageFlat: 16, attackSpeedPct: 4 }),
  skill_frost_terra: _({ intelligence: 5, baseDamageFlat: 17, damagePct: 5 }),
}

export const DIVINITY_BOARD_OPTION_CONTRIBUTIONS: Record<string, StatBlock> = {
  db_mock_1: _({ attackSpeedPct: 4, dexterity: 2 }),
  db_mock_2: _({ critChancePct: 3, critDamagePct: 8 }),
  db_mock_3: _({ damagePct: 4, baseDamageFlat: 6 }),
  db_mock_4: _({ hpFlat: 55, hpPct: 4 }),
  db_mock_5: _({ mpFlat: 35, mpPct: 5, intelligence: 3 }),
  db_mock_6: _({ strength: 3, intelligence: 3, baseDamageFlat: 5 }),
}

export const GEAR_BASE_CONTRIBUTIONS: Record<string, StatBlock> = {
  gear_helmet_01: _({ hpFlat: 45, intelligence: 2 }),
  gear_chest_01: _({ hpFlat: 80, strength: 4 }),
  gear_gloves_01: _({ dexterity: 3, attackSpeedPct: 3 }),
  gear_boots_01: _({ hpFlat: 35, dexterity: 4 }),
  gear_necklace_01: _({ mpFlat: 25, intelligence: 3 }),
  gear_belt_01: _({ hpFlat: 50, strength: 3 }),
  gear_ring_01: _({ baseDamageFlat: 6, dexterity: 2 }),
  gear_ring_02: _({ intelligence: 3, mpFlat: 12 }),
  gear_weapon_bow_01: _({ baseDamageFlat: 45, dexterity: 5, attackSpeedPct: 5 }),
  gear_weapon_staff_01: _({ baseDamageFlat: 38, intelligence: 6, mpFlat: 15 }),
  gear_weapon_sword_01: _({ baseDamageFlat: 28, strength: 4 }),
  gear_weapon_focus_01: _({ baseDamageFlat: 22, intelligence: 5, mpFlat: 20 }),
}

/** 傳奇：同槽位相對 base 為純增強；若要 trade-off 須在資料寫負值。 */
export const LEGENDARY_CONTRIBUTIONS: Record<string, StatBlock> = {
  leg_helmet_01: _({ hpFlat: 110, hpPct: 5, intelligence: 4 }),
  leg_chest_01: _({ hpFlat: 160, strength: 8, damagePct: 5 }),
  leg_gloves_01: _({ dexterity: 7, attackSpeedPct: 7, critChancePct: 2 }),
  leg_boots_01: _({ hpFlat: 90, dexterity: 6, attackSpeedPct: 4 }),
  leg_necklace_01: _({ mpFlat: 55, intelligence: 8, damagePct: 4 }),
  leg_belt_01: _({ hpFlat: 95, strength: 6, baseDamageFlat: 8 }),
  leg_ring_01: _({ baseDamageFlat: 16, dexterity: 4, critChancePct: 3 }),
  leg_ring_02: _({ baseDamageFlat: 14, intelligence: 6, mpPct: 6 }),
  leg_weapon1_01: _({ baseDamageFlat: 95, damagePct: 12, moreDamagePct: 5, attackSpeedPct: 4 }),
  /** 範例 trade-off：高傷、略扣生命（資料明示）。 */
  leg_weapon2_01: _({ baseDamageFlat: 72, damagePct: 10, critDamagePct: 12, hpFlat: -40 }),
}

export const PACTSPIRIT_CONTRIBUTIONS: Record<string, StatBlock> = {
  pact_iron_lion: _({ strength: 8, hpFlat: 120, hpPct: 4 }),
  pact_alice_1: _({ intelligence: 6, mpFlat: 40, mpPct: 5 }),
  pact_cloudgatherer: _({ dexterity: 7, attackSpeedPct: 6, damagePct: 4 }),
}
