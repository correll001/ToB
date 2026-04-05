/**
 * 將 unresolved 節點分桶為可治理 backlog（純函式，無 I/O）。
 * @see docs/talent-panels/translation-bridge-governance.md
 */
import { mapTalentPanelNodeToAffix } from '@/lib/talent/mapTalentNodesToAffixes'
import {
  translateTalentEffectLineEnToZh,
  translationBridgeLikelyForEffectLines,
} from '@/lib/talent/talentEffectLineZh'
import { buildSuggestedNodeId } from '@/lib/talent/validateTalentPanelData'
import type { TalentAffixNormalized } from '@/types/talentAffix'
import type { TalentNodeAdjudicationEntry } from '@/types/talentAdjudication'
import type { TalentPanelNode } from '@/types/talentPanel'

export type TalentNodeAffixBacklogBatchKey =
  | 'adjudication_followup'
  | 'manual_disambiguation_priority'
  | 'translation_bridge_priority'
  | 'missing_anchor_priority'
  | 'deferred_special_mechanic'

export type TalentNodeAffixBacklogEntry = {
  nodeId: string
  panelId: string
  slotIndex: number
  mappingStatus: 'unresolved'
  unresolvedReason: string | null
  candidateCount: number
  candidateAffixIds: string[]
  hasApprovedAdjudication: boolean
  hasTentativeAdjudication: boolean
  hasRejectedAdjudication: boolean
  recommendedAction: string
  batchKey: TalentNodeAffixBacklogBatchKey
  /** 數字越小越建議優先處理（報表排序用）。 */
  priority: number
  whyThisBucket: string
  effectLines: string[]
  /** 每行英文與決定性譯文（供審計）。 */
  effectLineTranslations: Array<{ en: string; zh: string }>
}

export type TalentNodeAffixBacklogBuildResult = {
  schemaVersion: 1
  generatedAt: string
  season: string
  summary: {
    totalUnresolved: number
    byUnresolvedReason: Record<string, number>
    byBatch: Record<TalentNodeAffixBacklogBatchKey, number>
  }
  perPanelUnresolved: Array<{ panelId: string; count: number }>
  /** 依 priority、panelId、slotIndex 排序。 */
  entries: TalentNodeAffixBacklogEntry[]
  translationBridgeCandidateSubset: Array<{ effectLine: string; affectedNodeCount: number }>
  /** manual_disambiguation + adjudication_followup（裁決工作佇列）。 */
  adjudicationCandidateSubset: TalentNodeAffixBacklogEntry[]
}

const DEFERRED_EN_PATTERNS: RegExp[] = [
  /\bif you\b/i,
  /\bwhen you\b/i,
  /\bwhen holding\b/i,
  /\bwhile\b/i,
  /\bfor every\b/i,
  /\bper stack\b/i,
  /\bchance to\b/i,
  /\bfor minions\b/i,
  /\badditional\b.*\bif\b/i,
  /\bgained from\b/i,
  /\bdamage dealt when\b/i,
  /\binflict\b/i,
  /\bagainst enemies\b/i,
  /\bfor every 2%\b/i,
]

function isDeferredSpecialMechanicLines(lines: string[]): boolean {
  for (const line of lines) {
    const t = line.trim()
    if (t.length > 140) return true
    if (lines.length >= 4) return true
    for (const re of DEFERRED_EN_PATTERNS) {
      if (re.test(t)) return true
    }
  }
  return false
}

function isMultipleCandidatesReason(reason: string | null | undefined): boolean {
  if (!reason) return false
  return (
    reason === 'multiple_candidates_same_text' ||
    reason === 'multiple_candidates_same_text_modifiers_tie' ||
    reason === 'multiple_candidates_core_talent_tab'
  )
}

function collectAdjudicationFlags(
  nodeId: string,
  adjudications: TalentNodeAdjudicationEntry[],
): {
  hasApprovedAdjudication: boolean
  hasTentativeAdjudication: boolean
  hasRejectedAdjudication: boolean
} {
  const rows = adjudications.filter((a) => a.nodeId === nodeId)
  return {
    hasApprovedAdjudication: rows.some((a) => a.reviewStatus === 'approved'),
    hasTentativeAdjudication: rows.some((a) => a.reviewStatus === 'tentative'),
    hasRejectedAdjudication: rows.some((a) => a.reviewStatus === 'rejected'),
  }
}

