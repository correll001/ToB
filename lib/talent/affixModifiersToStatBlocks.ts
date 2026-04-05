import type { StatBlock } from '@/types/combat'
import type { TalentAffixModifierStub } from '@/types/talentAffix'
import { percentIncreasedDamageFromLabelZh } from '@/lib/talent/mapIncreasedDamageLabelToStatBlock'

/**
 * 將 talent-affixes 的保守 modifiers 映射到引擎 StatBlock（同種類會由 aggregateStatBlocks 加總）。
 */
export function statBlocksFromAffixModifiers(modifiers: TalentAffixModifierStub[]): StatBlock[] {
  const out: StatBlock[] = []
  for (const m of modifiers) {
    const v = m.value
    if (v == null || !Number.isFinite(v)) continue
    const label = m.labelZh

    if (m.kind === 'percent_increased') {
      const dmg = percentIncreasedDamageFromLabelZh(label, v)
      if (dmg) {
        out.push(dmg)
        continue
      }
      if (/攻擊速度|施法速度|攻擊與施法|召喚物攻擊與施法/.test(label)) {
        out.push({ attackSpeedPct: v })
        continue
      }
      if (/暴擊傷害|召喚物暴擊傷害/.test(label)) {
        out.push({ critDamagePct: v })
        continue
      }
      if (/暴擊值|暴擊/.test(label)) {
        out.push({ critChancePct: v })
        continue
      }
      if (/最大生命|生命|護盾/.test(label)) {
        out.push({ hpPct: v })
        continue
      }
      if (/最大魔力|魔力|法力/.test(label)) {
        out.push({ mpPct: v })
        continue
      }
      if (/冰冷抗性/.test(label)) {
        out.push({ coldResistancePct: v })
        continue
      }
      if (/火焰抗性/.test(label)) {
        out.push({ fireResistancePct: v })
        continue
      }
      if (/閃電抗性/.test(label)) {
        out.push({ lightningResistancePct: v })
        continue
      }
      if (/腐蝕抗性/.test(label)) {
        out.push({ erosionResistancePct: v })
        continue
      }
      if (/元素抗性/.test(label) && !/穿透/.test(label)) {
        out.push({ elementalResistancePct: v })
        continue
      }
      continue
    }

    if (m.kind === 'flat') {
      if (/力量/.test(label)) {
        out.push({ strength: v })
        continue
      }
      if (/敏捷/.test(label)) {
        out.push({ dexterity: v })
        continue
      }
      if (/智慧|智力/.test(label)) {
        out.push({ intelligence: v })
        continue
      }
      if (/攻擊技能消耗|技能消耗/.test(label)) {
        out.push({ skillCostFlat: v })
        continue
      }
    }
  }
  return out
}
