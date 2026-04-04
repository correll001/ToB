/**
 * Global combat / Skill_Level rules from bundled effective dataset.
 */

import type { GlobalCombatRuleSet } from '@/types/rules'
import type {
  DerivedCombatBaseValues,
  DerivedCombatFallbackTrace,
  DerivedCombatRulesPrimarySource,
} from '@/types/combat'
import type { GlobalCombatRuleLayer, Post20ScalingConfig } from '@/types/skillInstance'
import { defaultGlobalCombatRuleLayer, TLIDB_DEFAULT_POST20 } from '@/lib/formula/skills/applyPost20Scaling'
import type { NormalizedGlobalRulesFile } from '@/types/normalized'

import { getRuntimeDataset } from './runtimeDataset'

const DERIVED_COMBAT_EXT_KEY = 'derivedCombatPanel'

/** Last-resort static aligns with TLIDB Character_Build help text when parse fails (still flagged). */
const WIKI_STATIC_LIFE_MANA: Pick<
  DerivedCombatBaseValues,
  'hpBaseFlat' | 'hpPerLevel' | 'hpPerStrength' | 'mpBaseFlat' | 'mpPerLevel' | 'mpPerIntelligence'
> = {
  hpBaseFlat: 50,
  hpPerLevel: 13,
  hpPerStrength: 0.2,
  mpBaseFlat: 40,
  mpPerLevel: 5,
  mpPerIntelligence: 0.5,
}

/** Pre–4E-4 panel placeholders — only used when extension + bundle provide nothing better. */
const LEGACY_PANEL_PLACEHOLDERS: Pick<
  DerivedCombatBaseValues,
  | 'baseAttrStart'
  | 'baseAttrPerLevel'
  | 'weaponDamageBase'
  | 'weaponDamagePerLevel'
  | 'attackSpeedBase'
  | 'attackSpeedPerLevel'
  | 'attackSpeedClampMin'
  | 'attackSpeedClampMax'
  | 'critBaseMultiplier'
  | 'mpFromDivinityMax'
  | 'mpFromDivinityPerChar'
> = {
  baseAttrStart: 8,
  baseAttrPerLevel: 1.5,
  weaponDamageBase: 25,
  weaponDamagePerLevel: 3,
  attackSpeedBase: 1,
  attackSpeedPerLevel: 0.002,
  attackSpeedClampMin: 0.35,
  attackSpeedClampMax: 6,
  critBaseMultiplier: 1.5,
  mpFromDivinityMax: 50,
  mpFromDivinityPerChar: 0.1,
}

export type DerivedCombatRulesResolution = {
  values: DerivedCombatBaseValues
  primarySource: DerivedCombatRulesPrimarySource
  fallbacks: DerivedCombatFallbackTrace[]
}

export function getBundledSkillLevelRules(): GlobalCombatRuleSet {
  return getRuntimeDataset().bundle.skillLevelRules.rules
}

export function getBundledCombatRulesFile(): NormalizedGlobalRulesFile {
  return getRuntimeDataset().bundle.combatRules
}

/** Resolved `rules` object inside the bundled Character_Build / combat rules file. */
export function getBundledCombatRules(): GlobalCombatRuleSet {
  return getBundledCombatRulesFile().rules
}

function joinSectionBullets(rules: GlobalCombatRuleSet, sectionId: string): string {
  const secs = rules.characterBuildRules ?? []
  const hit = secs.find((s) => s.sectionId === sectionId)
  if (!hit?.bullets?.length) return ''
  return hit.bullets.join('')
}