function classifyBatch(args: {
  n: TalentPanelNode
  unresolvedReason: string | null
  candidateCount: number
  effectLines: string[]
  flags: ReturnType<typeof collectAdjudicationFlags>
}): Pick<
  TalentNodeAffixBacklogEntry,
  'batchKey' | 'priority' | 'recommendedAction' | 'whyThisBucket'
> {
  const { n, unresolvedReason, candidateCount, effectLines, flags } = args

  if (
    flags.hasTentativeAdjudication ||
    flags.hasRejectedAdjudication ||
    (flags.hasApprovedAdjudication && n.mappingStatus === 'unresolved')
  ) {
    return {
      batchKey: 'adjudication_followup',
      priority: 10,
      recommendedAction: flags.hasApprovedAdjudication
        ? 'Node still unresolved while approved adjudication exists: fix anchor drift, re-run ingest, or add superseding adjudication row.'
        : flags.hasTentativeAdjudication
          ? 'Promote tentative to approved with evidence, or reject and document; re-run ingest.'
          : 'Rejected row on file: pick new affix with fresh adjudication or translation/anchor path; do not revive rejected choice.',
      whyThisBucket:
        '裁決表已有 tentative / rejected，或 approved 與節點狀態不一致；需延續治理流程。',
    }
  }

  if (isMultipleCandidatesReason(unresolvedReason) && candidateCount > 0) {
    return {
      batchKey: 'manual_disambiguation_priority',
      priority: 20,
      recommendedAction:
        'Use candidate table + evidence-based adjudication (exclude rows with extra stats not on node); see manual-adjudication-rules.md.',
      whyThisBucket:
        '自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。',
    }
  }

  if (unresolvedReason === 'missing_effect_lines_anchor') {
    return {
      batchKey: 'missing_anchor_priority',
      priority: 40,
      recommendedAction:
        'Restore effectLines from TLI/source, or manual adjudication with external anchor (screenshot/official page) per governance policy.',
      whyThisBucket: '無 effectLines，無法做決定性文字錨點比對。',
    }
  }

  if (unresolvedReason === 'no_affix_text_match') {
    if (effectLines.length === 0) {
      return {
        batchKey: 'missing_anchor_priority',
        priority: 40,
        recommendedAction: 'Treat as data gap: add effectLines or adjudicate with external evidence.',
        whyThisBucket: '標為 no_affix_text_match 但無 effectLines，與缺 anchor 同級處理。',
      }
    }
    if (isDeferredSpecialMechanicLines(effectLines)) {
      return {
        batchKey: 'deferred_special_mechanic',
        priority: 60,
        recommendedAction:
          'Defer: conditional / multi-clause / long lines — prefer adjudication or future engine bucket, not fuzzy bridge.',
        whyThisBucket: '效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。',
      }
    }
    if (translationBridgeLikelyForEffectLines(effectLines)) {
      return {
        batchKey: 'translation_bridge_priority',
        priority: 30,
        recommendedAction:
          'Add deterministic EXACT/PHRASE in talentEffectLineZh.ts only after TLIDB substring verification; re-run ingest.',
        whyThisBucket:
          '譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。',
      }
    }
    return {
      batchKey: 'deferred_special_mechanic',
      priority: 50,
      recommendedAction:
        '譯文已完整化仍無 haystack 命中：疑 SS11/S12 文案或神系池不一致；用 adjudication 或官方對照表，勿硬加寬鬆 bridge。',
      whyThisBucket:
        '非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。',
    }
  }

  return {
    batchKey: 'deferred_special_mechanic',
    priority: 70,
    recommendedAction: 'Review unresolvedReason code and panel context; may need new matcher reason taxonomy.',
    whyThisBucket: '未分類的 unresolved 原因，落入保守延後桶。',
  }
}

