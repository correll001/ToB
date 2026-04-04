/**
 * 4E-3 — Runtime vs bundled JSON vs effective support-skills for Added_Fire_Damage (+ Hammer_of_Ash).
 * Read-only: calls getSkillDefinitionById / reads files; prints + writes docs/debug-runtime-added-fire-damage.md
 *
 *   npx tsx scripts/verify/debugRuntimeAddedFireDamage.ts
 *
 * Note: Webpack/Next imports `lib/gameData/generated/effective-runtime-bundle.json` (not under data/effective/).
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { EffectiveRuntimeBundle } from '@/lib/data/types'
import type { NormalizedSkillRecord, NormalizedSkillsFile } from '@/types/normalized'
import type { SkillDefinition } from '@/types/skillData'
import { getBundledSkillDatasetMeta, getSkillDefinitionById, getNormalizedSkillRecord } from '@/lib/runtime/runtimeSkillLookup'

const BUNDLE_REL = 'lib/gameData/generated/effective-runtime-bundle.json'
const EFFECTIVE_SUPPORT_REL = 'data/effective/ss12/support-skills.json'
const EFFECTIVE_ACTIVE_REL = 'data/effective/ss12/active-skills.json'
const OUT_REL = 'docs/debug-runtime-added-fire-damage.md'

const IDS = {
  support: 'skill:Added_Fire_Damage',
  active: 'skill:Hammer_of_Ash',
} as const

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

function jsonEq(a: unknown, b: unknown): boolean {
  return JSON.stringify(sortKeysDeep(a)) === JSON.stringify(sortKeysDeep(b))
}

function loadJson<T>(rel: string): T {
  const p = join(process.cwd(), rel)
  return JSON.parse(readFileSync(p, 'utf8')) as T
}

function findRow(file: NormalizedSkillsFile, id: string): NormalizedSkillRecord | undefined {
  return file.skills.find((r) => r.definition?.id === id)
}

type TraceSlice = {
  supportRules: SkillDefinition['supportRules']
  tags: string[] | undefined
  parseStatus: string | undefined
  sourceUrl: string | undefined
  rawRequirementLines: string[] | undefined
}

function sliceFromDef(def: SkillDefinition | undefined, parseStatus?: string): TraceSlice | null {
  if (!def) return null
  return {
    supportRules: def.supportRules,
    tags: def.tags,
    parseStatus,
    sourceUrl: def.sourceUrl,
    rawRequirementLines: def.supportRules?.rawRequirementLines,
  }
}

function fmtSlice(label: string, s: TraceSlice | null): string[] {
  const lines: string[] = []
  lines.push(`### ${label}`)
  lines.push('')
  if (!s) {
    lines.push('**MISSING**（無此 id）')
    lines.push('')
    return lines
  }
  lines.push('```json')
  lines.push(
    JSON.stringify(
      {
        supportRules: s.supportRules ?? null,
        tags: s.tags ?? null,
        parseStatus: s.parseStatus ?? null,
        sourceUrl: s.sourceUrl ?? null,
        rawRequirementLines: s.rawRequirementLines ?? null,
      },
      null,
      2,
    ),
  )
  lines.push('```')
  lines.push('')
  return lines
}

function compareLine(a: string, rt: TraceSlice | null, b: TraceSlice | null, c: TraceSlice | null): string {
  const eq = (x: TraceSlice | null, y: TraceSlice | null) => (x && y ? jsonEq(x, y) : x === y)
  const rtB = eq(rt, b)
  const rtC = eq(rt, c)
  const bc = eq(b, c)
  return [
    `#### ${a}`,
    '',
    `- **runtime lookup vs disk bundle（${BUNDLE_REL}）**: ${!rt ? 'n/a（runtime 缺）' : !b ? 'n/a（bundle 缺）' : rtB ? '一致' : '**不一致**'}`,
    `- **runtime lookup vs ${a.includes('Support') ? EFFECTIVE_SUPPORT_REL : EFFECTIVE_ACTIVE_REL}**: ${!rt ? 'n/a' : !c ? 'n/a（effective 檔缺）' : rtC ? '一致' : '**不一致**'}`,
    `- **disk bundle vs effective 分檔**: ${!b || !c ? 'n/a' : bc ? '一致' : '**不一致**（bundle 可能未重新 import / 生成）'}`,
    '',
  ].join('\n')
}

function spellOnlySummary(sr: SkillDefinition['supportRules']): string {
  if (!sr) return '（無 supportRules）'
  const parts: string[] = []
  if (sr.requiresSpell === true) parts.push('requiresSpell:true')
  if (sr.allowedSkillTags?.length) parts.push(`allowedSkillTags:${JSON.stringify(sr.allowedSkillTags)}`)
  return parts.length ? parts.join(', ') : '（無 Spell 門檻欄位）'
}

function main() {
  const cwd = process.cwd()
  const meta = getBundledSkillDatasetMeta()
  const bundle = loadJson<EffectiveRuntimeBundle>(BUNDLE_REL)
  const effSupportFile = loadJson<NormalizedSkillsFile>(EFFECTIVE_SUPPORT_REL)
  const effActiveFile = loadJson<NormalizedSkillsFile>(EFFECTIVE_ACTIVE_REL)

  const md: string[] = []
  const log = (s: string) => {
    console.log(s)
    md.push(s)
  }

  md.push('# Runtime 載入實值 — Added_Fire_Damage / Hammer_of_Ash（4E-3）')
  md.push('')
  md.push(`Generated: ${new Date().toISOString()}`)
  md.push('')
  log('## Bundled dataset meta（getBundledSkillDatasetMeta）')
  log('')
  log('```json')
  log(JSON.stringify(meta, null, 2))
  log('```')
  log('')
  log('資料來源說明：`runtimeDataset.ts` 以 **webpack 靜態 import** 載入 `lib/gameData/generated/effective-runtime-bundle.json`，與 `data/effective/ss12/*.json` 是否一致取決於最後一次 `importEffectiveData` / 產 bundle 流程。')
  log('')

  for (const [kind, id] of Object.entries(IDS) as [keyof typeof IDS, string][]) {
    const isSupport = kind === 'support'
    const file = isSupport ? bundle.supportSkills : bundle.activeSkills
    const effFile = isSupport ? effSupportFile : effActiveFile

    const rtDef = getSkillDefinitionById(id)
    const rtRec = getNormalizedSkillRecord(id)
    const bundleRow = findRow(file, id)
    const effRow = findRow(effFile, id)

    const rtSlice = sliceFromDef(rtDef, rtRec?.parseStatus)
    const bundleSlice = sliceFromDef(bundleRow?.definition, bundleRow?.parseStatus)
    const effSlice = sliceFromDef(effRow?.definition, effRow?.parseStatus)

    log(`## ${id}`)
    log('')
    log(`- **runtime 是否載到**: ${rtDef ? '是' : '**否**'}`)
    log(`- **Spell-only 摘要（supportRules）**: ${spellOnlySummary(rtDef?.supportRules)}`)
    log('')

    for (const block of fmtSlice('Runtime — getSkillDefinitionById + getNormalizedSkillRecord（parseStatus）', rtSlice)) log(block)
    for (const block of fmtSlice(`Disk bundle — ${BUNDLE_REL}（同一路徑 import）`, bundleSlice)) log(block)
    for (const block of fmtSlice(
      `Effective 分檔 — ${isSupport ? EFFECTIVE_SUPPORT_REL : EFFECTIVE_ACTIVE_REL}`,
      effSlice,
    ))
      log(block)

    log(compareLine(kind === 'support' ? 'Support 比對' : 'Active 比對', rtSlice, bundleSlice, effSlice))
  }

  log('## 驗收摘要')
  log('')
  log('| 問題 | 答案（請以上方比對區塊為準） |')
  log('| --- | --- |')
  log('| runtime 是否載到 Added_Fire_Damage？ | 見 Added_Fire_Damage 小節 |')
  log('| runtime 看到的 rule？ | 見該小節 `supportRules` |')
  log('| runtime 與 generated bundle 是否一致？ | 應一致；若否代表 import 路徑或快取異常 |')
  log('| runtime/bundle 與 data/effective 分檔是否一致？ | 若否 → 需重跑產 bundle / import |')
  log('')

  writeFileSync(join(cwd, OUT_REL), md.join('\n'), 'utf8')
  console.log(`\nWrote ${OUT_REL}`)
}

main()
