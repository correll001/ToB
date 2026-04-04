/**
 * Skill Setup — player-facing copy only (no data / formula logic).
 */
import type { SkillFamily } from '@/types/skillData'

/** Single reminder: local skill row vs global build panel. */
export const SKILL_SETUP_SCOPE_HINT =
  '此頁只看「目前預覽的這顆主技能與連結」；全身總傷害與最終結論請以左側面板為準。'

export const SKILL_SETUP_PAGE_TITLE = '技能與連結'

export const SKILL_SETUP_SECTION_SKILL_SUMMARY = '技能摘要'
export const SKILL_SETUP_SECTION_SUPPORT_RESULTS = '輔助套用結果'
export const SKILL_SETUP_SECTION_CONTRIBUTION_FLOW = '加成怎麼疊上去'
export const SKILL_SETUP_SECTION_ADVANCED = '進階詳情'

export function skillFamilyUiLabel(family: SkillFamily): string {
  switch (family) {
    case 'active':
      return '主動'
    case 'support':
      return '輔助'
    case 'passive':
      return '被動'
    default:
      return family
  }
}

/** Editor-only badges from passiveMechanicalBadges() → player chips. */
export function passiveMechanicalBadgePlayerLabel(raw: string): string {
  const map: Record<string, string> = {
    '非 passive 族': '非被動類型',
    aura: '光環向',
    utility: '工具向',
    'support-only': '僅輔助',
  }
  return map[raw] ?? raw
}

export const SKILL_SETUP_PASSIVE_SECTION_TITLE = '被動與光環'
export const SKILL_SETUP_PASSIVE_SECTION_BLURB =
  '只有「被動」類技能會加進主技能；下列標籤來自資料庫。'

export const SKILL_SETUP_TAGS_LABEL = '標籤'
export const SKILL_SETUP_NO_TAGS = '資料裡沒有標籤列表。'

export const SKILL_SETUP_FAILED_SKILL_NOTE =
  '此技能資料讀取異常，下方數字與相容結果可能與遊戲不一致。'

export const SKILL_SETUP_SLOT_DISABLED_NOTE = '此槽已關閉，不參與計算與左側統計。'

export const SKILL_SETUP_COMBAT_ROLE_LABEL = '戰鬥定位'

export function skillSetupNormWarningsHint(count: number): string {
  return `有 ${count} 則資料提醒 · 請展開下方「進階詳情」`
}

/** `inferSkillCombatRole` string → short zh (presentation only). */
export function inferredCombatRoleZh(role: string | null | undefined): string {
  switch (role) {
    case 'damaging':
      return '輸出'
    case 'support-only':
      return '輔助專用'
    case 'aura-only':
      return '光環'
    case 'utility':
      return '功能'
    case 'summon-driver':
      return '召喚／圖騰'
    case 'unknown':
      return '未分類'
    default:
      return role ?? '—'
  }
}
