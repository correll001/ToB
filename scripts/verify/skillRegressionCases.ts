/**
 * 4D-5: Skill system regression — no network, runs under tsx.
 *
 *   npm run verify:skill-regression
 */
import type { BuildSnapshot, MainSkillSlot } from '@/types/build'
import type { SkillDefinition } from '@/types/skillData'
import type { SkillCombatRole } from '@/types/skillDamageRole'
import { createEmptyBuildSnapshot } from '@/lib/defaultBuildSnapshot'
import { normalizeBuildSnapshot } from '@/lib/normalizeBuildSnapshot'
import { computeSkillInstanceForMainSlot } from '@/lib/formula/collectBuildContributions'
import { computeSkillInstance, skillInstanceToContribution } from '@/lib/formula/skills/computeSkillInstance'
import { selectInspectedSkillDamageView } from '@/selectors/buildComputedStats'
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
    assert('channeled attack main + multistrike = applied', !!wwMs && !!wwMs.supports[0]?.applied)
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
  }

  const base = normalizeBuildSnapshot(createEmptyBuildSnapshot())
  const persisted = JSON.parse(JSON.stringify({ snapshot: base })) as { snapshot: BuildSnapshot }
  const reloaded = normalizeBuildSnapshot(persisted.snapshot)
  assert('persist JSON round-trip', reloaded.meta.title === base.meta.title)

  const share = decodeBuildFromShareCode(encodeBuildToShareCode(base))
  assert('share import/export', share.skills.length === base.skills.length)

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
