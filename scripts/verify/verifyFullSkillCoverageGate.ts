/**
 * 4F-8 — Full-skill coverage release gate (thresholds on entire bundle + engine probes).
 *
 *   npm run verify:full-skill-coverage-gate
 */
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import type { EffectiveRuntimeBundle } from '@/lib/data/types'
import {
  computeFullSkillCoverageMetrics,
  evaluateFullSkillCoverageGate,
  formatConfidenceDist,
} from '@/scripts/verify/fullSkillCoverageContract'

const ROOT = process.cwd()
const BUNDLE = path.join(ROOT, 'lib', 'gameData', 'generated', 'effective-runtime-bundle.json')

function main() {
  if (!existsSync(BUNDLE)) {
    console.error(`[verify:full-skill-coverage-gate] missing ${path.relative(ROOT, BUNDLE)}`)
    process.exit(1)
  }

  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8')) as EffectiveRuntimeBundle
  const m = computeFullSkillCoverageMetrics(bundle)
  const gate = evaluateFullSkillCoverageGate(m)

  console.log('[verify:full-skill-coverage-gate] record counts')
  console.log(
    `  active=${m.recordCounts.active} support=${m.recordCounts.support} passive=${m.recordCounts.passive} all=${m.recordCounts.all}`,
  )
  console.log(`  parse: ok=${m.parseTally.ok} partial=${m.parseTally.partial} failed=${m.parseTally.failed}`)
  console.log(`  parse ok ratio: ${m.parseOkRatio.toFixed(4)}`)
  console.log(formatConfidenceDist('  main-slot actives @ Lv20 (instance)', m.mainActiveConfidence))
  console.log(formatConfidenceDist('  └ damaging subset', m.mainDamagingConfidence))
  console.log(
    `  inspected: damaging authoritative=${m.inspectedDamagingAuthoritative} · damaging but effective≠ready=${m.inspectedDamagingNonReadyEffective} · dpsBlocked=${m.inspectedDpsBlocked}`,
  )
  console.log(`  structural: activeMissingLevelTable=${m.activeMissingLevelTable} activeLv20None=${m.activeResolveLv20None}`)
  console.log(`  support both hollow=${m.supportBothHollow} (must stay 0)`)
  console.log(`  passive ok without inject=${m.passiveParseOkWithoutInjectableModifiers} (must stay 0)`)
  console.log(`  damaging instance not ready=${m.damagingInstanceNotReadyCount}`)

  for (const w of gate.warnings) {
    console.warn(`[verify:full-skill-coverage-gate] WARN: ${w}`)
  }

  if (!gate.ok) {
    console.error('[verify:full-skill-coverage-gate] FAILED:\n  - ' + gate.failures.join('\n  - '))
    process.exit(1)
  }

  console.log('[verify:full-skill-coverage-gate] OK')
}

main()
