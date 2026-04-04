/**
 * Support removal / strip-all counterfactuals — skill-local computedStats + same scoped combat pipeline as inspected damaging.
 */
import type { BuildSnapshot, MainSkillSlot, SkillSetup } from '@/types/build'
import type {
  SkillTabStripAllSupportsDelta,
  SkillTabSupportLinkExplanation,
  SkillTabSupportRemovalDelta,
} from '@/types/skillTabExplanation'
import type { SkillComputedStats, SkillInstance } from '@/types/skillInstance'
import { cloneSnapshotWithSkillRow } from '@/lib/build/cloneSnapshotSkillRow'
import { computeSkillInstanceForMainSlot } from '@/lib/formula/collectBuildContributions'
import { skillLocalStatLabelZh } from '@/lib/format/supportLinkExplanationFormat'
import { tryComputeInspectedScopedDamagingCombat } from '@/selectors/buildComputedStats'

function diffNumericComputedStats(
  a: SkillComputedStats,
  b: SkillComputedStats,
): Array<{ key: string; delta: number; labelZh: string }> {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  const out: Array<{ key: string; delta: number; labelZh: string }> = []
  for (const k of keys) {
    const va = a[k]
    const vb = b[k]
    if (typeof va !== 'number' || typeof vb !== 'number' || !Number.isFinite(va) || !Number.isFinite(vb)) {
      continue
    }
    const d = va - vb
    if (d === 0 || Math.abs(d) < 1e-9) continue
    out.push({ key: k, delta: d, labelZh: skillLocalStatLabelZh(k) })
  }
  out.sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta))
  return out.slice(0, 16)
}

export function buildSupportRemovalDeltas(
  snapshot: BuildSnapshot,
  slot: MainSkillSlot,
  row: SkillSetup,
  instBase: SkillInstance,
  linkExplanations: SkillTabSupportLinkExplanation[],
): SkillTabSupportRemovalDelta[] {
  const sorted = [...row.supports].sort((a, b) => a.linkSlot - b.linkSlot)
  const out: SkillTabSupportRemovalDelta[] = []

  for (const link of sorted) {
    const expl = linkExplanations.find((e) => e.linkSlot === link.linkSlot)
    const supportName = expl?.supportName ?? link.supportSkillId

    if (link.enabled === false) {
      out.push({
        linkSlot: link.linkSlot,
        supportId: link.supportSkillId,
        supportName,
        editorDisabled: true,
        applied: false,
        skipReason: expl?.skipReason,
        skipReasonZh: expl?.skipReasonZh,
        deltaLines: ['此連結已停用：再「移除」不會改變目前技能層計算結果。'],
        combatDpsDelta: null,
        combatHitDelta: null,
        combatAttackSpeedDelta: null,
        combatCompareUnsupported: true,
        computedStatDeltas: [],
      })
      continue
    }

    if (!expl?.applied) {
      out.push({
        linkSlot: link.linkSlot,
        supportId: link.supportSkillId,
        supportName,
        editorDisabled: false,
        applied: false,
        skipReason: expl?.skipReason,
        skipReasonZh: expl?.skipReasonZh,
        deltaLines: [
          expl
            ? `此輔助目前未套用（${expl.skipReasonZh}），對技能層無數值增減。`
            : '此輔助未套用，對技能層無數值增減。',
        ],
        combatDpsDelta: null,
        combatHitDelta: null,
        combatAttackSpeedDelta: null,
        combatCompareUnsupported: true,
        computedStatDeltas: [],
      })
      continue
    }

    const rowWithout: SkillSetup = {
      ...row,
      supports: row.supports.map((l) =>
        l.linkSlot === link.linkSlot ? { ...l, enabled: false } : { ...l },
      ),
    }
    const snapWithout = cloneSnapshotWithSkillRow(snapshot, slot, rowWithout)
    const instWithout = computeSkillInstanceForMainSlot(rowWithout, snapWithout)
    if (!instWithout) {
      out.push({
        linkSlot: link.linkSlot,
        supportId: link.supportSkillId,
        supportName,
        editorDisabled: false,
        applied: true,
        skipReason: expl.skipReason,
        skipReasonZh: expl.skipReasonZh,
        deltaLines: ['無法建立「移除此輔助」後的技能 instance，無法精算差異。'],
        combatDpsDelta: null,
        combatHitDelta: null,
        combatAttackSpeedDelta: null,
        combatCompareUnsupported: true,
        computedStatDeltas: [],
      })
      continue
    }

    const computedStatDeltas = diffNumericComputedStats(instBase.computedStats, instWithout.computedStats)
    const deltaLines: string[] = []

    const scopedBase = tryComputeInspectedScopedDamagingCombat(snapshot, slot, row)
    const scopedWithout = tryComputeInspectedScopedDamagingCombat(snapshot, slot, rowWithout)

    let combatDpsDelta: number | null = null
    let combatHitDelta: number | null = null
    let combatAttackSpeedDelta: number | null = null
    let combatCompareUnsupported = false
    let combatCompareNote: string | undefined

    if (scopedBase && scopedWithout) {
      combatDpsDelta = scopedBase.combat.dps - scopedWithout.combat.dps
      combatHitDelta = scopedBase.combat.hitDamage - scopedWithout.combat.hitDamage
      combatAttackSpeedDelta = scopedBase.combat.attackSpeed - scopedWithout.combat.attackSpeed

      if (Math.abs(combatHitDelta) > 1e-6) {
        deltaLines.push(
          `局部命中傷害：移除此輔助後約 ${combatHitDelta >= 0 ? '降低' : '提高'} ${Math.abs(combatHitDelta).toFixed(1)}。`,
        )
      }
      if (Math.abs(combatDpsDelta) > 1e-6) {
        const relPct =
          scopedWithout.combat.dps !== 0
            ? ((scopedBase.combat.dps - scopedWithout.combat.dps) / scopedWithout.combat.dps) * 100
            : null
        deltaLines.push(
          `局部 DPS 預覽：移除此輔助後約 ${combatDpsDelta >= 0 ? '降低' : '提高'} ${Math.abs(combatDpsDelta).toFixed(1)}` +
            (relPct != null && Number.isFinite(relPct)
              ? `（相對「移除後」約 ${relPct >= 0 ? '+' : ''}${relPct.toFixed(1)}%）`
              : '') +
            '。',
        )
      }
      if (Math.abs(combatAttackSpeedDelta) > 1e-6) {
        deltaLines.push(
          `衍生攻擊速度：移除此輔助後約 ${combatAttackSpeedDelta >= 0 ? '降低' : '提高'} ${Math.abs(combatAttackSpeedDelta).toFixed(3)}。`,
        )
      }
    } else {
      combatCompareUnsupported = true
      combatCompareNote =
        '無法以與目前相同的「可精算局部 DPS」條件比較移除此輔助後（移除後信賴度或輸出條件可能改變）；以下為技能層 folded 數值差。'
      deltaLines.push(combatCompareNote)
    }

    for (const { labelZh, delta } of computedStatDeltas.slice(0, 8)) {
      const digits = Math.abs(delta) >= 10 || Number.isInteger(delta) ? 0 : 2
      deltaLines.push(
        `技能層「${labelZh}」：移除此輔助後約 ${delta > 0 ? '減少' : '增加'} ${Math.abs(delta).toFixed(digits)}（目前 − 移除後）。`,
      )
    }

    if (computedStatDeltas.length === 0 && deltaLines.length === (combatCompareUnsupported ? 1 : 0)) {
      deltaLines.push(
        '在技能層 folded stats 上未測得可量化差異；若上面亦無 DPS 列，可能代表此輔助僅改變極小數值或資料不足。',
      )
    }

    out.push({
      linkSlot: link.linkSlot,
      supportId: link.supportSkillId,
      supportName,
      editorDisabled: false,
      applied: true,
      skipReason: expl.skipReason,
      skipReasonZh: expl.skipReasonZh,
      deltaLines,
      combatDpsDelta,
      combatHitDelta,
      combatAttackSpeedDelta,
      combatCompareUnsupported,
      combatCompareNote,
      computedStatDeltas,
    })
  }

  return out
}

