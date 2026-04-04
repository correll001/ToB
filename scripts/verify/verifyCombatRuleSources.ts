/**
 * 4E-6 — Structured combat rules JSON: every extension block must carry `status` + non-empty `sources[]`.
 *
 *   npx tsx scripts/verify/verifyCombatRuleSources.ts
 *
 * Reads `data/effective/ss12/combat-rules.json` (authoritative effective file path).
 */
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import type { CombatRulesExtensions, RuleStatus } from '@/types/combatRules'

const ROOT = process.cwd()
const COMBAT_RULES_JSON = path.join(ROOT, 'data', 'effective', 'ss12', 'combat-rules.json')

const EXTENSION_KEYS: (keyof CombatRulesExtensions)[] = [
  'damageForms',
  'damageTypes',
  'damageConversion',
  'resistancePenetration',
  'armorReductionPenetration',
  'damageFormula',
  'critRules',
  'doubleDamageRules',
]

type SourceRow = {
  manifestRelativePath?: string
  topicId?: string
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0
}

function isRuleStatus(v: unknown): v is RuleStatus {
  return v === 'ready' || v === 'partial' || v === 'blocked_needs_user_rule'
}

function main() {
  const log = '[verify:combat-rule-sources]'
  const failures: string[] = []
  const notes: string[] = []

  if (!existsSync(COMBAT_RULES_JSON)) {
    console.error(`${log} missing ${path.relative(ROOT, COMBAT_RULES_JSON)}`)
    process.exit(1)
  }

  const raw = JSON.parse(readFileSync(COMBAT_RULES_JSON, 'utf8')) as {
    rules?: { structuredCombatRules?: { rules?: { extensions?: Partial<CombatRulesExtensions> } } }
  }

  const ext = raw.rules?.structuredCombatRules?.rules?.extensions
  if (!ext || typeof ext !== 'object') {
    console.error(`${log} FAILED: rules.structuredCombatRules.rules.extensions missing`)
    process.exit(1)
  }

  for (const key of EXTENSION_KEYS) {
    const block = ext[key] as Record<string, unknown> | undefined
    const blockLabel = `extensions.${String(key)}`

    if (block == null || typeof block !== 'object') {
      failures.push(`${blockLabel}: block missing`)
      continue
    }

    if (!('status' in block)) {
      failures.push(`${blockLabel}: missing field "status"`)
    } else if (!isRuleStatus(block.status)) {
      failures.push(`${blockLabel}: invalid status ${JSON.stringify(block.status)}`)
    }

    const sources = block.sources
    if (!Array.isArray(sources)) {
      failures.push(`${blockLabel}: "sources" must be an array`)
    } else if (sources.length === 0) {
      failures.push(`${blockLabel}: "sources" must be non-empty`)
    } else {
      sources.forEach((s: unknown, i: number) => {
        if (s == null || typeof s !== 'object') {
          failures.push(`${blockLabel}: sources[${i}] not an object`)
          return
        }
        const row = s as SourceRow
        if (!isNonEmptyString(row.manifestRelativePath) && !isNonEmptyString(row.topicId)) {
          failures.push(
            `${blockLabel}: sources[${i}] needs manifestRelativePath or topicId for traceability`,
          )
        }
      })
    }

    const st = block.status as RuleStatus | undefined
    if (st === 'blocked_needs_user_rule') {
      notes.push(`${blockLabel}: status=blocked_needs_user_rule`)
    }
    if (Array.isArray(block.blockedParts) && block.blockedParts.length > 0) {
      notes.push(`${blockLabel}: blockedParts[] count=${block.blockedParts.length}`)
    }
  }

  console.log(`${log} checked ${EXTENSION_KEYS.length} extension blocks`)

  if (notes.length) {
    console.log(`${log} boundary notes (informational):`)
    for (const n of notes) console.log(`  - ${n}`)
  }

  if (failures.length) {
    console.error(`${log} FAILED:\n  - ` + failures.join('\n  - '))
    process.exit(1)
  }

  console.log(`${log} OK`)
}

main()
