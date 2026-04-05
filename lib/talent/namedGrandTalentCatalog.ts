/**
 * 「具名頂級天賦」選項：來自 TLIDB 核心天賦列（比牆上傳奇格更高一層的專名能力）。
 *
 * 多數舊神系：8 位 gameDataId 第 5 碼 `1`／`2` 為階（約 12／24 點牆面），第 6 碼 `1–5` 為該排第幾個選項，
 * 與右側 5×2 格對齊（每排至多五選一）。面板 `god_XXX` 對應 `tags` 的 `deity:XXX`。
 */
import type { TalentAffixNormalized, TalentAffixNormalizedFile } from '@/types/talentAffix'
import affixJson from '@/data/normalized/ss12/talent-affixes.json'

const data = affixJson as TalentAffixNormalizedFile

const CORE = data.affixes.filter((a) => a.sourceKind === 'core_talent_node')

const BY_ID = new Map<string, TalentAffixNormalized>()
for (const a of CORE) {
  BY_ID.set(a.affixId, a)
}

/** 每排欄位數（至多五選一）。 */
export const NAMED_GRAND_COLS = 5

export const NAMED_GRAND_TALENT_SLOT_COUNT = NAMED_GRAND_COLS * 2

/** 上排／下排解鎖門檻（本盤牆面已投入天賦點）。 */
export const NAMED_GRAND_ROW_POINT_THRESHOLDS = [12, 24] as const

export type NamedGrandTalentPick = {
  affixId: string
  displayName: string
}

export const NAMED_GRAND_TALENT_PICKS: NamedGrandTalentPick[] = [...CORE]
  .map((a) => ({ affixId: a.affixId, displayName: a.displayName }))
  .sort((a, b) => a.displayName.localeCompare(b.displayName, 'zh-Hant'))

export function lookupCoreTalentAffix(affixId: string): TalentAffixNormalized | undefined {
  return BY_ID.get(affixId)
}

export function deityTagFromTalentPanelId(panelId: string): string | null {
  if (!panelId.startsWith('god_')) return null
  const rest = panelId.slice(4)
  return rest ? `deity:${rest}` : null
}

/** 8 位數 id：第 5 碼 1/2 為階、第 6 碼 1–5 為該排第幾個選項。 */
function parseEightDigitGrandGridKey(gameDataId: string | null): { tier: 1 | 2; variant: number } | null {
  if (!gameDataId || !/^\d{8}$/.test(gameDataId)) return null
  const tierCh = gameDataId[4]
  const varCh = gameDataId[5]
  if (tierCh !== '1' && tierCh !== '2') return null
  const variant = parseInt(varCh, 10)
  if (!Number.isFinite(variant) || variant < 1 || variant > NAMED_GRAND_COLS) return null
  return { tier: tierCh === '1' ? 1 : 2, variant }
}

function toPick(a: TalentAffixNormalized): NamedGrandTalentPick {
  return { affixId: a.affixId, displayName: a.displayName }
}

export type NamedGrandLayoutMode = 'perPanel' | 'legacyFlat'

export type NamedGrandLayout = {
  mode: NamedGrandLayoutMode
  /** 長度 2；每列 `NAMED_GRAND_COLS` 格，槽位 row*NAMED_GRAND_COLS+col。 */
  rows: { minPoints: number; cells: (NamedGrandTalentPick | null)[] }[]
  /** legacyFlat：每格共用此清單（仍為 deity 篩選後）。 */
  legacyOptions?: NamedGrandTalentPick[]
}

const emptyGrandRow = (): (NamedGrandTalentPick | null)[] =>
  Array.from({ length: NAMED_GRAND_COLS }, () => null)

