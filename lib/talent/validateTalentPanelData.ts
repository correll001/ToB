/**
 * Pure validation for talent-panels + talent-panel-nodes against affix id set.
 * No I/O — used by verify script and future loaders.
 */
import type { TalentPanelDef, TalentPanelNode, TalentPanelNodesFile, TalentPanelsFile } from '@/types/talentPanel'

const NODE_TYPES: Set<string> = new Set([
  'entry',
  'small',
  'medium',
  'major',
  'keystone',
  'special',
])

export type TalentPanelValidationStats = {
  panelCount: number
  nodeCount: number
  nodesPerPanel: Record<string, number>
  missingAffixReferences: number
  duplicateCoordinateViolations: number
  invalidSlotIndexCount: number
  crossPanelReferenceViolations: number
  selfReferenceViolations: number
  unknownNodeTypeCount: number
  invalidMaxRankCount: number
}

export type TalentPanelValidationResult = {
  ok: boolean
  errors: string[]
  stats: TalentPanelValidationStats
}

function expectedSlot(x: number, y: number): number {
  return y * 3 + x
}

export function buildSuggestedNodeId(season: string, panelId: string, slotIndex: number): string {
  return `talnode:${season}:${panelId}:s${slotIndex}`
}

export function validateTalentPanelDataset(
  panelsFile: TalentPanelsFile,
  nodesFile: TalentPanelNodesFile,
  affixIdSet: Set<string>,
): TalentPanelValidationResult {
  const errors: string[] = []
  const stats: TalentPanelValidationStats = {
    panelCount: 0,
    nodeCount: 0,
    nodesPerPanel: {},
    missingAffixReferences: 0,
    duplicateCoordinateViolations: 0,
    invalidSlotIndexCount: 0,
    crossPanelReferenceViolations: 0,
    selfReferenceViolations: 0,
    unknownNodeTypeCount: 0,
    invalidMaxRankCount: 0,
  }

  if (panelsFile.schemaVersion !== 1) {
    errors.push(`panels: unsupported schemaVersion ${panelsFile.schemaVersion}`)
  }
  if (nodesFile.schemaVersion !== 1) {
    errors.push(`nodes: unsupported schemaVersion ${nodesFile.schemaVersion}`)
  }
  if (panelsFile.season !== nodesFile.season) {
    errors.push(
      `season mismatch: panels.season=${panelsFile.season} vs nodes.season=${nodesFile.season}`,
    )
  }

  const { panels } = panelsFile
  const { nodes } = nodesFile

  stats.panelCount = panels.length
  stats.nodeCount = nodes.length

  if (panelsFile.panelCount !== panels.length) {
    errors.push(`panelCount (${panelsFile.panelCount}) !== panels.length (${panels.length})`)
  }
  if (nodesFile.nodeCount !== nodes.length) {
    errors.push(`nodeCount (${nodesFile.nodeCount}) !== nodes.length (${nodes.length})`)
  }

  const panelIds = new Set<string>()
  for (const p of panels) {
    if (!p.panelId || !p.displayName) {
      errors.push(`panel missing panelId or displayName: ${JSON.stringify(p)}`)
      continue
    }
    if (panelIds.has(p.panelId)) {
      errors.push(`duplicate panelId: ${p.panelId}`)
    }
    panelIds.add(p.panelId)
    if (p.gridWidth !== 3) {
      errors.push(`panel ${p.panelId}: gridWidth must be 3, got ${p.gridWidth}`)
    }
    if (p.gridHeight !== 6) {
      errors.push(`panel ${p.panelId}: gridHeight must be 6, got ${p.gridHeight}`)
    }
    if (p.manualTopology !== true) {
      errors.push(`panel ${p.panelId}: manualTopology must be true`)
    }
    if (!p.sourceKind) {
      errors.push(`panel ${p.panelId}: sourceKind required`)
    }
    if (!Array.isArray(p.notes)) {
      errors.push(`panel ${p.panelId}: notes must be an array`)
    }
    stats.nodesPerPanel[p.panelId] = 0
  }

  const nodeIds = new Set<string>()
  const nodesByPanel = new Map<string, TalentPanelNode[]>()
  for (const n of nodes) {
    const list = nodesByPanel.get(n.panelId) ?? []
    list.push(n)
    nodesByPanel.set(n.panelId, list)
  }

  for (const [pid, list] of nodesByPanel) {
    stats.nodesPerPanel[pid] = list.length
  }

  const slotOccupants = new Map<string, Map<string, string>>() // panelId -> slotKey -> nodeId

  for (const n of nodes) {
    if (!Array.isArray(n.requiresNodeIds) || !Array.isArray(n.edgesTo) || !Array.isArray(n.notes)) {
      errors.push(
        `node ${typeof n.nodeId === 'string' ? n.nodeId : '(missing nodeId)'}: requiresNodeIds, edgesTo, notes must be arrays`,
      )
    }
    if (!n.nodeId) {
      errors.push('node missing nodeId')
      continue
    }
    if (nodeIds.has(n.nodeId)) {
      errors.push(`duplicate nodeId: ${n.nodeId}`)
    }
    nodeIds.add(n.nodeId)

    if (!panelIds.has(n.panelId)) {
      errors.push(`node ${n.nodeId}: panelId not found: ${n.panelId}`)
    }

    if (!n.affixId) {
      errors.push(`node ${n.nodeId}: affixId required`)
    } else if (!affixIdSet.has(n.affixId)) {
      stats.missingAffixReferences += 1
      errors.push(`node ${n.nodeId}: affixId not in talent-affixes: ${n.affixId}`)
    }

    if (!Number.isInteger(n.x) || n.x < 0 || n.x > 2) {
      errors.push(`node ${n.nodeId}: x must be integer 0..2, got ${n.x}`)
    }
    if (!Number.isInteger(n.y) || n.y < 0 || n.y > 5) {
      errors.push(`node ${n.nodeId}: y must be integer 0..5, got ${n.y}`)
    }

    const exp = expectedSlot(n.x, n.y)
    if (n.slotIndex !== exp) {
      stats.invalidSlotIndexCount += 1
      errors.push(
        `node ${n.nodeId}: slotIndex ${n.slotIndex} !== y*3+x (${exp}) for x=${n.x} y=${n.y}`,
      )
    }

    if (!NODE_TYPES.has(n.nodeType)) {
      stats.unknownNodeTypeCount += 1
      errors.push(`node ${n.nodeId}: invalid nodeType: ${n.nodeType}`)
    }

    if (!Number.isInteger(n.maxRank) || n.maxRank < 1) {
      stats.invalidMaxRankCount += 1
      errors.push(`node ${n.nodeId}: maxRank must be integer >= 1, got ${n.maxRank}`)
    }

    const slotKey = `${n.x},${n.y}`
    const panelSlots = slotOccupants.get(n.panelId) ?? new Map()
    const prev = panelSlots.get(slotKey)
    if (prev) {
      stats.duplicateCoordinateViolations += 1
      errors.push(
        `node ${n.nodeId}: duplicate (x,y)=(${n.x},${n.y}) in panel ${n.panelId} (also ${prev})`,
      )
    } else {
      panelSlots.set(slotKey, n.nodeId)
    }
    slotOccupants.set(n.panelId, panelSlots)

    for (const req of n.requiresNodeIds) {
      if (req === n.nodeId) {
        stats.selfReferenceViolations += 1
        errors.push(`node ${n.nodeId}: requiresNodeIds self-reference`)
      }
    }
    for (const e of n.edgesTo) {
      if (e === n.nodeId) {
        stats.selfReferenceViolations += 1
        errors.push(`node ${n.nodeId}: edgesTo self-reference`)
      }
    }
  }

  const nodeById = new Map(nodes.map((n) => [n.nodeId, n]))

  for (const n of nodes) {
    if (!panelIds.has(n.panelId)) continue

    for (const req of n.requiresNodeIds) {
      if (!nodeIds.has(req)) {
        errors.push(`node ${n.nodeId}: requiresNodeIds unknown nodeId: ${req}`)
        continue
      }
      const target = nodeById.get(req)!
      if (target.panelId !== n.panelId) {
        stats.crossPanelReferenceViolations += 1
        errors.push(
          `node ${n.nodeId}: requiresNodeIds cross-panel: ${req} belongs to panel ${target.panelId}`,
        )
      }
    }

    for (const e of n.edgesTo) {
      if (!nodeIds.has(e)) {
        errors.push(`node ${n.nodeId}: edgesTo unknown nodeId: ${e}`)
        continue
      }
      const target = nodeById.get(e)!
      if (target.panelId !== n.panelId) {
        stats.crossPanelReferenceViolations += 1
        errors.push(
          `node ${n.nodeId}: edgesTo cross-panel: ${e} belongs to panel ${target.panelId}`,
        )
      }
    }
  }

  const ok = errors.length === 0
  return { ok, errors, stats }
}
