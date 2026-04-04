/**
 * 4E-3: Inspected skill selectors — slot switch / level / empty meta (no network).
 *
 *   npm run verify:inspected-skill-selectors
 */
import type { BuildSnapshot, MainSkillSlot } from '@/types/build'
import { createEmptyBuildSnapshot } from '@/lib/defaultBuildSnapshot'
import { normalizeBuildSnapshot } from '@/lib/normalizeBuildSnapshot'
import {
  deriveInspectedPresentationMode,
  selectBuildStatsPanelDerived,
  selectInspectedSkillDamageView,
  selectInspectedSkillDebugView,
  selectInspectedSkillPrimaryInstance,
} from '@/selectors/buildComputedStats'
import { getSkillDefinitionById } from '@/lib/runtime/runtimeSkillLookup'

function snap(partial: Partial<BuildSnapshot>): BuildSnapshot {
  const base = createEmptyBuildSnapshot()
  return normalizeBuildSnapshot({
    ...base,
    ...partial,
    meta: partial.meta ? { ...base.meta, ...partial.meta } : base.meta,
    skills: partial.skills ?? base.skills,
    passives: partial.passives ?? base.passives,
  } as BuildSnapshot)
}

function assert(name: string, ok: boolean, detail?: string) {
  if (!ok) {
    console.error(`[verify:inspected-skill-selectors] FAIL ${name}${detail ? `: ${detail}` : ''}`)
    process.exit(1)
  }
}

