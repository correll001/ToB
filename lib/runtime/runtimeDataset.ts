/**
 * Single cached view of the bundled effective dataset (no I/O, no SQLite on client).
 * Rebuilt once per JS module evaluation; safe for HMR in dev.
 */

import type { EffectiveRuntimeBundle } from '@/lib/data/types'
import type { SkillDefinition } from '@/types/skillData'
import type { NormalizedSkillRecord, NormalizedSkillsFile } from '@/types/normalized'

import effectiveRuntimeBundle from '@/lib/gameData/generated/effective-runtime-bundle.json'

import { RUNTIME_GAME_DATA_SEASON } from '@/lib/gameData/gameDataConfig'

export type RuntimeDatasetCache = {
  bundle: EffectiveRuntimeBundle
  /** Same as bundle.datasetVersion.id */
  datasetVersionId: number
  season: string
  versionLabel: string
  definitionsById: ReadonlyMap<string, SkillDefinition>
  /** Normalized row (parseStatus, warnings, …) */
  recordsById: ReadonlyMap<string, NormalizedSkillRecord>
  activeSkillsFile: NormalizedSkillsFile
  supportSkillsFile: NormalizedSkillsFile
  passiveSkillsFile: NormalizedSkillsFile
}

let cache: RuntimeDatasetCache | null = null

function buildCache(raw: EffectiveRuntimeBundle): RuntimeDatasetCache {
  const defMap = new Map<string, SkillDefinition>()
  const recMap = new Map<string, NormalizedSkillRecord>()

  const ingest = (file: NormalizedSkillsFile) => {
    for (const row of file.skills) {
      defMap.set(row.definition.id, row.definition)
      recMap.set(row.definition.id, row)
    }
  }

  ingest(raw.activeSkills)
  ingest(raw.supportSkills)
  ingest(raw.passiveSkills)

  if (typeof console !== 'undefined' && raw.datasetVersion.season !== RUNTIME_GAME_DATA_SEASON) {
    console.warn(
      `[runtimeDataset] bundle season ${raw.datasetVersion.season} !== RUNTIME_GAME_DATA_SEASON ${RUNTIME_GAME_DATA_SEASON}`,
    )
  }

  return {
    bundle: raw,
    datasetVersionId: raw.datasetVersion.id,
    season: raw.datasetVersion.season,
    versionLabel: raw.datasetVersion.versionLabel,
    definitionsById: defMap,
    recordsById: recMap,
    activeSkillsFile: raw.activeSkills,
    supportSkillsFile: raw.supportSkills,
    passiveSkillsFile: raw.passiveSkills,
  }
}

export function getRuntimeDataset(): RuntimeDatasetCache {
  if (!cache) {
    cache = buildCache(effectiveRuntimeBundle as unknown as EffectiveRuntimeBundle)
  }
  return cache
}

/** Tests only — avoid in prod runtime. */
export function __resetRuntimeDatasetCacheForTests(): void {
  cache = null
}

export function getEffectiveRuntimeBundle(): EffectiveRuntimeBundle {
  return getRuntimeDataset().bundle
}

/** Internal / admin UI: traceability for bundled dataset (no network, no SQLite on client). */
export type DatasetProvenance = {
  schemaVersion: number
  datasetVersionId: number
  season: string
  versionLabel: string
  importedAt: string
  sourceKind: string
  /** From `gameDataConfig.ts` — must match bundle season after a proper import. */
  runtimeConfigSeason: typeof RUNTIME_GAME_DATA_SEASON
  overrideReport: {
    overridesSchemaVersion: string
    generatedAt: string
    season: string
  } | null
}

export function getDatasetProvenance(): DatasetProvenance {
  const b = getEffectiveRuntimeBundle()
  return {
    schemaVersion: b.schemaVersion,
    datasetVersionId: b.datasetVersion.id,
    season: b.datasetVersion.season,
    versionLabel: b.datasetVersion.versionLabel,
    importedAt: b.datasetVersion.importedAt,
    sourceKind: b.datasetVersion.sourceKind,
    runtimeConfigSeason: RUNTIME_GAME_DATA_SEASON,
    overrideReport: b.overrideReport
      ? {
          overridesSchemaVersion: b.overrideReport.overridesSchemaVersion,
          generatedAt: b.overrideReport.generatedAt,
          season: b.overrideReport.season,
        }
      : null,
  }
}
