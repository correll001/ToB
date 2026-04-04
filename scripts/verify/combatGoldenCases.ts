/**
 * 4E-6 — Golden cases: authoritative structured combat rules + 4E-5 formula helpers (no UI).
 *
 *   npx tsx scripts/verify/combatGoldenCases.ts
 */
import type { DamageForm, DamageType } from '@/types/combatRules'
import {
  getDamageConversionRules,
  getDamageTypesRules,
  getDamageFormsRules,
  getCritRules,
} from '@/lib/runtime/runtimeRulesLookup'
import { incomingDamageTypeConversionAppliesToForm, outgoingDamageTypeConversionAppliesToForm } from '@/lib/formula/rules/damageFormApplicability'
import { redistributeSameSourceOutgoingPercents, specialFusionTypeBonusBlocked } from '@/lib/formula/rules/damageTypeConversion'
import { effectiveResistancePercentForDamageCalc } from '@/lib/formula/rules/resistancePenetration'
import { effectiveArmorMitigationPercentForDamageCalc } from '@/lib/formula/rules/armorReductionPenetration'
import { computeCritAndDoubleDamageForForm } from '@/lib/formula/rules/critAndDoubleDamage'

const LOG = '[verify:combat-golden-cases]'
const ALL_FORMS: DamageForm[] = ['hit', 'dot', 'indirect', 'reflect', 'true_damage']
const CANONICAL_TYPES: readonly DamageType[] = [
  'physical',
  'fire',
  'cold',
  'lightning',
  'corrosion',
]

function nearlySum100(values: number[], eps = 1e-6): boolean {
  const s = values.reduce((a, b) => a + b, 0)
  return Math.abs(s - 100) <= eps
}

function proportionalTo100(percents: number[]): number[] {
  const sum = percents.reduce((a, b) => a + b, 0)
  return percents.map((x) => (x / sum) * 100)
}

type CaseResult = { id: string; block: string; ok: boolean; detail: string }

function fail(id: string, block: string, detail: string): CaseResult {
  return { id, block, ok: false, detail }
}

function pass(id: string, block: string, detail = 'ok'): CaseResult {
  return { id, block, ok: true, detail }
}