export function buildTalentNodeAffixBacklog(input: {
  season: string
  nodes: TalentPanelNode[]
  affixes: TalentAffixNormalized[]
  adjudications: TalentNodeAdjudicationEntry[]
  generatedAt?: string
}): TalentNodeAffixBacklogBuildResult {
  const { season, nodes, affixes, adjudications } = input
  const generatedAt = input.generatedAt ?? new Date().toISOString()

  const unresolved = nodes.filter((n) => n.mappingStatus === 'unresolved')
  const byUnresolvedReason: Record<string, number> = {}
  const byBatch: Record<TalentNodeAffixBacklogBatchKey, number> = {
    adjudication_followup: 0,
    manual_disambiguation_priority: 0,
    translation_bridge_priority: 0,
    missing_anchor_priority: 0,
    deferred_special_mechanic: 0,
  }
  const panelCounts = new Map<string, number>()

  const entries: TalentNodeAffixBacklogEntry[] = []

  for (const n of unresolved) {
    const ur = n.unresolvedReason ?? null
    byUnresolvedReason[ur] = (byUnresolvedReason[ur] ?? 0) + 1
    panelCounts.set(n.panelId, (panelCounts.get(n.panelId) ?? 0) + 1)

    const nodeId = n.nodeId?.trim() || buildSuggestedNodeId(season, n.panelId, n.slotIndex)
    const match = mapTalentPanelNodeToAffix(n, affixes)
    const cands = match.debugCandidateAffixIds ?? []
    const effectLines = n.effectLines ?? []
    const flags = collectAdjudicationFlags(nodeId, adjudications)

    const effectLineTranslations = effectLines.map((en) => ({
      en,
      zh: translateTalentEffectLineEnToZh(en),
    }))

    const classified = classifyBatch({
      n,
      unresolvedReason: ur,
      candidateCount: cands.length,
      effectLines,
      flags,
    })

    byBatch[classified.batchKey]++

    entries.push({
      nodeId,
      panelId: n.panelId,
      slotIndex: n.slotIndex,
      mappingStatus: 'unresolved',
      unresolvedReason: ur,
      candidateCount: cands.length,
      candidateAffixIds: cands,
      hasApprovedAdjudication: flags.hasApprovedAdjudication,
      hasTentativeAdjudication: flags.hasTentativeAdjudication,
      hasRejectedAdjudication: flags.hasRejectedAdjudication,
      recommendedAction: classified.recommendedAction,
      batchKey: classified.batchKey,
      priority: classified.priority,
      whyThisBucket: classified.whyThisBucket,
      effectLines,
      effectLineTranslations,
    })
  }

  entries.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority
    if (a.panelId !== b.panelId) return a.panelId.localeCompare(b.panelId)
    return a.slotIndex - b.slotIndex
  })

  const bridgeLineCounts = new Map<string, number>()
  for (const e of entries) {
    if (e.batchKey !== 'translation_bridge_priority') continue
    for (const line of e.effectLines) {
      bridgeLineCounts.set(line, (bridgeLineCounts.get(line) ?? 0) + 1)
    }
  }
  const translationBridgeCandidateSubset = [...bridgeLineCounts.entries()]
    .map(([effectLine, affectedNodeCount]) => ({ effectLine, affectedNodeCount }))
    .sort((x, y) => y.affectedNodeCount - x.affectedNodeCount)

  const adjudicationCandidateSubset = entries.filter(
    (e) =>
      e.batchKey === 'manual_disambiguation_priority' || e.batchKey === 'adjudication_followup',
  )

  const perPanelUnresolved = [...panelCounts.entries()]
    .map(([panelId, count]) => ({ panelId, count }))
    .sort((a, b) => b.count - a.count)

  return {
    schemaVersion: 1,
    generatedAt,
    season,
    summary: {
      totalUnresolved: unresolved.length,
      byUnresolvedReason,
      byBatch,
    },
    perPanelUnresolved,
    entries,
    translationBridgeCandidateSubset,
    adjudicationCandidateSubset,
  }
}
