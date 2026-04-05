/**
 * Second layer: apply approved manual adjudications on top of auto mapping.
 * Does not modify mapTalentNodesToAffixes.ts; all overrides live in data/manual/...adjudications.json.
 */
import type { TalentAffixNormalized } from '@/types/talentAffix'
import type {
  TalentNodeAdjudicationEntry,
  TalentNodeAdjudicationFile,
} from '@/types/talentAdjudication'
import {
  TALENT_ADJUDICATION_REASONS,
  TALENT_ADJUDICATION_REVIEW_STATUSES,
} from '@/types/talentAdjudication'
import type { TalentPanelNode, TalentPanelNodeMappingConfidence } from '@/types/talentPanel'
import { buildSuggestedNodeId } from '@/lib/talent/validateTalentPanelData'

export const TALENT_ADJUDICATION_PROVENANCE = 'applyTalentNodeAffixAdjudications:v1'

const AUTO_CONFIDENCES_NO_SILENT_OVERRIDE: Set<TalentPanelNodeMappingConfidence> = new Set([
  'normalized_text_talent_tree',
  'normalized_text_core_talent',
  'constrained_fallback_unique',
])

export type AdjudicationValidationIssue = { kind: string; message: string; adjudicationId?: string }

export type AdjudicationApplyStats = {
  approvedInFile: number
  tentativeInFile: number
  rejectedInFile: number
  appliedApproved: number
  skippedNotUnresolved: number
}

function isRecord(x: unknown): x is Record<string, unknown> {
  return x != null && typeof x === 'object' && !Array.isArray(x)
}

/** Parse and structural validation (no cross-file checks). */
export function parseTalentNodeAdjudicationFile(raw: unknown): {
  file: TalentNodeAdjudicationFile | null
  errors: string[]
} {
  const errors: string[] = []
  if (!isRecord(raw)) {
    return { file: null, errors: ['root must be an object'] }
  }
  if (raw.schemaVersion !== 1) {
    errors.push(`schemaVersion must be 1, got ${JSON.stringify(raw.schemaVersion)}`)
  }
  if (typeof raw.season !== 'string' || !raw.season.trim()) {
    errors.push('season must be a non-empty string')
  }
  if (typeof raw.sourceNote !== 'string') {
    errors.push('sourceNote must be a string')
  }
  const list = raw.adjudications
  if (!Array.isArray(list)) {
    return { file: null, errors: [...errors, 'adjudications must be an array'] }
  }

  const adjudications: TalentNodeAdjudicationEntry[] = []
  for (let i = 0; i < list.length; i++) {
    const row = list[i]
    const prefix = `adjudications[${i}]`
    if (!isRecord(row)) {
      errors.push(`${prefix}: must be object`)
      continue
    }
    const id = typeof row.adjudicationId === 'string' ? row.adjudicationId.trim() : ''
    if (!id) errors.push(`${prefix}: adjudicationId required`)

    const season = typeof row.season === 'string' ? row.season.trim() : ''
    if (!season) errors.push(`${prefix}: season required`)

    const panelId = typeof row.panelId === 'string' ? row.panelId.trim() : ''
    if (!panelId) errors.push(`${prefix}: panelId required`)

    const nodeId = typeof row.nodeId === 'string' ? row.nodeId.trim() : ''
    if (!nodeId) errors.push(`${prefix}: nodeId required`)

    const chosenAffixId = typeof row.chosenAffixId === 'string' ? row.chosenAffixId.trim() : ''
    if (!chosenAffixId) errors.push(`${prefix}: chosenAffixId required`)

    const reason = row.reason
    if (
      typeof reason !== 'string' ||
      !(TALENT_ADJUDICATION_REASONS as readonly string[]).includes(reason)
    ) {
      errors.push(`${prefix}: reason must be one of ${TALENT_ADJUDICATION_REASONS.join(', ')}`)
    }

    const rs = row.reviewStatus
    if (
      typeof rs !== 'string' ||
      !(TALENT_ADJUDICATION_REVIEW_STATUSES as readonly string[]).includes(rs)
    ) {
      errors.push(
        `${prefix}: reviewStatus must be one of ${TALENT_ADJUDICATION_REVIEW_STATUSES.join(', ')}`,
      )
    }

    const reviewedBy = typeof row.reviewedBy === 'string' ? row.reviewedBy.trim() : ''
    if (!reviewedBy) errors.push(`${prefix}: reviewedBy required`)

    const updatedAt = typeof row.updatedAt === 'string' ? row.updatedAt.trim() : ''
    if (!updatedAt) errors.push(`${prefix}: updatedAt required`)

    const evidence = row.evidence
    if (!Array.isArray(evidence) || evidence.length === 0) {
      errors.push(`${prefix}: evidence must be a non-empty array of strings`)
    } else if (!evidence.every((e) => typeof e === 'string' && e.trim().length > 0)) {
      errors.push(`${prefix}: each evidence must be a non-empty string`)
    }

    const sa = row.sourceAnchor
    if (!isRecord(sa)) {
      errors.push(`${prefix}: sourceAnchor must be object`)
    } else {
      if (typeof sa.panelId !== 'string' || !sa.panelId.trim()) {
        errors.push(`${prefix}.sourceAnchor.panelId required`)
      }
      if (!Number.isInteger(sa.slotIndex)) {
        errors.push(`${prefix}.sourceAnchor.slotIndex must be integer`)
      }
      if (typeof sa.nodeType !== 'string' || !sa.nodeType.trim()) {
        errors.push(`${prefix}.sourceAnchor.nodeType required`)
      }
      if (!Array.isArray(sa.effectLines)) {
        errors.push(`${prefix}.sourceAnchor.effectLines must be array`)
      }
    }

    if (
      id &&
      season &&
      panelId &&
      nodeId &&
      chosenAffixId &&
      typeof reason === 'string' &&
      typeof rs === 'string' &&
      reviewedBy &&
      updatedAt &&
      Array.isArray(evidence) &&
      evidence.length > 0 &&
      isRecord(sa) &&
      typeof sa.panelId === 'string' &&
      Number.isInteger(sa.slotIndex) &&
      typeof sa.nodeType === 'string' &&
      Array.isArray(sa.effectLines)
    ) {
      adjudications.push({
        adjudicationId: id,
        season,
        panelId,
        nodeId,
        sourceAnchor: {
          panelId: sa.panelId.trim(),
          slotIndex: sa.slotIndex as number,
          nodeType: sa.nodeType.trim(),
          effectLines: sa.effectLines.filter((l: unknown) => typeof l === 'string') as string[],
          sourceNotes: Array.isArray(sa.sourceNotes)
            ? sa.sourceNotes.filter((l: unknown) => typeof l === 'string')
            : undefined,
        },
        chosenAffixId,
        reason: reason as TalentNodeAdjudicationEntry['reason'],
        evidence: evidence as string[],
        reviewStatus: rs as TalentNodeAdjudicationEntry['reviewStatus'],
        reviewedBy,
        updatedAt,
        notes: Array.isArray(row.notes)
          ? row.notes.filter((l: unknown) => typeof l === 'string')
          : undefined,
      })
    }
  }

  if (errors.length) {
    return { file: null, errors }
  }

  return {
    file: {
      schemaVersion: 1,
      season: String(raw.season).trim(),
      sourceNote: typeof raw.sourceNote === 'string' ? raw.sourceNote : '',
      adjudications,
    },
    errors: [],
  }
}

