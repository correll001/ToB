/**
 * Validate talent-panels.json + talent-panel-nodes.json against talent-affixes.json.
 *
 *   npx tsx scripts/verify/verifyTalentPanels.ts
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { validateTalentPanelDataset } from '@/lib/talent/validateTalentPanelData'
import type { TalentAffixNormalizedFile } from '@/types/talentAffix'
import type { TalentPanelNodesFile, TalentPanelsFile } from '@/types/talentPanel'

const ROOT = join(__dirname, '..', '..')
const PANELS_PATH = join(ROOT, 'data', 'normalized', 'ss12', 'talent-panels.json')
const NODES_PATH = join(ROOT, 'data', 'normalized', 'ss12', 'talent-panel-nodes.json')
const AFFIX_PATH = join(ROOT, 'data', 'normalized', 'ss12', 'talent-affixes.json')

function main() {
  let panelsRaw: string
  let nodesRaw: string
  let affixRaw: string
  try {
    panelsRaw = readFileSync(PANELS_PATH, 'utf8')
    nodesRaw = readFileSync(NODES_PATH, 'utf8')
    affixRaw = readFileSync(AFFIX_PATH, 'utf8')
  } catch (e) {
    console.error('[verifyTalentPanels] FAIL cannot read input files', e)
    process.exit(1)
  }

  let panels: TalentPanelsFile
  let nodes: TalentPanelNodesFile
  let affixData: TalentAffixNormalizedFile
  try {
    panels = JSON.parse(panelsRaw) as TalentPanelsFile
    nodes = JSON.parse(nodesRaw) as TalentPanelNodesFile
    affixData = JSON.parse(affixRaw) as TalentAffixNormalizedFile
  } catch (e) {
    console.error('[verifyTalentPanels] FAIL JSON parse', e)
    process.exit(1)
  }

  const affixIdSet = new Set(affixData.affixes.map((a) => a.affixId))
  const result = validateTalentPanelDataset(panels, nodes, affixIdSet)

  const { stats } = result
  console.log('[verifyTalentPanels] report')
  console.log(`  panels: ${stats.panelCount}`)
  console.log(`  nodes: ${stats.nodeCount}`)
  console.log('  nodes per panel:')
  for (const p of panels.panels) {
    const c = stats.nodesPerPanel[p.panelId] ?? 0
    console.log(`    ${p.panelId}: ${c}`)
  }
  console.log(`  missing affix references: ${stats.missingAffixReferences}`)
  console.log(`  duplicate (x,y) violations: ${stats.duplicateCoordinateViolations}`)
  console.log(`  invalid slotIndex (≠ y*3+x): ${stats.invalidSlotIndexCount}`)
  console.log(`  cross-panel requires/edges: ${stats.crossPanelReferenceViolations}`)
  console.log(`  self-reference violations: ${stats.selfReferenceViolations}`)
  console.log(`  invalid nodeType: ${stats.unknownNodeTypeCount}`)
  console.log(`  invalid maxRank: ${stats.invalidMaxRankCount}`)

  if (!result.ok) {
    console.error('[verifyTalentPanels] FAIL')
    for (const err of result.errors.slice(0, 80)) {
      console.error(`  - ${err}`)
    }
    if (result.errors.length > 80) {
      console.error(`  ... and ${result.errors.length - 80} more`)
    }
    process.exit(1)
  }

  console.log('[verifyTalentPanels] OK')
}

main()
