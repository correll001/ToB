/**
 * Human-readable lines for central Skill TAB debug foldout (no raw JSON dumps).
 */
import { activeCanonicalTagSet } from '@/lib/formula/skills/tagVocabulary'
import { getNormalizedSkillRecord } from '@/lib/runtime/runtimeSkillLookup'
import type { SkillInstanceTrace } from '@/types/skillInstance'

export function formatSkillInstanceTraceLines(trace: SkillInstanceTrace | undefined | null): string[] {
  if (!trace) return []

  const lines: string[] = []

  if (trace.levelRowSource != null) {
    lines.push(`trace.levelRowSource=${trace.levelRowSource}`)
  }
  if (trace.levelRowHitScaling != null) {
    lines.push(`trace.levelRowHitScaling=${trace.levelRowHitScaling}`)
  }
  if (trace.levelRowWarnings?.length) {
    lines.push(...trace.levelRowWarnings.map((w) => `levelRow: ${w}`))
  }

  if (trace.supportsAcceptedIds.length > 0) {
    lines.push(`已接受輔助（${trace.supportsAcceptedIds.length}）：${trace.supportsAcceptedIds.join(', ')}`)
  }
  if (trace.supportsRejected.length > 0) {
    for (const r of trace.supportsRejected) {
      lines.push(`略過輔助 · ${r.id}${r.reason ? ` — ${r.reason}` : ''}`)
    }
  }

  lines.push(`post-20 套用：${trace.post20Applied ? '是' : '否'}`)
  if (trace.post20RefId) lines.push(`post-20 ref：${trace.post20RefId}`)

  const inj = trace.passiveInjects
  if (inj.length > 0) {
    const cap = 12
    const head = inj.slice(0, cap)
    for (const p of head) {
      lines.push(`passive 摺疊 · ${p.refId} · ${p.stat} · ${p.operation}`)
    }
    if (inj.length > cap) lines.push(`… 其餘 ${inj.length - cap} 條 passive inject（已截斷）`)
  }

  return lines
}

/** Canonical tags for debug (deterministic sort). */
export function skillTabCanonicalTags(skillId: string | null | undefined): string[] {
  if (!skillId) return []
  const rec = getNormalizedSkillRecord(skillId)
  if (!rec) return []
  return [...activeCanonicalTagSet(rec.definition.tags)].sort((a, b) => a.localeCompare(b, 'en'))
}