function readExtensionNumeric(
  rules: GlobalCombatRuleSet,
  fallbacks: DerivedCombatFallbackTrace[],
): Partial<DerivedCombatBaseValues> {
  const raw = rules.extensions?.[DERIVED_COMBAT_EXT_KEY]
  const out: Partial<DerivedCombatBaseValues> = {}
  if (!raw || typeof raw !== 'object' || raw === null) return out

  const o = raw as Record<string, unknown>
  const take = (field: keyof DerivedCombatBaseValues, jsonKey: string) => {
    const v = o[jsonKey]
    if (typeof v === 'number' && Number.isFinite(v)) {
      out[field] = v
    } else if (v !== undefined) {
      fallbacks.push({
        key: `derivedCombatPanel.${jsonKey}`,
        reason: 'non_numeric_or_non_finite_ignored',
        detail: JSON.stringify(v),
      })
    }
  }

  take('hpBaseFlat', 'hpBaseFlat')
  take('hpPerLevel', 'hpPerLevel')
  take('hpPerStrength', 'hpPerStrength')
  take('mpBaseFlat', 'mpBaseFlat')
  take('mpPerLevel', 'mpPerLevel')
  take('mpPerIntelligence', 'mpPerIntelligence')
  take('mpFromDivinityMax', 'mpFromDivinityMax')
  take('mpFromDivinityPerChar', 'mpFromDivinityPerChar')
  take('baseAttrStart', 'baseAttrStart')
  take('baseAttrPerLevel', 'baseAttrPerLevel')
  take('weaponDamageBase', 'weaponDamageBase')
  take('weaponDamagePerLevel', 'weaponDamagePerLevel')
  take('attackSpeedBase', 'attackSpeedBase')
  take('attackSpeedPerLevel', 'attackSpeedPerLevel')
  take('attackSpeedClampMin', 'attackSpeedClampMin')
  take('attackSpeedClampMax', 'attackSpeedClampMax')
  take('critBaseMultiplier', 'critBaseMultiplier')

  return out
}

function parseLifeManaFromCharacterBuild(rules: GlobalCombatRuleSet): {
  partial: Partial<DerivedCombatBaseValues>
  foundLife: boolean
  foundMana: boolean
} {
  const lifeText = joinSectionBullets(rules, 'CharacterBuild-Life-Help')
  const manaText = joinSectionBullets(rules, 'CharacterBuild-Mana-Help')
  const partial: Partial<DerivedCombatBaseValues> = {}
  let foundLife = false
  let foundMana = false

  const mLifeStart =
    lifeText.match(/(?:initially\s+)?start with (\d+) Max Life/i) ??
    lifeText.match(/(\d+)\s+Max Life/i)
  const mLifeLv = lifeText.match(/increases Max Life by (\d+)/i)
  const mLifeStr = lifeText.match(/Strength increases Max Life by ([\d.]+)/i)

  if (mLifeStart?.[1] && mLifeLv?.[1] && mLifeStr?.[1]) {
    partial.hpBaseFlat = Number(mLifeStart[1])
    partial.hpPerLevel = Number(mLifeLv[1])
    partial.hpPerStrength = Number(mLifeStr[1])
    foundLife = true
  }

  const mManaStart =
    manaText.match(/have (\d+) Max Mana by default/i) ?? manaText.match(/(\d+)\s+Max Mana/i)
  const mManaLv = manaText.match(/Each level increases Max Mana by (\d+)/i)
  const mManaInt = manaText.match(/Intelligence increases Max Mana by ([\d.]+)/i)

  if (mManaStart?.[1] && mManaLv?.[1] && mManaInt?.[1]) {
    partial.mpBaseFlat = Number(mManaStart[1])
    partial.mpPerLevel = Number(mManaLv[1])
    partial.mpPerIntelligence = Number(mManaInt[1])
    foundMana = true
  }

  return { partial, foundLife, foundMana }
}

/**
 * Merge bundled `extensions.derivedCombatPanel`, Character_Build Life/Mana bullets, then legacy placeholders.
 * Every gap filled from legacy/wiki-static is recorded in `fallbacks`.
 */
