/**
 * Central Skill TAB — skill-local explanation contract (4F / skill tab series).
 * Not a full build breakdown; no gear/talent/board line items.
 */

import type { MainSkillSlot, PassiveApplyMode } from '@/types/build'
import type { SkillFamily } from '@/types/skillData'
import type { ParseStatus } from '@/types/normalized'
import type { SkillDamageRole } from '@/types/skillDamageRole'
import type {
  CalculationConfidence,
  InspectedSkillDamageView,
  InspectedSkillDebugView,
  SkillInstanceTrace,
} from '@/types/skillInstance'

/** Legacy compact shape — populated from `supportRemovalDeltas` computed stats for tooling. */
export type SkillTabSupportDeltaCandidate = {
  supportId: string
  supportName: string
  /** Local stat deltas (baseline computedStats − without this support). */
  deltas: Record<string, number>
}

/** Card 4 — counterfactual: disable one link and measure skill-local / scoped combat deltas. */
export type SkillTabSupportRemovalDelta = {
  linkSlot: number
  supportId: string
  supportName: string
  editorDisabled: boolean
  applied: boolean
  skipReason?: string
  skipReasonZh?: string
  deltaLines: string[]
  /** baseline DPS − withoutSupport DPS (positive ⇒ this support currently helps DPS). */
  combatDpsDelta: number | null
  combatHitDelta: number | null
  combatAttackSpeedDelta: number | null
  combatCompareUnsupported: boolean
  combatCompareNote?: string
  computedStatDeltas: Array<{ key: string; delta: number; labelZh: string }>
}

/**
 * Card 5 — passive / aura entries that actually inject into this inspected main skill (skill-local fold only).
 */
export type SkillTabPassiveImpactTrace = {
  passiveEditorSlot: 1 | 2 | 3
  passiveSkillId: string
  passiveName: string
  applyMode: PassiveApplyMode
  linkedMainSkillSlots: MainSkillSlot[]
  /** Registry stat keys remapped onto this active skill (folded modifiers). */
  statKeys: string[]
  /** True if any source modifier used selector kind `aura`. */
  hasAuraModifier: boolean
  /** Tags / selector hint — not a full aura simulation. */
  auraTagHint: boolean
  partialHints: string[]
}

/** Disable every support link on this main skill row. */
export type SkillTabStripAllSupportsDelta = {
  deltaLines: string[]
  combatDpsDelta: number | null
  combatHitDelta: number | null
  combatCompareUnsupported: boolean
  combatCompareNote?: string
  computedStatDeltas: Array<{ key: string; delta: number; labelZh: string }>
}

/** Skill-local row preview (not global build combat totals). */
export type SkillTabLocalPreviewMetrics = {
  manaCost: number | null
  cooldownSec: number | null
  castTimeSec: number | null
  /** From structured level row when present. */
  projectileCount: number | null
  /** Hit/spell base from level row when resolved (informational). */
  levelRowHitBase: number | null
  levelRowHitBaseFromMinMaxAverage: boolean
  /**
   * Sample of folded registry stats from `SkillInstance.computedStats` (deterministic key order, capped).
   * For central tab only — not merged with gear.
   */
  computedStatSample: Array<{ key: string; value: number }>
}

export type SkillTabSupportAppliedRow = {
  id: string
  name: string
  gemLevel: number
}

export type SkillTabSupportSkippedRow = {
  id: string
  name: string
  skipReason?: string
}

/**
 * Card 6 — collapsible debug / missing-data detail (formatted lines only; not raw JSON).
 */
export type SkillTabDebugSupportLinkRawReq = {
  linkSlot: number
  supportId: string
  supportName: string
  lines: string[]
}

export type SkillTabDebugFoldout = {
  canonicalTags: string[]
  mainSkillRawRequirementLines: string[]
  supportLinkRawRequirements: SkillTabDebugSupportLinkRawReq[]
  instanceWarnings: string[]
  recordWarnings: string[]
  engineWarnings: string[]
  parseStatus: ParseStatus | null
  /** Same structured strings as `levelRowLines` on the parent explanation. */
  levelRowDetailLines: string[]
  supportSkippedRows: SkillTabSupportSkippedRow[]
  localMissingDataHints: string[]
  traceSummaryLines: string[]
  /**
   * When no `SkillInstance`, narrative lines already on the parent (`localWarnings`) —
   * shown here so they are not lost after moving detailed lists out of the base card.
   */
  contextNotesWithoutInstance: string[]
}

/** Per-link support compatibility + skill-local modifier summary (central TAB only). */
export type SkillTabSupportLinkExplanation = {
  linkSlot: number
  supportId: string
  supportName: string
  gemLevel: number
  editorDisabled: boolean
  applied: boolean
  skipReason?: string
  skipReasonZh: string
  warnings: string[]
  rawRequirementLines?: string[]
  /** Player-facing bullets (not raw JSON). */
  localStatEffects: string[]
  /** Registry stat keys touched by this support's modifiers. */
  affectedStatKeys: string[]
  /** True when applied but no structured numeric modifiers were folded. */
  noStructuredEffect: boolean
}

