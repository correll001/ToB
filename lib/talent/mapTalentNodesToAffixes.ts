/**
 * Deterministic talent-panel node → talent-affixes mapping (no displayName guessing).
 *
 * Layers:
 * 1) Panel deity tag (`deity:{Panel}`) scopes affix candidates.
 * 2) Primary pool: `sourceKind === 'talent_tree_node'`.
 * 3) Normalized text: node `effectLines` → zh (translateTalentEffectLineEnToZh) → each line must
 *    appear in normalized affix haystack (rawText + descriptionLines).
 * 4) If 0 tree matches, secondary pool: `core_talent_node` (same rules) → confidence `normalized_text_core_talent`.
 * 5) If multiple tree matches, retry with haystack = modifiersText only; unique → `constrained_fallback_unique`.
 * 6) Else unresolved with explicit reason codes.
 */
import { translateTalentEffectLineEnToZh } from '@/lib/talent/talentEffectLineZh'
import type { TalentAffixNormalized } from '@/types/talentAffix'
import type {
  TalentPanelNode,
  TalentPanelNodeMappingConfidence,
} from '@/types/talentPanel'

export const TALENT_NODE_AFFIX_MAPPING_PROVENANCE = 'mapTalentNodesToAffixes:v1'

export type TalentNodeAffixMatchResult = {
  mappingStatus: 'resolved' | 'unresolved'
  affixId?: string
  affixGameDataId?: string | null
  affixSourceTab?: 'talent_tree' | 'core_talent' | null
  mappingConfidence?: TalentPanelNodeMappingConfidence | null
  unresolvedReason?: string | null
  /** 除錯：候選 affixId 列表（僅 verify / report） */
  debugCandidateAffixIds?: string[]
}

function stripTrailingOriginalParen(zh: string): string {
  const idx = zh.indexOf('（原文：')
  if (idx >= 0) return zh.slice(0, idx).trim()
  return zh.trim()
}

/** 與比對用：去 <br>、NFKC、去空白。 */
export function normalizeTextForAffixMatch(s: string): string {
  return s
    .replace(/<br\s*\/?>/gi, ' ')
    .normalize('NFKC')
    .replace(/\s+/g, '')
    .toLowerCase()
}

function haystackPrimary(a: TalentAffixNormalized): string {
  return normalizeTextForAffixMatch([a.rawText, ...a.descriptionLines].join('\n'))
}

function haystackModifiers(a: TalentAffixNormalized): string {
  return normalizeTextForAffixMatch(a.modifiersText ?? '')
}

export function deityTagFromPanelId(panelId: string): string {
  return `deity:${panelId.replace(/^god_/, '')}`
}

function nodeEffectNeedles(node: TalentPanelNode): string[] {
  const lines = node.effectLines ?? []
  return lines.map((line) =>
    normalizeTextForAffixMatch(stripTrailingOriginalParen(translateTalentEffectLineEnToZh(line))),
  )
}

function affixMatchesNeedles(a: TalentAffixNormalized, needles: string[], hay: string): boolean {
  if (needles.length === 0) return false
  return needles.every((n) => n.length > 0 && hay.includes(n))
}

function filterByNeedles(
  pool: TalentAffixNormalized[],
  needles: string[],
  hayFn: (a: TalentAffixNormalized) => string,
): TalentAffixNormalized[] {
  return pool.filter((a) => affixMatchesNeedles(a, needles, hayFn(a)))
}