/** Cross-check adjudication file + affix ids + duplicate approved nodeIds. */
export function validateAdjudicationsAgainstRefs(
  file: TalentNodeAdjudicationFile,
  affixIdSet: Set<string>,
): AdjudicationValidationIssue[] {
  const issues: AdjudicationValidationIssue[] = []
  const approvedByNode = new Map<string, TalentNodeAdjudicationEntry[]>()

  for (const a of file.adjudications) {
    if (!affixIdSet.has(a.chosenAffixId)) {
      issues.push({
        kind: 'unknown_affix',
        adjudicationId: a.adjudicationId,
        message: `chosenAffixId not in talent-affixes: ${a.chosenAffixId}`,
      })
    }
    if (a.reviewStatus === 'approved') {
      const list = approvedByNode.get(a.nodeId) ?? []
      list.push(a)
      approvedByNode.set(a.nodeId, list)
    }
    if (a.reviewStatus === 'approved' && a.evidence.length === 0) {
      issues.push({
        kind: 'missing_evidence',
        adjudicationId: a.adjudicationId,
        message: 'approved adjudication must have evidence',
      })
    }
    if (a.reviewStatus === 'approved' && !a.reviewedBy.trim()) {
      issues.push({
        kind: 'missing_reviewer',
        adjudicationId: a.adjudicationId,
        message: 'approved adjudication must have reviewedBy',
      })
    }
  }

  for (const [nodeId, list] of approvedByNode) {
    const affixIds = new Set(list.map((x) => x.chosenAffixId))
    if (affixIds.size > 1) {
      issues.push({
        kind: 'duplicate_approved_conflict',
        message: `nodeId ${nodeId} has ${list.length} approved rows with different chosenAffixId`,
      })
    }
  }

  const seenAdjIds = new Set<string>()
  for (const a of file.adjudications) {
    if (seenAdjIds.has(a.adjudicationId)) {
      issues.push({
        kind: 'duplicate_adjudication_id',
        adjudicationId: a.adjudicationId,
        message: `duplicate adjudicationId: ${a.adjudicationId}`,
      })
    }
    seenAdjIds.add(a.adjudicationId)
  }

  return issues
}