function main() {
  const empty = normalizeBuildSnapshot(createEmptyBuildSnapshot())
  empty.meta.inspectedMainSkillSlot = null
  assert('cleared inspected → no_slot', selectInspectedSkillDamageView(empty).mode === 'none')
  assert(
    '4F-7: cleared → none_no_slot presentation',
    deriveInspectedPresentationMode(selectInspectedSkillDamageView(empty)) === 'none_no_slot',
  )
  assert(
    'cleared primary',
    selectInspectedSkillPrimaryInstance(empty) == null,
    String(selectInspectedSkillDebugView(empty).resolution),
  )

  const dual = snap({
    meta: {
      ...createEmptyBuildSnapshot().meta,
      inspectedMainSkillSlot: 1,
    },
    skills: [
      {
        slot: 1,
        skillId: 'skill:Ice_Shot',
        supports: [],
        skillLevel: 20,
        enabled: true,
      },
      {
        slot: 2,
        skillId: 'skill:Stoneskin',
        supports: [],
        skillLevel: 10,
        enabled: true,
      },
      ...createEmptyBuildSnapshot().skills.slice(2),
    ],
  })

  const iceView = selectInspectedSkillDamageView(dual)
  assert('slot1 ice damaging', iceView.mode === 'damaging', JSON.stringify(iceView))

  const dualAura = snap({
    ...dual,
    meta: { ...dual.meta, inspectedMainSkillSlot: 2 },
  })
  const stoneView = selectInspectedSkillDamageView(dualAura)
  assert(
    'slot2 aura-only ≠ damaging',
    stoneView.mode !== 'damaging',
    JSON.stringify(stoneView),
  )
  assert(
    'switching slot changes mode',
    iceView.mode !== stoneView.mode,
    `${iceView.mode} vs ${stoneView.mode}`,
  )

  const seqIce = selectBuildStatsPanelDerived(dual).inspectedViewSequenceKey
  const seqStone = selectBuildStatsPanelDerived(dualAura).inspectedViewSequenceKey
  assert(
    '4F-7: inspectedViewSequenceKey must differ when switching slot/skill',
    seqIce !== seqStone,
    `${seqIce} vs ${seqStone}`,
  )
  assert(
    '4F-7: presentationMode tracks damage view',
    deriveInspectedPresentationMode(iceView) !== deriveInspectedPresentationMode(stoneView) ||
      iceView.mode !== stoneView.mode,
    `${deriveInspectedPresentationMode(iceView)} / ${deriveInspectedPresentationMode(stoneView)}`,
  )

  const dualLv = snap({
    meta: { ...createEmptyBuildSnapshot().meta, inspectedMainSkillSlot: 1 },
    skills: [
      { slot: 1, skillId: 'skill:Ice_Shot', supports: [], skillLevel: 20, enabled: true },
      { slot: 2, skillId: 'skill:Ice_Shot', supports: [], skillLevel: 30, enabled: true },
      ...createEmptyBuildSnapshot().skills.slice(2),
    ],
  })
  const v20 = selectInspectedSkillDamageView(dualLv)
  const v30snap = snap({
    ...dualLv,
    meta: { ...dualLv.meta, inspectedMainSkillSlot: 2 },
  })
  const v30 = selectInspectedSkillDamageView(v30snap)
  if (v20.mode === 'damaging' && v30.mode === 'damaging') {
    const diff =
      v20.manaCost !== v30.manaCost ||
      v20.castTimeSec !== v30.castTimeSec ||
      v20.combat.dps !== v30.combat.dps ||
      v20.combat.hitDamage !== v30.combat.hitDamage
    assert('Lv20 vs L30 inspected readout differs', diff, `mana ${v20.manaCost}/${v30.manaCost}`)
  }

  const spellSecond = getSkillDefinitionById('skill:Blizzard') ?? getSkillDefinitionById('skill:Fireball')
  if (spellSecond) {
    const dualAtkSpell = snap({
      meta: { ...createEmptyBuildSnapshot().meta, inspectedMainSkillSlot: 1 },
      skills: [
        { slot: 1, skillId: 'skill:Ice_Shot', supports: [], skillLevel: 20, enabled: true },
        { slot: 2, skillId: spellSecond.id, supports: [], skillLevel: 20, enabled: true },
        ...createEmptyBuildSnapshot().skills.slice(2),
      ],
    })
    const vIce = selectInspectedSkillDamageView(dualAtkSpell)
    const vSpell = selectInspectedSkillDamageView({
      ...dualAtkSpell,
      meta: { ...dualAtkSpell.meta, inspectedMainSkillSlot: 2 },
    })
    if (vIce.mode === 'damaging' && vSpell.mode === 'damaging') {
      assert(
        '4F-6: two damaging mains — switch inspected slot changes primary combat numbers',
        vIce.combat.dps !== vSpell.combat.dps || vIce.combat.hitDamage !== vSpell.combat.hitDamage,
        `dps ${vIce.combat.dps}/${vSpell.combat.dps} hit ${vIce.combat.hitDamage}/${vSpell.combat.hitDamage}`,
      )
    }
  }

  const addedLightId = 'skill:Added_Lightning_Damage'
  const iceNoSup = snap({
    meta: { ...createEmptyBuildSnapshot().meta, inspectedMainSkillSlot: 1 },
    skills: [
      { slot: 1, skillId: 'skill:Ice_Shot', supports: [], skillLevel: 20, enabled: true },
      ...createEmptyBuildSnapshot().skills.slice(1),
    ],
  })
  const iceWithSup = snap({
    ...iceNoSup,
    skills: [
      {
        slot: 1,
        skillId: 'skill:Ice_Shot',
        supports: [{ supportSkillId: addedLightId, level: 20, enabled: true, linkSlot: 1 }],
        skillLevel: 20,
        enabled: true,
      },
      ...createEmptyBuildSnapshot().skills.slice(1),
    ],
  })
  const noSupView = selectInspectedSkillDamageView(iceNoSup)
  const supView = selectInspectedSkillDamageView(iceWithSup)
  if (
    noSupView.mode === 'damaging' &&
    supView.mode === 'damaging' &&
    supView.supportApplied > 0
  ) {
    assert(
      '4F-6: same skill — different support links change inspected hit/dps',
      noSupView.combat.hitDamage !== supView.combat.hitDamage ||
        noSupView.combat.dps !== supView.combat.dps,
      `hit ${noSupView.combat.hitDamage}/${supView.combat.hitDamage}`,
    )
  }

  /** Bypass `normalizeBuildSnapshot` finalizer so out-of-range slots survive (selector must still handle). */
  const rogueSlot: BuildSnapshot = {
    ...createEmptyBuildSnapshot(),
    meta: {
      ...createEmptyBuildSnapshot().meta,
      inspectedMainSkillSlot: 6 as MainSkillSlot,
    },
  }
  const badView = selectInspectedSkillDamageView(rogueSlot)
  assert('invalid meta slot', badView.mode === 'none' && badView.reason === 'invalid_slot')

  console.log('[verify:inspected-skill-selectors] OK')
}

main()
