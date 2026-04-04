/**
 * Flat talent / god-panel affix dictionary (content layer only).
 * No tree coordinates, edges, or in-game panel topology — see docs/talent-affixes/.
 */

/** Which TLIDB Talent tab the row was scraped from. */
export type TalentAffixSourceTab = 'profession' | 'core_talent' | 'talent_tree'

/** High-level origin of the row on the wiki page. */
export type TalentAffixSourceKind =
  | 'profession_overview'
  | 'core_talent_node'
  | 'talent_tree_node'

/**
 * Where this affix can appear in the game (best-effort from page text only).
 * Use `unresolved` when the flat list does not justify a stronger claim.
 */
export type TalentAffixAvailability =
  | 'talent_tree'
  | 'core_talent'
  | 'profession_meta'
  | 'new_god_related'
  | 'god_grid_cap_hint'
  | 'slate_related_hint'
  | 'unresolved'

/** Optional structured modifier stub — only when parsed with conservative rules. */
export type TalentAffixModifierStub = {
  kind: 'percent_increased' | 'flat' | 'unknown'
  /** Numeric magnitude when parsed; omit if unknown. */
  value?: number
  /** Free-text stat / scope label from the source line (not a game stat key). */
  labelZh: string
  /** Original substring that produced this stub. */
  rawSnippet: string
}

export type TalentAffixRawSnapshotEntry = {
  sourceOrderIndex: number
  sourceTab: TalentAffixSourceTab
  sourceTabLabel: string
  /** TLIDB numeric id when present on the name span. */
  gameDataId: string | null
  rawDisplayName: string
  rawBodyText: string
  rawBodyHtml: string
  iconUrl: string | null
  iconAlt: string | null
  /** First deity / profession link in the row (href basename, e.g. New_God). */
  deityOrProfessionHref: string | null
  deityOrProfessionLabel: string | null
  sourceUrl: string
}

export type TalentAffixRawSnapshotFile = {
  schemaVersion: 1
  sourceUrl: string
  fetchedAt: string
  locale: 'tw'
  season: string
  entryCount: number
  entries: TalentAffixRawSnapshotEntry[]
}

export type TalentAffixNormalized = {
  affixId: string
  displayName: string
  descriptionLines: string[]
  rawText: string
  iconUrl: string | null
  sourceUrl: string
  sourceKind: TalentAffixSourceKind
  sourceTab: TalentAffixSourceTab
  /** TLIDB row id when present. */
  gameDataId: string | null
  /** Original scrape order within the whole page (0-based). */
  sourceOrderIndex: number
  availability: TalentAffixAvailability[]
  newGodOnly: boolean
  /** Text mentions 神格生效上限 (slate / god-grid cap); no layout implied. */
  godGridEffectCapHint: boolean
  /** Heuristic: body text mentions 石板. */
  slateMentionHint: boolean
  talentTreeRow: boolean
  coreTalentRow: boolean
  professionRow: boolean
  /** Always empty in v1 — reserved for manual panel mapping later. */
  panelHints: string[]
  tags: string[]
  notes: string[]
  modifiersText: string | null
  modifiers: TalentAffixModifierStub[]
}

export type TalentAffixNormalizedFile = {
  schemaVersion: 1
  season: string
  sourceUrl: string
  generatedAt: string
  affixCount: number
  affixes: TalentAffixNormalized[]
}
