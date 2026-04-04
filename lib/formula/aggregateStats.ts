import type { AggregatedBuckets, StatBlock } from '@/types/combat'

/** Fold many StatBlock into one bucket (additive % + multiplicative more). */
export function aggregateStatBlocks(blocks: StatBlock[]): AggregatedBuckets {
  const out: AggregatedBuckets = {
    strength: 0,
    dexterity: 0,
    intelligence: 0,
    hpFlat: 0,
    hpPct: 0,
    mpFlat: 0,
    mpPct: 0,
    attackSpeedPct: 0,
    baseDamageFlat: 0,
    damagePct: 0,
    moreDamageMult: 1,
    critChancePct: 0,
    critDamagePct: 0,
  }

  for (const b of blocks) {
    out.strength += b.strength ?? 0
    out.dexterity += b.dexterity ?? 0
    out.intelligence += b.intelligence ?? 0
    out.hpFlat += b.hpFlat ?? 0
    out.hpPct += b.hpPct ?? 0
    out.mpFlat += b.mpFlat ?? 0
    out.mpPct += b.mpPct ?? 0
    out.attackSpeedPct += b.attackSpeedPct ?? 0
    out.baseDamageFlat += b.baseDamageFlat ?? 0
    out.damagePct += b.damagePct ?? 0
    out.critChancePct += b.critChancePct ?? 0
    out.critDamagePct += b.critDamagePct ?? 0
    const m = b.moreDamagePct
    if (m != null && m !== 0) {
      out.moreDamageMult *= 1 + m / 100
    }
  }

  return out
}
