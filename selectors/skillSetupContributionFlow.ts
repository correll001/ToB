/**
 * Skill Setup — contribution flow presentation only.
 * Assembles Base → Supports (applied) → Passives/Aura → Final from `SkillTabExplanation`.
 * No combat derivation; no new deltas beyond strings already produced upstream.
 */
import type { SkillTabExplanation, SkillTabLocalNumericSummary } from '@/types/skillTabExplanation'
import type { SkillSetupContributionFlow } from '@/types/skillSetupPlayerView'
import { SKILL_SETUP_DATA_GAP_NO_QUANTIFIED_DELTA } from '@/types/skillSetupPlayerView'
import { skillLocalStatLabelZh } from '@/lib/format/supportLinkExplanationFormat'

const MAX_SUPPORT_EFFECT_LINES = 3

function formatLevelRowFactLines(ex: SkillTabExplanation): string[] {
  const f = ex.levelRowFacts
  if (!f) return []
  const lines: string[] = []
  lines.push(`技能等級：${f.skillGemLevel}`)
  const src =
    f.source === 'levelTable'
      ? '連續等級表'
      : f.source === 'breakpoints'
        ? '稀疏等級表（不連續）'
        : '無對應列'
  lines.push(`等級表類型：${src}`)
  if (f.rowPartial) lines.push('（此列標示為不完整）')
  if (f.baseDamageDisplay) lines.push(`技能傷害（表上）：${f.baseDamageDisplay}`)
  if (f.baseDamageIsRangeMidpoint) lines.push('（傷害為區間時取表中點）')
  if (f.manaCost != null) lines.push(`魔力消耗：${f.manaCost}`)
  if (f.cooldownSec != null) lines.push(`冷卻（秒）：${f.cooldownSec}`)
  if (f.castTimeSec != null) {
    const castLabel = f.weaponDamagePct != null ? '施放／攻擊時間（秒）' : '施放時間（秒）'
    lines.push(`${castLabel}：${f.castTimeSec}`)
  }
  if (f.addedDamageEffectiveness != null) lines.push(`額傷效用：${f.addedDamageEffectiveness}`)
  if (f.projectileCount != null) lines.push(`投射物數：${f.projectileCount}`)
  if (f.weaponDamagePct != null) lines.push(`武器傷害係數（%）：${f.weaponDamagePct}`)
  return lines
}

function buildSupportAppliedItem(
  l: SkillTabExplanation['supportLinkExplanations'][number],
  removal: SkillTabExplanation['supportRemovalDeltas'][number] | undefined,
): SkillSetupContributionFlow['supports']['items'][number] {
  const rawEffects = l.localStatEffects
  const effectLines =
    rawEffects.length > 0
      ? rawEffects.slice(0, MAX_SUPPORT_EFFECT_LINES)
      : [SKILL_SETUP_DATA_GAP_NO_QUANTIFIED_DELTA]

  const moreEffectCount = Math.max(0, rawEffects.length - MAX_SUPPORT_EFFECT_LINES)

  let counterfactualDeltaLines: string[] = []
  let counterfactualMetricLines: string[] = []
  let counterfactualUnsupported = false
  let counterfactualUnsupportedNote: string | null = null

  if (removal && removal.applied && !removal.editorDisabled) {
    counterfactualDeltaLines = [...removal.deltaLines]
    for (const d of removal.computedStatDeltas.slice(0, 8)) {
      counterfactualMetricLines.push(
        `${d.labelZh}（對照移除此輔助）：${d.delta > 0 ? '+' : ''}${d.delta.toFixed(Math.abs(d.delta) >= 10 ? 0 : 2)}`,
      )
    }
    if (removal.combatCompareUnsupported) {
      counterfactualUnsupported = true
      counterfactualUnsupportedNote =
        removal.combatCompareNote ?? '這顆輔助的傷害／DPS 對照無法在此顯示（並未另外推算）。'
    } else {
      if (removal.combatHitDelta != null) {
        counterfactualMetricLines.push(`試算 · 單下傷害變化：${removal.combatHitDelta}`)
      }
      if (removal.combatDpsDelta != null) {
        counterfactualMetricLines.push(`試算 · DPS 變化：${removal.combatDpsDelta}`)
      }
      if (removal.combatAttackSpeedDelta != null) {
        counterfactualMetricLines.push(`試算 · 攻速變化：${removal.combatAttackSpeedDelta}`)
      }
    }
  }

  return {
    linkSlot: l.linkSlot,
    supportName: l.supportName,
    gemLevel: l.gemLevel,
    effectLines,
    moreEffectCount,
    noStructuredEffect: l.noStructuredEffect,
    counterfactualDeltaLines,
    counterfactualMetricLines,
    counterfactualUnsupported,
    counterfactualUnsupportedNote,
  }
}

function buildSupportsLayer(ex: SkillTabExplanation): SkillSetupContributionFlow['supports'] {
  const items: SkillSetupContributionFlow['supports']['items'] = []
  for (const l of ex.supportLinkExplanations) {
    if (l.editorDisabled || !l.applied) continue
    const removal = ex.supportRemovalDeltas.find((d) => d.linkSlot === l.linkSlot)
    items.push(buildSupportAppliedItem(l, removal))
  }
  return {
    items,
    emptyHint: '目前沒有「已生效」的連結輔助。未生效或關閉的請看上方「輔助套用結果」。',
  }
}

