/**
 * 產出 unresolved 節點的人工審閱清單（JSON + Markdown），含候選 affix 與裁決表狀態。
 *
 *   npx tsx scripts/verify/reviewTalentNodeAffixUnresolved.ts
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseTalentNodeAdjudicationFile } from '@/lib/talent/applyTalentNodeAffixAdjudications'
import { mapTalentPanelNodeToAffix } from '@/lib/talent/mapTalentNodesToAffixes'
import { buildSuggestedNodeId } from '@/lib/talent/validateTalentPanelData'
import type { TalentAffixNormalizedFile } from '@/types/talentAffix'
import type { TalentNodeAdjudicationEntry } from '@/types/talentAdjudication'
import type { TalentPanelNodesFile, TalentPanelNode } from '@/types/talentPanel'

const ROOT = join(__dirname, '..', '..')
const NODES = join(ROOT, 'data', 'normalized', 'ss12', 'talent-panel-nodes.json')
const AFFIX = join(ROOT, 'data', 'normalized', 'ss12', 'talent-affixes.json')
const ADJ = join(ROOT, 'data', 'manual', 'ss12', 'talent-node-affix-adjudications.json')
const OUT_JSON = join(ROOT, 'data', 'normalized', 'ss12', 'talent-node-affix-unresolved-review.json')
const OUT_MD = join(ROOT, 'data', 'normalized', 'ss12', 'talent-node-affix-unresolved-review.md')

function nodeIdOf(n: TalentPanelNode, season: string): string {
  return n.nodeId?.trim() || buildSuggestedNodeId(season, n.panelId, n.slotIndex)
}

function adjudicationsForNodeId(
  list: TalentNodeAdjudicationEntry[],
  nodeId: string,
): TalentNodeAdjudicationEntry[] {
  return list.filter((a) => a.nodeId === nodeId)
}

function candidateSummaries(
  ids: string[] | undefined,
  affixById: Map<string, { displayName: string; gameDataId: string | null; sourceTab: string }>,
): Array<{ affixId: string; displayName: string; gameDataId: string | null; sourceTab: string }> {
  if (!ids?.length) return []
  return ids.map((id) => {
    const a = affixById.get(id)
    return {
      affixId: id,
      displayName: a?.displayName ?? '(missing)',
      gameDataId: a?.gameDataId ?? null,
      sourceTab: a?.sourceTab ?? '?',
    }
  })
}

function main() {
  const nodesFile = JSON.parse(readFileSync(NODES, 'utf8')) as TalentPanelNodesFile
  const affixFile = JSON.parse(readFileSync(AFFIX, 'utf8')) as TalentAffixNormalizedFile
  const affixById = new Map(
    affixFile.affixes.map((a) => [
      a.affixId,
      { displayName: a.displayName, gameDataId: a.gameDataId, sourceTab: a.sourceTab },
    ]),
  )

  let adjList: TalentNodeAdjudicationEntry[] = []
  try {
    const adjRaw = JSON.parse(readFileSync(ADJ, 'utf8'))
    const parsed = parseTalentNodeAdjudicationFile(adjRaw)
    if (parsed.file && !parsed.errors.length) adjList = parsed.file.adjudications
  } catch {
    // review still useful without adjudication file
  }

  const season = nodesFile.season
  type ReviewEntry = {
    nodeId: string
    panelId: string
    slotIndex: number
    x: number
    y: number
    nodeType: string
    maxRank: number
    effectLines: string[]
    notes: string[]
    mappingStatus: string
    unresolvedReason: string | null | undefined
    candidateCount: number
    candidateAffixIds: string[]
    candidateSummaries: ReturnType<typeof candidateSummaries>
    whyNotAuto: string
    adjudicationsOnFile: Array<{
      adjudicationId: string
      reviewStatus: string
      chosenAffixId: string
      reason: string
      reviewedBy: string
      updatedAt: string
    }>
    suggestedNextStep: string
  }

  const entries: ReviewEntry[] = []
  const mdParts: string[] = [
    '# Talent node → affix unresolved review',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Season: ${season}`,
    '',
    '---',
    '',
  ]

  const unresolved = nodesFile.nodes.filter((n) => n.mappingStatus === 'unresolved')
  for (const n of unresolved) {
    const match = mapTalentPanelNodeToAffix(n, affixFile.affixes)
    const nid = nodeIdOf(n, season)
    const adjs = adjudicationsForNodeId(adjList, nid)
    const row: ReviewEntry = {
      nodeId: nid,
      panelId: n.panelId,
      slotIndex: n.slotIndex,
      x: n.x,
      y: n.y,
      nodeType: n.nodeType,
      maxRank: n.maxRank,
      effectLines: n.effectLines ?? [],
      notes: n.notes ?? [],
      mappingStatus: n.mappingStatus,
      unresolvedReason: n.unresolvedReason,
      candidateCount: match.debugCandidateAffixIds?.length ?? 0,
      candidateAffixIds: match.debugCandidateAffixIds ?? [],
      candidateSummaries: candidateSummaries(match.debugCandidateAffixIds, affixById),
      whyNotAuto:
        match.unresolvedReason === 'multiple_candidates_same_text' ||
        match.unresolvedReason === 'multiple_candidates_same_text_modifiers_tie'
          ? 'Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.'
          : match.unresolvedReason === 'no_affix_text_match'
            ? 'No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).'
            : match.unresolvedReason === 'missing_effect_lines_anchor'
              ? 'Node has no effectLines; no deterministic text anchor.'
              : match.unresolvedReason === 'multiple_candidates_core_talent_tab'
                ? 'Multiple core_talent rows match the same needles.'
                : 'See unresolvedReason code.',
      adjudicationsOnFile: adjs.map((a) => ({
        adjudicationId: a.adjudicationId,
        reviewStatus: a.reviewStatus,
        chosenAffixId: a.chosenAffixId,
        reason: a.reason,
        reviewedBy: a.reviewedBy,
        updatedAt: a.updatedAt,
      })),
      suggestedNextStep:
        adjs.some((a) => a.reviewStatus === 'approved')
          ? 'If node is still unresolved, re-run ingest:apply after fixing adjudication or matcher.'
          : match.debugCandidateAffixIds?.length
            ? 'Pick one candidate in talent-node-affix-adjudications.json with evidence (e.g. exclude rows with extra stats not on node).'
            : 'Extend deterministic translation table or add external id mapping; or adjudicate with manual_external_reference_match if TLIDB row is provably unique.',
    }
    entries.push(row)

    mdParts.push(`## ${nid}`)
    mdParts.push('')
    mdParts.push(`- **panel**: \`${n.panelId}\`  **slot**: ${n.slotIndex}  **type**: ${n.nodeType}`)
    mdParts.push(`- **unresolvedReason**: \`${n.unresolvedReason}\``)
    mdParts.push('')
    mdParts.push('### effectLines')
    mdParts.push('')
    for (const line of n.effectLines ?? []) mdParts.push(`- ${line}`)
    mdParts.push('')
    mdParts.push('### source notes')
    mdParts.push('')
    for (const note of n.notes ?? []) mdParts.push(`- \`${note}\``)
    mdParts.push('')
    mdParts.push('### 為何自動層無法決定')
    mdParts.push('')
    mdParts.push(row.whyNotAuto)
    mdParts.push('')
    const cands = row.candidateSummaries
    if (cands.length) {
      mdParts.push('### candidate affix（自動層留下的候選）')
      mdParts.push('')
      mdParts.push('| affixId | gameDataId | sourceTab | displayName |')
      mdParts.push('|---------|------------|-------------|-------------|')
      for (const c of cands) {
        mdParts.push(
          `| \`${c.affixId}\` | ${c.gameDataId ?? 'null'} | ${c.sourceTab} | ${c.displayName.replace(/\|/g, '\\|')} |`,
        )
      }
      mdParts.push('')
    } else {
      mdParts.push('### candidate affix')
      mdParts.push('')
      mdParts.push('（無 — 多為 no_affix_text_match 或缺 effectLines）')
      mdParts.push('')
    }
    if (adjs.length) {
      mdParts.push('### 裁決表上已有列')
      mdParts.push('')
      for (const a of adjs) {
        mdParts.push(
          `- \`${a.adjudicationId}\` **${a.reviewStatus}** → \`${a.chosenAffixId}\` (${a.reason})`,
        )
      }
      mdParts.push('')
    }
    mdParts.push('### 建議人工決策欄（填寫後寫入 adjudications.json）')
    mdParts.push('')
    mdParts.push('- chosenAffixId: ')
    mdParts.push('- reason: ')
    mdParts.push('- evidence: ')
    mdParts.push('- reviewedBy: ')
    mdParts.push('')
    mdParts.push('---')
    mdParts.push('')
  }

  const outJson = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    season,
    totalUnresolved: unresolved.length,
    entries,
  }

  writeFileSync(OUT_JSON, `${JSON.stringify(outJson, null, 2)}\n`, 'utf8')
  writeFileSync(OUT_MD, mdParts.join('\n'), 'utf8')
  console.log('[reviewTalentNodeAffixUnresolved] wrote', OUT_JSON)
  console.log('[reviewTalentNodeAffixUnresolved] wrote', OUT_MD)
  console.log('total unresolved:', unresolved.length)
}

main()