/** 舊版 6 槽（上排 3 + 下排 3）→ 新 10 槽（5+5）；其餘長度截斷或補滿。 */
export function normalizeNamedGrandAffixSlots(raw: unknown): (string | null)[] {
  const out: (string | null)[] = Array.from({ length: NAMED_GRAND_TALENT_SLOT_COUNT }, () => null)
  const trim = (x: unknown): string | null =>
    typeof x === 'string' && x.trim() !== '' ? x.trim() : null

  if (!Array.isArray(raw)) return out

  if (raw.length <= 6) {
    for (let j = 0; j < 3 && j < raw.length; j++) out[j] = trim(raw[j])
    for (let j = 3; j < 6 && j < raw.length; j++) out[NAMED_GRAND_COLS + (j - 3)] = trim(raw[j])
    return out
  }

  for (let j = 0; j < NAMED_GRAND_TALENT_SLOT_COUNT && j < raw.length; j++) out[j] = trim(raw[j])
  return out
}

function coreTalentsForDeity(deityTag: string): TalentAffixNormalized[] {
  return CORE.filter((a) => a.tags.includes(deityTag))
}

/**
 * 右側具名頂級格版面：依神系與 TLIDB id 對齊 12／24 點兩排（每排至多五選一）；無法解析時退回舊版扁平下拉。
 */
export function namedGrandLayoutForPanel(panelId: string): NamedGrandLayout {
  const deityTag = deityTagFromTalentPanelId(panelId)
  const emptyRows: NamedGrandLayout['rows'] = [
    { minPoints: NAMED_GRAND_ROW_POINT_THRESHOLDS[0], cells: emptyGrandRow() },
    { minPoints: NAMED_GRAND_ROW_POINT_THRESHOLDS[1], cells: emptyGrandRow() },
  ]

  if (!deityTag) {
    return { mode: 'legacyFlat', rows: emptyRows, legacyOptions: NAMED_GRAND_TALENT_PICKS }
  }

  const tagged = coreTalentsForDeity(deityTag)
  if (tagged.length === 0) {
    return { mode: 'legacyFlat', rows: emptyRows, legacyOptions: NAMED_GRAND_TALENT_PICKS }
  }

  const row0: (NamedGrandTalentPick | null)[] = emptyGrandRow()
  const row1: (NamedGrandTalentPick | null)[] = emptyGrandRow()
  let placedFromKey = 0
  for (const a of tagged) {
    const key = parseEightDigitGrandGridKey(a.gameDataId)
    if (!key) continue
    const row = key.tier === 1 ? row0 : row1
    const col = key.variant - 1
    if (row[col] == null) {
      row[col] = toPick(a)
      placedFromKey++
    }
  }

  if (placedFromKey > 0) {
    return {
      mode: 'perPanel',
      rows: [
        { minPoints: NAMED_GRAND_ROW_POINT_THRESHOLDS[0], cells: row0 },
        { minPoints: NAMED_GRAND_ROW_POINT_THRESHOLDS[1], cells: row1 },
      ],
    }
  }

  const orphans = tagged
    .filter((a) => !parseEightDigitGrandGridKey(a.gameDataId))
    .sort((a, b) => {
      const na = parseInt(String(a.gameDataId ?? ''), 10)
      const nb = parseInt(String(b.gameDataId ?? ''), 10)
      if (Number.isFinite(na) && Number.isFinite(nb) && na !== nb) return na - nb
      return a.sourceOrderIndex - b.sourceOrderIndex
    })

  if (orphans.length > 0) {
    const next: [(NamedGrandTalentPick | null)[], (NamedGrandTalentPick | null)[]] = [
      emptyGrandRow(),
      emptyGrandRow(),
    ]
    const cap = NAMED_GRAND_TALENT_SLOT_COUNT
    for (let i = 0; i < cap && i < orphans.length; i++) {
      next[Math.floor(i / NAMED_GRAND_COLS)][i % NAMED_GRAND_COLS] = toPick(orphans[i]!)
    }
    return {
      mode: 'perPanel',
      rows: [
        { minPoints: NAMED_GRAND_ROW_POINT_THRESHOLDS[0], cells: next[0] },
        { minPoints: NAMED_GRAND_ROW_POINT_THRESHOLDS[1], cells: next[1] },
      ],
    }
  }

  const legacyOptions = tagged
    .map((a) => toPick(a))
    .sort((a, b) => a.displayName.localeCompare(b.displayName, 'zh-Hant'))

  return { mode: 'legacyFlat', rows: emptyRows, legacyOptions }
}
