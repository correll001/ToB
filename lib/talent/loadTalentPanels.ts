/**
 * Load normalized talent panel JSON (structure layer).
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { TalentPanelNodesFile, TalentPanelsFile } from '@/types/talentPanel'
import type { TalentAffixNormalizedFile } from '@/types/talentAffix'

const ROOT = join(__dirname, '..', '..')

export function loadTalentPanelsNormalized(season = 'ss12'): TalentPanelsFile {
  const p = join(ROOT, 'data', 'normalized', season, 'talent-panels.json')
  return JSON.parse(readFileSync(p, 'utf8')) as TalentPanelsFile
}

export function loadTalentPanelNodesNormalized(season = 'ss12'): TalentPanelNodesFile {
  const p = join(ROOT, 'data', 'normalized', season, 'talent-panel-nodes.json')
  return JSON.parse(readFileSync(p, 'utf8')) as TalentPanelNodesFile
}

export function loadTalentAffixIdSet(season = 'ss12'): Set<string> {
  const p = join(ROOT, 'data', 'normalized', season, 'talent-affixes.json')
  const data = JSON.parse(readFileSync(p, 'utf8')) as TalentAffixNormalizedFile
  return new Set(data.affixes.map((a) => a.affixId))
}
