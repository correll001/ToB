/**
 * Central Skill TAB — passive/aura “traces” for the inspected main skill only.
 * Mirrors `passiveModifiersForActiveSkill` scope without listing global build rows.
 */
import type { BuildSnapshot, MainSkillSlot } from '@/types/build'
import type { SkillTabPassiveImpactTrace } from '@/types/skillTabExplanation'
import { isMainSkillSlot } from '@/lib/build/supportLinks'
import { modifiersFromSkillLevelRow } from '@/lib/formula/skills/levelRowModifiers'
import { analyzePassiveModifiersForActiveSkill } from '@/lib/formula/skills/passiveModifiers'
import { getSkillDefinitionById } from '@/lib/runtime/runtimeSkillLookup'

export function buildPassiveImpactTraces(
  snapshot: BuildSnapshot,
  mainSlot: MainSkillSlot,
  activeSkillId: string,
): SkillTabPassiveImpactTrace[] {
  if (!isMainSkillSlot(mainSlot)) return []

  const out: SkillTabPassiveImpactTrace[] = []

  for (const p of snapshot.passives ?? []) {
    if (!p?.skillId || p.enabled === false) continue

    const mode = p.applyMode ?? 'global'
    if (mode === 'linked') {
      const linked = p.linkedMainSkillSlots ?? []
      if (linked.length === 0) continue
      if (!linked.includes(mainSlot)) continue
    }

    const def = getSkillDefinitionById(p.skillId)
    if (def?.family !== 'passive') continue

    const passiveName = def.name ?? p.skillId
    const pLv = Math.max(1, Math.floor(p.skillLevel ?? 1))
    const passiveMods = [...(def.modifiers ?? []), ...modifiersFromSkillLevelRow(def, pLv)]

    const analysis = analyzePassiveModifiersForActiveSkill(activeSkillId, def.id, passiveMods)

    const partialHints: string[] = []
    if (analysis.skippedNonFoldableSelector > 0) {
      partialHints.push(
        `${analysis.skippedNonFoldableSelector} 項 modifier 為 statPath／custom 等，未摺疊進本技能 instance（中央只追蹤可摺疊者）。`,
      )
    }
    if (analysis.skippedNoStat > 0) {
      partialHints.push(`${analysis.skippedNoStat} 項缺少 stat 欄位，已略過。`)
    }
    if (passiveMods.length === 0) {
      partialHints.push('此被動在資料中無基礎／等級列 modifier。')
    } else if (analysis.statKeys.length === 0 && partialHints.length === 0) {
      partialHints.push('資料不足：無法列出摺疊至本技能的 stat（請檢查 modifier／selector）。')
    }

    const auraTagHint =
      analysis.hasAuraSelector ||
      def.tags.some((t) => {
        const x = t.toLowerCase()
        return x === 'aura' || x.includes('aura')
      })

    out.push({
      passiveEditorSlot: p.slot,
      passiveSkillId: p.skillId,
      passiveName,
      applyMode: mode,
      linkedMainSkillSlots: p.linkedMainSkillSlots ?? [],
      statKeys: analysis.statKeys,
      hasAuraModifier: analysis.hasAuraSelector,
      auraTagHint,
      partialHints,
    })
  }

  return out.sort((a, b) => a.passiveEditorSlot - b.passiveEditorSlot)
}
