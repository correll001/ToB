/**
 * Pure validation for talent-panels + talent-panel-nodes against affix rows.
 * No I/O — used by verify script and future loaders.
 */
import type { TalentAffixNormalized } from '@/types/talentAffix'
import type { TalentPanelNode, TalentPanelNodesFile, TalentPanelsFile } from '@/types/talentPanel'

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

type AugNode = {
  raw: TalentPanelNode
  nodeId: string
  affixId: string
}

function expectedSlot(x: number, y: number): number {
  return y * 8 + x
}

export function buildSuggestedNodeId(season: string, panelId: string, slotIndex: number): string {
  return `talnode:${season}:${panelId}:s${slotIndex}`
}

function resolveAffixIdForNode(
  n: TalentPanelNode,
  affixRows: TalentAffixNormalized[],
  affixIdSet: Set<string>,
  label: string,
  errors: string[],
): string | null {
  const idTrim = n.affixId?.trim() ?? ''
  const gidRaw = n.affixGameDataId
  const gidTrim = gidRaw != null && String(gidRaw).trim() !== '' ? String(gidRaw).trim() : ''

  if (!idTrim && !gidTrim) {
    errors.push(`${label}: 需要 affixId 或 affixGameDataId 其一`)
    return null
  }

  if (idTrim && !affixIdSet.has(idTrim)) {
    errors.push(`${label}: affixId 不在 talent-affixes: ${idTrim}`)
    return null
  }

  if (!gidTrim) {
    return idTrim
  }

  const matches = affixRows.filter((a) => a.gameDataId === gidTrim)
  if (matches.length === 0) {
    errors.push(`${label}: affixGameDataId 找不到: ${gidTrim}`)
    return null
  }

  let resolved: TalentAffixNormalized | undefined
  if (matches.length === 1) {
    resolved = matches[0]
  } else {
    const tab = n.affixSourceTab ?? undefined
    if (!tab) {
      errors.push(
        `${label}: affixGameDataId「${gidTrim}」對應多筆（通常為核心／天賦樹各一筆），請填 affixSourceTab: "core_talent" 或 "talent_tree"，或改用 affixId`,
      )
      return null
    }
    resolved = matches.find((a) => a.sourceTab === tab)
    if (!resolved) {
      errors.push(`${label}: affixSourceTab「${tab}」與 gameDataId「${gidTrim}」無對應列`)
      return null
    }
  }

  if (idTrim && resolved.affixId !== idTrim) {
    errors.push(
      `${label}: affixId「${idTrim}」與 affixGameDataId 解析結果「${resolved.affixId}」不一致`,
    )
    return null
  }

  return resolved.affixId
}

