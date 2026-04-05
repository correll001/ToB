import type { StatBlock } from '@/types/combat'

const trim = (s: string) => s.trim()

/**
 * 將牆面節點英文效果行解析為 StatBlock；解析不到則回 null（交由 UI 以純文字列顯示）。
 */
export function parseTalentEffectLineToStatBlock(line: string): StatBlock | null {
  const s = trim(line)
  if (!s) return null

  let m: RegExpMatchArray | null

  m = s.match(/^\+(\d+(?:\.\d+)?)% additional (.+)$/i)
  if (m) {
    const n = Number(m[1])
    if (!Number.isFinite(n)) return null
    const rest = m[2]!.toLowerCase()
    if (
      /attack damage|damage|spell damage|physical damage|erosion damage|elemental damage|minion damage|base damage|sentry damage/.test(
        rest,
      )
    ) {
      return { moreDamagePct: n }
    }
    return null
  }

  m = s.match(/^(\d+(?:\.\d+)?)% additional (.+)$/i)
  if (m) {
    const n = Number(m[1])
    if (!Number.isFinite(n)) return null
    const rest = m[2]!.toLowerCase()
    if (/damage/.test(rest) && !/duration|stack/.test(rest)) {
      return { moreDamagePct: n }
    }
    return null
  }

  m = s.match(
    /^\+(\d+(?:\.\d+)?)% Minion (Fire|Lightning|Cold|Erosion|Physical) Damage$/i,
  )
  if (m) {
    const n = Number(m[1])
    const t = m[2]!.toLowerCase()
    if (t === 'fire') return { minionFireDamagePct: n }
    if (t === 'lightning') return { minionLightningDamagePct: n }
    if (t === 'cold') return { minionColdDamagePct: n }
    if (t === 'erosion') return { minionErosionDamagePct: n }
    if (t === 'physical') return { minionPhysicalDamagePct: n }
    return null
  }

  m = s.match(/^\+(\d+(?:\.\d+)?)% (Minion|Sentry) Damage$/i)
  if (m) return { minionDamagePct: Number(m[1]) }

  m = s.match(/^\+(\d+(?:\.\d+)?)% Spell Damage$/i)
  if (m) return { spellDamagePct: Number(m[1]) }

  m = s.match(/^\+(\d+(?:\.\d+)?)% Attack Damage$/i)
  if (m) return { attackDamagePct: Number(m[1]) }

  m = s.match(/^\+(\d+(?:\.\d+)?)% Melee Damage$/i)
  if (m) return { meleeDamagePct: Number(m[1]) }

  m = s.match(/^\+(\d+(?:\.\d+)?)% Projectile Damage$/i)
  if (m) return { projectileDamagePct: Number(m[1]) }

  m = s.match(/^\+(\d+(?:\.\d+)?)% Damage Over Time$/i)
  if (m) return { dotDamagePct: Number(m[1]) }

  m = s.match(/^\+(\d+(?:\.\d+)?)% Elemental Damage$/i)
  if (m) return { elementalDamagePct: Number(m[1]) }

  m = s.match(
    /^\+(\d+(?:\.\d+)?)% (Physical|Erosion|Lightning|Fire|Cold) Damage$/i,
  )
  if (m) {
    const n = Number(m[1])
    const t = m[2]!.toLowerCase()
    if (t === 'physical') return { physicalDamagePct: n }
    if (t === 'erosion') return { erosionDamagePct: n }
    if (t === 'lightning') return { lightningDamagePct: n }
    if (t === 'fire') return { fireDamagePct: n }
    if (t === 'cold') return { coldDamagePct: n }
    return null
  }

  m = s.match(/^\+(\d+(?:\.\d+)?)% damage\s+for\s+Channeled\s+Skills$/i)
  if (m) return { channeledDamagePct: Number(m[1]) }

  m = s.match(/^\+(\d+(?:\.\d+)?)% damage$/i)
  if (m) return { damagePct: Number(m[1]) }

  m = s.match(/^\+(\d+(?:\.\d+)?)% (Attack Speed|Cast Speed|Attack and Cast Speed)/i)
  if (m) return { attackSpeedPct: Number(m[1]) }

  m = s.match(/^\+(\d+(?:\.\d+)?)% Minion Attack and Cast Speed/i)
  if (m) return { attackSpeedPct: Number(m[1]) }

  m = s.match(/^\+(\d+(?:\.\d+)?)% Max Life/i)
  if (m) return { hpPct: Number(m[1]) }

  m = s.match(/^\+(\d+(?:\.\d+)?)% Max Mana/i)
  if (m) return { mpPct: Number(m[1]) }

  m = s.match(
    /^\+(\d+(?:\.\d+)?)% ((?:Attack |Spell |Minion )?Critical Strike Rating|Critical Strike Rating)/i,
  )
  if (m) return { critChancePct: Number(m[1]) }

  m = s.match(/^\+(\d+(?:\.\d+)?)% ((?:Minion )?Critical Strike Damage)/i)
  if (m) return { critDamagePct: Number(m[1]) }

  m = s.match(/^\+(\d+) Strength$/i)
  if (m) return { strength: Number(m[1]) }

  m = s.match(/^\+(\d+) Dexterity$/i)
  if (m) return { dexterity: Number(m[1]) }

  m = s.match(/^\+(\d+) Intelligence$/i)
  if (m) return { intelligence: Number(m[1]) }

  m = s.match(/^\+(\d+(?:\.\d+)?)% Elemental Resistance$/i)
  if (m) return { elementalResistancePct: Number(m[1]) }

  m = s.match(
    /^\+(\d+(?:\.\d+)?)% (Cold|Fire|Lightning|Erosion) Resistance$/i,
  )
  if (m) {
    const n = Number(m[1])
    const t = m[2]!.toLowerCase()
    if (t === 'cold') return { coldResistancePct: n }
    if (t === 'fire') return { fireResistancePct: n }
    if (t === 'lightning') return { lightningResistancePct: n }
    if (t === 'erosion') return { erosionResistancePct: n }
    return null
  }

  m = s.match(/^-(\d+) Attack Skill Cost$/i)
  if (m) return { skillCostFlat: -Number(m[1]) }

  m = s.match(/^-(\d+) Skill Cost$/i)
  if (m) return { skillCostFlat: -Number(m[1]) }

  return null
}

/** 同一行投資多階：遞增類乘階級；additional（more）每階再乘一層。 */
export function statBlocksForTalentLineAndRank(line: string, rank: number): StatBlock[] {
  const r = Math.floor(rank)
  if (!Number.isFinite(r) || r < 1) return []
  const one = parseTalentEffectLineToStatBlock(line)
  if (!one) return []
  if (one.moreDamagePct != null && one.moreDamagePct !== 0) {
    return Array.from({ length: r }, () => ({ moreDamagePct: one.moreDamagePct }))
  }
  const scaled: StatBlock = {}
  for (const [k, v] of Object.entries(one)) {
    if (v == null || typeof v !== 'number') continue
    ;(scaled as Record<string, number>)[k] = v * r
  }
  return [scaled]
}
