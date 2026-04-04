/**
 * Back-compat re-exports — prefer:
 * - `@/lib/runtime/runtimeSkillLookup`
 * - `@/lib/runtime/runtimeRulesLookup`
 * - `@/lib/runtime/runtimeDataset`
 *
 * Bundled JSON: `lib/gameData/generated/effective-runtime-bundle.json` (see `npm run data:import:effective`).
 */

export type { BundledSkillDatasetMeta, SkillPickerRow } from '@/lib/runtime/runtimeSkillLookup'
export {
  getBundledSkillDatasetMeta,
  getSkillDefinitionById,
  getNormalizedSkillRecord,
  listSkillsByFamily,
  listMainSlotSkillPickerRows,
  isMainSlotSkillFamily,
} from '@/lib/runtime/runtimeSkillLookup'

export {
  getBundledSkillLevelRules,
  getBundledCombatRulesFile,
  post20ConfigFromBundledRules,
  bundledGlobalCombatRuleLayer,
} from '@/lib/runtime/runtimeRulesLookup'

export { getRuntimeDataset, getEffectiveRuntimeBundle, __resetRuntimeDatasetCacheForTests } from '@/lib/runtime/runtimeDataset'
