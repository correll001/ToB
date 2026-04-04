/**
 * Player-facing lines for support link rows (skill-local only).
 */
import type { ModifierDefinition } from '@/types/skillData'

const STAT_LABEL_ZH: Record<string, string> = {
  'damage.increased': '傷害（增加%）',
  'damage.more': '傷害（更多%）',
  'skill.baseDamageFlat': '技能基礎傷害（flat）',
  'skill.addedBaseDamage': '附加點傷',
  'skill.weaponDamagePct': '武器傷害係數',
  'skill.manaCost': '魔耗',
  'skill.cooldownSec': '冷卻時間',
  'skill.castTimeSec': '施放時間',
  'skill.attackSpeed': '攻擊速度',
  'skill.castSpeed': '施放速度',
  'skill.attackSpeedIncreased': '攻擊速度（增加%）',
  'skill.castSpeedIncreased': '施放速度（增加%）',
  projectileCount: '投射物數量',
  'area.radius': '範圍／半徑',
  'area.angle': '範圍角度',
}

/** Registry key → short Chinese for delta lines. */
export function skillLocalStatLabelZh(stat: string): string {
  if (stat.endsWith(':moreProduct')) return `更多乘區（${stat.replace(/:moreProduct$/, '')}）`
  return STAT_LABEL_ZH[stat] ?? stat
}

function statLabel(stat: string): string {
  return skillLocalStatLabelZh(stat)
}

function operationPhrase(m: ModifierDefinition): string {
  const v = m.value
  const num = typeof v === 'number' && Number.isFinite(v) ? v : String(v)
  if (m.operation === 'add') return `+${num}`
  if (m.operation === 'override') return `設為 ${num}`
  if (m.operation === 'mul') {
    if (m.valueKind === 'more') return `更多 ${num}%`
    if (m.valueKind === 'increased' || m.stat.includes('increased')) return `增加 ${num}%`
    return `×${num}`
  }
  return `${m.operation} ${num}`
}

/** One line per modifier for support summary (not global build). */
export function formatSupportModifierSummaryLine(m: ModifierDefinition): string {
  const head = statLabel(m.stat)
  const tail = operationPhrase(m)
  const id = m.id ? `（${m.id}）` : ''
  return `${head}${id}：${tail}`
}

export function summarizeSupportModifierList(mods: ModifierDefinition[]): {
  lines: string[]
  statKeys: string[]
} {
  const keys = new Set<string>()
  const lines: string[] = []
  for (const m of mods) {
    keys.add(m.stat)
    const line = formatSupportModifierSummaryLine(m)
    if (!lines.includes(line)) lines.push(line)
  }
  return { lines, statKeys: [...keys].sort((a, b) => a.localeCompare(b, 'en')) }
}

/** Map engine skip tokens to short Chinese for players. */
export function formatSupportSkipReasonZh(reason: string | undefined): string {
  if (!reason) return '未套用（原因未標註）。'
  if (reason === 'link_disabled') return '此連結在編輯器中停用，引擎未計算。'
  if (reason === 'not_support_family') return '此槽不是輔助技能資料，引擎略過。'
  if (reason === 'main_skill_disabled') return '主技能已停用，未計算輔助套用。'
  if (reason === 'unsupported_main_family') return '主技能類型不支援技能 instance：未計算輔助套用。'
  if (reason === 'not_in_engine_instance') return '主技能 instance 未建立，無法評估輔助。'
  if (reason.startsWith('forbidden_tag:')) {
    return `與主技能標籤衝突（禁止：${reason.slice('forbidden_tag:'.length)}）。`
  }
  if (reason.startsWith('allowedSkillTags_unsatisfied:')) {
    const rest = reason.replace('allowedSkillTags_unsatisfied:', '')
    return `未滿足輔助所需技能標籤（需要其中之一：${rest}）。`
  }
  if (reason === 'requires_attack') return '需要「攻擊 Attack」類主技能。'
  if (reason === 'requires_spell') return '需要「法術 Spell」類主技能。'
  if (reason === 'requires_projectile') return '需要「投射物 Projectile」標籤。'
  if (reason === 'requires_channeled') return '需要「引導 Channeled」標籤。'
  if (reason === 'requires_melee') return '需要「近戰 Melee」標籤。'
  return `未套用：${reason}`
}
