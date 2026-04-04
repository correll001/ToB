/**
 * 4E-2 — Cross-layer diff for skill:Added_Fire_Damage (normalized vs override vs effective).
 * Read-only; writes docs/debug-added-fire-damage-layer-diff.md
 *
 *   npx tsx scripts/verify/compareAddedFireDamageAcrossLayers.ts
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { deepMerge } from '../etl/deepMerge'
import type { SupportRule } from '@/types/skillData'
import type { NormalizedSkillRecord, NormalizedSkillsFile } from '@/types/normalized'
import type { SkillOverrideEntry, SkillsOverrideDocument } from '@/types/override'

const SKILL_ID = 'skill:Added_Fire_Damage'
const OUT_REL = 'docs/debug-added-fire-damage-layer-diff.md'

type EffectiveSkillsFile = NormalizedSkillsFile

function loadJson<T>(rel: string): T {
  const p = join(process.cwd(), rel)
  return JSON.parse(readFileSync(p, 'utf8')) as T
}

/** `data/overrides/**` JSON files whose raw text mentions the skill slug (read-only scan). */
function listOverrideJsonFilesContaining(needle: string): string[] {
  const root = join(process.cwd(), 'data', 'overrides')
  const hits: string[] = []
  const walk = (dir: string) => {
    let entries: ReturnType<typeof readdirSync>
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const e of entries) {
      const p = join(dir, e.name)
      if (e.isDirectory()) walk(p)
      else if (e.isFile() && e.name.endsWith('.json')) {
        try {
          if (readFileSync(p, 'utf8').includes(needle)) {
            hits.push(relative(process.cwd(), p).split(sep).join('/'))
          }
        } catch {
          /* ignore */
        }
      }
    }
  }
  walk(root)
  hits.sort((a, b) => a.localeCompare(b, 'en'))
  return hits
}

function findNormalizedRecord(file: NormalizedSkillsFile, id: string): NormalizedSkillRecord | null {
  return file.skills.find((r) => r.definition?.id === id) ?? null
}

function findOverrideEntry(doc: SkillsOverrideDocument | null, id: string): SkillOverrideEntry | null {
  if (!doc?.entries) return null
  const hit = doc.entries.find((e) => e.id === id || e.id === id.replace(/^skill:/, '') || `skill:${e.id}` === id)
  return hit ?? null
}

function stableJson(v: unknown): string {
  if (v === undefined) return 'undefined'
  return JSON.stringify(v, null, 2)
}

/** One-line for markdown tables. */
function inlineJson(v: unknown): string {
  if (v === undefined) return '`undefined`'
  return `\`${JSON.stringify(v)}\``
}

function sortKeysDeep(v: unknown): unknown {
  if (v === null || typeof v !== 'object') return v
  if (Array.isArray(v)) return v.map(sortKeysDeep)
  const o = v as Record<string, unknown>
  const out: Record<string, unknown> = {}
  for (const k of Object.keys(o).sort()) {
    out[k] = sortKeysDeep(o[k])
  }
  return out
}

function jsonStructurallyEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(sortKeysDeep(a)) === JSON.stringify(sortKeysDeep(b))
}

function isEmptyObject(v: unknown): boolean {
  return v !== null && typeof v === 'object' && !Array.isArray(v) && Object.keys(v as object).length === 0
}

/** Spell-only gating for support gem pairing (heuristic). */
function isSpellOnlyGating(sr: SupportRule | undefined): boolean {
  if (!sr) return false
  if (sr.requiresSpell === true) return true
  const a = sr.allowedSkillTags
  if (Array.isArray(a) && a.length === 1 && a[0] === 'Spell') return true
  return false
}

function mergeSupportRules(base: SupportRule | undefined, patch: SupportRule | undefined): SupportRule {
  const b = (base ?? {}) as unknown as Record<string, unknown>
  const p = (patch ?? {}) as unknown as Record<string, unknown>
  return deepMerge(b, p) as unknown as SupportRule
}

function rawLinesSupportSpell(raw: string[] | undefined): 'yes' | 'weak' | 'no' | 'n/a' {
  if (!raw?.length) return 'n/a'
  const t = raw.join(' ').toLowerCase()
  if (/\bspell\b|法術|咒術|技能為法術/i.test(t)) return 'yes'
  if (/spell skills|added fire/i.test(t)) return 'yes'
  return 'weak'
}

