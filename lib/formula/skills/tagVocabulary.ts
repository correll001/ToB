/**
 * Maps TLIDB display tags to canonical keys for SupportRule matching.
 * Extend as new tags appear in normalized data.
 */
const ZH_TO_CANON: Record<string, string> = {
  位移: "Mobility",
  攻擊: "Attack",
  法術: "Spell",
  近戰: "Melee",
  遠程: "Ranged",
  投射物: "Projectile",
  輔助: "Support",
  引導: "Channeled",
  範圍: "Area",
  物理: "Physical",
  火焰: "Fire",
  冰冷: "Cold",
  閃電: "Lightning",
  腐蝕: "Corrosion",
  破擊: "Demolish",
  戰吼: "Warcry",
  持續: "Duration",
  召喚: "Summon",
  光環: "Aura",
  哨衛: "Sentinel",
  連鎖: "Chain",
}

export function zhTagToCanonical(tag: string): string {
  return ZH_TO_CANON[tag] ?? tag
}

export function activeCanonicalTagSet(tags: string[]): Set<string> {
  const s = new Set<string>()
  for (const t of tags) {
    s.add(zhTagToCanonical(t))
    s.add(t)
  }
  return s
}
