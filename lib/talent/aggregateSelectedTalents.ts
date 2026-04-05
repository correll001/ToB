/**
 * 已點天賦總加成聚合（不依賴 DPS / 最終戰鬥公式）。
 */
import { statBlocksFromAffixModifiers } from '@/lib/talent/affixModifiersToStatBlocks'
import { suggestedTalentNodeId } from '@/lib/talent/talentPanelClientData'
import { aggregatedTalentWallBucketsToZh } from '@/lib/talent/aggregateTalentWallBonuses'
import { aggregateStatBlocks } from '@/lib/formula/aggregateStats'
import type { StatBlock } from '@/types/combat'
import type { TalentAffixNormalized } from '@/types/talentAffix'
import type { TalentAggregateInput, TalentAggregateResult, TalentAggregateRawLine } from '@/types/talentAggregate'
import type { TalentPanelNode } from '@/types/talentPanel'

function nodeIdFor(n: TalentPanelNode, season: string): string {
  return n.nodeId?.trim() || suggestedTalentNodeId(n.panelId, n.slotIndex, season)
}

function buildNodeById(nodes: TalentPanelNode[], season: string): Map<string, TalentPanelNode> {
  const m = new Map<string, TalentPanelNode>()
  for (const n of nodes) {
    m.set(nodeIdFor(n, season), n)
  }
  return m
}

/**
 * 聚合已選節點；`ranksByNodeId` 僅統計 >=1 的階級。
 */
export function aggregateSelectedTalents(input: TalentAggregateInput): TalentAggregateResult {
  const { season, ranksByNodeId, nodes, affixById } = input
  const byId = buildNodeById(nodes, season)

  const selectedNodes: TalentAggregateResult['selectedNodes'] = []
  const unresolvedNodes: TalentAggregateResult['unresolvedNodes'] = []
  const resolvedAffixesMap = new Map<string, TalentAffixNormalized>()

  const allBlocks: StatBlock[] = []
  const rawLines: TalentAggregateRawLine[] = []
  const perPanelMap = new Map<
    string,
    { nodeIds: string[]; blocks: StatBlock[]; raw: TalentAggregateRawLine[] }
  >()

  for (const [nodeId, rawRank] of Object.entries(ranksByNodeId)) {
    const rank = Math.floor(Number(rawRank))
    if (!Number.isFinite(rank) || rank < 1) continue

    const n = byId.get(nodeId)
    if (!n) {
      rawLines.push({
        source: 'unresolved_node',
        nodeId,
        panelId: '—',
        lineZh: '（未知 nodeId，略過）',
        detail: nodeId,
      })
      continue
    }

    const panelId = n.panelId
    if (!perPanelMap.has(panelId)) {
      perPanelMap.set(panelId, { nodeIds: [], blocks: [], raw: [] })
    }
    const pBucket = perPanelMap.get(panelId)!
    pBucket.nodeIds.push(nodeId)

    if (n.mappingStatus === 'unresolved' || (!n.mappingStatus && n.affixPending)) {
      unresolvedNodes.push({
        nodeId,
        panelId,
        reason: n.unresolvedReason ?? (n.affixPending ? 'legacy_affix_pending' : null),
        rawNode: n,
      })
      for (const line of n.effectLines ?? []) {
        const rl: TalentAggregateRawLine = {
          source: 'node_effect',
          nodeId,
          panelId,
          lineZh: line,
          detail: 'unresolved_or_pending_node',
        }
        rawLines.push(rl)
        pBucket.raw.push(rl)
      }
      continue
    }

    const aid = n.affixId?.trim()
    if (!aid || n.mappingStatus !== 'resolved') {
      unresolvedNodes.push({
        nodeId,
        panelId,
        reason: n.unresolvedReason ?? 'missing_affix_id',
        rawNode: n,
      })
      continue
    }

    const affix = affixById.get(aid)
    if (!affix) {
      unresolvedNodes.push({
        nodeId,
        panelId,
        reason: 'affix_not_in_dataset',
        rawNode: n,
      })
      continue
    }

    resolvedAffixesMap.set(aid, affix)

    const modifierContributions: TalentAggregateResult['selectedNodes'][0]['modifierContributions'] = []
    const mods = affix.modifiers ?? []
    for (let mi = 0; mi < mods.length; mi++) {
      const stub = mods[mi]!
      modifierContributions.push({
        affixId: aid,
        modifierIndex: mi,
        effectiveWeight: rank,
        stubKind: stub.kind,
        labelZh: stub.labelZh,
        value: stub.value,
      })
    }

    const stubBlocks = statBlocksFromAffixModifiers(mods)
    if (stubBlocks.length === 0 && mods.length > 0) {
      for (const stub of mods) {
        const rl: TalentAggregateRawLine = {
          source: 'affix_unbucketed_modifier',
          nodeId,
          panelId,
          lineZh: `${stub.kind} ${stub.value ?? '?'} ${stub.labelZh}`.trim(),
          detail: aid,
        }
        rawLines.push(rl)
        pBucket.raw.push(rl)
      }
    }
    if (stubBlocks.length === 0 && mods.length === 0) {
      for (const line of affix.descriptionLines ?? []) {
        const rl: TalentAggregateRawLine = {
          source: 'affix_unbucketed_modifier',
          nodeId,
          panelId,
          lineZh: line,
          detail: `${aid}·no_modifiers_stub`,
        }
        rawLines.push(rl)
        pBucket.raw.push(rl)
      }
    }

    for (const sb of stubBlocks) {
      const scaled = scaleStatBlock(sb, rank)
      allBlocks.push(scaled)
      pBucket.blocks.push(scaled)
    }

    selectedNodes.push({
      nodeId,
      panelId,
      slotIndex: n.slotIndex,
      rank,
      rawNode: n,
      affix,
      modifierContributions,
    })
  }

  const buckets = aggregateStatBlocks(allBlocks)
  const bucketLinesZh = aggregatedTalentWallBucketsToZh(buckets)

  const perPanel = [...perPanelMap.entries()].map(([panelId, { nodeIds, blocks, raw }]) => {
    const pb = aggregateStatBlocks(blocks)
    return {
      panelId,
      nodeIds: [...new Set(nodeIds)],
      structuredBuckets: pb,
      bucketLinesZh: aggregatedTalentWallBucketsToZh(pb),
      rawUnbucketedLines: raw,
    }
  })

  return {
    selectedNodes,
    resolvedAffixes: [...resolvedAffixesMap.values()],
    unresolvedNodes,
    totals: {
      structuredBuckets: buckets,
      bucketLinesZh,
      rawUnbucketed: rawLines,
    },
    perPanel,
    perNode: selectedNodes,
  }
}