function modifiersSummary(mods: unknown[] | undefined): string {
  if (!mods?.length) return stableJson(mods ?? [])
  return `${mods.length} modifier(s); first id=${(mods[0] as { id?: string })?.id ?? '?'}`
}

function cellSkillMissing(): string {
  return '`MISSING_IN_LAYER`'
}

function cellPatchMissing(): string {
  return '— *(override 條目未提供此欄，不覆寫 definition)*'
}

function main() {
  const normPath = 'data/normalized/ss12/support-skills.json'
  const effPath = 'data/effective/ss12/support-skills.json'
  const overridePath = 'data/overrides/ss12/support-skills.json'

  const normFile = loadJson<NormalizedSkillsFile>(normPath)
  const effFile = loadJson<EffectiveSkillsFile>(effPath)
  let overrideDoc: SkillsOverrideDocument | null = null
  try {
    overrideDoc = loadJson<SkillsOverrideDocument>(overridePath)
  } catch {
    overrideDoc = null
  }

  const normRec = findNormalizedRecord(normFile, SKILL_ID)
  const effRec = findNormalizedRecord(effFile, SKILL_ID)
  const ovEntry = findOverrideEntry(overrideDoc, SKILL_ID)

  const normDef = normRec?.definition ?? null
  const effDef = effRec?.definition ?? null

  const normSr = normDef?.supportRules
  const effSr = effDef?.supportRules
  const ovMerge = ovEntry?.supportRulesMerge

  const mergedPreview = mergeSupportRules(normSr, ovMerge)

  const spellNorm = isSpellOnlyGating(normSr)
  const spellMerged = isSpellOnlyGating(mergedPreview)
  const spellEff = isSpellOnlyGating(effSr)

  let earliestSpell: string
  if (spellNorm) earliestSpell = `**Normalized 層**（\`${normPath}\` 內 \`supportRules\` 已構成 Spell-only）`
  else if (spellMerged && ovEntry)
    earliestSpell = `**Override 層**（\`${overridePath}\` 的 \`supportRulesMerge\` 與 normalized 合併後首次成為 Spell-only）`
  else if (spellEff && !spellMerged)
    earliestSpell = `**異常**：effective 呈 Spell-only，但 normalized+override 合併預覽非 Spell-only（請查 import / 手動改檔）`
  else earliestSpell = '**無**（三層均未偵測到 Spell-only 門檻）'

  const rawEff = effSr?.rawRequirementLines
  const rawAlign =
    spellEff && rawLinesSupportSpell(rawEff) === 'yes'
      ? '`rawRequirementLines` 文字與 Spell-only **一致**'
      : spellEff && rawLinesSupportSpell(rawEff) === 'n/a'
        ? '`rawRequirementLines` 缺失 — **無法**用文案佐證規則'
        : spellEff
          ? '`rawRequirementLines` 與 Spell-only **對齊度弱或矛盾**（見下方原文）'
          : 'n/a（effective 非 Spell-only）'

  const summaryTextHit = normDef?.summaryText?.join(' ') ?? ''
  const normTextSaysHit = /擊中|輔助擊中/.test(summaryTextHit)
  const modContradiction =
    normDef?.modifiers?.length && spellEff && normTextSaysHit
      ? 'normalized **summaryText** 含「擊中／輔助擊中」語意，與 **Spell-only** 門檻可能語意衝突（實際仍以 `supportRules` 為準）。'
      : normDef?.modifiers?.length && spellEff
        ? 'modifiers 存在；請人工比對是否與 `supportRules` 敘述一致。'
        : '無顯著矛盾（或缺資料）。'

  const normAllowed = normSr?.allowedSkillTags
  const effAllowed = effSr?.allowedSkillTags
  const narrowedToSpellOnlyTags =
    Array.isArray(normAllowed) &&
    normAllowed.includes('Attack') &&
    Array.isArray(effAllowed) &&
    effAllowed.length === 1 &&
    effAllowed[0] === 'Spell'

  const rows: Array<{ field: string; normalized: string; override: string; effective: string }> = []

  const pushRow = (field: string, n: string, o: string, e: string) => rows.push({ field, normalized: n, override: o, effective: e })

  pushRow(
    'id',
    normDef ? `\`${normDef.id}\`` : cellSkillMissing(),
    ovEntry ? `\`${SKILL_ID}\` *(條目 id)*` : cellSkillMissing(),
    effDef ? `\`${effDef.id}\`` : cellSkillMissing(),
  )
  pushRow(
    'name',
    normDef ? stableJson(normDef.name) : cellSkillMissing(),
    ovEntry ? cellPatchMissing() : cellSkillMissing(),
    effDef ? stableJson(effDef.name) : cellSkillMissing(),
  )
  pushRow(
    'family',
    normDef ? stableJson(normDef.family) : cellSkillMissing(),
    ovEntry ? cellPatchMissing() : cellSkillMissing(),
    effDef ? stableJson(effDef.family) : cellSkillMissing(),
  )

  const srTableCell = (sr: SupportRule | undefined): string => {
    if (sr === undefined) return '`undefined`'
    if (isEmptyObject(sr)) return '`{}`'
    const s = JSON.stringify(sr)
    return s.length > 160 ? '`（非空，見下方 § 全文）`' : inlineJson(sr)
  }

  pushRow(
    'supportRules（列內為摘要；全文見下方 §）',
    normDef ? srTableCell(normSr) : cellSkillMissing(),
    ovEntry ? (ovMerge && Object.keys(ovMerge as object).length ? srTableCell(ovMerge) : '`{}`') : cellSkillMissing(),
    effDef ? srTableCell(effSr) : cellSkillMissing(),
  )

  const pick = (sr: SupportRule | undefined, k: keyof SupportRule) => {
    const v = sr?.[k]
    return v === undefined ? '`undefined`' : inlineJson(v)
  }

  pushRow(
    'allowedSkillTags',
    normDef ? pick(normSr, 'allowedSkillTags') : cellSkillMissing(),
    ovEntry ? (ovMerge ? pick(ovMerge, 'allowedSkillTags') : '`undefined`') : cellSkillMissing(),
    effDef ? pick(effSr, 'allowedSkillTags') : cellSkillMissing(),
  )
  pushRow(
    'requiresAttack',
    normDef ? pick(normSr, 'requiresAttack') : cellSkillMissing(),
    ovEntry ? (ovMerge ? pick(ovMerge, 'requiresAttack') : '`undefined`') : cellSkillMissing(),
    effDef ? pick(effSr, 'requiresAttack') : cellSkillMissing(),
  )
  pushRow(
    'requiresSpell',
    normDef ? pick(normSr, 'requiresSpell') : cellSkillMissing(),
    ovEntry ? (ovMerge ? pick(ovMerge, 'requiresSpell') : '`undefined`') : cellSkillMissing(),
    effDef ? pick(effSr, 'requiresSpell') : cellSkillMissing(),
  )
  pushRow(
    'rawRequirementLines',
    normDef ? pick(normSr, 'rawRequirementLines') : cellSkillMissing(),
    ovEntry ? (ovMerge ? pick(ovMerge, 'rawRequirementLines') : '`undefined`') : cellSkillMissing(),
    effDef ? pick(effSr, 'rawRequirementLines') : cellSkillMissing(),
  )
  pushRow(
    'modifiers（摘要）',
    normDef ? modifiersSummary(normDef.modifiers) : cellSkillMissing(),
    ovEntry
      ? ovEntry.modifiersAppend?.length
        ? modifiersSummary(ovEntry.modifiersAppend)
        : ovEntry.modifiersReplace?.length
          ? `modifiersReplace: ${modifiersSummary(ovEntry.modifiersReplace)}`
          : '— *(未 append/replace)*'
      : cellSkillMissing(),
    effDef ? modifiersSummary(effDef.modifiers) : cellSkillMissing(),
  )

  const md: string[] = []
  md.push('# Added_Fire_Damage — normalized / override / effective 差異（4E-2）')
  md.push('')
  md.push(`Generated: ${new Date().toISOString()}`)
  md.push('')
  md.push('## 結論摘要')
  md.push('')
  md.push(`- **最早出現 Spell-only 的層級**: ${earliestSpell}`)
  md.push(`- **Spell-only 偵測**（\`requiresSpell === true\` 或 \`allowedSkillTags === [\"Spell\"]\`）: normalized=${spellNorm} → merged( norm + overrideMerge )=${spellMerged} → effective=${spellEff}`)
  md.push(`- **rawRequirementLines 是否支持 Spell-only 判定**: ${rawAlign}`)
  md.push(`- **modifiers 與 rules**: ${modContradiction}`)
  md.push(
    `- **override 是否把「含 Attack」收窄成 Spell-only**: ${narrowedToSpellOnlyTags ? '是 — normalized `allowedSkillTags` 含 **Attack**，effective 僅 **Spell**（`deepMerge` 以 patch 陣列**整段取代**原陣列）' : '否或 n/a（見表）'}`,
  )
  md.push('')
  md.push('### 路線判讀')
  md.push('')
  md.push(
    spellNorm
      ? '- **路線 1**：normalized 已 Spell-only → 疑 **parser / 頁面需求解析**（或上游資料）。'
      : spellMerged && !spellNorm
        ? '- **路線 2**：normalized 非 Spell-only，override 合併後變 Spell-only → 疑 **人工 override / 套版規則**（`data/overrides/.../support-skills.json`）。'
        : '- 請依上表與 `supportRules` 全文人工複核。',
  )
  md.push('')
  md.push('### 合併預覽（驗證 ETL `deepMerge`）')
  md.push('')
  md.push('`effective.supportRules` 應等於 `deepMerge(normalized.supportRules ?? {}, override.supportRulesMerge ?? {})`。預覽：')
  md.push('')
  md.push('```json')
  md.push(stableJson(mergedPreview))
  md.push('```')
  md.push('')
  const mergeMatch = jsonStructurallyEqual(mergedPreview, effSr ?? {})
  md.push(`- **與 effective.supportRules 結構比對**: ${mergeMatch ? '一致' : '**不一致**（請查是否有多段 override 或其它管線）'}`)
  md.push('')

  md.push('## 跨層欄位對照表')
  md.push('')
  md.push('| 欄位 | normalized | override（patch） | effective |')
  md.push('| --- | --- | --- | --- |')
  for (const r of rows) {
    const esc = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ')
    md.push(`| **${esc(r.field)}** | ${esc(r.normalized)} | ${esc(r.override)} | ${esc(r.effective)} |`)
  }
  md.push('')

  md.push('## supportRules / supportRulesMerge 全文（JSON）')
  md.push('')
  md.push('### normalized → `definition.supportRules`')
  md.push('')
  md.push('```json')
  md.push(normDef ? stableJson(normSr ?? {}) : 'MISSING_IN_LAYER')
  md.push('```')
  md.push('')
  md.push('### override → `supportRulesMerge`（僅 patch）')
  md.push('')
  md.push('```json')
  md.push(ovEntry ? stableJson(ovMerge ?? {}) : 'MISSING_IN_LAYER')
  md.push('```')
  md.push('')
  md.push('### effective → `definition.supportRules`')
  md.push('')
  md.push('```json')
  md.push(effDef ? stableJson(effSr ?? {}) : 'MISSING_IN_LAYER')
  md.push('```')
  md.push('')

  const overrideHits = listOverrideJsonFilesContaining('Added_Fire_Damage')
  md.push('## 其它 `data/overrides` 檔案')
  md.push('')
  md.push(
    `以字串 \`Added_Fire_Damage\` 掃描 \`data/overrides/**/*.json\`：**${overrideHits.length}** 個檔案命中。`,
  )
  md.push('')
  md.push(overrideHits.map((p) => `- \`${p}\``).join('\n') || '- （無）')
  md.push('')

  md.push('## 參考：ETL 合併實作')
  md.push('')
  md.push('- `scripts/etl/applySkillOverride.ts` — `supportRulesMerge` 以 `deepMerge` 寫入 `definition.supportRules`')
  md.push('- `scripts/etl/applyOverrides.ts` — normalized + overrides → effective')
  md.push('- `scripts/import/importEffectiveData.ts` — effective → DB / bundle（本腳本不比對 DB）')
  md.push('')

  const outPath = join(process.cwd(), OUT_REL)
  writeFileSync(outPath, md.join('\n'), 'utf8')
  console.log(`Wrote ${OUT_REL}`)
}

main()
