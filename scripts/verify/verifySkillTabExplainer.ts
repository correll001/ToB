/**
 * 4F / Skill TAB — central skill-tab explainer + regression guards (left panel isolation).
 *
 *   npm run verify:skill-tab-explainer
 *
 * Golden `EXPECTED_PANEL_CONTRACT_*` strings tie left-column `selectBuildStatsPanelDerived` routing
 * to fixed fixtures; bump only when buildComputedStats / dataset intentionally changes.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { BuildSnapshot, MainSkillSlot } from '@/types/build'
import { createEmptyBuildSnapshot } from '@/lib/defaultBuildSnapshot'
import { normalizeBuildSnapshot } from '@/lib/normalizeBuildSnapshot'
import { passiveModifiersForActiveSkill } from '@/lib/formula/collectBuildContributions'
import { getSkillDefinitionById } from '@/lib/runtime/runtimeSkillLookup'
import { selectBuildStatsPanelDerived } from '@/selectors/buildComputedStats'
import { selectSkillTabExplanation } from '@/selectors/skillTabExplanation'

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
    console.error(`[verify:skill-tab-explainer] FAIL ${name}${detail ? `: ${detail}` : ''}`)
    process.exit(1)
  }
}

function noThrow(name: string, fn: () => void) {
  try {
    fn()
  } catch (e) {
    console.error(`[verify:skill-tab-explainer] FAIL ${name}: threw`, e)
    process.exit(1)
  }
}

/** Stable subset of left-panel derived state (no full combat object — avoids float churn in unrelated edits). */
function panelContractFingerprint(snapshot: BuildSnapshot): string {
  const d = selectBuildStatsPanelDerived(snapshot)
  const dv = d.inspectedSkillDamageView
  const base: Record<string, unknown> = {
    seq: d.inspectedViewSequenceKey,
    pres: d.inspectedPresentationMode,
    target: d.inspectedTargetSlot,
    main: d.inspectedMainSkillSlot,
    dbgRes: d.inspectedSkillDebugView.resolution,
    mode: dv.mode,
    activeId: d.inspectedSkillPrimaryInstance?.activeId ?? null,
    valLen: d.validationErrors.length,
  }
  if (dv.mode === 'none') {
    base.reason = dv.reason
  }
  return JSON.stringify(base)
}

function deepClone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T
}

function deltaFingerprint(ex: ReturnType<typeof selectSkillTabExplanation>): string {
  const parts = ex.supportRemovalDeltas.map((r) => ({
    slot: r.linkSlot,
    applied: r.applied,
    ed: r.editorDisabled,
    n: r.computedStatDeltas.length,
    dps: r.combatDpsDelta,
  }))
  const stripAll = ex.stripAllSupportsDelta
  const strip = stripAll
    ? {
        n: stripAll.computedStatDeltas.length,
        dps: stripAll.combatDpsDelta,
      }
    : null
  return JSON.stringify({ parts, strip })
}

/** Bump when `selectBuildStatsPanelDerived` contract for these fixtures changes on purpose. */
const EXPECTED_PANEL_CONTRACT_EMPTY_NO_SLOT =
  '{"seq":"∅|no_slot|∅|∅|none|none_no_slot","pres":"none_no_slot","target":null,"main":null,"dbgRes":"no_slot","mode":"none","activeId":null,"valLen":4,"reason":"no_slot"}'

const EXPECTED_PANEL_CONTRACT_ICE_SLOT1 =
  '{"seq":"1|ok|1|skill:Ice_Shot|damaging|damaging_partial","pres":"damaging_partial","target":1,"main":1,"dbgRes":"ok","mode":"damaging","activeId":"skill:Ice_Shot","valLen":3}'

const EXPECTED_PANEL_CONTRACT_STONE_SLOT2 =
  '{"seq":"2|ok|2|skill:Stoneskin|nonDamaging|role_aura_only","pres":"role_aura_only","target":2,"main":2,"dbgRes":"ok","mode":"nonDamaging","activeId":"skill:Stoneskin","valLen":3}'

function guardNoSkillTabImportsInLeftPanel() {
  const root = process.cwd()
  const panelPath = join(root, 'components', 'editor', 'BuildStatsPanel.tsx')
  const statsPath = join(root, 'selectors', 'buildComputedStats.ts')
  const panel = readFileSync(panelPath, 'utf8')
  const stats = readFileSync(statsPath, 'utf8')

  assert(
    'guard: BuildStatsPanel.tsx does not reference skill-tab explainer',
    !panel.includes('selectSkillTabExplanation') &&
      !panel.includes('skillTabExplanation') &&
      !panel.includes('/skillTabExplanation'),
    'remove accidental coupling to central TAB selector',
  )
  assert(
    'guard: buildComputedStats.ts does not import skillTabExplanation',
    !stats.includes("from '@/selectors/skillTabExplanation'") &&
      !stats.includes('selectors/skillTabExplanation'),
    'left pipeline must stay independent of skill-tab explainer module',
  )
}

