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
  if (!reason) return '沒套用（原因未註記）。'
  if (reason === 'link_disabled') return '這格連結關著，不會算進去。'
  if (reason === 'not_support_family') return '這顆不是輔助技能，略過。'
  if (reason === 'main_skill_disabled') return '主技能關閉，輔助不生效。'
  if (reason === 'unsupported_main_family') return '主技能類型不支援這種連結計算。'
  if (reason === 'not_in_engine_instance') return '主技能尚未建立計算資料，無法判斷輔助。'
  if (reason.startsWith('forbidden_tag:')) {
    return `與主技能類型不合（${reason.slice('forbidden_tag:'.length)}）。`
  }
  if (reason.startsWith('allowedSkillTags_unsatisfied:')) {
    const rest = reason.replace('allowedSkillTags_unsatisfied:', '')
    return `主技能缺必要標籤，需要其一：${rest}`
  }
  if (reason === 'requires_attack') return '需要攻擊類主技能。'
  if (reason === 'requires_spell') return '需要法術類主技能。'
  if (reason === 'requires_projectile') return '需要投射物類主技能。'
  if (reason === 'requires_channeled') return '需要引導類主技能。'
  if (reason === 'requires_melee') return '需要近戰類主技能。'
  return `沒套用（${reason}）`
}
