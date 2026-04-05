/**
 * 驗證 talent-panel-nodes 與 talent-affixes 對應完整性 + 人工裁決表治理規則。
 *
 *   npx tsx scripts/verify/verifyTalentNodeAffixMapping.ts
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  parseTalentNodeAdjudicationFile,
  validateAdjudicationsAgainstRefs,
} from '@/lib/talent/applyTalentNodeAffixAdjudications'
import { buildSuggestedNodeId } from '@/lib/talent/validateTalentPanelData'
import type { TalentAffixNormalizedFile } from '@/types/talentAffix'
import type { TalentNodeAdjudicationEntry } from '@/types/talentAdjudication'
import type { TalentPanelNodesFile, TalentPanelNode } from '@/types/talentPanel'

const ROOT = join(__dirname, '..', '..')
const NODES = join(ROOT, 'data', 'normalized', 'ss12', 'talent-panel-nodes.json')
const AFFIX = join(ROOT, 'data', 'normalized', 'ss12', 'talent-affixes.json')
const ADJ = join(ROOT, 'data', 'manual', 'ss12', 'talent-node-affix-adjudications.json')

function nodeIdOf(n: TalentPanelNode, season: string): string {
  return n.nodeId?.trim() || buildSuggestedNodeId(season, n.panelId, n.slotIndex)
}

function linesEqual(a: string[] | undefined, b: string[]): boolean {
  const x = a ?? []
  if (x.length !== b.length) return false
  return x.every((v, i) => v === b[i]!)
}

function main() {
  const nodesFile = JSON.parse(readFileSync(NODES, 'utf8')) as TalentPanelNodesFile
  const affixFile = JSON.parse(readFileSync(AFFIX, 'utf8')) as TalentAffixNormalizedFile
  const affixSet = new Set(affixFile.affixes.map((a) => a.affixId))
  const season = nodesFile.season

  const errors: string[] = []
  let resolved = 0
  let unresolved = 0
  let legacyPending = 0
  let manualResolved = 0
  let autoResolved = 0

  for (let i = 0; i < nodesFile.nodes.length; i++) {
    const n = nodesFile.nodes[i]!
    const label = `node[#${i} panel=${n.panelId} slot=${n.slotIndex}]`

    if (n.mappingStatus === 'resolved') {
      resolved++
      if (n.mappingConfidence === 'manual_adjudicated') manualResolved++
      else if (
        n.mappingConfidence === 'normalized_text_talent_tree' ||
        n.mappingConfidence === 'normalized_text_core_talent' ||
        n.mappingConfidence === 'constrained_fallback_unique'
      ) {
        autoResolved++
      }

      const id = n.affixId?.trim()
      if (!id) errors.push(`${label}: resolved 但缺少 affixId`)
      else if (!affixSet.has(id)) errors.push(`${label}: affixId 不在 talent-affixes: ${id}`)
      if (n.unresolvedReason != null && String(n.unresolvedReason).length > 0) {
        errors.push(`${label}: resolved 不應帶 unresolvedReason`)
      }
      if (n.mappingConfidence === 'manual_adjudicated') {
        const aid = n.mappingAdjudicationId?.trim()
        if (!aid) {
          errors.push(`${label}: manual_adjudicated 必須有 mappingAdjudicationId`)
        }
      }
      continue
    }

    if (n.mappingStatus === 'unresolved') {
      unresolved++
      if (!n.unresolvedReason || !String(n.unresolvedReason).trim()) {
        errors.push(`${label}: unresolved 必須有 unresolvedReason`)
      }
      if (n.affixId?.trim()) {
        errors.push(`${label}: unresolved 不可帶 affixId`)
      }
      if (n.mappingConfidence === 'manual_adjudicated') {
        errors.push(`${label}: unresolved 不可標為 manual_adjudicated`)
      }
      continue
    }

    if (n.affixPending === true) {
      legacyPending++
      errors.push(`${label}: 仍為 affixPending，請執行 applyTalentNodeAffixMapping`)
      continue
    }

    errors.push(`${label}: 缺少 mappingStatus（非 resolved / unresolved）`)
  }

  let adjFile: ReturnType<typeof parseTalentNodeAdjudicationFile>['file'] = null
  let adjudications: TalentNodeAdjudicationEntry[] = []
  try {
    const adjRaw = JSON.parse(readFileSync(ADJ, 'utf8'))
    const parsed = parseTalentNodeAdjudicationFile(adjRaw)
    if (parsed.errors.length) {
      for (const e of parsed.errors) errors.push(`adjudication file: ${e}`)
    } else {
      adjFile = parsed.file
      adjudications = parsed.file?.adjudications ?? []
    }
  } catch (e) {
    errors.push(`adjudication file: cannot read/parse ${ADJ}: ${e instanceof Error ? e.message : e}`)
  }

  const approved = adjudications.filter((a) => a.reviewStatus === 'approved')
  const tentative = adjudications.filter((a) => a.reviewStatus === 'tentative')
  const rejected = adjudications.filter((a) => a.reviewStatus === 'rejected')

  const nodeBySuggestedId = new Map<string, TalentPanelNode>()
  for (const n of nodesFile.nodes) {
    nodeBySuggestedId.set(nodeIdOf(n, season), n)
  }

  const refIssues = adjFile ? validateAdjudicationsAgainstRefs(adjFile, affixSet) : []
  let conflictCount = refIssues.filter((i) => i.kind === 'duplicate_approved_conflict').length
  for (const issue of refIssues) {
    errors.push(
      issue.adjudicationId
        ? `adjudication ${issue.adjudicationId}: ${issue.message}`
        : `adjudication: ${issue.message}`,
    )
  }

  for (const a of approved) {
    const node = nodeBySuggestedId.get(a.nodeId)
    if (!node) {
      errors.push(`adjudication ${a.adjudicationId}: nodeId 不在 talent-panel-nodes: ${a.nodeId}`)
      continue
    }
    if (a.panelId !== node.panelId) {
      errors.push(`adjudication ${a.adjudicationId}: panelId 與節點不符`)
    }
    if (a.sourceAnchor.panelId !== node.panelId) {
      errors.push(`adjudication ${a.adjudicationId}: sourceAnchor.panelId 與節點不符`)
    }
    if (a.sourceAnchor.slotIndex !== node.slotIndex) {
      errors.push(`adjudication ${a.adjudicationId}: sourceAnchor.slotIndex 與節點不符`)
    }
    if (a.sourceAnchor.nodeType !== node.nodeType) {
      errors.push(`adjudication ${a.adjudicationId}: sourceAnchor.nodeType 與節點不符`)
    }
    if (!linesEqual(node.effectLines, a.sourceAnchor.effectLines)) {
      errors.push(
        `adjudication ${a.adjudicationId}: sourceAnchor.effectLines 與節點 effectLines 不一致（資料漂移或未更新錨點）`,
      )
    }

    if (node.mappingStatus !== 'resolved' || node.mappingConfidence !== 'manual_adjudicated') {
      errors.push(
        `adjudication ${a.adjudicationId}: approved 裁決存在但節點未為 manual_adjudicated resolved（請重跑 ingest）`,
      )
    } else {
      if (node.affixId !== a.chosenAffixId) {
        errors.push(
          `adjudication ${a.adjudicationId}: chosenAffixId 與節點 affixId 不一致`,
        )
      }
      if (node.mappingAdjudicationId !== a.adjudicationId) {
        errors.push(
          `adjudication ${a.adjudicationId}: mappingAdjudicationId 與裁決 id 不一致`,
        )
      }
    }
  }

  for (const a of tentative) {
    const node = nodeBySuggestedId.get(a.nodeId)
    if (!node) {
      errors.push(`tentative adjudication ${a.adjudicationId}: nodeId 不在 nodes: ${a.nodeId}`)
    }
    if (!affixSet.has(a.chosenAffixId)) {
      errors.push(`tentative adjudication ${a.adjudicationId}: chosenAffixId 無效`)
    }
  }

  for (const a of rejected) {
    if (!affixSet.has(a.chosenAffixId)) {
      errors.push(`rejected adjudication ${a.adjudicationId}: chosenAffixId 無效`)
    }
  }

  for (const n of nodesFile.nodes) {
    if (n.mappingConfidence !== 'manual_adjudicated') continue
    const aid = n.mappingAdjudicationId?.trim()
    if (!aid) continue
    const adj = approved.find((x) => x.adjudicationId === aid)
    if (!adj) {
      errors.push(
        `node ${nodeIdOf(n, season)}: mappingAdjudicationId ${aid} 無對應 approved 裁決列`,
      )
    }
  }

  console.log('[verifyTalentNodeAffixMapping] total', nodesFile.nodes.length)
  console.log('  resolved:', resolved, '(auto ~', autoResolved, ', manual', manualResolved, ')')
  console.log('  unresolved:', unresolved)
  console.log('  legacy affixPending:', legacyPending)
  console.log('  adjudication rows:', adjudications.length)
  console.log('    approved:', approved.length, ' tentative:', tentative.length, ' rejected:', rejected.length)
  console.log('  duplicate-approved conflicts (from ref check):', conflictCount)
  console.log('  governance: approved adjudications must match manual-resolved nodes after ingest')

  if (errors.length) {
    console.error('[verifyTalentNodeAffixMapping] FAIL')
    for (const e of errors.slice(0, 120)) console.error(' ', e)
    if (errors.length > 120) console.error(`  ... +${errors.length - 120} more`)
    process.exit(1)
  }

  console.log('[verifyTalentNodeAffixMapping] OK')
}

main()
