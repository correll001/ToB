/**
 * 列出 unresolved 節點 effectLines 經 translate 後仍含「（原文：」的列（bridge 候選）。
 *
 *   npx tsx scripts/verify/debugTalentEffectLineBridge.ts
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  translateTalentEffectLineEnToZh,
  translationBridgeLikelyForEffectLines,
} from '@/lib/talent/talentEffectLineZh'
import type { TalentPanelNodesFile } from '@/types/talentPanel'

const ROOT = join(__dirname, '..', '..')
const NODES = join(ROOT, 'data', 'normalized', 'ss12', 'talent-panel-nodes.json')

function main() {
  const nodesFile = JSON.parse(readFileSync(NODES, 'utf8')) as TalentPanelNodesFile
  const lineCounts = new Map<string, number>()
  for (const n of nodesFile.nodes) {
    if (n.mappingStatus !== 'unresolved' || n.unresolvedReason !== 'no_affix_text_match') continue
    if (!translationBridgeLikelyForEffectLines(n.effectLines)) continue
    for (const line of n.effectLines ?? []) {
      const zh = translateTalentEffectLineEnToZh(line)
      if (zh.includes('（原文：')) {
        lineCounts.set(line, (lineCounts.get(line) ?? 0) + 1)
      }
    }
  }
  const rows = [...lineCounts.entries()].sort((a, b) => b[1] - a[1])
  console.log(JSON.stringify({ countDistinctLines: rows.length, top: rows.slice(0, 60) }, null, 2))
}

main()
