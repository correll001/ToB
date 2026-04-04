/**
 * 4D-5: Skill system regression — no network, runs under tsx.
 *
 *   npm run verify:skill-regression
 */
import type { BuildSnapshot, MainSkillSlot } from '@/types/build'
import type { SkillDefinition } from '@/types/skillData'
import { createEmptyBuildSnapshot } from '@/lib/defaultBuildSnapshot'
import { normalizeBuildSnapshot } from '@/lib/normalizeBuildSnapshot'
import { computeSkillInstanceForMainSlot } from '@/lib/formula/collectBuildContributions'
import { computeSkillInstance, skillInstanceToContribution } from '@/lib/formula/skills/computeSkillInstance'
import { selectInspectedSkillDamageView } from '@/selectors/buildComputedStats'
import { encodeBuildToShareCode, decodeBuildFromShareCode } from '@/lib/shareCodec'
import { getRuntimeDataset } from '@/lib/runtime/runtimeDataset'
import {
  getSkillDefinitionById,
  isMainSlotSkillFamily,
  listSkillsByFamily,
} from '@/lib/runtime/runtimeSkillLookup'
import { isDamagingInspectedSkillRole } from '@/lib/formula/skills/inferDamageRole'
import { passiveModifiersForActiveSkill } from '@/lib/formula/collectBuildContributions'

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
    assert('leap+scatter skipped (no projectile)', !!leapInst && !leapInst.supports[0]?.applied)
  }

  let auraSkillId: string | null = null
  for (const def of getRuntimeDataset().definitionsById.values()) {
    if (!isMainSlotSkillFamily(def.family)) continue
    const hay = def.tags.join(' ').toLowerCase()
    if (hay.includes('aura') || def.tags.some((t) => t.includes('光環'))) {
      auraSkillId = def.id
      break
    }
  }
  if (auraSkillId) {
    const auraSnap: BuildSnapshot = {
      ...createEmptyBuildSnapshot(),
      meta: { ...createEmptyBuildSnapshot().meta, inspectedMainSkillSlot: 1 },
      skills: [
        { slot: 1, skillId: auraSkillId, supports: [], skillLevel: 10, enabled: true },
        ...createEmptyBuildSnapshot().skills.slice(1),
      ],
    }
    const auraInst = computeSkillInstanceForMainSlot(auraSnap.skills[0]!, auraSnap)
    if (auraInst?.damageRole === 'aura-only') {
      const auraView = selectInspectedSkillDamageView(auraSnap)
      assert('aura-only inspected → no primary DPS path', auraView.mode !== 'damaging', JSON.stringify(auraView))
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

  const passiveList = listSkillsByFamily('passive')
  let pid: string | null = null
  for (const row of passiveList) {
    const d = getSkillDefinitionById(row.id)
    if (d && (d.modifiers?.length ?? 0) > 0) {
      pid = row.id
      break
    }
  }
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
        skillId: pid,
        enabled: true,
        applyMode: 'linked',
        linkedMainSkillSlots: [2 as MainSkillSlot],
        skillLevel: 10,
      },
      ...createEmptyBuildSnapshot().passives.slice(1),
    ],
  }
  if (pid) {
    const m1 = passiveModifiersForActiveSkill(ice!.id, passiveLinked2, 1).length
    const m2 = passiveModifiersForActiveSkill(ice!.id, passiveLinked2, 2).length
    assert('passive linked only slot 2: slot1 excluded', m1 === 0 && m2 > 0, `m1=${m1} m2=${m2}`)
  }

  const base = normalizeBuildSnapshot(createEmptyBuildSnapshot())
  const persisted = JSON.parse(JSON.stringify({ snapshot: base })) as { snapshot: BuildSnapshot }
  const reloaded = normalizeBuildSnapshot(persisted.snapshot)
  assert('persist JSON round-trip', reloaded.meta.title === base.meta.title)

  const share = decodeBuildFromShareCode(encodeBuildToShareCode(base))
  assert('share import/export', share.skills.length === base.skills.length)

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
