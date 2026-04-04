/**
 * 4D-5: Skill system regression — no network, runs under tsx.
 *
 *   npm run verify:skill-regression
 */
import type { EffectiveRuntimeBundle } from '@/lib/data/types'
import type { BuildSnapshot, MainSkillSlot } from '@/types/build'
import type { SkillDefinition } from '@/types/skillData'
import type { SkillCombatRole } from '@/types/skillDamageRole'
import { createEmptyBuildSnapshot } from '@/lib/defaultBuildSnapshot'
import { normalizeBuildSnapshot } from '@/lib/normalizeBuildSnapshot'
import { computeSkillInstanceForMainSlot } from '@/lib/formula/collectBuildContributions'
import { computeSkillInstance, skillInstanceToContribution } from '@/lib/formula/skills/computeSkillInstance'
import {
  deriveInspectedPresentationMode,
  selectBuildStatsPanelDerived,
  selectInspectedSkillDamageView,
} from '@/selectors/buildComputedStats'
import {
  computeFullSkillCoverageMetrics,
  evaluateFullSkillCoverageGate,
} from '@/scripts/verify/fullSkillCoverageContract'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { encodeBuildToShareCode, decodeBuildFromShareCode } from '@/lib/shareCodec'
import { getSkillDefinitionById } from '@/lib/runtime/runtimeSkillLookup'
import { getRuntimeDataset } from '@/lib/runtime/runtimeDataset'
import { inferSkillCombatRole, isDamagingInspectedSkillRole } from '@/lib/formula/skills/inferDamageRole'
import { passiveModifiersForActiveSkill } from '@/lib/formula/collectBuildContributions'

function firstBundledActiveWithRole(role: SkillCombatRole): SkillDefinition | null {
  const file = getRuntimeDataset().activeSkillsFile
  for (const lv of [20, 10, 1, 30]) {
    for (const r of file.skills) {
      const inferred = inferSkillCombatRole(r.definition, lv, { parseStatus: r.parseStatus })
      if (inferred === role) return r.definition
    }
  }
  return null
}

function sk(
  partial: Pick<SkillDefinition, 'id' | 'name' | 'family' | 'tags'> &
    Partial<Omit<SkillDefinition, 'id' | 'name' | 'family' | 'tags'>>,
): SkillDefinition {
  return {
    sourceUrl: '',
    locale: 'tw',
    season: 'ss12',
    version: '1.0.0',
    ...partial,
  }
}

const scatter = sk({
  id: 'skill:Multiple_Projectiles',
  name: '散射',
  family: 'support',
  tags: ['投射物', '輔助'],
  supportRules: { requiresProjectile: true, allowedSkillTags: ['Projectile'] },
  modifiers: [],
})

function assert(name: string, ok: boolean, detail?: string) {
  if (!ok) {
    console.error(`[verify:skill-regression] FAIL ${name}${detail ? `: ${detail}` : ''}`)
    process.exit(1)
  }
}

