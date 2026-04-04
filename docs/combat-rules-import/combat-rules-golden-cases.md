# Combat rules — golden cases & verify (4E-6)

Structured combat rules are validated **without UI**: JSON provenance, runtime getters, and formula helpers.

## Commands

| Script | Purpose |
|--------|---------|
| `npx tsx scripts/verify/verifyCombatRuleSources.ts` | Each `rules.extensions.*` block has valid `status` and non-empty `sources[]` with traceability (`manifestRelativePath` or `topicId`). |
| `npx tsx scripts/verify/verifyCombatRuleRuntime.ts` | Bundled `structuredCombatRules` loads; each `get*Rules()` getter returns an object. |
| `npx tsx scripts/verify/combatGoldenCases.ts` | Data + 4E-5 helpers: cases A–N + blocked C.7 gate. |

Umbrella: `npm run verify:combat-rules` (also chained from `npm run verify:4e`).

## Golden case map

| ID | Rule / behavior | Primary block | How it is verified |
|----|-----------------|---------------|-------------------|
| A | Default skill damage form = hit | `damageForms` | `unspecifiedSkillDamageDefaultForm === "hit"` |
| B | Exactly five damage types | `damageTypes` | `types` equals canonical set |
| C | Physical does not use resistance matrix | `damageTypes` | `resistanceAppliesTo.physical === false` |
| D | Fire / cold / lightning / corrosion use resistance | `damageTypes` | `resistanceAppliesTo[…] === true` |
| E | Outgoing conversion hit-only | `damageConversion` | `outgoingDamageTypeConversionAppliesToForm` |
| F | Incoming conversion all forms | `damageConversion` | `incomingDamageTypeConversionAppliesToForm` for all five forms |
| G | Same-source outgoing &gt;100% → weight scale to 100% | `damageConversion` | `redistributeSameSourceOutgoingPercents([30,80])` vs proportional expectation |
| H | Resistance penetration → effective only | `resistancePenetration` | `effectiveResistancePercentForDamageCalc('hit', 50, 10).effective === 40` |
| I | Armor reduction penetration hit-only | `armorReductionPenetration` | Dot: skipped, mitigation unchanged; hit: pen applies |
| J | Armor mitigation % can go negative | `armorReductionPenetration` | `5 - 20 → -15` on hit |
| K | Crit hit-only | `critRules` | `computeCritAndDoubleDamageForForm('dot', …).critExpectedMult === 1` |
| L | Default crit damage 150% | `critRules` | Bundle `defaultCritDamagePercent === 150`; 100% crit uses 1.5× not legacy multiplier |
| M | Double damage hit-only | `doubleDamageRules` | Dot + 100% double chance → EV mult stays 1 |
| N | True damage ignores resist & armor | `damageForms` + helpers | Effective resist/armor mitigation 0 with skip |
| BLOCK_C7 | Special fusion not implemented | `damageConversion` | `specialFusionTypeBonusBlocked() === true` |

## Blocked / partial boundaries (not pretended as fully implemented)

- **`damageConversion.specialFusionTypeBonus`**: `blocked_needs_user_rule` — golden case **BLOCK_C7** asserts it stays blocked; no numeric fusion is verified.
- **`damageConversion`**: ingest `partial` + `blockedParts` (C.7 note) — case **G** still runs because `redistributeSameSourceOutgoingPercents` only gates on whole-block `blocked_needs_user_rule` and `sameSourceOutgoingOverCapRedistributesByWeight`.
- **`critRules`**: `partial`; **G.5** full crit value composition is **not** golden-tested — only **L** (default 150%) and **K** (form gate).
- **`damageForms`**: `partial`; section I terms in `blockedParts` (e.g. aggravate, block) are **not** algorithmically verified here.
- **True damage “most bonuses don’t apply again”**: only **N** (ignore resist/armor) is asserted; no full modifier exclusion list.
- **Double damage EV**: **M** checks form gate only; aggregate `doubleDamageChancePct` is not part of default build pipeline.

## Failure messages

Failures include a case **ID** and **block** name so CI can point to the broken extension (e.g. `extensions.damageConversion`).