export function validateTalentPanelDataset(
  panelsFile: TalentPanelsFile,
  nodesFile: TalentPanelNodesFile,
  affixIdSet: Set<string>,
  affixRows: TalentAffixNormalized[],
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

  const season = panelsFile.season

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
    if (p.gridWidth !== 8) {
      errors.push(`panel ${p.panelId}: gridWidth must be 8, got ${p.gridWidth}`)
    }
    if (p.gridHeight !== 5) {
      errors.push(`panel ${p.panelId}: gridHeight must be 5, got ${p.gridHeight}`)
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

  const nodesByPanel = new Map<string, TalentPanelNode[]>()
  for (const n of nodes) {
    const list = nodesByPanel.get(n.panelId) ?? []
    list.push(n)
    nodesByPanel.set(n.panelId, list)
  }

  for (const [pid, list] of nodesByPanel) {
    stats.nodesPerPanel[pid] = list.length
  }

  const aug: AugNode[] = []
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i]!
    const label = `node[#${i} panel=${n.panelId} xy=(${n.x},${n.y})]`

    if (!Array.isArray(n.requiresNodeIds) || !Array.isArray(n.edgesTo) || !Array.isArray(n.notes)) {
      errors.push(`${label}: requiresNodeIds, edgesTo, notes must be arrays`)
    }

    let xyOk = true
    if (!Number.isInteger(n.x) || n.x < 0 || n.x > 7) {
      errors.push(`${label}: x must be integer 0..7, got ${n.x}`)
      xyOk = false
    }
    if (!Number.isInteger(n.y) || n.y < 0 || n.y > 4) {
      errors.push(`${label}: y must be integer 0..4, got ${n.y}`)
      xyOk = false
    }

    const exp = expectedSlot(n.x, n.y)
    if (n.slotIndex !== exp) {
      stats.invalidSlotIndexCount += 1
      errors.push(
        `${label}: slotIndex ${n.slotIndex} !== y*8+x (${exp}) for x=${n.x} y=${n.y}`,
      )
      xyOk = false
    }

    let resolvedAffix: string | null = null
    if (n.affixPending === true) {
      const idTrim = n.affixId?.trim() ?? ''
      const gidRaw = n.affixGameDataId
      const gidTrim = gidRaw != null && String(gidRaw).trim() !== '' ? String(gidRaw).trim() : ''
      if (idTrim || gidTrim) {
        errors.push(`${label}: affixPending 為 true 時不可同時填 affixId / affixGameDataId`)
      } else if (xyOk) {
        resolvedAffix = `__pending__:${n.panelId}:s${exp}`
      }
    } else {
      resolvedAffix = resolveAffixIdForNode(n, affixRows, affixIdSet, label, errors)
    }

    if (!resolvedAffix) {
      if (!n.affixPending) {
        stats.missingAffixReferences += 1
      }
      continue
    }

    if (!xyOk) {
      continue
    }

    const slotIndex = exp
    const autoId = buildSuggestedNodeId(season, n.panelId, slotIndex)
    const nodeId = n.nodeId?.trim() ? n.nodeId.trim() : autoId

    aug.push({ raw: n, nodeId, affixId: resolvedAffix })
  }

  const nodeIds = new Set<string>()
  for (const a of aug) {
    if (nodeIds.has(a.nodeId)) {
      errors.push(`duplicate nodeId: ${a.nodeId}`)
    }
    nodeIds.add(a.nodeId)
  }

  const slotOccupants = new Map<string, Map<string, string>>()

  for (const a of aug) {
    const n = a.raw
    const { nodeId } = a

    if (!panelIds.has(n.panelId)) {
      errors.push(`node ${nodeId}: panelId not found: ${n.panelId}`)
    }

    if (!NODE_TYPES.has(n.nodeType)) {
      stats.unknownNodeTypeCount += 1
      errors.push(`node ${nodeId}: invalid nodeType: ${n.nodeType}`)
    }

    if (!Number.isInteger(n.maxRank) || n.maxRank < 1) {
      stats.invalidMaxRankCount += 1
      errors.push(`node ${nodeId}: maxRank must be integer >= 1, got ${n.maxRank}`)
    }

    const slotKey = `${n.x},${n.y}`
    const panelSlots = slotOccupants.get(n.panelId) ?? new Map()
    const prev = panelSlots.get(slotKey)
    if (prev) {
      stats.duplicateCoordinateViolations += 1
      errors.push(
        `node ${nodeId}: duplicate (x,y)=(${n.x},${n.y}) in panel ${n.panelId} (also ${prev})`,
      )
    } else {
      panelSlots.set(slotKey, nodeId)
    }
    slotOccupants.set(n.panelId, panelSlots)

    for (const req of n.requiresNodeIds) {
      if (req === nodeId) {
        stats.selfReferenceViolations += 1
        errors.push(`node ${nodeId}: requiresNodeIds self-reference`)
      }
    }
    for (const e of n.edgesTo) {
      if (e === nodeId) {
        stats.selfReferenceViolations += 1
        errors.push(`node ${nodeId}: edgesTo self-reference`)
      }
    }
  }

  const nodeById = new Map(aug.map((a) => [a.nodeId, a]))

  for (const a of aug) {
    const n = a.raw
    const { nodeId } = a
    if (!panelIds.has(n.panelId)) continue

    for (const req of n.requiresNodeIds) {
      if (!nodeIds.has(req)) {
        errors.push(`node ${nodeId}: requiresNodeIds unknown nodeId: ${req}`)
        continue
      }
      const target = nodeById.get(req)!
      if (target.raw.panelId !== n.panelId) {
        stats.crossPanelReferenceViolations += 1
        errors.push(
          `node ${nodeId}: requiresNodeIds cross-panel: ${req} belongs to panel ${target.raw.panelId}`,
        )
      }
    }

    for (const e of n.edgesTo) {
      if (!nodeIds.has(e)) {
        errors.push(`node ${nodeId}: edgesTo unknown nodeId: ${e}`)
        continue
      }
      const target = nodeById.get(e)!
      if (target.raw.panelId !== n.panelId) {
        stats.crossPanelReferenceViolations += 1
        errors.push(
          `node ${nodeId}: edgesTo cross-panel: ${e} belongs to panel ${target.raw.panelId}`,
        )
      }
    }
  }

  const ok = errors.length === 0
  return { ok, errors, stats }
}
