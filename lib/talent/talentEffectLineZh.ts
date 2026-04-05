/**
 * 將 TLI 英文效果行轉成可讀中文（詞組替換 + 高頻整句對照）。
 * 未覆蓋處保留譯後片段並附原文，避免誤導。
 */

const EXACT_LINE_ZH: Record<string, string> = {
  '+2% Max Life': '+2% 最大生命',
  '+3% Max Life': '+3% 最大生命',
  '+4% Max Life': '+4% 最大生命',
  '+6% Max Life': '+6% 最大生命',
  '+8% Max Life': '+8% 最大生命',
  '+3% Max Energy Shield': '+3% 最大能量護盾',
  '+6% Max Energy Shield': '+6% 最大能量護盾',
  '+9% damage': '+9% 傷害',
  '+18% damage': '+18% 傷害',
  '+3% Attack and Cast Speed': '+3% 攻擊與施法速度',
  '+6% Attack and Cast Speed': '+6% 攻擊與施法速度',
  '+15% Critical Strike Rating': '+15% 暴擊值',
  '+20% Critical Strike Rating': '+20% 暴擊值',
  '1.5% Life Regain': '1.5% 生命回復',
  '+9% Minion Damage': '+9% 召喚物傷害',
  '1.5% Energy Shield Regain': '1.5% 能量護盾回復',
  '+3% Life Regain': '+3% 生命回復',
  '+5% Critical Strike Damage': '+5% 暴擊傷害',
  '-4 Skill Cost': '-4 技能消耗',
  '+3% Energy Shield Regain': '+3% 能量護盾回復',
  '+6% Minion Attack and Cast Speed': '+6% 召喚物攻擊與施法速度',
  '+4% Max Mana': '+4% 最大魔力',
  '+3% Minion Attack and Cast Speed': '+3% 召喚物攻擊與施法速度',
  '+6% Projectile Speed': '+6% 投射物速度',
  '+12% Projectile Speed': '+12% 投射物速度',
  '+15% Minion Critical Strike Rating': '+15% 召喚物暴擊值',
  '+9% Attack Damage': '+9% 攻擊傷害',
  '+18% Attack Damage': '+18% 攻擊傷害',
  '+9% Erosion Damage': '+9% 腐蝕傷害',
  '+20% Minion Critical Strike Rating': '+20% 召喚物暴擊值',
  '+2% Movement Speed': '+2% 移動速度',
  '+6% Attack Speed': '+6% 攻擊速度',
  '+6% Skill Area': '+6% 技能範圍',
  '+12% Skill Area': '+12% 技能範圍',
  '+7% Evasion': '+7% 閃避',
  '+8% Max Mana': '+8% 最大魔力',
  '+2% Attack Block Chance': '+2% 攻擊格擋機率',
  '+4% Attack Block Chance': '+4% 攻擊格擋機率',
  '+4% Spell Block Chance': '+4% 法術格擋機率',
  '+18% Minion Damage': '+18% 召喚物傷害',
  '+5% Minion Critical Strike Damage': '+5% 召喚物暴擊傷害',
  '+4% Movement Speed': '+4% 移動速度',
  '+3% Attack Speed': '+3% 攻擊速度',
  '+1 to Attack Skill Level': '+1 攻擊技能等級',
  '-4 Attack Skill Cost': '-4 攻擊技能消耗',
  '+3% Attack Speed': '+3% 攻擊速度',
  '+6% Attack Speed': '+6% 攻擊速度',
  '+1 to Max Tenacity Blessing Stacks': '+1 堅韌祝福最大層數',
  '+1 to Max Agility Blessing Stacks': '+1 敏捷祝福最大層數',
  '+1 to Max Focus Blessing Stacks': '+1 專注祝福最大層數',
  '+1 Spell Skill Level': '+1 法術技能等級',
  '+1 Physical Skill Level': '+1 物理技能等級',
  '+10% Attack Critical Strike Rating': '+10% 攻擊暴擊值',
  '+20% Attack Critical Strike Rating': '+20% 攻擊暴擊值',
  '+40% Attack Critical Strike Rating': '+40% 攻擊暴擊值',
  '+40% Spell Critical Strike Rating': '+40% 法術暴擊值',
  '+15% Spell Critical Strike Rating': '+15% 法術暴擊值',
  '+20% Spell Critical Strike Rating': '+20% 法術暴擊值',
  '+9% Spell Damage': '+9% 法術傷害',
  '+9% Physical Damage': '+9% 物理傷害',
  '+18% Physical Damage': '+18% 物理傷害',
}

