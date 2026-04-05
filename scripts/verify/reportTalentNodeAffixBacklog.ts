/**
 * 產出 talent node→affix unresolved 的批次化 backlog（JSON + Markdown）。
 *
 *   npx tsx scripts/verify/reportTalentNodeAffixBacklog.ts
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseTalentNodeAdjudicationFile } from '@/lib/talent/applyTalentNodeAffixAdjudications'
import { buildTalentNodeAffixBacklog } from '@/lib/talent/buildTalentNodeAffixBacklog'
import type { TalentAffixNormalizedFile } from '@/types/talentAffix'
import type { TalentNodeAffixBacklogEntry } from '@/lib/talent/buildTalentNodeAffixBacklog'

const ROOT = join(__dirname, '..', '..')
const NODES = join(ROOT, 'data', 'normalized', 'ss12', 'talent-panel-nodes.json')
const AFFIX = join(ROOT, 'data', 'normalized', 'ss12', 'talent-affixes.json')
const ADJ = join(ROOT, 'data', 'manual', 'ss12', 'talent-node-affix-adjudications.json')
const MAP_REPORT = join(ROOT, 'data', 'normalized', 'ss12', 'talent-node-affix-map-report.json')
const OUT_JSON = join(ROOT, 'data', 'normalized', 'ss12', 'talent-node-affix-backlog.json')
const OUT_MD = join(ROOT, 'data', 'normalized', 'ss12', 'talent-node-affix-backlog.md')

function topMulti(entries: TalentNodeAffixBacklogEntry[], k: number): TalentNodeAffixBacklogEntry[] {
  return [...entries]
    .filter((e) => e.candidateCount > 0)
    .sort((a, b) => b.candidateCount - a.candidateCount || b.priority - a.priority)
    .slice(0, k)
}

function adjudicationRowsSummary(adjRaw: unknown): {
  approved: number
  tentative: number
  rejected: number
} {
  const parsed = parseTalentNodeAdjudicationFile(adjRaw)
  if (!parsed.file) return { approved: 0, tentative: 0, rejected: 0 }
  let approved = 0
  let tentative = 0
  let rejected = 0
  for (const a of parsed.file.adjudications) {
    if (a.reviewStatus === 'approved') approved++
    else if (a.reviewStatus === 'tentative') tentative++
    else rejected++
  }
  return { approved, tentative, rejected }
}

function main() {
  const nodesFile = JSON.parse(readFileSync(NODES, 'utf8')) as {
    season: string
    nodes: import('@/types/talentPanel').TalentPanelNode[]
  }
  const affixFile = JSON.parse(readFileSync(AFFIX, 'utf8')) as TalentAffixNormalizedFile
  const adjRaw = JSON.parse(readFileSync(ADJ, 'utf8'))
  const parsedAdj = parseTalentNodeAdjudicationFile(adjRaw)
  const adjudications = parsedAdj.file?.adjudications ?? []

  let mapReport: Record<string, unknown> = {}
  try {
    mapReport = JSON.parse(readFileSync(MAP_REPORT, 'utf8')) as Record<string, unknown>
  } catch {
    mapReport = {}
  }

  const generatedAt = new Date().toISOString()
  const backlog = buildTalentNodeAffixBacklog({
    season: nodesFile.season,
    nodes: nodesFile.nodes,
    affixes: affixFile.affixes,
    adjudications,
    generatedAt,
  })

  const adjSummary = adjudicationRowsSummary(adjRaw)
  const tentativeNodes = backlog.entries.filter((e) => e.hasTentativeAdjudication)
  const rejectedNodes = backlog.entries.filter((e) => e.hasRejectedAdjudication)

  const out = {
    ...backlog,
    mapReportSnapshot: {
      resolved: mapReport.resolved,
      unresolved: mapReport.unresolved,
      unresolvedReasons: mapReport.unresolvedReasons,
      byConfidence: mapReport.byConfidence,
      comparison: mapReport.comparison,
    },
    adjudicationFileSummary: adjSummary,
    governanceNotes: {
      tentativeUnresolvedNodes: tentativeNodes.length,
      rejectedOnFileUnresolvedNodes: rejectedNodes.length,
    },
  }

  const md: string[] = [
    '# Talent node → affix unresolved backlog',
    '',
    `Generated: ${generatedAt}`,
    `Season: ${backlog.season}`,
    '',
    '## Summary',
    '',
    `- **total unresolved**: ${backlog.summary.totalUnresolved}`,
    `- **adjudication rows**: approved ${adjSummary.approved}, tentative ${adjSummary.tentative}, rejected ${adjSummary.rejected}`,
    `- **tentative + still unresolved**: ${tentativeNodes.length}`,
    `- **rejected on file + still unresolved**: ${rejectedNodes.length}`,
    '',
  ]

  if (mapReport.comparison && typeof mapReport.comparison === 'object') {
    md.push('## Latest ingest comparison (from talent-node-affix-map-report.json)', '')
    md.push('```json')
    md.push(JSON.stringify(mapReport.comparison, null, 2))
    md.push('```')
    md.push('')
  }

  md.push('## unresolvedReason 分布', '')
  md.push('| reason | count |', '|--------|-------|')
  for (const [reason, count] of Object.entries(backlog.summary.byUnresolvedReason).sort(
    (a, b) => b[1] - a[1],
  )) {
    md.push(`| \`${reason}\` | ${count} |`)
  }
  md.push('')

  md.push('## batch 分布', '')
  md.push('| batchKey | count |', '|----------|-------|')
  for (const [k, v] of Object.entries(backlog.summary.byBatch)) {
    md.push(`| \`${k}\` | ${v} |`)
  }
  md.push('')

  md.push('## Panel unresolved 排名（前 25）', '')
  md.push('| panelId | count |', '|---------|-------|')
  for (const row of backlog.perPanelUnresolved.slice(0, 25)) {
    md.push(`| \`${row.panelId}\` | ${row.count} |`)
  }
  md.push('')

  md.push('## candidateCount 最高的多候選案件（前 20）', '')
  md.push('| nodeId | panel | slot | candidates | reason |', '|--------|-------|------|------------|--------|')
  for (const e of topMulti(backlog.entries, 20)) {
    md.push(
      `| \`${e.nodeId}\` | ${e.panelId} | ${e.slotIndex} | ${e.candidateCount} | \`${e.unresolvedReason}\` |`,
    )
  }
  md.push('')

  md.push('## 建議優先補 translation bridge 的 effectLines（translation_bridge_priority 桶）', '')
  md.push('| English effectLine | 影響節點數 |', '|--------------------|------------|')
  for (const row of backlog.translationBridgeCandidateSubset.slice(0, 40)) {
    md.push(`| \`${row.effectLine.replace(/`/g, '\\`')}\` | ${row.affectedNodeCount} |`)
  }
  md.push('')

  md.push('## 裁決後續（adjudication_followup + manual_disambiguation 摘要）', '')
  md.push(`- adjudication_candidate_subset 筆數: ${backlog.adjudicationCandidateSubset.length}`)
  md.push('')
  md.push('| nodeId | batchKey | tentative | rejected | candidates |', '|--------|----------|-----------|----------|------------|')
  for (const e of backlog.adjudicationCandidateSubset.slice(0, 35)) {
    md.push(
      `| \`${e.nodeId}\` | \`${e.batchKey}\` | ${e.hasTentativeAdjudication} | ${e.hasRejectedAdjudication} | ${e.candidateCount} |`,
    )
  }
  md.push('')

  md.push('## 批次定義與建議路徑', '')
  md.push('見 `docs/talent-panels/translation-bridge-governance.md` 與 `docs/talent-panels/manual-adjudication-rules.md`。')
  md.push('')

  writeFileSync(OUT_JSON, `${JSON.stringify(out, null, 2)}\n`, 'utf8')
  writeFileSync(OUT_MD, md.join('\n'), 'utf8')
  console.log('[reportTalentNodeAffixBacklog] wrote', OUT_JSON)
  console.log('[reportTalentNodeAffixBacklog] wrote', OUT_MD)
}

main()
