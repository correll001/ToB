/**
 * 驗證 talent-panel-nodes 與 talent-affixes 對應完整性。
 *
 *   npx tsx scripts/verify/verifyTalentNodeAffixMapping.ts
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { TalentAffixNormalizedFile } from '@/types/talentAffix'
import type { TalentPanelNodesFile } from '@/types/talentPanel'

const ROOT = join(__dirname, '..', '..')
const NODES = join(ROOT, 'data', 'normalized', 'ss12', 'talent-panel-nodes.json')
const AFFIX = join(ROOT, 'data', 'normalized', 'ss12', 'talent-affixes.json')

function main() {
  const nodesFile = JSON.parse(readFileSync(NODES, 'utf8')) as TalentPanelNodesFile
  const affixFile = JSON.parse(readFileSync(AFFIX, 'utf8')) as TalentAffixNormalizedFile
  const affixSet = new Set(affixFile.affixes.map((a) => a.affixId))

  const errors: string[] = []
  let resolved = 0
  let unresolved = 0
  let legacyPending = 0

  for (let i = 0; i < nodesFile.nodes.length; i++) {
    const n = nodesFile.nodes[i]!
    const label = `node[#${i} panel=${n.panelId} slot=${n.slotIndex}]`

    if (n.mappingStatus === 'resolved') {
      resolved++
      const id = n.affixId?.trim()
      if (!id) errors.push(`${label}: resolved 但缺少 affixId`)
      else if (!affixSet.has(id)) errors.push(`${label}: affixId 不在 talent-affixes: ${id}`)
      if (n.unresolvedReason != null && String(n.unresolvedReason).length > 0) {
        errors.push(`${label}: resolved 不應帶 unresolvedReason`)
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
      continue
    }

    if (n.affixPending === true) {
      legacyPending++
      errors.push(`${label}: 仍為 affixPending，請執行 applyTalentNodeAffixMapping`)
      continue
    }

    errors.push(`${label}: 缺少 mappingStatus（非 resolved / unresolved）`)
  }

  console.log('[verifyTalentNodeAffixMapping] total', nodesFile.nodes.length)
  console.log('  resolved:', resolved)
  console.log('  unresolved:', unresolved)
  console.log('  legacy affixPending:', legacyPending)

  if (errors.length) {
    console.error('[verifyTalentNodeAffixMapping] FAIL')
    for (const e of errors.slice(0, 100)) console.error(' ', e)
    if (errors.length > 100) console.error(`  ... +${errors.length - 100} more`)
    process.exit(1)
  }

  console.log('[verifyTalentNodeAffixMapping] OK')
}

main()