const PHRASES: Array<[string, string]> = [
  ['Attack Critical Strike Rating', '攻擊暴擊值'],
  ['Spell Critical Strike Rating', '法術暴擊值'],
  ['Minion Critical Strike Rating', '召喚物暴擊值'],
  ['Minion Critical Strike Damage', '召喚物暴擊傷害'],
  ['Minion Attack and Cast Speed', '召喚物攻擊與施法速度'],
  ['Attack and Cast Speed', '攻擊與施法速度'],
  ['Critical Strike Damage', '暴擊傷害'],
  ['Critical Strike Rating', '暴擊值'],
  ['Tenacity Blessing Duration', '堅韌祝福持續時間'],
  ['Tenacity Blessing Stacks', '堅韌祝福層數'],
  ['Agility Blessing', '敏捷祝福'],
  ['Focus Blessing', '專注祝福'],
  ['Attack Damage', '攻擊傷害'],
  ['Spell Damage', '法術傷害'],
  ['Physical Damage', '物理傷害'],
  ['Erosion Damage', '腐蝕傷害'],
  ['Tangle Damage', '纏繞傷害'],
  ['Minion Damage', '召喚物傷害'],
  ['Skill Area', '技能範圍'],
  ['Projectile Speed', '投射物速度'],
  ['Movement Speed', '移動速度'],
  ['Attack Speed', '攻擊速度'],
  ['Cast Speed', '施法速度'],
  ['Energy Shield Regain', '能量護盾回復'],
  ['Energy Shield', '能量護盾'],
  ['Max Energy Shield', '最大能量護盾'],
  ['Life Regeneration Speed', '生命再生速度'],
  ['Life Regain', '生命回復'],
  ['Max Life', '最大生命'],
  ['Max Mana', '最大魔力'],
  ['Skill Cost', '技能消耗'],
  ['Spell Block Chance', '法術格擋機率'],
  ['Attack Block Chance', '攻擊格擋機率'],
  ['Warcry Cooldown Recovery Speed', '戰吼冷卻回復速度'],
  ['Spell Burst Charge Speed', '法術爆發蓄能速度'],
  ['additional Attack Damage', '額外攻擊傷害'],
  ['additional Cast Speed', '額外施法速度'],
  ['additional Attack Speed', '額外攻擊速度'],
  ['Evasion', '閃避'],
  ['Armor', '護甲'],
  ['Strength', '力量'],
  ['Dexterity', '敏捷'],
  ['Intelligence', '智慧'],
  ['damage', '傷害'],
  ['Skill Level', '技能等級'],
  ['Stacks', '層數'],
  ['Duration', '持續時間'],
]

export function translateTalentEffectLineEnToZh(en: string): string {
  const t = en.trim()
  if (!t) return t
  const hit = EXACT_LINE_ZH[t]
  if (hit) return hit

  let s = t
  for (const [eng, zh] of PHRASES) {
    s = s.split(eng).join(zh)
  }

  if (/[a-zA-Z]{3,}/.test(s)) {
    return `${s}（原文：${t}）`
  }
  return s
}

export function effectLinesToZh(lines: string[] | undefined): string[] {
  if (!lines?.length) return []
  return lines.map(translateTalentEffectLineEnToZh)
}