export function mapTalentPanelNodeToAffix(
  node: TalentPanelNode,
  affixes: TalentAffixNormalized[],
): TalentNodeAffixMatchResult {
  const deity = deityTagFromPanelId(node.panelId)
  const treePool = affixes.filter(
    (a) => a.sourceKind === 'talent_tree_node' && a.tags.includes(deity),
  )
  const corePool = affixes.filter(
    (a) => a.sourceKind === 'core_talent_node' && a.tags.includes(deity),
  )

  const needles = nodeEffectNeedles(node)
  if (needles.length === 0) {
    return {
      mappingStatus: 'unresolved',
      unresolvedReason: 'missing_effect_lines_anchor',
      mappingConfidence: null,
    }
  }

  const treeHit = filterByNeedles(treePool, needles, haystackPrimary)
  if (treeHit.length === 1) {
    const a = treeHit[0]!
    return {
      mappingStatus: 'resolved',
      affixId: a.affixId,
      affixGameDataId: a.gameDataId,
      affixSourceTab: 'talent_tree',
      mappingConfidence: 'normalized_text_talent_tree',
      unresolvedReason: null,
    }
  }

  if (treeHit.length > 1) {
    const modHit = filterByNeedles(treeHit, needles, haystackModifiers)
    if (modHit.length === 1) {
      const a = modHit[0]!
      return {
        mappingStatus: 'resolved',
        affixId: a.affixId,
        affixGameDataId: a.gameDataId,
        affixSourceTab: 'talent_tree',
        mappingConfidence: 'constrained_fallback_unique',
        unresolvedReason: null,
      }
    }
    return {
      mappingStatus: 'unresolved',
      unresolvedReason:
        modHit.length > 1
          ? 'multiple_candidates_same_text_modifiers_tie'
          : 'multiple_candidates_same_text',
      mappingConfidence: null,
      debugCandidateAffixIds: treeHit.map((a) => a.affixId),
    }
  }

  const coreHit = filterByNeedles(corePool, needles, haystackPrimary)
  if (coreHit.length === 1) {
    const a = coreHit[0]!
    return {
      mappingStatus: 'resolved',
      affixId: a.affixId,
      affixGameDataId: a.gameDataId,
      affixSourceTab: 'core_talent',
      mappingConfidence: 'normalized_text_core_talent',
      unresolvedReason: null,
    }
  }
  if (coreHit.length > 1) {
    return {
      mappingStatus: 'unresolved',
      unresolvedReason: 'multiple_candidates_core_talent_tab',
      mappingConfidence: null,
      debugCandidateAffixIds: coreHit.map((a) => a.affixId),
    }
  }

  if (treeHit.length === 0 && coreHit.length === 0) {
    return {
      mappingStatus: 'unresolved',
      unresolvedReason: 'no_affix_text_match',
      mappingConfidence: null,
    }
  }

  return {
    mappingStatus: 'unresolved',
    unresolvedReason: 'no_affix_text_match',
    mappingConfidence: null,
  }
}

/** 套用對應結果到節點物件（純函式，不修改輸入則請自行展開）。 */
export function applyMatchToTalentPanelNode(
  node: TalentPanelNode,
  match: TalentNodeAffixMatchResult,
): TalentPanelNode {
  const base: TalentPanelNode = { ...node }
  delete base.affixPending

  base.mappingStatus = match.mappingStatus
  base.mappingProvenance = TALENT_NODE_AFFIX_MAPPING_PROVENANCE

  if (match.mappingStatus === 'resolved') {
    base.affixId = match.affixId
    base.affixGameDataId = match.affixGameDataId ?? null
    base.affixSourceTab = match.affixSourceTab ?? null
    base.mappingConfidence = match.mappingConfidence ?? null
    base.unresolvedReason = null
  } else {
    delete base.affixId
    delete base.affixGameDataId
    delete base.affixSourceTab
    base.mappingConfidence = null
    base.unresolvedReason = match.unresolvedReason ?? 'unresolved_unknown'
  }

  return base
}

export type TalentNodeAffixMappingReport = {
  provenance: string
  totalNodes: number
  resolved: number
  unresolved: number
  byConfidence: Record<string, number>
  unresolvedReasons: Record<string, number>
}

export function summarizeMappingReport(matches: TalentNodeAffixMatchResult[]): TalentNodeAffixMappingReport {
  const byConfidence: Record<string, number> = {}
  const unresolvedReasons: Record<string, number> = {}
  let resolved = 0
  let unresolved = 0
  for (const m of matches) {
    if (m.mappingStatus === 'resolved') {
      resolved++
      const c = m.mappingConfidence ?? 'unknown'
      byConfidence[c] = (byConfidence[c] ?? 0) + 1
    } else {
      unresolved++
      const r = m.unresolvedReason ?? 'unknown'
      unresolvedReasons[r] = (unresolvedReasons[r] ?? 0) + 1
    }
  }
  return {
    provenance: TALENT_NODE_AFFIX_MAPPING_PROVENANCE,
    totalNodes: matches.length,
    resolved,
    unresolved,
    byConfidence,
    unresolvedReasons,
  }
}
