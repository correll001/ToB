/**
 * Data-driven combat routing for skill instances — not authoritative game data.
 * Values are conservative: when evidence is missing, prefer `unknown` over inventing a damage path.
 */

/** Primary label for formula / panel routing (4D-4). */
export type SkillCombatRole =
  | 'damaging'
  | 'support-only'
  | 'aura-only'
  | 'utility'
  | 'summon-driver'
  | 'unknown'

/** @deprecated Prefer `SkillCombatRole`; kept as alias for existing imports. */
export type SkillDamageRole = SkillCombatRole
