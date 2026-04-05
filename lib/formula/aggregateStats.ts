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
    spellDamagePct: 0,
    attackDamagePct: 0,
    meleeDamagePct: 0,
    projectileDamagePct: 0,
    physicalDamagePct: 0,
    erosionDamagePct: 0,
    fireDamagePct: 0,
    lightningDamagePct: 0,
    coldDamagePct: 0,
    elementalDamagePct: 0,
    dotDamagePct: 0,
    minionDamagePct: 0,
    minionFireDamagePct: 0,
    minionLightningDamagePct: 0,
    minionColdDamagePct: 0,
    minionErosionDamagePct: 0,
    minionPhysicalDamagePct: 0,
    channeledDamagePct: 0,
    weaponDamageEffectivenessPct: 0,
    moreDamageMult: 1,
    critChancePct: 0,
    critDamagePct: 0,
    coldResistancePct: 0,
    fireResistancePct: 0,
    lightningResistancePct: 0,
    erosionResistancePct: 0,
    elementalResistancePct: 0,
    skillCostFlat: 0,
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
    out.spellDamagePct += b.spellDamagePct ?? 0
    out.attackDamagePct += b.attackDamagePct ?? 0
    out.meleeDamagePct += b.meleeDamagePct ?? 0
    out.projectileDamagePct += b.projectileDamagePct ?? 0
    out.physicalDamagePct += b.physicalDamagePct ?? 0
    out.erosionDamagePct += b.erosionDamagePct ?? 0
    out.fireDamagePct += b.fireDamagePct ?? 0
    out.lightningDamagePct += b.lightningDamagePct ?? 0
    out.coldDamagePct += b.coldDamagePct ?? 0
    out.elementalDamagePct += b.elementalDamagePct ?? 0
    out.dotDamagePct += b.dotDamagePct ?? 0
    out.minionDamagePct += b.minionDamagePct ?? 0
    out.minionFireDamagePct += b.minionFireDamagePct ?? 0
    out.minionLightningDamagePct += b.minionLightningDamagePct ?? 0
    out.minionColdDamagePct += b.minionColdDamagePct ?? 0
    out.minionErosionDamagePct += b.minionErosionDamagePct ?? 0
    out.minionPhysicalDamagePct += b.minionPhysicalDamagePct ?? 0
    out.channeledDamagePct += b.channeledDamagePct ?? 0
    out.weaponDamageEffectivenessPct += b.weaponDamageEffectivenessPct ?? 0
    out.critChancePct += b.critChancePct ?? 0
    out.critDamagePct += b.critDamagePct ?? 0
    out.coldResistancePct += b.coldResistancePct ?? 0
    out.fireResistancePct += b.fireResistancePct ?? 0
    out.lightningResistancePct += b.lightningResistancePct ?? 0
    out.erosionResistancePct += b.erosionResistancePct ?? 0
    out.elementalResistancePct += b.elementalResistancePct ?? 0
    out.skillCostFlat += b.skillCostFlat ?? 0
    const m = b.moreDamagePct
    if (m != null && m !== 0) {
      out.moreDamageMult *= 1 + m / 100
    }
  }

  return out
}
