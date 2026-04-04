/**
 * 4F-5: Bundled actives — damaging+ready must corroborate hit scaling in emitted level-row modifiers.
 *
 *   npm run verify:level-row-confidence
 */
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import type { EffectiveRuntimeBundle } from '@/lib/data/types'
import { computeSkillInstance } from '@/lib/formula/skills/computeSkillInstance'
import { bundledGlobalCombatRuleLayer } from '@/lib/runtime/runtimeRulesLookup'

const ROOT = process.cwd()
const BUNDLE = path.join(ROOT, 'lib', 'gameData', 'generated', 'effective-runtime-bundle.json')

function main(): void {
  if (!existsSync(BUNDLE)) {
    console.error(`[verify:level-row-confidence] missing ${path.relative(ROOT, BUNDLE)}`)
    process.exit(1)
  }

  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8')) as EffectiveRuntimeBundle
  const layer = bundledGlobalCombatRuleLayer()
  const fails: string[] = []

  for (const rec of bundle.activeSkills.skills) {
    const def = rec.definition
    const inst = computeSkillInstance({
      active: def,
      level: 20,
      supports: [],
      globalLayer: layer,
      activeParse: { status: rec.parseStatus, warnings: rec.warnings },
    })

    if (inst.damageRole === 'damaging' && inst.calculationConfidence === 'ready') {
      if (inst.breakdown.levelRow.hitScalingFromRow !== true) {
        fails.push(`${def.id}: damaging+ready but levelRow.hitScalingFromRow !== true`)
      }
    }

  }

  if (fails.length) {
    console.error('[verify:level-row-confidence] FAILED:\n  - ' + fails.slice(0, 40).join('\n  - '))
    if (fails.length > 40) console.error(`  ... +${fails.length - 40} more`)
    process.exit(1)
  }

  console.log('[verify:level-row-confidence] OK', bundle.activeSkills.skills.length, 'actives')
}

main()
