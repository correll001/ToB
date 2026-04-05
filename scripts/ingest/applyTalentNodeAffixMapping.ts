/**
 * 將 talent-panel-nodes.json 各節點對應到 talent-affixes（可重跑、確定性）。
 * 流程：① 自動 mapTalentNodesToAffixes ② 套用 data/manual/.../talent-node-affix-adjudications.json（approved）。
 *
 *   npx tsx scripts/ingest/applyTalentNodeAffixMapping.ts
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  applyAdjudicationsToNodes,
  parseTalentNodeAdjudicationFile,
} from '@/lib/talent/applyTalentNodeAffixAdjudications'
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
const ADJ = join(ROOT, 'data', 'manual', 'ss12', 'talent-node-affix-adjudications.json')

function main() {
  const nodesFile = JSON.parse(readFileSync(NODES, 'utf8')) as TalentPanelNodesFile
  const affixFile = JSON.parse(readFileSync(AFFIX, 'utf8')) as TalentAffixNormalizedFile
  const affixes = affixFile.affixes
  const affixById = new Map(affixes.map((a) => [a.affixId, a]))

  const matches = nodesFile.nodes.map((n) => mapTalentPanelNodeToAffix(n, affixes))
  let nextNodes = nodesFile.nodes.map((n, i) => applyMatchToTalentPanelNode(n, matches[i]!))

  const autoReport = summarizeMappingReport(matches)
  const unresolvedAfterAuto = autoReport.unresolved

  let adjudicationParseErrors: string[] = []
  let adjudicationApplyErrors: string[] = []
  let manualApplied = 0

  try {
    const adjRaw = JSON.parse(readFileSync(ADJ, 'utf8'))
    const parsed = parseTalentNodeAdjudicationFile(adjRaw)
    adjudicationParseErrors = parsed.errors
    if (parsed.file && adjudicationParseErrors.length === 0) {
      if (parsed.file.season !== nodesFile.season) {
        adjudicationApplyErrors.push(
          `adjudication season ${parsed.file.season} !== nodes.season ${nodesFile.season}`,
        )
      } else {
        const applied = applyAdjudicationsToNodes(nodesFile.season, nextNodes, parsed.file, affixById)
        adjudicationApplyErrors = applied.errors
        manualApplied = applied.stats.appliedApproved
        if (adjudicationApplyErrors.length === 0) {
          nextNodes = applied.nodes
        }
      }
    }
  } catch (e) {
    adjudicationParseErrors.push(`failed to read ${ADJ}: ${e instanceof Error ? e.message : String(e)}`)
  }

  // Recompute summary from written nodes (accurate for resolved/unresolved counts)
  let resolved = 0
  let unresolved = 0
  const byConfidence: Record<string, number> = {}
  const unresolvedReasons: Record<string, number> = {}
  for (const n of nextNodes) {
    if (n.mappingStatus === 'resolved') {
      resolved++
      const c = n.mappingConfidence ?? 'unknown'
      byConfidence[c] = (byConfidence[c] ?? 0) + 1
    } else {
      unresolved++
      const r = n.unresolvedReason ?? 'unknown'
      unresolvedReasons[r] = (unresolvedReasons[r] ?? 0) + 1
    }
  }

  const report = {
    provenance: 'applyTalentNodeAffixMapping:v2',
    autoLayerProvenance: autoReport.provenance,
    totalNodes: nextNodes.length,
    resolved,
    unresolved,
    unresolvedAfterAuto,
    resolvedByManualAdjudication: manualApplied,
    byConfidence,
    unresolvedReasons,
    adjudicationFile: ADJ,
    adjudicationParseErrors,
    adjudicationApplyErrors,
    generatedAt: new Date().toISOString(),
    sampleUnresolved: nextNodes
      .map((n, i) => ({
        i,
        panelId: n.panelId,
        slot: n.slotIndex,
        nodeId: n.nodeId?.trim() || `talnode:${nodesFile.season}:${n.panelId}:s${n.slotIndex}`,
        mappingStatus: n.mappingStatus,
        unresolvedReason: n.unresolvedReason,
        mappingConfidence: n.mappingConfidence,
      }))
      .filter((x) => x.mappingStatus === 'unresolved')
      .slice(0, 40),
  }

  if (adjudicationParseErrors.length || adjudicationApplyErrors.length) {
    console.error('[applyTalentNodeAffixMapping] adjudication errors (nodes NOT written):')
    for (const e of adjudicationParseErrors) console.error(' ', e)
    for (const e of adjudicationApplyErrors) console.error(' ', e)
    process.exit(1)
  }

  const outFile: TalentPanelNodesFile = {
    ...nodesFile,
    readMeZh: [
      '節點座標與 requires / edges 來自 TLI Compendium SS11 `talent-tree/*/master` bundle。',
      '格線：x = position，y = tier，slotIndex = y*8+x（8×5）。',
      '各節點含 mappingStatus：resolved 時有 affixId；unresolved 時有 unresolvedReason（機讀原因碼）。',
      '重跑對應：npx tsx scripts/ingest/applyTalentNodeAffixMapping.ts（自動層 + data/manual/ss12/talent-node-affix-adjudications.json）。',
    ],
    sourceNote:
      'Node→affix: auto mapTalentNodesToAffixes:v1 then manual adjudications; see talent-node-affix-map-report.json.',
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
