/**
 * 4E-3: Inspected skill selectors — slot switch / level / empty meta (no network).
 *
 *   npm run verify:inspected-skill-selectors
 */
import type { BuildSnapshot, MainSkillSlot } from '@/types/build'
import { createEmptyBuildSnapshot } from '@/lib/defaultBuildSnapshot'
import { normalizeBuildSnapshot } from '@/lib/normalizeBuildSnapshot'
import {
  selectInspectedSkillDamageView,
  selectInspectedSkillDebugView,
  selectInspectedSkillPrimaryInstance,
} from '@/selectors/buildComputedStats'

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
      v20.combat.dps !== v30.combat.dps
    assert('Lv20 vs L30 inspected readout differs', diff, `mana ${v20.manaCost}/${v30.manaCost}`)
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
