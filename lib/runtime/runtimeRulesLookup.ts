/**
 * Global combat / Skill_Level rules from bundled effective dataset.
 */

import type { GlobalCombatRuleSet } from '@/types/rules'
import type { GlobalCombatRuleLayer, Post20ScalingConfig } from '@/types/skillInstance'
import { defaultGlobalCombatRuleLayer, TLIDB_DEFAULT_POST20 } from '@/lib/formula/skills/applyPost20Scaling'
import type { NormalizedGlobalRulesFile } from '@/types/normalized'

import { getRuntimeDataset } from './runtimeDataset'

export function getBundledSkillLevelRules(): GlobalCombatRuleSet {
  return getRuntimeDataset().bundle.skillLevelRules.rules
}

export function getBundledCombatRulesFile(): NormalizedGlobalRulesFile {
  return getRuntimeDataset().bundle.combatRules
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
  return {
    ...base,
    getPost20Scaling: () => post20,
  }
}