function main() {
  guardNoSkillTabImportsInLeftPanel()

  const empty = normalizeBuildSnapshot(createEmptyBuildSnapshot())
  empty.meta.inspectedMainSkillSlot = null

  const dual = snap({
    meta: { ...createEmptyBuildSnapshot().meta, inspectedMainSkillSlot: 1 },
    skills: [
      { slot: 1, skillId: 'skill:Ice_Shot', supports: [], skillLevel: 20, enabled: true },
      { slot: 2, skillId: 'skill:Stoneskin', supports: [], skillLevel: 10, enabled: true },
      ...createEmptyBuildSnapshot().skills.slice(2),
    ],
  })

  const dualAura = snap({
    ...dual,
    meta: { ...dual.meta, inspectedMainSkillSlot: 2 },
  })

  const addedLightId = 'skill:Added_Lightning_Damage'
  const addedColdId = 'skill:Added_Cold_Damage'
  const multipleProjId = 'skill:Multiple_Projectiles'

  const iceNoSup = snap({
    meta: { ...createEmptyBuildSnapshot().meta, inspectedMainSkillSlot: 1 },
    skills: [
      { slot: 1, skillId: 'skill:Ice_Shot', supports: [], skillLevel: 20, enabled: true },
      ...createEmptyBuildSnapshot().skills.slice(1),
    ],
  })

  const iceLight = snap({
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

  const iceCold = snap({
    ...iceNoSup,
    skills: [
      {
        slot: 1,
        skillId: 'skill:Ice_Shot',
        supports: [{ supportSkillId: addedColdId, level: 20, enabled: true, linkSlot: 1 }],
        skillLevel: 20,
        enabled: true,
      },
      ...createEmptyBuildSnapshot().skills.slice(1),
    ],
  })

  const iceMultiProj = snap({
    ...iceNoSup,
    skills: [
      {
        slot: 1,
        skillId: 'skill:Ice_Shot',
        supports: [{ supportSkillId: multipleProjId, level: 20, enabled: true, linkSlot: 1 }],
        skillLevel: 20,
        enabled: true,
      },
      ...createEmptyBuildSnapshot().skills.slice(1),
    ],
  })

  const iceDisabledLink = snap({
    ...iceLight,
    skills: [
      {
        slot: 1,
        skillId: 'skill:Ice_Shot',
        supports: [{ supportSkillId: addedLightId, level: 20, enabled: false, linkSlot: 1 }],
        skillLevel: 20,
        enabled: true,
      },
      ...createEmptyBuildSnapshot().skills.slice(1),
    ],
  })

  const wpnAmp = getSkillDefinitionById('skill:Weapon_Amplification')
  const ice = getSkillDefinitionById('skill:Ice_Shot')

  const passiveLinkedSlot2Only =
    wpnAmp && ice
      ? snap({
          meta: { ...createEmptyBuildSnapshot().meta, inspectedMainSkillSlot: 1 },
          skills: [
            { slot: 1, skillId: ice.id, supports: [], skillLevel: 20, enabled: true },
            { slot: 2, skillId: ice.id, supports: [], skillLevel: 20, enabled: true },
            ...createEmptyBuildSnapshot().skills.slice(2),
          ],
          passives: [
            {
              slot: 1,
              skillId: wpnAmp.id,
              enabled: true,
              applyMode: 'linked',
              linkedMainSkillSlots: [2 as MainSkillSlot],
              skillLevel: 10,
            },
            ...createEmptyBuildSnapshot().passives.slice(1),
          ],
        })
      : null

  const passiveGlobal =
    wpnAmp && ice
      ? snap({
          meta: { ...createEmptyBuildSnapshot().meta, inspectedMainSkillSlot: 1 },
          skills: [
            { slot: 1, skillId: ice.id, supports: [], skillLevel: 20, enabled: true },
            ...createEmptyBuildSnapshot().skills.slice(1),
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
        })
      : null

  const snapshots: BuildSnapshot[] = [
    empty,
    dual,
    dualAura,
    iceNoSup,
    iceLight,
    iceCold,
    iceMultiProj,
    iceDisabledLink,
    ...(passiveLinkedSlot2Only ? [passiveLinkedSlot2Only] : []),
    ...(passiveGlobal ? [passiveGlobal] : []),
  ]

  for (let i = 0; i < snapshots.length; i++) {
    noThrow(`selectSkillTabExplanation snapshot#${i}`, () => {
      selectSkillTabExplanation(snapshots[i]!)
    })
  }

  assert(
    'left panel contract: empty / no inspected slot',
    panelContractFingerprint(empty) === EXPECTED_PANEL_CONTRACT_EMPTY_NO_SLOT,
    `got ${panelContractFingerprint(empty)}`,
  )
  assert(
    'left panel contract: Ice Shot slot 1 damaging',
    panelContractFingerprint(dual) === EXPECTED_PANEL_CONTRACT_ICE_SLOT1,
    `got ${panelContractFingerprint(dual)}`,
  )
  assert(
    'left panel contract: Stoneskin slot 2 nonDamaging',
    panelContractFingerprint(dualAura) === EXPECTED_PANEL_CONTRACT_STONE_SLOT2,
    `got ${panelContractFingerprint(dualAura)}`,
  )

  const cloneDual = deepClone(dual)
  const panelBefore = selectBuildStatsPanelDerived(dual)
  selectSkillTabExplanation(dual)
  const panelAfter = selectBuildStatsPanelDerived(dual)
  assert(
    'selectSkillTabExplanation does not mutate snapshot (dual ice)',
    JSON.stringify(dual) === JSON.stringify(cloneDual),
    'snapshot JSON drifted',
  )
  assert(
    'selectSkillTabExplanation does not alter left-panel derived output',
    JSON.stringify(panelBefore) === JSON.stringify(panelAfter),
    'BuildStatsPanelDerived changed after skill-tab explainer',
  )

  const exNo = selectSkillTabExplanation(iceNoSup)
  const exLight = selectSkillTabExplanation(iceLight)
  const exMultiProj = selectSkillTabExplanation(iceMultiProj)
  // Flat ele supports can share the same removal-delta shape on the same active; compare vs a mechanical gem.
  if (exLight.coreResolution === 'ok' && exMultiProj.coreResolution === 'ok') {
    assert(
      'different support gems → different local removal fingerprints',
      deltaFingerprint(exLight) !== deltaFingerprint(exMultiProj),
      `${deltaFingerprint(exLight)} vs ${deltaFingerprint(exMultiProj)}`,
    )
  }

  const exDisabled = selectSkillTabExplanation(iceDisabledLink)
  if (exDisabled.coreResolution === 'ok') {
    const disabledRow = exDisabled.supportRemovalDeltas.find((r) => r.editorDisabled)
    assert(
      'editor-disabled support link: no fake numeric deltas',
      !!disabledRow &&
        disabledRow.computedStatDeltas.length === 0 &&
        disabledRow.applied === false &&
        disabledRow.combatDpsDelta == null,
      JSON.stringify(disabledRow),
    )
  }

  const skippedEngineRow = exLight.supportRemovalDeltas.find((r) => !r.applied && !r.editorDisabled)
  if (skippedEngineRow) {
    assert(
      'engine-skipped support: no fabricated stat deltas',
      skippedEngineRow.computedStatDeltas.length === 0 && skippedEngineRow.combatDpsDelta == null,
      JSON.stringify(skippedEngineRow),
    )
  }

  for (const ex of [exNo, exLight, selectSkillTabExplanation(dualAura)]) {
    const num = ex.localNumericSummary
    if (num.effectiveCalculationConfidence === 'unsupported' && num.previewKind === 'full_scoped_combat') {
      assert('unsupported must not pair with full_scoped_combat preview', false, JSON.stringify(num))
    }
    if (num.damagingPresentation === 'authoritative') {
      assert(
        'authoritative damagingPresentation requires ready effective confidence',
        num.effectiveCalculationConfidence === 'ready',
        JSON.stringify(num),
      )
    }
    if (num.effectiveCalculationConfidence === 'partial' && num.damagingPresentation === 'authoritative') {
      assert('partial effective must not use authoritative presentation', false, JSON.stringify(num))
    }
  }

  if (passiveLinkedSlot2Only && wpnAmp) {
    const m1 = passiveModifiersForActiveSkill(ice!.id, passiveLinkedSlot2Only, 1).length
    const m2 = passiveModifiersForActiveSkill(ice!.id, passiveLinkedSlot2Only, 2).length
    assert('fixture: linked passive only hits slot 2', m1 === 0 && m2 > 0, `${m1} ${m2}`)

    const ins1 = snap({ ...passiveLinkedSlot2Only, meta: { ...passiveLinkedSlot2Only.meta, inspectedMainSkillSlot: 1 } })
    const ins2 = snap({ ...passiveLinkedSlot2Only, meta: { ...passiveLinkedSlot2Only.meta, inspectedMainSkillSlot: 2 } })
    const t1 = selectSkillTabExplanation(ins1).passiveImpactTraces.filter((t) => t.passiveSkillId === wpnAmp.id)
    const t2 = selectSkillTabExplanation(ins2).passiveImpactTraces.filter((t) => t.passiveSkillId === wpnAmp.id)
    assert('passive trace: linked passive absent on non-linked main slot', t1.length === 0, String(t1.length))
    assert('passive trace: linked passive present on linked main slot', t2.length === 1, String(t2.length))
    assert('passive trace: applyMode linked', t2[0]?.applyMode === 'linked', String(t2[0]?.applyMode))
  }

  if (passiveGlobal && wpnAmp) {
    const exG = selectSkillTabExplanation(passiveGlobal)
    const hit = exG.passiveImpactTraces.filter((t) => t.passiveSkillId === wpnAmp.id)
    assert('passive trace: global passive hits inspected slot', hit.length === 1, String(hit.length))
    assert('passive trace: applyMode global', hit[0]?.applyMode === 'global', String(hit[0]?.applyMode))
  }

  console.log('[verify:skill-tab-explainer] OK')
}

main()
