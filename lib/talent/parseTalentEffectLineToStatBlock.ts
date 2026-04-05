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
      /attack damage|damage|spell damage|physical damage|erosion damage|minion damage|base damage|sentry damage/.test(
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

  m = s.match(/^\+(\d+(?:\.\d+)?)% damage$/i)
  if (m) return { damagePct: Number(m[1]) }

  m = s.match(/^\+(\d+(?:\.\d+)?)% (Attack Damage|Spell Damage|Physical Damage|Erosion Damage|Minion Damage)/i)
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
