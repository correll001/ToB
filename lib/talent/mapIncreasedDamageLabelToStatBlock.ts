/**
 * 將繁中 label（talent affix modifier）對應到 StatBlock 的遞增傷害欄位。
 * 順序：愈具體愈先匹配，避免「傷害」吃掉元素／召喚物等子類。
 */
import type { StatBlock } from '@/types/combat'

/** @returns 單一欄位 StatBlock，或 null 表示不屬於遞增傷害類。 */
export function percentIncreasedDamageFromLabelZh(label: string, value: number): StatBlock | null {
  if (!Number.isFinite(value)) return null

  if (/法術傷害/.test(label)) return { spellDamagePct: value }

  if (/召喚物.*火焰|火焰.*召喚物/.test(label)) return { minionFireDamagePct: value }
  if (/召喚物.*閃電|閃電.*召喚物/.test(label)) return { minionLightningDamagePct: value }
  if (/召喚物.*冰冷|冰冷.*召喚物/.test(label)) return { minionColdDamagePct: value }
  if (/召喚物.*腐蝕|腐蝕.*召喚物/.test(label)) return { minionErosionDamagePct: value }
  if (/召喚物.*物理|物理.*召喚物/.test(label)) return { minionPhysicalDamagePct: value }
  if (/召喚物/.test(label) && /傷害/.test(label)) return { minionDamagePct: value }

  if (/哨衛/.test(label) && /傷害/.test(label)) return { minionDamagePct: value }

  if (/攻擊傷害/.test(label)) return { attackDamagePct: value }
  if (/近戰傷害/.test(label)) return { meleeDamagePct: value }
  if (/投射物傷害/.test(label)) return { projectileDamagePct: value }
  if (/持續傷害/.test(label)) return { dotDamagePct: value }

  if (/物理傷害/.test(label)) return { physicalDamagePct: value }
  if (/腐蝕傷害/.test(label)) return { erosionDamagePct: value }
  if (/閃電傷害/.test(label)) return { lightningDamagePct: value }
  if (/火焰傷害/.test(label)) return { fireDamagePct: value }
  if (/冰冷傷害/.test(label)) return { coldDamagePct: value }
  if (/元素傷害/.test(label)) return { elementalDamagePct: value }

  if (
    /傷害/.test(label) &&
    /Channeled|引導技能|引導類技能|for Channeled/i.test(label) &&
    !/for every/i.test(label)
  ) {
    return { channeledDamagePct: value }
  }

  if (/傷害/.test(label)) return { damagePct: value }

  return null
}
