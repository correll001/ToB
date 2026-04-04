/**
 * MAINTENANCE-ONLY — not a production or `next build` dependency.
 * Override merge helpers for offline ETL.
 */
import type { NormalizedSkillRecord } from "../../types/normalized"
import type { Post20OverrideSpec, SkillOverrideEntry } from "../../types/override"
import type { JsonValue } from "../../types/skillData"
import type { SkillDefinition, SkillLevelEntry } from "../../types/skillData"
import { deepMerge } from "./deepMerge"

export function normalizeSkillId(id: string): string {
  const t = id.trim()
  if (t.startsWith("skill:")) return t
  return `skill:${t}`
}

function applyPost20SpecToMechanics(def: SkillDefinition, spec: Post20OverrideSpec): void {
  const params: Record<string, JsonValue> = {}
  if (spec.disabled) {
    params.skip = true
    params.disabled = true
  }
  if (spec.tier21to30PerLevelMorePct != null) {
    params.tier21to30PerLevelMorePct = spec.tier21to30PerLevelMorePct
  }
  if (spec.tier31PlusPerLevelMorePct != null) {
    params.tier31PlusPerLevelMorePct = spec.tier31PlusPerLevelMorePct
  }
  def.mechanics = [
    ...(def.mechanics ?? []),
    {
      hookId: "override:post20",
      category: "data-patch",
      parameters: params,
      notes: ["Applied from data/overrides patch"],
    },
  ]
}

/**
 * Apply one override entry onto a cloned normalized skill record.
 */
export function applySkillOverrideRecord(
  record: NormalizedSkillRecord,
  entry: SkillOverrideEntry,
): NormalizedSkillRecord {
  const out: NormalizedSkillRecord = structuredClone(record)

  if (entry.recordPatch) {
    if (entry.recordPatch.parseStatus != null) {
      out.parseStatus = entry.recordPatch.parseStatus
    }
    if (entry.recordPatch.unparsedText != null) {
      out.unparsedText = entry.recordPatch.unparsedText
    }
  }

  if (entry.warningsAppend?.length) {
    out.warnings = [...(out.warnings ?? []), ...entry.warningsAppend.map((w) => `[override] ${w}`)]
  }

  const def = out.definition

  if (entry.familyOverride) {
    def.family = entry.familyOverride
  }

  if (entry.definitionMerge) {
    const merged = deepMerge(def as unknown as Record<string, unknown>, entry.definitionMerge as unknown as Record<string, unknown>)
    out.definition = merged as SkillDefinition
  }

  if (entry.modifiersReplace) {
    out.definition.modifiers = entry.modifiersReplace
  } else if (entry.modifiersAppend?.length) {
    out.definition.modifiers = [...(out.definition.modifiers ?? []), ...entry.modifiersAppend]
  }

  if (entry.levelTableMerge) {
    const lt = { ...(out.definition.levelTable ?? {}) }
    for (const [key, patch] of Object.entries(entry.levelTableMerge)) {
      const n = Number(key)
      const lvl = Number.isFinite(n) ? n : parseInt(key, 10)
      const cur = lt[lvl] ?? ({ level: lvl } as SkillLevelEntry)
      lt[lvl] = deepMerge(
        cur as unknown as Record<string, unknown>,
        patch as unknown as Record<string, unknown>,
      ) as SkillLevelEntry
    }
    out.definition.levelTable = lt
  }

  if (entry.supportRulesMerge) {
    const sr = out.definition.supportRules ?? {}
    out.definition.supportRules = deepMerge(
      sr as unknown as Record<string, unknown>,
      entry.supportRulesMerge as unknown as Record<string, unknown>,
    ) as typeof out.definition.supportRules
  }

  if (entry.mechanicsAppend?.length) {
    out.definition.mechanics = [...(out.definition.mechanics ?? []), ...entry.mechanicsAppend]
  }

  if (entry.post20) {
    applyPost20SpecToMechanics(out.definition, entry.post20)
  }

  if (entry.notes?.length) {
    out.warnings = [...(out.warnings ?? []), ...entry.notes.map((n) => `[override-note] ${n}`)]
  }

  return out
}

export function mergeOverrideEntriesForSameId(entries: SkillOverrideEntry[]): SkillOverrideEntry {
  if (entries.length === 0) {
    throw new Error("mergeOverrideEntriesForSameId: empty")
  }
  const id = normalizeSkillId(entries[0]!.id)
  const acc: SkillOverrideEntry = { id }

  for (const e of entries) {
    if (e.recordPatch) {
      acc.recordPatch = { ...acc.recordPatch, ...e.recordPatch }
    }
    if (e.warningsAppend?.length) {
      acc.warningsAppend = [...(acc.warningsAppend ?? []), ...e.warningsAppend]
    }
    if (e.notes?.length) {
      acc.notes = [...(acc.notes ?? []), ...e.notes]
    }
    if (e.author) acc.author = e.author
    if (e.since) acc.since = e.since
    if (e.definitionMerge) {
      acc.definitionMerge = deepMerge(
        (acc.definitionMerge ?? {}) as unknown as Record<string, unknown>,
        e.definitionMerge as unknown as Record<string, unknown>,
      ) as SkillOverrideEntry["definitionMerge"]
    }
    if (e.familyOverride) acc.familyOverride = e.familyOverride
    if (e.modifiersReplace != null) {
      acc.modifiersReplace = e.modifiersReplace
    }
    if (e.modifiersAppend?.length) {
      acc.modifiersAppend = [...(acc.modifiersAppend ?? []), ...e.modifiersAppend]
    }
    if (e.levelTableMerge) {
      acc.levelTableMerge = { ...acc.levelTableMerge, ...e.levelTableMerge }
    }
    if (e.supportRulesMerge) {
      acc.supportRulesMerge = deepMerge(
        (acc.supportRulesMerge ?? {}) as unknown as Record<string, unknown>,
        e.supportRulesMerge as unknown as Record<string, unknown>,
      ) as SkillOverrideEntry["supportRulesMerge"]
    }
    if (e.mechanicsAppend?.length) {
      acc.mechanicsAppend = [...(acc.mechanicsAppend ?? []), ...e.mechanicsAppend]
    }
    if (e.post20) {
      acc.post20 = { ...acc.post20, ...e.post20 }
    }
  }

  return acc
}