export function buildStripAllSupportsDelta(
  snapshot: BuildSnapshot,
  slot: MainSkillSlot,
  row: SkillSetup,
  instBase: SkillInstance,
): SkillTabStripAllSupportsDelta {
  const anyEnabled = row.supports.some((l) => l.enabled !== false)
  if (!anyEnabled) {
    return {
      deltaLines: ['目前所有連結均已停用，沒有可一次關閉的套用中輔助。'],
      combatDpsDelta: null,
      combatHitDelta: null,
      combatCompareUnsupported: true,
      computedStatDeltas: [],
    }
  }

  const rowStrip: SkillSetup = {
    ...row,
    supports: row.supports.map((l) => ({ ...l, enabled: false })),
  }
  const instStrip = computeSkillInstanceForMainSlot(
    rowStrip,
    cloneSnapshotWithSkillRow(snapshot, slot, rowStrip),
  )
  const computedStatDeltas = instStrip
    ? diffNumericComputedStats(instBase.computedStats, instStrip.computedStats)
    : []

  const deltaLines: string[] = []
  const scopedBase = tryComputeInspectedScopedDamagingCombat(snapshot, slot, row)
  const scopedStrip = tryComputeInspectedScopedDamagingCombat(snapshot, slot, rowStrip)

  let combatDpsDelta: number | null = null
  let combatHitDelta: number | null = null
  let combatCompareUnsupported = false
  let combatCompareNote: string | undefined

  if (scopedBase && scopedStrip) {
    combatDpsDelta = scopedBase.combat.dps - scopedStrip.combat.dps
    combatHitDelta = scopedBase.combat.hitDamage - scopedStrip.combat.hitDamage
    if (Math.abs(combatHitDelta) > 1e-6) {
      deltaLines.push(
        `局部命中：若停用全部連結輔助，約 ${combatHitDelta >= 0 ? '降低' : '提高'} ${Math.abs(combatHitDelta).toFixed(1)}。`,
      )
    }
    if (Math.abs(combatDpsDelta) > 1e-6) {
      deltaLines.push(
        `局部 DPS：若停用全部連結輔助，約 ${combatDpsDelta >= 0 ? '降低' : '提高'} ${Math.abs(combatDpsDelta).toFixed(1)}。`,
      )
    }
  } else {
    combatCompareUnsupported = true
    combatCompareNote =
      '停用全部連結後無法維持與目前相同的局部 DPS 精算條件；以下僅列技能層 folded 差異。'
    deltaLines.push(combatCompareNote)
  }

  for (const { labelZh, delta } of computedStatDeltas.slice(0, 10)) {
    const digits = Math.abs(delta) >= 10 || Number.isInteger(delta) ? 0 : 2
    deltaLines.push(
      `技能層「${labelZh}」：全部連結停用後約 ${delta > 0 ? '減少' : '增加'} ${Math.abs(delta).toFixed(digits)}（目前 − 全停後）。`,
    )
  }

  if (computedStatDeltas.length === 0 && deltaLines.length <= (combatCompareUnsupported ? 1 : 0)) {
    deltaLines.push('技能層未測得明顯 folded 差異。')
  }

  return {
    deltaLines,
    combatDpsDelta,
    combatHitDelta,
    combatCompareUnsupported,
    combatCompareNote,
    computedStatDeltas,
  }
}