function buildPassivesLayer(ex: SkillTabExplanation): SkillSetupContributionFlow['passivesAura'] {
  const traces = ex.passiveImpactTraces.map((t) => {
    const mode = t.applyMode === 'global' ? '全域套用' : '僅連結槽'
    const link =
      t.applyMode === 'linked' && t.linkedMainSkillSlots.length
        ? ` · 連結主槽 [${t.linkedMainSkillSlots.join(', ')}]`
        : ''
    const aura = t.hasAuraModifier || t.auraTagHint ? ' · 光環相關' : ''
    const bodyLines: string[] = [
      `${mode}${link}${aura}`,
      t.statKeys.length > 0
        ? `影響項目：${t.statKeys.map((k) => skillLocalStatLabelZh(k)).join('、')}`
        : '影響項目：清單未列出（仍可能已生效；此處不顯示逐項加減數字）。',
    ]
    for (const h of t.partialHints) {
      bodyLines.push(`提示：${h}`)
    }
    return {
      headline: `被動槽 ${t.passiveEditorSlot} · ${t.passiveName}`,
      bodyLines,
    }
  })

  return {
    narrativeLines: [...ex.passiveAuraLines],
    traces,
    unquantifiedDeltaNotice:
      '以下被動／光環有作用在這顆技能上，但這裡不會列出「每一項加多少」的數字（不代表沒生效）。',
  }
}

function buildFinalLayer(ex: SkillTabExplanation): SkillSetupContributionFlow['final'] {
  const num = ex.localNumericSummary
  const { metrics, extraLines, unavailableNote } = buildFinalMetricsAndExtras(num)

  let note = unavailableNote
  if (
    ex.baseSkillLines.length === 0 &&
    ex.levelRowLines.length === 0 &&
    ex.coreResolution === 'ok'
  ) {
    note = note ?? '缺少基底說明文字；細節請展開下方「進階詳情」。'
  }

  return { metrics, extraLines, unavailableNote: note }
}

function buildFinalMetricsAndExtras(num: SkillTabLocalNumericSummary): {
  metrics: SkillSetupContributionFlow['final']['metrics']
  extraLines: string[]
  unavailableNote: string | null
} {
  const metrics: SkillSetupContributionFlow['final']['metrics'] = []
  const extraLines: string[] = []

  if (num.previewKind === 'unavailable') {
    return {
      metrics: [],
      extraLines: [],
      unavailableNote: '目前狀態下無法顯示命中／DPS／攻速預覽。',
    }
  }

  if (num.previewKind === 'full_scoped_combat') {
    metrics.push({
      label: '單下傷害（預覽）',
      value: num.scopedHitDamage != null ? String(num.scopedHitDamage) : '—',
    })
    metrics.push({
      label: 'DPS（預覽）',
      value: num.scopedDpsPreview != null ? String(num.scopedDpsPreview) : '—',
    })
    metrics.push({
      label: '攻速（預覽）',
      value: num.scopedAttackSpeed != null ? String(num.scopedAttackSpeed) : '—',
    })
  } else {
    extraLines.push('此技能不以輸出預覽為主；下方仍顯示魔耗、冷卻等。')
  }

  metrics.push({
    label: '魔力消耗',
    value: num.manaCost != null ? String(num.manaCost) : '—',
  })
  metrics.push({
    label: '冷卻（秒）',
    value: num.cooldownSec != null ? String(num.cooldownSec) : '—',
  })
  metrics.push({
    label: '施放時間（秒）',
    value: num.castTimeSec != null ? String(num.castTimeSec) : '—',
  })
  metrics.push({
    label: '投射物數',
    value: num.projectileCount != null ? String(num.projectileCount) : '—',
  })

  if (num.skillLocalAttackSpeedIncreased != null) {
    extraLines.push(`攻速加成%（本技能）：${num.skillLocalAttackSpeedIncreased}%`)
  }
  if (num.skillLocalCastSpeedIncreased != null) {
    extraLines.push(`施放速度加成%（本技能）：${num.skillLocalCastSpeedIncreased}%`)
  }
  if (num.damagingPresentation === 'estimate') {
    extraLines.push('傷害數字為估算，可能與最終值略有出入。')
  } else if (num.damagingPresentation === 'authoritative') {
    extraLines.push('傷害數字為就緒路徑下的結果。')
  }
  for (const c of num.confidenceCaveats) {
    extraLines.push(`說明：${c}`)
  }

  let unavailableNote: string | null = null
  if (num.previewKind === 'resource_timing_only') {
    unavailableNote = '此模式下沒有命中／DPS 預覽，僅資源與時間相關數字。'
  }

  return { metrics, extraLines, unavailableNote }
}

export function buildPlayerContributionFlow(ex: SkillTabExplanation): SkillSetupContributionFlow {
  const narrativeLines = [...ex.baseSkillLines, ...ex.levelRowLines]
  const levelRowFactLines = formatLevelRowFactLines(ex)

  return {
    base: {
      narrativeLines,
      levelRowFactLines,
    },
    supports: buildSupportsLayer(ex),
    passivesAura: buildPassivesLayer(ex),
    final: buildFinalLayer(ex),
  }
}