/**
 * Scoped combat preview: same pipeline as inspected damaging (global aggregate + this slot’s skill row only).
 * Framed for central TAB — not labeled as full-build final output.
 */
export type SkillTabLocalNumericSummary = {
  /** `full_scoped_combat`: hit/dps from derive; `resource_timing_only`: level row + skill stats only; `unavailable`. */
  previewKind: 'full_scoped_combat' | 'resource_timing_only' | 'unavailable'
  /** From `computeDerivedCombat` scoped filter — only when damaging + effective not blocked. */
  scopedHitDamage: number | null
  scopedDpsPreview: number | null
  scopedAttackSpeed: number | null
  manaCost: number | null
  cooldownSec: number | null
  castTimeSec: number | null
  projectileCount: number | null
  /** Folded skill-local registry (increased %), not merge order with gear. */
  skillLocalAttackSpeedIncreased: number | null
  skillLocalCastSpeedIncreased: number | null
  effectiveCalculationConfidence: CalculationConfidence | null
  calculationConfidence: CalculationConfidence | null
  damagingPresentation: 'authoritative' | 'estimate' | null
  /** Non-ready / caveats; never empty when confidence is partial or unsupported. */
  confidenceCaveats: string[]
}

/** Structured level-row fields for the central「基底」card (player-facing strings built in UI). */
export type SkillTabLevelRowFacts = {
  source: 'levelTable' | 'breakpoints' | 'none'
  skillGemLevel: number
  rowPartial: boolean
  baseDamageDisplay: string | null
  /** True when `baseDamage` was a min–max interval and we show a midpoint for hit base. */
  baseDamageIsRangeMidpoint: boolean
  manaCost: number | null
  cooldownSec: number | null
  castTimeSec: number | null
  weaponDamagePct: number | null
  addedDamageEffectiveness: number | null
  projectileCount: number | null
}

/**
 * Projection for the central skill pane only.
 * Callers must not feed this into BuildStatsPanel / global DPS selectors.
 */
export type SkillTabExplanation = {
  slot: MainSkillSlot | null
  coreResolution: InspectedSkillDebugView['resolution']
  activeSkillId: string | null
  activeSkillName: string | null
  /** Definition family when skill id resolves; aids presentation tags. */
  activeSkillFamily: SkillFamily | null
  /** Main skill row enabled when a row exists; false for empty / unresolved. */
  enabled: boolean
  parseStatus: ParseStatus | null
  damageRole: SkillDamageRole | null
  /** Instance-layer confidence; null if no `SkillInstance`. */
  calculationConfidence: CalculationConfidence | null
  /**
   * Worst of instance vs derived combat layer (when damaging path ran); mirrors inspected DPS gating.
   * Null when not applicable (`none` / no damaging merge).
   */
  effectiveCalculationConfidence: CalculationConfidence | null
  /** Mirrors `InspectedSkillDamageView.mode` for routing without re-deriving. */
  inspectedDamageViewMode: InspectedSkillDamageView['mode']
  /** Player-facing chips (輸出／光環／partial …). */
  presentationTags: string[]
  /** Level table facts for the base card; null when no instance / no row context. */
  levelRowFacts: SkillTabLevelRowFacts | null
  localPreviewMetrics: SkillTabLocalPreviewMetrics | null
  /** Active gem base modifiers (+ short id lines), skill-local. */
  baseSkillLines: string[]
  /** Level row resolution + structured hints (no full build context). */
  levelRowLines: string[]
  supportAppliedDetail: SkillTabSupportAppliedRow[]
  supportSkippedDetail: SkillTabSupportSkippedRow[]
  /** Card 0: always empty; future — swap diff previews. */
  supportDeltaCandidates: SkillTabSupportDeltaCandidate[]
  /** Card 2: one entry per link slot (sorted); empty when no main skill / no links. */
  supportLinkExplanations: SkillTabSupportLinkExplanation[]
  /** Card 4: per-link removal counterfactuals. */
  supportRemovalDeltas: SkillTabSupportRemovalDelta[]
  /** Card 4: all support links disabled on this row. */
  stripAllSupportsDelta: SkillTabStripAllSupportsDelta | null
  /** Passive / aura inject trace (which passives apply to this slot), not numeric detail. */
  passiveAuraLines: string[]
  /** Card 5 — only passives that hit this inspected slot + passive family; skill-local stat keys only. */
  passiveImpactTraces: SkillTabPassiveImpactTrace[]
  localWarnings: string[]
  localMissingDataHints: string[]
  /** Engine instance trace when available. */
  debugTrace?: SkillInstanceTrace
  /** Card 3 — scoped hit/DPS preview + resources (with confidence caveats). */
  localNumericSummary: SkillTabLocalNumericSummary
  /** Card 6 — advanced debug foldout payload (UI defaults collapsed). */
  debugFoldout: SkillTabDebugFoldout
}
