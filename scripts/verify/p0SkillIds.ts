/**
 * 4E-6 — Canonical P0 skill IDs for bundled data contracts (overrides + effective bundle).
 * Keep in sync with `data/overrides/ss12/active-skills.json` / `support-skills.json` batch intent.
 */

/** Must match data/overrides P0 active batch (4E-1). */
export const P0_ACTIVE_SKILL_IDS = [
  'skill:Leap_Attack',
  'skill:Ice_Shot',
  'skill:Hammer_of_Ash',
  'skill:Whirlwind',
  'skill:Focused_Slash',
  'skill:Rain_of_Arrows',
  'skill:Berserking_Blade',
  'skill:Chromatic_Shot',
  'skill:Blizzard',
  'skill:Chain_Lightning',
  'skill:Ring_of_Ice',
] as const

/** Entries from `data/overrides/ss12/support-skills.json` (4E-2 curated supports). */
export const P0_SUPPORT_SKILL_IDS = [
  'skill:Multiple_Projectiles',
  'skill:Projectile_Split',
  'skill:Increased_Area',
  'skill:Tendonslicer',
  'skill:Glacial_Freeze',
  'skill:Added_Physical_Damage',
  'skill:Added_Fire_Damage',
  'skill:Added_Cold_Damage',
  'skill:Melee_Knockback',
  'skill:Steamroll',
  'skill:Multistrike',
  'skill:Overload',
] as const
