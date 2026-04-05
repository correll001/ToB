/**
 * 將 TLI 英文效果行轉成可讀中文（詞組替換 + 高頻整句對照）。
 * 不再附帶整段「（原文：…）」；少數未覆蓋處可能殘留英文，由 backlog 掃描補片語。
 */
import { TALENT_EFFECT_LINE_PHRASES_EXTRA } from '@/lib/talent/talentEffectLinePhrasesExtra'

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
  '+9% Damage Over Time': '+9% 持續傷害',
  '+3% Defense': '+3% 防禦值',
  '+6% Defense': '+6% 防禦值',
  '+9% Minion Fire Damage': '+9% 召喚物火焰傷害',
  '+18% Minion Fire Damage': '+18% 召喚物火焰傷害',
  '+9% Minion Erosion Damage': '+9% 召喚物腐蝕傷害',
  '+9% Fire Damage': '+9% 火焰傷害',
  '+9% Lightning Damage': '+9% 閃電傷害',
  '+9% Cold Damage': '+9% 冰冷傷害',
  '+9% Elemental Damage': '+9% 元素傷害',
  '+18% Elemental Damage': '+18% 元素傷害',
  'Upon inflicting damage, penetrates 3% of Elemental Resistance for each type of Elemental Ailment the enemy has':
    '造成傷害時，敵人每有一種元素異常狀態，傷害穿透 3% 元素抗性',
  'Damage Penetrates 1.5% Elemental Resistance': '傷害穿透 1.5% 元素抗性',
  '+2% Skill Effect Duration': '+2% 技能效果持續時間',
  '+2% Elemental Resistance': '+2% 元素抗性',
  '+12% Sentry Damage': '+12% 哨衛傷害',
  '+9% Projectile Damage': '+9% 投射物傷害',
  '+9% Melee Damage': '+9% 近戰傷害',
  '+18% Melee Damage': '+18% 近戰傷害',
  '+7% Barrier Shield': '+7% 屏障吸收量',
  '+8% Barrier Shield': '+8% 屏障吸收量',
  '+14% Barrier Shield': '+14% 屏障吸收量',
  '+16% Barrier Shield': '+16% 屏障吸收量',
  '+24% Sentry Damage': '+24% 哨衛傷害',
  '+18% Fire Damage': '+18% 火焰傷害',
  '+18% Projectile Damage': '+18% 投射物傷害',
  '4.5% Projectile Damage': '4.5% 投射物傷害',
  '+8% Injury Buffer if you have triggered Life Regain in the last 8s':
    '+8% 傷害緩衝（過去 8 秒內曾觸發生命回復）',
  '+1 to Max Channeled Stacks': '+1 最大引導層數',
  "+1 to All Skills' Levels": '+1 全技能等級',
  '+1 Jumps': '+1 跳躍次數',
  '+1 Max Charges': '+1 最大充能',
  '+1 Max Spell Burst': '+1 最大法術爆發',
  '+3 Defensive Skill Level': '+3 防禦技能等級',
  '+4 to the minimum number of enemies affected by Warcry': '+4 戰吼最少影響敵人數',
  '+5 to All Stats': '+5 全屬性',
  '+10 to All Stats': '+10 全屬性',
  '+75 Max Energy Shield': '+75 最大能量護盾',
  'Minions are immune to Cold Damage': '召喚物免疫冰冷傷害',
  'Minions are immune to Freeze and Frozen': '召喚物免疫冰結和冰封',
}

const BASE_PHRASES: Array<[string, string]> = [
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
  ['Elemental Damage', '元素傷害'],
  ['Elemental Ailment', '元素異常狀態'],
  ['Elemental Ailments', '元素異常狀態'],
  ['Elemental Resistance', '元素抗性'],
  ['Damage Penetrates', '傷害穿透'],
  ['Erosion Damage', '腐蝕傷害'],
  ['Tangle Damage', '纏繞傷害'],
  ['Minion Damage', '召喚物傷害'],
  ['Minion Lightning Damage', '召喚物閃電傷害'],
  ['Minion Cold Damage', '召喚物冰冷傷害'],
  ['Minion Fire Damage', '召喚物火焰傷害'],
  ['Projectile Damage', '投射物傷害'],
  ['Lightning Damage', '閃電傷害'],
  ['Cold Damage', '冰冷傷害'],
  ['Cold Resistance', '冰冷抗性'],
  ['Fire Damage', '火焰傷害'],
  ['Barrier Shield', '屏障吸收量'],
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

/** 長片語先替換，避免短詞破壞長句結構。 */
const PHRASES_SORTED: Array<[string, string]> = [...BASE_PHRASES, ...TALENT_EFFECT_LINE_PHRASES_EXTRA].sort(
  (a, b) => b[0].length - a[0].length,
)

/** +1 XXX Skill Level（單行） */
const PLUS_ONE_SKILL_LEVEL_ZH: Record<string, string> = {
  Fire: '火焰',
  Cold: '冰冷',
  Lightning: '閃電',
  Erosion: '腐蝕',
  Spell: '法術',
  Attack: '攻擊',
  Physical: '物理',
  Minion: '召喚物',
  Passive: '被動',
  Persistent: '持續',
  Focus: '專注',
  Empower: '增幅',
  'Spirit Magus': '魔導精靈',
  'Synthetic Troop': '合成部隊',
}

function applyPlusOneSkillLevelLine(s: string): string {
  const m = s.match(/^\+1 ([A-Za-z][A-Za-z ]*?) Skill Level$/)
  if (!m) return s
  const key = m[1]!.trim()
  const zh = PLUS_ONE_SKILL_LEVEL_ZH[key]
  if (!zh) return s
  return `+1 ${zh}技能等級`
}

/** 譯後仍含連續英文字母（或舊版「原文」尾綴）→ 疑為可補 EXACT/PHRASE 的 bridge 缺口。 */
export function translationBridgeLikelyForEffectLines(lines: string[] | undefined): boolean {
  if (!lines?.length) return false
  return lines.some((en) => {
    const zh = translateTalentEffectLineEnToZh(en)
    if (zh.includes('（原文：')) return true
    return /[A-Za-z]{4,}/.test(zh)
  })
}

export function translateTalentEffectLineEnToZh(en: string): string {
  const t = en.trim()
  if (!t) return t
  const hit = EXACT_LINE_ZH[t]
  if (hit) return hit

  let s = applyPlusOneSkillLevelLine(t)

  for (const [eng, zhPhrase] of PHRASES_SORTED) {
    if (eng.length === 0) continue
    s = s.split(eng).join(zhPhrase)
  }

  return s
}

export function effectLinesToZh(lines: string[] | undefined): string[] {
  if (!lines?.length) return []
  return lines.map(translateTalentEffectLineEnToZh)
}
