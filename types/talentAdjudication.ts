/**
 * Manual node → talent-affix governance layer (not auto-matcher truth).
 * @see docs/talent-panels/manual-adjudication-rules.md
 */

export type TalentAdjudicationReviewStatus = 'approved' | 'tentative' | 'rejected'

/** Why a human tied this node to chosenAffixId (machine-readable). */
export type TalentAdjudicationReason =
  | 'manual_disambiguation_same_text'
  | 'manual_cross_tab_resolution'
  | 'manual_missing_translation_bridge'
  | 'manual_external_reference_match'
  | 'manual_override_after_review'

/** Snapshot of node fields the reviewer used as anchors (must stay stable for audit). */
export type TalentAdjudicationSourceAnchor = {
  panelId: string
  slotIndex: number
  nodeType: string
  effectLines: string[]
  /** TLI / uuid trace lines copied from node.notes at review time. */
  sourceNotes?: string[]
}

export type TalentNodeAdjudicationEntry = {
  /** Stable id referenced from talent-panel-nodes.mappingAdjudicationId */
  adjudicationId: string
  season: string
  panelId: string
  nodeId: string
  sourceAnchor: TalentAdjudicationSourceAnchor
  chosenAffixId: string
  reason: TalentAdjudicationReason
  /** At least one concrete evidence string (e.g. TLIDB row diff, translation bridge). */
  evidence: string[]
  reviewStatus: TalentAdjudicationReviewStatus
  reviewedBy: string
  updatedAt: string
  notes?: string[]
}

export type TalentNodeAdjudicationFile = {
  schemaVersion: 1
  season: string
  sourceNote: string
  adjudications: TalentNodeAdjudicationEntry[]
}

export const TALENT_ADJUDICATION_REASONS: readonly TalentAdjudicationReason[] = [
  'manual_disambiguation_same_text',
  'manual_cross_tab_resolution',
  'manual_missing_translation_bridge',
  'manual_external_reference_match',
  'manual_override_after_review',
] as const

export const TALENT_ADJUDICATION_REVIEW_STATUSES: readonly TalentAdjudicationReviewStatus[] = [
  'approved',
  'tentative',
  'rejected',
] as const
