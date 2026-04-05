import type { BuildSnapshot } from '@/types/build'
import type { AggregatedBuckets, StatBlock } from '@/types/combat'
import type { TalentPanelNode } from '@/types/talentPanel'
import { aggregateStatBlocks } from '@/lib/formula/aggregateStats'
import { suggestedTalentNodeId, TALENT_PANEL_NODES_FILE, TALENT_PANEL_SEASON } from '@/lib/talent/talentPanelClientData'
import { translateTalentEffectLineEnToZh } from '@/lib/talent/talentEffectLineZh'
import { statBlocksForTalentLineAndRank } from '@/lib/talent/parseTalentEffectLineToStatBlock'
import {
  lookupCoreTalentAffix,
  NAMED_GRAND_TALENT_SLOT_COUNT,
  normalizeNamedGrandAffixSlots,
} from '@/lib/talent/namedGrandTalentCatalog'
import { statBlocksFromAffixModifiers } from '@/lib/talent/affixModifiersToStatBlocks'

function buildNodeById(): Map<string, TalentPanelNode> {
  const m = new Map<string, TalentPanelNode>()
  const season = TALENT_PANEL_SEASON
  for (const n of TALENT_PANEL_NODES_FILE.nodes) {
    const id = n.nodeId?.trim() || suggestedTalentNodeId(n.panelId, n.slotIndex, season)
    m.set(id, n)
  }
  return m
}

const NODE_BY_ID = buildNodeById()

export type TalentWallUnbucketedRollup = {
  lineZh: string
  stackedWeight: number
}

export function aggregatedTalentWallBucketsToZh(b: AggregatedBuckets): string[] {
  const lines: string[] = []
  const r0 = (n: number) => Math.round(n * 100) / 100

  if (b.strength) lines.push(`力量 +${r0(b.strength)}`)
  if (b.dexterity) lines.push(`敏捷 +${r0(b.dexterity)}`)
  if (b.intelligence) lines.push(`智慧 +${r0(b.intelligence)}`)
  if (b.hpFlat) lines.push(`生命（固定） +${r0(b.hpFlat)}`)
  if (b.hpPct) lines.push(`最大生命 +${r0(b.hpPct)}%`)
  if (b.mpFlat) lines.push(`魔力（固定） +${r0(b.mpFlat)}`)
  if (b.mpPct) lines.push(`最大魔力 +${r0(b.mpPct)}%`)
  if (b.attackSpeedPct) lines.push(`攻擊／施法速度 +${r0(b.attackSpeedPct)}%`)
  if (b.baseDamageFlat) lines.push(`基礎傷害 +${r0(b.baseDamageFlat)}`)
  if (b.damagePct) lines.push(`傷害（遞增 %） +${r0(b.damagePct)}%`)
  if (b.weaponDamageEffectivenessPct) lines.push(`武器傷害效用 +${r0(b.weaponDamageEffectivenessPct)}%`)
  if (b.critChancePct) lines.push(`暴擊值相關 +${r0(b.critChancePct)}%`)
  if (b.critDamagePct) lines.push(`暴擊傷害 +${r0(b.critDamagePct)}%`)
  if (b.moreDamageMult !== 1) lines.push(`額外傷害（連乘） ×${r0(b.moreDamageMult)}`)

  lines.sort((a, x) => a.localeCompare(x, 'zh-Hant'))
  return lines
}

/**
 * 四盤天賦牆：節點效果解析進 StatBlock 後以 aggregateStatBlocks 合併；無法解析的列仍附在 unbucketed。
 * 具名頂級天賦（核心天賦詞綴）修飾符一併併入同一套桶。
 */
export function aggregateTalentWallBonuses(snapshot: BuildSnapshot): {
  totalTalentPoints: number
  buckets: AggregatedBuckets
  bucketLinesZh: string[]
  unbucketed: TalentWallUnbucketedRollup[]
} {
  const blocks: StatBlock[] = []
  const textTally = new Map<string, number>()
  let totalTalentPoints = 0

  const boards = snapshot.talentWallBoards
  if (!Array.isArray(boards)) {
    const empty = aggregateStatBlocks([])
    return { totalTalentPoints: 0, buckets: empty, bucketLinesZh: [], unbucketed: [] }
  }

  for (const board of boards) {
    if (!board?.ranks || typeof board.ranks !== 'object') continue

    const slots = normalizeNamedGrandAffixSlots(board.namedGrandAffixSlots)
    for (let i = 0; i < NAMED_GRAND_TALENT_SLOT_COUNT; i++) {
      const id = slots[i]
      if (typeof id !== 'string' || id.trim() === '') continue
      const affix = lookupCoreTalentAffix(id.trim())
      if (!affix) continue
      blocks.push(...statBlocksFromAffixModifiers(affix.modifiers ?? []))
    }

    for (const [nodeId, raw] of Object.entries(board.ranks)) {
      const r = Math.floor(Number(raw))
      if (!Number.isFinite(r) || r < 1) continue
      totalTalentPoints += r

      const node = NODE_BY_ID.get(nodeId)
      const lines = node?.effectLines
      if (!lines?.length) {
        const key = `（無匯入效果摘要 · ${board.panelId}）`
        textTally.set(key, (textTally.get(key) ?? 0) + r)
        continue
      }
      for (const line of lines) {
        const parsed = statBlocksForTalentLineAndRank(line, r)
        if (parsed.length > 0) {
          blocks.push(...parsed)
        } else {
          const zh = translateTalentEffectLineEnToZh(line)
          textTally.set(zh, (textTally.get(zh) ?? 0) + r)
        }
      }
    }
  }

  const buckets = aggregateStatBlocks(blocks)
  const bucketLinesZh = aggregatedTalentWallBucketsToZh(buckets)
  const unbucketed: TalentWallUnbucketedRollup[] = [...textTally.entries()]
    .map(([lineZh, stackedWeight]) => ({ lineZh, stackedWeight }))
    .sort((a, b) => b.stackedWeight - a.stackedWeight || a.lineZh.localeCompare(b.lineZh, 'zh-Hant'))

  return { totalTalentPoints, buckets, bucketLinesZh, unbucketed }
}