export function getDerivedCombatBaseRules(): DerivedCombatRulesResolution {
  const combatRules = getBundledCombatRules()
  const fallbacks: DerivedCombatFallbackTrace[] = []
  const fromExt = readExtensionNumeric(combatRules, fallbacks)
  const fromCb = parseLifeManaFromCharacterBuild(combatRules)

  const pickLifeMana = (
    key: keyof typeof WIKI_STATIC_LIFE_MANA,
    label: 'life' | 'mana',
  ): number => {
    if (fromExt[key] != null) return fromExt[key] as number
    if (fromCb.partial[key] != null) return fromCb.partial[key] as number
    fallbacks.push({
      key: `resource:${key}`,
      reason:
        label === 'life'
          ? 'no_bundle_extension_or_character_build_used_wiki_static'
          : 'no_bundle_extension_or_character_build_used_wiki_static',
      detail: String(WIKI_STATIC_LIFE_MANA[key]),
    })
    return WIKI_STATIC_LIFE_MANA[key]
  }

  const values: DerivedCombatBaseValues = {
    hpBaseFlat: pickLifeMana('hpBaseFlat', 'life'),
    hpPerLevel: pickLifeMana('hpPerLevel', 'life'),
    hpPerStrength: pickLifeMana('hpPerStrength', 'life'),
    mpBaseFlat: pickLifeMana('mpBaseFlat', 'mana'),
    mpPerLevel: pickLifeMana('mpPerLevel', 'mana'),
    mpPerIntelligence: pickLifeMana('mpPerIntelligence', 'mana'),
    mpFromDivinityMax:
      fromExt.mpFromDivinityMax ?? LEGACY_PANEL_PLACEHOLDERS.mpFromDivinityMax,
    mpFromDivinityPerChar:
      fromExt.mpFromDivinityPerChar ?? LEGACY_PANEL_PLACEHOLDERS.mpFromDivinityPerChar,
    baseAttrStart: (() => {
      if (fromExt.baseAttrStart != null) return fromExt.baseAttrStart
      fallbacks.push({
        key: 'baseAttrStart',
        reason: 'panel_placeholder_not_in_global_rules',
        detail: String(LEGACY_PANEL_PLACEHOLDERS.baseAttrStart),
      })
      return LEGACY_PANEL_PLACEHOLDERS.baseAttrStart
    })(),
    baseAttrPerLevel: (() => {
      if (fromExt.baseAttrPerLevel != null) return fromExt.baseAttrPerLevel
      fallbacks.push({
        key: 'baseAttrPerLevel',
        reason: 'panel_placeholder_not_in_global_rules',
        detail: String(LEGACY_PANEL_PLACEHOLDERS.baseAttrPerLevel),
      })
      return LEGACY_PANEL_PLACEHOLDERS.baseAttrPerLevel
    })(),
    weaponDamageBase: (() => {
      if (fromExt.weaponDamageBase != null) return fromExt.weaponDamageBase
      fallbacks.push({
        key: 'weaponDamageBase',
        reason: 'panel_placeholder_not_in_global_rules',
        detail: String(LEGACY_PANEL_PLACEHOLDERS.weaponDamageBase),
      })
      return LEGACY_PANEL_PLACEHOLDERS.weaponDamageBase
    })(),
    weaponDamagePerLevel: (() => {
      if (fromExt.weaponDamagePerLevel != null) return fromExt.weaponDamagePerLevel
      fallbacks.push({
        key: 'weaponDamagePerLevel',
        reason: 'panel_placeholder_not_in_global_rules',
        detail: String(LEGACY_PANEL_PLACEHOLDERS.weaponDamagePerLevel),
      })
      return LEGACY_PANEL_PLACEHOLDERS.weaponDamagePerLevel
    })(),
    attackSpeedBase: (() => {
      if (fromExt.attackSpeedBase != null) return fromExt.attackSpeedBase
      fallbacks.push({
        key: 'attackSpeedBase',
        reason: 'panel_placeholder_not_in_global_rules',
        detail: String(LEGACY_PANEL_PLACEHOLDERS.attackSpeedBase),
      })
      return LEGACY_PANEL_PLACEHOLDERS.attackSpeedBase
    })(),
    attackSpeedPerLevel: (() => {
      if (fromExt.attackSpeedPerLevel != null) return fromExt.attackSpeedPerLevel
      fallbacks.push({
        key: 'attackSpeedPerLevel',
        reason: 'panel_placeholder_not_in_global_rules',
        detail: String(LEGACY_PANEL_PLACEHOLDERS.attackSpeedPerLevel),
      })
      return LEGACY_PANEL_PLACEHOLDERS.attackSpeedPerLevel
    })(),
    attackSpeedClampMin:
      fromExt.attackSpeedClampMin ?? LEGACY_PANEL_PLACEHOLDERS.attackSpeedClampMin,
    attackSpeedClampMax:
      fromExt.attackSpeedClampMax ?? LEGACY_PANEL_PLACEHOLDERS.attackSpeedClampMax,
    critBaseMultiplier: (() => {
      if (fromExt.critBaseMultiplier != null) return fromExt.critBaseMultiplier
      fallbacks.push({
        key: 'critBaseMultiplier',
        reason: 'unverified_game_default_panel_placeholder',
        detail: String(LEGACY_PANEL_PLACEHOLDERS.critBaseMultiplier),
      })
      return LEGACY_PANEL_PLACEHOLDERS.critBaseMultiplier
    })(),
  }

  if (fromExt.mpFromDivinityMax == null || fromExt.mpFromDivinityPerChar == null) {
    if (fromExt.mpFromDivinityMax == null) {
      fallbacks.push({
        key: 'mpFromDivinityMax',
        reason: 'panel_heuristic_default',
        detail: String(LEGACY_PANEL_PLACEHOLDERS.mpFromDivinityMax),
      })
    }
    if (fromExt.mpFromDivinityPerChar == null) {
      fallbacks.push({
        key: 'mpFromDivinityPerChar',
        reason: 'panel_heuristic_default',
        detail: String(LEGACY_PANEL_PLACEHOLDERS.mpFromDivinityPerChar),
      })
    }
  }

  const extKeys = Object.keys(fromExt).length
  let primarySource: DerivedCombatRulesPrimarySource
  if (extKeys > 0) primarySource = 'bundle_extension'
  else if (fromCb.foundLife && fromCb.foundMana) primarySource = 'character_build_parsed'
  else primarySource = 'legacy_fallback'

  if (primarySource === 'legacy_fallback') {
    fallbacks.push({
      key: 'bundle',
      reason: 'character_build_life_mana_bullets_unparsed',
      detail: 'used_wiki_static_and_panel_placeholders',
    })
  }

  return { values, primarySource, fallbacks }
}