export function runCombatGoldenCases(): CaseResult[] {
  const results: CaseResult[] = []

  const forms = getDamageFormsRules()
  if (!forms?.unspecifiedSkillDamageDefaultForm || forms.unspecifiedSkillDamageDefaultForm !== 'hit') {
    results.push(fail('A', 'damageForms', `expected unspecifiedSkillDamageDefaultForm "hit", got ${JSON.stringify(forms?.unspecifiedSkillDamageDefaultForm)}`))
  } else {
    results.push(pass('A', 'damageForms'))
  }

  const typesBlock = getDamageTypesRules()
  if (!typesBlock?.types) {
    results.push(fail('B', 'damageTypes', 'types[] missing'))
  } else {
    const set = new Set(typesBlock.types)
    const bMissing = CANONICAL_TYPES.filter((t) => !set.has(t))
    if (set.size !== CANONICAL_TYPES.length || bMissing.length) {
      results.push(
        fail(
          'B',
          'damageTypes',
          `expected exactly the five canonical types, distinct=${set.size} missing=${bMissing.join(',') || '—'}`,
        ),
      )
    } else {
      results.push(pass('B', 'damageTypes'))
    }
  }

  const ra = typesBlock?.resistanceAppliesTo
  if (!ra) {
    results.push(fail('C', 'damageTypes', 'resistanceAppliesTo missing'))
  } else if (ra.physical !== false) {
    results.push(fail('C', 'damageTypes', `physical should not use resistance matrix entry true, got ${ra.physical}`))
  } else {
    results.push(pass('C', 'damageTypes'))
  }

  if (!ra) {
    results.push(fail('D', 'damageTypes', 'resistanceAppliesTo missing'))
  } else {
    const need: DamageType[] = ['fire', 'cold', 'lightning', 'corrosion']
    let bad = ''
    for (const t of need) {
      if (ra[t] !== true) bad = `${t}=${ra[t]}`
    }
    if (bad) results.push(fail('D', 'damageTypes', `expected true for elemental+corrosion, bad ${bad}`))
    else results.push(pass('D', 'damageTypes'))
  }

  const conv = getDamageConversionRules()
  if (!conv) {
    results.push(fail('E', 'damageConversion', 'rules missing'))
  } else {
    if (!outgoingDamageTypeConversionAppliesToForm('hit', conv)) {
      results.push(fail('E', 'damageConversion', 'outgoing should apply to hit'))
    } else if (outgoingDamageTypeConversionAppliesToForm('dot', conv)) {
      results.push(fail('E', 'damageConversion', 'outgoing must not apply to dot'))
    } else {
      results.push(pass('E', 'damageConversion'))
    }
  }

  if (!conv) {
    results.push(fail('F', 'damageConversion', 'rules missing'))
  } else if (!conv.incomingConversionAppliesToAllDamageForms) {
    results.push(fail('F', 'damageConversion', 'incomingConversionAppliesToAllDamageForms should be true'))
  } else {
    let miss: DamageForm | null = null
    for (const f of ALL_FORMS) {
      if (!incomingDamageTypeConversionAppliesToForm(f, conv)) miss = f
    }
    if (miss) results.push(fail('F', 'damageConversion', `incoming should apply to form ${miss}`))
    else results.push(pass('F', 'damageConversion'))
  }

  if (!conv) {
    results.push(fail('G', 'damageConversion', 'rules missing'))
  } else if (conv.status === 'blocked_needs_user_rule') {
    results.push({
      id: 'G',
      block: 'damageConversion',
      ok: false,
      detail: 'cannot run redistributeSameSourceOutgoingPercents: whole block blocked_needs_user_rule',
    })
  } else {
    const res = redistributeSameSourceOutgoingPercents([30, 80])
    if (!res.ok) {
      results.push(fail('G', 'damageConversion', `redistribution blocked: ${res.reason}`))
    } else {
      const expected = proportionalTo100([30, 80])
      const ok =
        nearlySum100(res.redistributed) &&
        res.redistributed.length === 2 &&
        Math.abs(res.redistributed[0] - expected[0]) < 1e-9 &&
        Math.abs(res.redistributed[1] - expected[1]) < 1e-9
      if (!ok) {
        results.push(
          fail(
            'G',
            'damageConversion',
            `expected weight-scaled sum 100, got ${JSON.stringify(res.redistributed)}`,
          ),
        )
      } else {
        results.push(pass('G', 'damageConversion', 'same-source over 100% scales by weight (C.5)'))
      }
    }
  }

  const rawListed = 50
  const pen = 10
  const hitRes = effectiveResistancePercentForDamageCalc('hit', rawListed, pen)
  if (hitRes.skipped) {
    results.push(
      fail('H', 'resistancePenetration', `hit path should apply pen (not skipped); reason=${hitRes.reason}`),
    )
  } else if (hitRes.effective !== rawListed - pen) {
    results.push(
      fail(
        'H',
        'resistancePenetration',
        `effective should be raw - pen (${rawListed - pen}), got ${hitRes.effective}`,
      ),
    )
  } else {
    results.push(pass('H', 'resistancePenetration', 'effective = raw - pen; raw only passed in, not mutated'))
  }

  const armorHit = effectiveArmorMitigationPercentForDamageCalc('hit', 20, 10)
  if (armorHit.skipped || armorHit.effectiveMitigationPercent !== 10) {
    results.push(
      fail(
        'I',
        'armorReductionPenetration',
        `hit: expected effective mitigation 10, got skipped=${armorHit.skipped} value=${armorHit.effectiveMitigationPercent}`,
      ),
    )
  } else {
    const armorDot = effectiveArmorMitigationPercentForDamageCalc('dot', 20, 10)
    if (!armorDot.skipped || armorDot.effectiveMitigationPercent !== 20) {
      results.push(
        fail(
          'I',
          'armorReductionPenetration',
          'dot: penetration must not reduce mitigation (still base 20)',
        ),
      )
    } else {
      results.push(pass('I', 'armorReductionPenetration'))
    }
  }

  const armorNeg = effectiveArmorMitigationPercentForDamageCalc('hit', 5, 20)
  if (armorNeg.skipped || armorNeg.effectiveMitigationPercent !== -15) {
    results.push(
      fail(
        'J',
        'armorReductionPenetration',
        `expected effective mitigation -15, got skipped=${armorNeg.skipped} ${armorNeg.effectiveMitigationPercent}`,
      ),
    )
  } else {
    results.push(pass('J', 'armorReductionPenetration'))
  }

  const critDot = computeCritAndDoubleDamageForForm(
    'dot',
    { critChancePct: 100, critDamagePct: 0 },
    { legacyCritBaseMultiplier: 2 },
  )
  if (critDot.critExpectedMult !== 1) {
    results.push(fail('K', 'critRules', `crit must not apply to dot (EV=1), got ${critDot.critExpectedMult}`))
  } else {
    results.push(pass('K', 'critRules'))
  }

  const critRules = getCritRules()
  if (critRules?.defaultCritDamagePercent !== 150) {
    results.push(
      fail('L', 'critRules', `bundle defaultCritDamagePercent should be 150, got ${critRules?.defaultCritDamagePercent}`),
    )
  } else {
    const critHit = computeCritAndDoubleDamageForForm(
      'hit',
      { critChancePct: 100, critDamagePct: 0 },
      { legacyCritBaseMultiplier: 99 },
    )
    if (Math.abs(critHit.critExpectedMult - 1.5) > 1e-9) {
      results.push(
        fail(
          'L',
          'critRules',
          `with 100% crit and +0% crit damage, EV should be 1.5 (150% default), got ${critHit.critExpectedMult}`,
        ),
      )
    } else {
      results.push(pass('L', 'critRules', 'structured default 150% beats absurd legacy multiplier'))
    }
  }

  const ddDot = computeCritAndDoubleDamageForForm(
    'dot',
    { critChancePct: 0, critDamagePct: 0 },
    { legacyCritBaseMultiplier: 1.5, doubleDamageChancePct: 100 },
  )
  if (ddDot.doubleDamageExpectedMult !== 1) {
    results.push(
      fail('M', 'doubleDamageRules', `double damage must not apply to dot, got mult ${ddDot.doubleDamageExpectedMult}`),
    )
  } else {
    results.push(pass('M', 'doubleDamageRules'))
  }

  const tdRes = effectiveResistancePercentForDamageCalc('true_damage', 50, 0)
  const tdArmor = effectiveArmorMitigationPercentForDamageCalc('true_damage', 40, 0)
  const tdOk =
    tdRes.skipped &&
    tdRes.effective === 0 &&
    tdArmor.skipped &&
    tdArmor.effectiveMitigationPercent === 0
  if (!tdOk) {
    results.push(
      fail(
        'N',
        'damageForms',
        `true damage should ignore resist/armor (effective 0, skipped): resist=${JSON.stringify(tdRes)} armor=${JSON.stringify(tdArmor)}`,
      ),
    )
  } else {
    results.push(pass('N', 'damageForms'))
  }

  if (!specialFusionTypeBonusBlocked()) {
    results.push(
      fail(
        'BLOCK_C7',
        'damageConversion',
        'specialFusionTypeBonus must stay blocked_needs_user_rule until a user rule exists (do not pretend C.7 is implemented)',
      ),
    )
  } else {
    results.push(pass('BLOCK_C7', 'damageConversion', 'C.7 special fusion remains blocked (expected)'))
  }

  return results
}

function main() {
  const results = runCombatGoldenCases()
  const bad = results.filter((r) => !r.ok)

  for (const r of results) {
    const mark = r.ok ? 'PASS' : 'FAIL'
    console.log(`${LOG} [${r.id}] ${mark} (${r.block}) ${r.detail}`)
  }

  if (bad.length) {
    console.error(`${LOG} FAILED ${bad.length} case(s): ${bad.map((b) => b.id).join(', ')}`)
    process.exit(1)
  }

  console.log(`${LOG} OK (${results.length} cases)`)
}

main()
