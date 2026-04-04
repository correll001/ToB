/**
 * Validate talent-affixes.json + print import statistics.
 *
 *   npx tsx scripts/verify/verifyTalentAffixes.ts
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { TalentAffixNormalizedFile } from '../../types/talentAffix'

const ROOT = join(__dirname, '..', '..')
const PATH = join(ROOT, 'data', 'normalized', 'ss12', 'talent-affixes.json')

function main() {
  const raw = readFileSync(PATH, 'utf8')
  const data = JSON.parse(raw) as TalentAffixNormalizedFile
  const { affixes } = data
  const ids = new Set<string>()
  let dup = 0
  for (const a of affixes) {
    if (ids.has(a.affixId)) dup++
    ids.add(a.affixId)
  }

  for (const a of affixes) {
    if (!a.affixId || !a.displayName || !a.sourceUrl) {
      console.error('[verifyTalentAffixes] FAIL missing required field', a.affixId)
      process.exit(1)
    }
    if (!a.rawText && (!a.descriptionLines || a.descriptionLines.length === 0)) {
      console.error('[verifyTalentAffixes] FAIL missing text', a.affixId)
      process.exit(1)
    }
  }

  const withIcon = affixes.filter((a) => !!a.iconUrl).length
  const withMods = affixes.filter((a) => a.modifiers.length > 0).length
  const rawOnly = affixes.filter((a) => a.modifiers.length === 0).length
  const newGod = affixes.filter((a) => a.newGodOnly).length
  const capHint = affixes.filter((a) => a.godGridEffectCapHint).length
  const slateHint = affixes.filter((a) => a.slateMentionHint).length
  const profession = affixes.filter((a) => a.professionRow).length
  const core = affixes.filter((a) => a.coreTalentRow).length
  const tree = affixes.filter((a) => a.talentTreeRow).length
  const unresolved = affixes.filter((a) => a.availability.includes('unresolved')).length

  console.log('[verifyTalentAffixes] report')
  console.log(`  file: ${PATH}`)
  console.log(`  affixCount: ${affixes.length}`)
  console.log(`  unique affixId: ${ids.size} duplicateIds: ${dup}`)
  console.log(`  with iconUrl: ${withIcon}`)
  console.log(`  with parsed modifiers (percent stubs): ${withMods}`)
  console.log(`  rawText only (no parsed modifiers): ${rawOnly}`)
  console.log(`  newGodOnly flag: ${newGod}`)
  console.log(`  godGridEffectCapHint: ${capHint}`)
  console.log(`  slateMentionHint (石板 in text): ${slateHint}`)
  console.log(`  rows: profession=${profession} core=${core} tree=${tree}`)
  console.log(`  availability includes unresolved: ${unresolved}`)

  if (dup > 0) {
    console.error('[verifyTalentAffixes] FAIL duplicate affixId')
    process.exit(1)
  }
  console.log('[verifyTalentAffixes] OK')
}

main()
