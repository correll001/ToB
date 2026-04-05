import type { TalentTreePanelMessages } from '@/lib/i18n/locales/zh-Hant/talentTreePanel'
import { talentTreePanelZh } from '@/lib/i18n/locales/zh-Hant/talentTreePanel'

/** 應用程式介面語系；新增語系時擴充此聯集並註冊 catalog。 */
export type AppLocale = 'zh-Hant'

const talentTreePanelByLocale: Record<AppLocale, TalentTreePanelMessages> = {
  'zh-Hant': talentTreePanelZh,
}

export function tTalentTreePanel(locale: AppLocale = 'zh-Hant'): TalentTreePanelMessages {
  return talentTreePanelByLocale[locale]
}
