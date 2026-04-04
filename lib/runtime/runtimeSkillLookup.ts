/**
 * Client-safe skill resolution from bundled effective dataset.
 */

import type { SkillDefinition, SkillFamily } from '@/types/skillData'
import type { NormalizedSkillRecord } from '@/types/normalized'
import { getRuntimeDataset, type RuntimeDatasetCache } from './runtimeDataset'

/** Main-link (6L-style) skill families: includes ladder variants after overrides. */
const MAIN_SLOT_FAMILIES = new Set<SkillFamily>(['active', 'medium', 'noble', 'precise'])

export type SkillPickerRow = { id: string; name: string; family: SkillFamily }

export type BundledSkillDatasetMeta = {
  season: string
  datasetVersionId: number
  versionLabel: string
  effectiveLayer?: string
  activeCount: number
  supportCount: number
  passiveCount: number
  skillLevelRulesId?: string
}

export function isMainSlotSkillFamily(family: SkillFamily): boolean {
  return MAIN_SLOT_FAMILIES.has(family)
}

function ds(): RuntimeDatasetCache {
  return getRuntimeDataset()
}

export function getBundledSkillDatasetMeta(): BundledSkillDatasetMeta {
  const d = ds()
  const a = d.activeSkillsFile
  return {
    season: d.season,
    datasetVersionId: d.datasetVersionId,
    versionLabel: d.versionLabel,
    effectiveLayer: a.meta.effectiveLayer,
    activeCount: a.skills.length,
    supportCount: d.supportSkillsFile.skills.length,
    passiveCount: d.passiveSkillsFile.skills.length,
    skillLevelRulesId: d.bundle.skillLevelRules.rules?.id,
  }
}

export function getSkillDefinitionById(id: string | null | undefined): SkillDefinition | undefined {
  if (!id) return undefined
  return ds().definitionsById.get(id)
}

export function getNormalizedSkillRecord(id: string | null | undefined): NormalizedSkillRecord | undefined {
  if (!id) return undefined
  return ds().recordsById.get(id)
}

export function listSkillsByFamily(family: SkillFamily): SkillPickerRow[] {
  const out: SkillPickerRow[] = []
  for (const def of ds().definitionsById.values()) {
    if (def.family === family) {
      out.push({ id: def.id, name: def.name, family: def.family })
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant'))
}

/** Skill gem choices for primary slots (active + noble/precise/medium ladder). */
export function listMainSlotSkillPickerRows(): SkillPickerRow[] {
  const out: SkillPickerRow[] = []
  for (const def of ds().definitionsById.values()) {
    if (isMainSlotSkillFamily(def.family)) {
      out.push({ id: def.id, name: def.name, family: def.family })
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant'))
}
