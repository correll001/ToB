/**
 * 將 talent-panel-nodes.json 各節點對應到 talent-affixes（可重跑、確定性）。
 *
 *   npx tsx scripts/ingest/applyTalentNodeAffixMapping.ts
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  applyMatchToTalentPanelNode,
  mapTalentPanelNodeToAffix,
  summarizeMappingReport,
} from '@/lib/talent/mapTalentNodesToAffixes'
import type { TalentAffixNormalizedFile } from '@/types/talentAffix'
import type { TalentPanelNodesFile } from '@/types/talentPanel'

const ROOT = join(__dirname, '..', '..')
const NODES = join(ROOT, 'data', 'normalized', 'ss12', 'talent-panel-nodes.json')
const AFFIX = join(ROOT, 'data', 'normalized', 'ss12', 'talent-affixes.json')
const REPORT = join(ROOT, 'data', 'normalized', 'ss12', 'talent-node-affix-map-report.json')

function main() {
  const nodesFile = JSON.parse(readFileSync(NODES, 'utf8')) as TalentPanelNodesFile
  const affixFile = JSON.parse(readFileSync(AFFIX, 'utf8')) as TalentAffixNormalizedFile
  const affixes = affixFile.affixes

  const matches = nodesFile.nodes.map((n) => mapTalentPanelNodeToAffix(n, affixes))
  const nextNodes = nodesFile.nodes.map((n, i) => applyMatchToTalentPanelNode(n, matches[i]!))

  const report = {
    ...summarizeMappingReport(matches),
    generatedAt: new Date().toISOString(),
    sampleUnresolved: matches
      .map((m, i) => ({ i, panelId: nodesFile.nodes[i]!.panelId, slot: nodesFile.nodes[i]!.slotIndex, ...m }))
      .filter((x) => x.mappingStatus === 'unresolved')
      .slice(0, 40),
  }

  const outFile: TalentPanelNodesFile = {
    ...nodesFile,
    readMeZh: [
      '節點座標與 requires / edges 來自 TLI Compendium SS11 `talent-tree/*/master` bundle。',
      '格線：x = position，y = tier，slotIndex = y*8+x（8×5）。',
      '各節點含 mappingStatus：resolved 時有 affixId；unresolved 時有 unresolvedReason（機讀原因碼）。',
      '重跑對應：npx tsx scripts/ingest/applyTalentNodeAffixMapping.ts；報告：talent-node-affix-map-report.json。',
    ],
    sourceNote:
      'Node→affix mapping applied via scripts/ingest/applyTalentNodeAffixMapping.ts; see talent-node-affix-map-report.json.',
    nodeCount: nextNodes.length,
    nodes: nextNodes,
  }

  writeFileSync(NODES, `${JSON.stringify(outFile, null, 2)}\n`, 'utf8')
  writeFileSync(REPORT, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  console.log('[applyTalentNodeAffixMapping] wrote', NODES)
  console.log('[applyTalentNodeAffixMapping] report', REPORT)
  console.log(JSON.stringify(report, null, 2))
}

main()
