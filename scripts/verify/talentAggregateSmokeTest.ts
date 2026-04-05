/**
 * 煙霧測試：aggregateSelectedTalents 輸出結構。
 *
 *   npx tsx scripts/verify/talentAggregateSmokeTest.ts
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { aggregateSelectedTalents } from '@/lib/talent/aggregateSelectedTalents'
import type { TalentAffixNormalizedFile } from '@/types/talentAffix'
import type { TalentPanelNodesFile } from '@/types/talentPanel'

const ROOT = join(__dirname, '..', '..')
const NODES = join(ROOT, 'data', 'normalized', 'ss12', 'talent-panel-nodes.json')
const AFFIX = join(ROOT, 'data', 'normalized', 'ss12', 'talent-affixes.json')

function main() {
  const nodesFile = JSON.parse(readFileSync(NODES, 'utf8')) as TalentPanelNodesFile
  const affixFile = JSON.parse(readFileSync(AFFIX, 'utf8')) as TalentAffixNormalizedFile
  const affixById = new Map(affixFile.affixes.map((a) => [a.affixId, a]))

  const might = nodesFile.nodes.filter((n) => n.panelId === 'god_God_of_Might' && n.mappingStatus === 'resolved')
  const manual = might.find((n) => n.mappingConfidence === 'manual_adjudicated')
  const autoPicks = might.filter((n) => n.mappingConfidence !== 'manual_adjudicated').slice(0, 4)
  const picks = manual ? [...autoPicks, manual] : might.slice(0, 5)
  const ranksByNodeId: Record<string, number> = {}
  for (const n of picks) {
    const id = n.nodeId?.trim() || `talnode:${nodesFile.season}:${n.panelId}:s${n.slotIndex}`
    ranksByNodeId[id] = n.maxRank >= 2 ? 2 : 1
  }

  const out = aggregateSelectedTalents({
    season: nodesFile.season,
    ranksByNodeId,
    nodes: nodesFile.nodes,
    affixById,
  })

  const summary = {
    selectedCount: out.selectedNodes.length,
    manualSelectedCount: out.selectedNodes.filter((s) => s.mappingResolutionSource === 'manual').length,
    autoSelectedCount: out.selectedNodes.filter((s) => s.mappingResolutionSource === 'auto').length,
    resolvedAffixCount: out.resolvedAffixes.length,
    unresolvedCount: out.unresolvedNodes.length,
    bucketLineCount: out.totals.bucketLinesZh.length,
    rawUnbucketedCount: out.totals.rawUnbucketed.length,
    perPanelCount: out.perPanel.length,
    perPanelSourceSample: out.perPanel[0]?.nodeIdsByMappingSource,
    sampleBuckets: out.totals.bucketLinesZh.slice(0, 8),
    sampleRaw: out.totals.rawUnbucketed.slice(0, 5),
  }

  console.log(JSON.stringify(summary, null, 2))

  if (out.selectedNodes.length === 0 && picks.length > 0) {
    console.error('[talentAggregateSmokeTest] FAIL: expected some selected nodes')
    process.exit(1)
  }

  if (manual && !out.selectedNodes.some((s) => s.mappingResolutionSource === 'manual')) {
    console.error('[talentAggregateSmokeTest] FAIL: expected manual adjudicated node in aggregate')
    process.exit(1)
  }

  console.log('[talentAggregateSmokeTest] OK')
}

main()