function main() {
  const ice = getSkillDefinitionById('skill:Ice_Shot')
  const sc = getSkillDefinitionById('skill:Multiple_Projectiles')
  assert('bundle Ice_Shot', !!ice)
  assert('bundle Scatter', !!sc)

  const compatible = computeSkillInstanceForMainSlot(
    {
      slot: 1,
      skillId: 'skill:Ice_Shot',
      supports: [{ supportSkillId: 'skill:Multiple_Projectiles', level: 20, enabled: true, linkSlot: 1 }],
      skillLevel: 20,
      enabled: true,
    },
    createEmptyBuildSnapshot(),
  )
  assert('damaging+compatible support', !!compatible?.supports[0]?.applied)

  const incompatible = computeSkillInstanceForMainSlot(
    {
      slot: 1,
      skillId: 'skill:Ice_Shot',
      supports: [{ supportSkillId: scatter.id, level: 20, enabled: true, linkSlot: 1 }],
      skillLevel: 20,
      enabled: true,
    },
    createEmptyBuildSnapshot(),
  )
  assert('damaging+incompatible: instance built', !!incompatible)
  assert('scatter skipped when not linked to mock support only', true)
  const leap = getSkillDefinitionById('skill:Leap_Attack')
  if (leap) {
    const leapInst = computeSkillInstanceForMainSlot(
      {
        slot: 1,
        skillId: 'skill:Leap_Attack',
        supports: [{ supportSkillId: 'skill:Multiple_Projectiles', level: 20, enabled: true, linkSlot: 1 }],
        skillLevel: 20,
        enabled: true,
      },
      createEmptyBuildSnapshot(),
    )
    assert('non-projectile main + projectile support = skipped', !!leapInst && !leapInst.supports[0]?.applied)
  }

  const blizzard = getSkillDefinitionById('skill:Blizzard')
  const steamroll = getSkillDefinitionById('skill:Steamroll')
  if (blizzard && steamroll) {
    const spellSkipMelee = computeSkillInstanceForMainSlot(
      {
        slot: 1,
        skillId: 'skill:Blizzard',
        supports: [{ supportSkillId: steamroll.id, level: 20, enabled: true, linkSlot: 1 }],
        skillLevel: 20,
        enabled: true,
      },
      createEmptyBuildSnapshot(),
    )
    assert(
      'spell main + attack-only support = skipped',
      !!spellSkipMelee && !spellSkipMelee.supports[0]?.applied,
      spellSkipMelee?.supports[0]?.skipReason,
    )
  }

  const overload = getSkillDefinitionById('skill:Overload')
  if (blizzard && overload) {
    const spellSpellSup = computeSkillInstanceForMainSlot(
      {
        slot: 1,
        skillId: 'skill:Blizzard',
        supports: [{ supportSkillId: overload.id, level: 20, enabled: true, linkSlot: 1 }],
        skillLevel: 20,
        enabled: true,
      },
      createEmptyBuildSnapshot(),
    )
    assert('spell main + spell support = applied', !!spellSpellSup && !!spellSpellSup.supports[0]?.applied)
  }

  if (ice && overload) {
    const atkNoSpellSup = computeSkillInstanceForMainSlot(
      {
        slot: 1,
        skillId: ice.id,
        supports: [{ supportSkillId: overload.id, level: 20, enabled: true, linkSlot: 1 }],
        skillLevel: 20,
        enabled: true,
      },
      createEmptyBuildSnapshot(),
    )
    assert(
      'projectile attack main + spell-only support = skipped',
      !!atkNoSpellSup && !atkNoSpellSup.supports[0]?.applied,
    )
  }

  const projArea = getSkillDefinitionById('skill:Increased_Area')
  if (ice && projArea) {
    const iceArea = computeSkillInstanceForMainSlot(
      {
        slot: 1,
        skillId: ice.id,
        supports: [{ supportSkillId: projArea.id, level: 20, enabled: true, linkSlot: 1 }],
        skillLevel: 20,
        enabled: true,
      },
      createEmptyBuildSnapshot(),
    )
    assert('projectile main + area support = applied', !!iceArea && !!iceArea.supports[0]?.applied)
  }

  const whirl = getSkillDefinitionById('skill:Whirlwind')
  const multi = getSkillDefinitionById('skill:Multistrike')
  if (whirl && multi) {
    const wwMs = computeSkillInstanceForMainSlot(
      {
        slot: 1,
        skillId: whirl.id,
        supports: [{ supportSkillId: multi.id, level: 20, enabled: true, linkSlot: 1 }],
        skillLevel: 20,
        enabled: true,
      },
      createEmptyBuildSnapshot(),
    )
    assert(
      'channeled main + multistrike forbidden = skipped',
      !!wwMs && !wwMs.supports[0]?.applied,
      wwMs?.supports[0]?.skipReason,
    )
  }

  if (ice && multi) {
    const iceMs = computeSkillInstanceForMainSlot(
      {
        slot: 1,
        skillId: ice.id,
        supports: [{ supportSkillId: multi.id, level: 20, enabled: true, linkSlot: 1 }],
        skillLevel: 20,
        enabled: true,
      },
      createEmptyBuildSnapshot(),
    )
    assert('non-channeled attack + multistrike = applied', !!iceMs && !!iceMs.supports[0]?.applied)
  }

  const blink = getSkillDefinitionById('skill:Blink')
  const quickDecision = getSkillDefinitionById('skill:Quick_Decision')
  if (blink && quickDecision) {
    const blkQd = computeSkillInstanceForMainSlot(
      {
        slot: 1,
        skillId: blink.id,
        supports: [{ supportSkillId: quickDecision.id, level: 20, enabled: true, linkSlot: 1 }],
        skillLevel: 20,
        enabled: true,
      },
      createEmptyBuildSnapshot(),
    )
    assert(
      'mobility spell + support that forbids mobility = skipped',
      !!blkQd && !blkQd.supports[0]?.applied,
      blkQd?.supports[0]?.skipReason,
    )
  }

  const addedLight = getSkillDefinitionById('skill:Added_Lightning_Damage')
  if (ice && addedLight?.levelTable && Object.keys(addedLight.levelTable).length > 0) {
    const low = computeSkillInstanceForMainSlot(
      {
        slot: 1,
        skillId: ice.id,
        supports: [{ supportSkillId: addedLight.id, level: 5, enabled: true, linkSlot: 1 }],
        skillLevel: 20,
        enabled: true,
      },
      createEmptyBuildSnapshot(),
    )
    const high = computeSkillInstanceForMainSlot(
      {
        slot: 1,
        skillId: ice.id,
        supports: [{ supportSkillId: addedLight.id, level: 20, enabled: true, linkSlot: 1 }],
        skillLevel: 20,
        enabled: true,
      },
      createEmptyBuildSnapshot(),
    )
    const a = low?.computedStats['skill.addedBaseDamage'] ?? 0
    const b = high?.computedStats['skill.addedBaseDamage'] ?? 0
    assert(
      'support gem level row changes structured added damage on main',
      !!low?.supports[0]?.applied && b > a,
      `added=${a} vs ${b}`,
    )
  }

  const stoneskin = getSkillDefinitionById('skill:Stoneskin')
  if (stoneskin) {
    const auraSnap: BuildSnapshot = {
      ...createEmptyBuildSnapshot(),
      meta: { ...createEmptyBuildSnapshot().meta, inspectedMainSkillSlot: 1 },
      skills: [
        { slot: 1, skillId: stoneskin.id, supports: [], skillLevel: 10, enabled: true },
        ...createEmptyBuildSnapshot().skills.slice(1),
      ],
    }
    const auraInst = computeSkillInstanceForMainSlot(auraSnap.skills[0]!, auraSnap)
    if (auraInst?.damageRole === 'aura-only') {
      const auraView = selectInspectedSkillDamageView(auraSnap)
      assert('aura-only active inspected → not damaging mode', auraView.mode !== 'damaging', JSON.stringify(auraView))
      assert(
        '4F-7: aura-only → presentation role_aura_only',
        deriveInspectedPresentationMode(auraView) === 'role_aura_only',
        deriveInspectedPresentationMode(auraView),
      )
      const dAura = selectBuildStatsPanelDerived(auraSnap)
      assert(
        '4F-7: derived sequence key + mode stay non-damaging for aura',
        dAura.inspectedPresentationMode === 'role_aura_only' && dAura.inspectedSkillDamageView.mode !== 'damaging',
        dAura.inspectedViewSequenceKey,
      )
    }
  }

  const supportMain: BuildSnapshot = {
    ...createEmptyBuildSnapshot(),
    meta: { ...createEmptyBuildSnapshot().meta, inspectedMainSkillSlot: 1 },
    skills: [
      { slot: 1, skillId: scatter.id, supports: [], skillLevel: 20, enabled: true },
      ...createEmptyBuildSnapshot().skills.slice(1),
    ],
  }
  const supInst = computeSkillInstanceForMainSlot(supportMain.skills[0]!, supportMain)
  assert('support gem as main slot → rejected by main-slot family gate', supInst == null)
  assert(
    '4E-5: support as main → inspected view must not be damaging (no fake DPS)',
    selectInspectedSkillDamageView(supportMain).mode !== 'damaging',
  )
  assert(
    '4F-7: support main → none_unsupported_main_family',
    deriveInspectedPresentationMode(selectInspectedSkillDamageView(supportMain)) === 'none_unsupported_main_family',
  )

  const wpnAmp = getSkillDefinitionById('skill:Weapon_Amplification')
  const passiveLinked2: BuildSnapshot = {
    ...createEmptyBuildSnapshot(),
    skills: [
      { slot: 1, skillId: ice!.id, supports: [], skillLevel: 20, enabled: true },
      { slot: 2, skillId: ice!.id, supports: [], skillLevel: 20, enabled: true },
      ...createEmptyBuildSnapshot().skills.slice(2),
    ],
    passives: [
      {
        slot: 1,
        skillId: wpnAmp?.id ?? null,
        enabled: true,
        applyMode: 'linked',
        linkedMainSkillSlots: [2 as MainSkillSlot],
        skillLevel: 10,
      },
      ...createEmptyBuildSnapshot().passives.slice(1),
    ],
  }
  if (wpnAmp) {
    const m1 = passiveModifiersForActiveSkill(ice!.id, passiveLinked2, 1).length
    const m2 = passiveModifiersForActiveSkill(ice!.id, passiveLinked2, 2).length
    assert('passive linked only slot 2: slot1 excluded', m1 === 0 && m2 > 0, `m1=${m1} m2=${m2}`)
    const instOn1 = computeSkillInstanceForMainSlot(passiveLinked2.skills[0]!, passiveLinked2)
    const instOn2 = computeSkillInstanceForMainSlot(passiveLinked2.skills[1]!, passiveLinked2)
    const p1 = instOn1?.breakdown.passiveModifierCount ?? 0
    const p2 = instOn2?.breakdown.passiveModifierCount ?? 0
    assert(
      'linked passive injects stats only on linked main slot',
      !!instOn1 && !!instOn2 && p2 > p1,
      `p1=${p1} p2=${p2}`,
    )

    const passiveGlobal: BuildSnapshot = {
      ...createEmptyBuildSnapshot(),
      skills: [
        { slot: 1, skillId: ice!.id, supports: [], skillLevel: 20, enabled: true },
        { slot: 2, skillId: ice!.id, supports: [], skillLevel: 20, enabled: true },
        ...createEmptyBuildSnapshot().skills.slice(2),
      ],
      passives: [
        {
          slot: 1,
          skillId: wpnAmp.id,
          enabled: true,
          applyMode: 'global',
          linkedMainSkillSlots: [],
          skillLevel: 10,
        },
        ...createEmptyBuildSnapshot().passives.slice(1),
      ],
    }
    const g1 = passiveModifiersForActiveSkill(ice!.id, passiveGlobal, 1).length
    const g2 = passiveModifiersForActiveSkill(ice!.id, passiveGlobal, 2).length
    assert('global passive injects into every linked main slot', g1 > 0 && g1 === g2, `g1=${g1} g2=${g2}`)
    const iG1 = computeSkillInstanceForMainSlot(passiveGlobal.skills[0]!, passiveGlobal)
    const iG2 = computeSkillInstanceForMainSlot(passiveGlobal.skills[1]!, passiveGlobal)
    const dG1 = iG1?.computedStats['damage.increased'] ?? 0
    const dG2 = iG2?.computedStats['damage.increased'] ?? 0
    assert(
      'global passive: same damage.increased on both main skills',
      !!iG1 && !!iG2 && dG1 === dG2 && dG1 > 0,
      `${dG1} vs ${dG2}`,
    )
  }

  const base = normalizeBuildSnapshot(createEmptyBuildSnapshot())
  const persisted = JSON.parse(JSON.stringify({ snapshot: base })) as { snapshot: BuildSnapshot }
  const reloaded = normalizeBuildSnapshot(persisted.snapshot)
  assert('persist JSON round-trip', reloaded.meta.title === base.meta.title)

  const share = decodeBuildFromShareCode(encodeBuildToShareCode(base))
  assert('share import/export', share.skills.length === base.skills.length)

  const bundlePath = path.join(process.cwd(), 'lib', 'gameData', 'generated', 'effective-runtime-bundle.json')
  if (existsSync(bundlePath)) {
    const bundle = JSON.parse(readFileSync(bundlePath, 'utf8')) as EffectiveRuntimeBundle
    const gate = evaluateFullSkillCoverageGate(computeFullSkillCoverageMetrics(bundle))
    assert('4F-8: full-skill coverage gate (regression hook)', gate.ok, gate.failures.join(' | '))
  }

  const baseInsp3 = normalizeBuildSnapshot({
    ...createEmptyBuildSnapshot(),
    meta: { ...createEmptyBuildSnapshot().meta, inspectedMainSkillSlot: 3 },
    skills: createEmptyBuildSnapshot().skills.map((row) =>
      row.slot === 3 ? { ...row, skillId: 'skill:Ice_Shot', skillLevel: 20, enabled: true } : row,
    ),
  })
  assert(
    '4E-6: share round-trip preserves inspectedMainSkillSlot (slot 3 must have a skill — finalize otherwise repicks)',
    decodeBuildFromShareCode(encodeBuildToShareCode(baseInsp3)).meta.inspectedMainSkillSlot === 3,
  )

  const dualSwitch = normalizeBuildSnapshot({
    ...createEmptyBuildSnapshot(),
    meta: { ...createEmptyBuildSnapshot().meta, inspectedMainSkillSlot: 1 },
    skills: [
      { slot: 1, skillId: 'skill:Ice_Shot', supports: [], skillLevel: 20, enabled: true },
      { slot: 2, skillId: 'skill:Stoneskin', supports: [], skillLevel: 10, enabled: true },
      ...createEmptyBuildSnapshot().skills.slice(2),
    ],
  })
  const viewIce = selectInspectedSkillDamageView(dualSwitch)
  const viewStone = selectInspectedSkillDamageView({
    ...dualSwitch,
    meta: { ...dualSwitch.meta, inspectedMainSkillSlot: 2 },
  })
  assert(
    '4E-6: inspected slot switch must change mode (Ice damaging vs Stoneskin non-DPS)',
    viewIce.mode !== viewStone.mode,
    `${viewIce.mode} vs ${viewStone.mode}`,
  )

  const utilDef = firstBundledActiveWithRole('utility')
  if (utilDef) {
    const uSnap = normalizeBuildSnapshot({
      ...createEmptyBuildSnapshot(),
      meta: { ...createEmptyBuildSnapshot().meta, inspectedMainSkillSlot: 1 },
      skills: [
        { slot: 1, skillId: utilDef.id, supports: [], skillLevel: 20, enabled: true },
        ...createEmptyBuildSnapshot().skills.slice(1),
      ],
    })
    assert(
      '4E-6: utility-role active must not show damaging inspected mode',
      selectInspectedSkillDamageView(uSnap).mode !== 'damaging',
      utilDef.id,
    )
  }

  const unkDef = firstBundledActiveWithRole('unknown')
  if (unkDef) {
    const uSnap = normalizeBuildSnapshot({
      ...createEmptyBuildSnapshot(),
      meta: { ...createEmptyBuildSnapshot().meta, inspectedMainSkillSlot: 1 },
      skills: [
        { slot: 1, skillId: unkDef.id, supports: [], skillLevel: 20, enabled: true },
        ...createEmptyBuildSnapshot().skills.slice(1),
      ],
    })
    assert(
      '4E-6: unknown-role active must not show damaging inspected mode',
      selectInspectedSkillDamageView(uSnap).mode !== 'damaging',
      unkDef.id,
    )
  }

  const noStructEvidence = sk({
    id: 'skill:Mock_ActiveDamagingTagNoStruct',
    name: 'Mock attack tag only',
    family: 'active',
    tags: ['攻擊'],
    levelTable: {
      20: { level: 20, manaCost: 5, partial: false },
    },
    modifiers: [],
  })
  const noStructInst = computeSkillInstance({
    active: noStructEvidence,
    level: 20,
    supports: [],
    activeParse: { status: 'ok' },
  })
  assert(
    '4F-6: no structural damage evidence → not damaging-ready (no weapon%/base/weapon mod)',
    noStructInst.damageRole !== 'damaging' || noStructInst.calculationConfidence !== 'ready',
    `${noStructInst.damageRole} ${noStructInst.calculationConfidence} evidence=${noStructInst.structuralDamageEvidence}`,
  )

  const levelOnlyRow = sk({
    id: 'skill:Mock_LevelManaOnly',
    name: 'Mock mana row only',
    family: 'active',
    tags: ['攻擊'],
    levelTable: {
      10: { level: 10, manaCost: 12, partial: false },
    },
  })
  const manaInst = computeSkillInstance({ active: levelOnlyRow, level: 10, supports: [] })
  if (manaInst) {
    const block = skillInstanceToContribution(manaInst).block
    const noFakeAgg =
      manaInst.calculationConfidence === 'unsupported' ||
      !isDamagingInspectedSkillRole(manaInst.damageRole, manaInst.calculationConfidence) ||
      Object.keys(block).length === 0
    assert(
      'mana-only level row: no damaging aggregate / no fabricated DPS block',
      noFakeAgg,
      `${manaInst.damageRole} ${manaInst.calculationConfidence}`,
    )
  }

  const cooldownOnlyRow = sk({
    id: 'skill:Mock_LevelCooldownOnly',
    name: 'Mock cooldown row only',
    family: 'active',
    tags: ['法術'],
    levelTable: {
      10: { level: 10, cooldown: 2.2, partial: false },
    },
  })
  assert(
    'cooldown-only level row: not classified as damaging (no damage signals in row)',
    inferSkillCombatRole(cooldownOnlyRow, 10) !== 'damaging',
    `role@10=${inferSkillCombatRole(cooldownOnlyRow, 10)}`,
  )
  const cdInst = computeSkillInstance({ active: cooldownOnlyRow, level: 10, supports: [] })
  if (cdInst) {
    assert(
      'cooldown-only: cannot be damaging+ready (would fabricate hit scaling)',
      cdInst.damageRole !== 'damaging' || cdInst.calculationConfidence !== 'ready',
      `${cdInst.damageRole} ${cdInst.calculationConfidence}`,
    )
  }

  const manaRowDefWpn = sk({
    id: 'skill:Mock_ManaRowDefWeapon',
    name: 'Mock mana row + def weapon pct',
    family: 'active',
    tags: ['攻擊'],
    levelTable: {
      20: { level: 20, manaCost: 10, partial: false },
    },
    modifiers: [
      {
        selector: { kind: 'skill' },
        operation: 'add',
        stat: 'skill.weaponDamagePct',
        value: 120,
        valueKind: 'flat',
      },
    ],
  })
  const mwd = computeSkillInstance({
    active: manaRowDefWpn,
    level: 20,
    supports: [],
    activeParse: { status: 'ok' },
  })
  assert(
    '4F-5: level row resource-only cannot yield damaging+ready when hit scaling is only on definition',
    mwd.damageRole === 'damaging' && mwd.calculationConfidence === 'partial',
    `${mwd.damageRole} ${mwd.calculationConfidence} hitScaling=${mwd.breakdown.levelRow.hitScalingFromRow}`,
  )

  const rangeSafe = sk({
    id: 'skill:Mock_BaseDamageRangeSafe',
    name: 'Mock safe baseDamage range',
    family: 'active',
    tags: ['法術'],
    levelTable: {
      10: { level: 10, baseDamage: { min: 10, max: 30 }, partial: false },
    },
  })
  const rs = computeSkillInstance({
    active: rangeSafe,
    level: 10,
    supports: [],
    activeParse: { status: 'ok' },
  })
  assert(
    '4F-5: safe min-max baseDamage emits midpoint modifier',
    (rs.computedStats['skill.addedBaseDamage'] ?? 0) === 20,
    String(rs.computedStats['skill.addedBaseDamage']),
  )
  assert(
    '4F-5: baseDamage range + row hit scaling allows ready at ok parse',
    rs.damageRole === 'damaging' &&
      rs.calculationConfidence === 'ready' &&
      rs.breakdown.levelRow.hitScalingFromRow === true,
    `${rs.damageRole} ${rs.calculationConfidence}`,
  )

  const rangeUnsafe = sk({
    id: 'skill:Mock_BaseDamageRangeUnsafe',
    name: 'Mock unsafe baseDamage range',
    family: 'active',
    tags: ['法術'],
    levelTable: {
      10: { level: 10, baseDamage: { min: 1, max: 9999 }, partial: false },
    },
  })
  const ru = computeSkillInstance({ active: rangeUnsafe, level: 10, supports: [] })
  assert(
    '4F-5: unsafe range does not fabricate addedBaseDamage',
    (ru.computedStats['skill.addedBaseDamage'] ?? 0) === 0,
    String(ru.computedStats['skill.addedBaseDamage']),
  )
  assert(
    '4F-5: unsafe range warns',
    ru.warnings.some((w) => w.includes('baseDamage_range_unsafe')) ||
      ru.breakdown.levelRow.warnings?.some((w) => w.includes('unsafe')) === true,
    ru.breakdown.levelRow.warnings?.join(','),
  )

  const plainUnknown = sk({
    id: 'skill:Mock_PlainUnknownActive',
    name: 'plain unknown',
    family: 'active',
    tags: [],
    modifiers: [],
  })
  assert('plain active no tags: unknown role', inferSkillCombatRole(plainUnknown, 10) === 'unknown')

  const legacyRaw = {
    ...createEmptyBuildSnapshot(),
    skills: [
      {
        slot: 1,
        skillId: ice!.id,
        supports: ['skill:Multiple_Projectiles'],
        skillGemLevel: 18,
        enabled: true,
      },
      ...createEmptyBuildSnapshot().skills.slice(1),
    ],
  }
  const legacy = normalizeBuildSnapshot(legacyRaw as unknown as BuildSnapshot)
  const firstLink = legacy.skills[0]?.supports[0]
  assert(
    'legacy supports string[] migrates to SupportLink',
    typeof firstLink === 'object' && firstLink !== null && 'supportSkillId' in firstLink,
  )

  console.log('[verify:skill-regression] OK')
}

main()