function nodeKeyFor(n: TalentPanelNode, season: string): string {
  return n.nodeId?.trim() || buildSuggestedNodeId(season, n.panelId, n.slotIndex)
}

/**
 * Apply approved adjudications. Mutates clones only; returns new node array.
 * Errors on conflict with auto-resolved high-confidence rows.
 */
export function applyAdjudicationsToNodes(
  season: string,
  nodes: TalentPanelNode[],
  file: TalentNodeAdjudicationFile,
  affixById: Map<string, TalentAffixNormalized>,
): { nodes: TalentPanelNode[]; errors: string[]; stats: AdjudicationApplyStats } {
  const errors: string[] = []
  const stats: AdjudicationApplyStats = {
    approvedInFile: 0,
    tentativeInFile: 0,
    rejectedInFile: 0,
    appliedApproved: 0,
    skippedNotUnresolved: 0,
  }

  for (const a of file.adjudications) {
    if (a.reviewStatus === 'approved') stats.approvedInFile++
    else if (a.reviewStatus === 'tentative') stats.tentativeInFile++
    else stats.rejectedInFile++
  }

  const approved = file.adjudications.filter((a) => a.reviewStatus === 'approved')
  const byNode = new Map<string, TalentNodeAdjudicationEntry>()
  for (const a of approved) {
    const prev = byNode.get(a.nodeId)
    if (prev && prev.chosenAffixId !== a.chosenAffixId) {
      errors.push(
        `adjudication conflict: nodeId ${a.nodeId} has two approved rows (${prev.adjudicationId} vs ${a.adjudicationId})`,
      )
    } else {
      byNode.set(a.nodeId, a)
    }
  }

  if (errors.length) {
    return { nodes: nodes.map((n) => ({ ...n })), errors, stats }
  }

  const index = new Map<string, number>()
  nodes.forEach((n, i) => {
    index.set(nodeKeyFor(n, season), i)
  })

  const out = nodes.map((n) => ({ ...n }))

  for (const adj of byNode.values()) {
    const idx = index.get(adj.nodeId)
    if (idx === undefined) {
      errors.push(`adjudication ${adj.adjudicationId}: nodeId not found in nodes: ${adj.nodeId}`)
      continue
    }
    const n = out[idx]!

    if (adj.season !== file.season || adj.season !== season) {
      errors.push(
        `adjudication ${adj.adjudicationId}: season mismatch (file=${file.season} node season=${season} adj.season=${adj.season})`,
      )
      continue
    }
    if (adj.panelId !== n.panelId) {
      errors.push(
        `adjudication ${adj.adjudicationId}: panelId mismatch adjudication=${adj.panelId} node=${n.panelId}`,
      )
      continue
    }

    const affix = affixById.get(adj.chosenAffixId)
    if (!affix) {
      errors.push(`adjudication ${adj.adjudicationId}: chosenAffixId not loaded: ${adj.chosenAffixId}`)
      continue
    }

    if (n.mappingStatus === 'resolved') {
      const c = n.mappingConfidence
      if (c != null && AUTO_CONFIDENCES_NO_SILENT_OVERRIDE.has(c)) {
        errors.push(
          `adjudication ${adj.adjudicationId}: cannot override auto-resolved node ${adj.nodeId} (confidence=${c})`,
        )
        continue
      }
      if (c !== 'manual_adjudicated') {
        errors.push(
          `adjudication ${adj.adjudicationId}: resolved node ${adj.nodeId} is not manual_adjudicated and cannot be overridden`,
        )
        continue
      }
    } else if (n.mappingStatus !== 'unresolved') {
      errors.push(
        `adjudication ${adj.adjudicationId}: node ${adj.nodeId} must be unresolved or manual_adjudicated (got mappingStatus=${n.mappingStatus})`,
      )
      continue
    }

    delete n.affixPending
    n.mappingStatus = 'resolved'
    n.mappingConfidence = 'manual_adjudicated'
    n.mappingProvenance = TALENT_ADJUDICATION_PROVENANCE
    n.mappingAdjudicationId = adj.adjudicationId
    n.unresolvedReason = null
    n.affixId = affix.affixId
    n.affixGameDataId = affix.gameDataId
    n.affixSourceTab =
      affix.sourceTab === 'talent_tree' || affix.sourceTab === 'core_talent' ? affix.sourceTab : null

    stats.appliedApproved++
  }

  return { nodes: out, errors, stats }
}