/** Convenience: fallback traces from the current bundled merge (cheap; for debug hooks). */
export function getFallbackFlags(): DerivedCombatFallbackTrace[] {
  return [...getDerivedCombatBaseRules().fallbacks]
}

export function post20ConfigFromBundledRules(): Post20ScalingConfig {
  const rules = getBundledSkillLevelRules()
  const ext = rules.extensions
  if (!ext || typeof ext !== 'object' || ext === null) return TLIDB_DEFAULT_POST20
  const pr = ext['post20Runtime']
  if (!pr || typeof pr !== 'object') return TLIDB_DEFAULT_POST20
  const o = pr as Record<string, unknown>
  const t21 = typeof o.tier21to30PerLevelMorePct === 'number' ? o.tier21to30PerLevelMorePct : undefined
  const t31 = typeof o.tier31PlusPerLevelMorePct === 'number' ? o.tier31PlusPerLevelMorePct : undefined
  if (t21 == null && t31 == null) return TLIDB_DEFAULT_POST20
  return {
    tier21to30PerLevelMorePct: t21 ?? TLIDB_DEFAULT_POST20.tier21to30PerLevelMorePct,
    tier31PlusPerLevelMorePct: t31 ?? TLIDB_DEFAULT_POST20.tier31PlusPerLevelMorePct,
  }
}

export function bundledGlobalCombatRuleLayer(): GlobalCombatRuleLayer {
  const base = defaultGlobalCombatRuleLayer()
  const post20 = post20ConfigFromBundledRules()
  const derived = getDerivedCombatBaseRules()
  const vls = derived.values
  return {
    ...base,
    getPost20Scaling: () => post20,
    getResourceScalingHint: () => ({
      hpFlatPerLevel: vls.hpPerLevel,
      mpFlatPerLevel: vls.mpPerLevel,
      strToHp: vls.hpPerStrength,
      intToMp: vls.mpPerIntelligence,
    }),
  }
}