function scaleStatBlock(b: StatBlock, rank: number): StatBlock {
  const o: StatBlock = {}
  const r = rank
  const mul = (x: number | undefined) => (x != null && Number.isFinite(x) ? x * r : undefined)
  if (b.strength != null) o.strength = mul(b.strength)
  if (b.dexterity != null) o.dexterity = mul(b.dexterity)
  if (b.intelligence != null) o.intelligence = mul(b.intelligence)
  if (b.hpFlat != null) o.hpFlat = mul(b.hpFlat)
  if (b.hpPct != null) o.hpPct = mul(b.hpPct)
  if (b.mpFlat != null) o.mpFlat = mul(b.mpFlat)
  if (b.mpPct != null) o.mpPct = mul(b.mpPct)
  if (b.attackSpeedPct != null) o.attackSpeedPct = mul(b.attackSpeedPct)
  if (b.baseDamageFlat != null) o.baseDamageFlat = mul(b.baseDamageFlat)
  if (b.damagePct != null) o.damagePct = mul(b.damagePct)
  if (b.weaponDamageEffectivenessPct != null) o.weaponDamageEffectivenessPct = mul(b.weaponDamageEffectivenessPct)
  if (b.critChancePct != null) o.critChancePct = mul(b.critChancePct)
  if (b.critDamagePct != null) o.critDamagePct = mul(b.critDamagePct)
  if (b.moreDamagePct != null && b.moreDamagePct !== 0) {
    const mult = Math.pow(1 + b.moreDamagePct / 100, r)
    o.moreDamagePct = (mult - 1) * 100
  }
  return o
}
