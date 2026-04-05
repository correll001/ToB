# Talent node → affix unresolved backlog

Generated: 2026-04-05T06:08:42.492Z
Season: ss12

## Summary

- **total unresolved**: 604
- **adjudication rows**: approved 3, tentative 1, rejected 1
- **tentative + still unresolved**: 1
- **rejected on file + still unresolved**: 1

## Latest ingest comparison (from talent-node-affix-map-report.json)

```json
{
  "vsPreviousRun": {
    "resolvedDelta": 22,
    "unresolvedDelta": -22,
    "previousResolved": 249,
    "previousUnresolved": 626,
    "previousUnresolvedReasons": {
      "no_affix_text_match": 514,
      "missing_effect_lines_anchor": 58,
      "multiple_candidates_same_text_modifiers_tie": 54
    },
    "previousByConfidence": {
      "normalized_text_talent_tree": 244,
      "manual_adjudicated": 3,
      "constrained_fallback_unique": 2
    }
  }
}
```

## unresolvedReason 分布

| reason | count |
|--------|-------|
| `no_affix_text_match` | 467 |
| `multiple_candidates_same_text_modifiers_tie` | 79 |
| `missing_effect_lines_anchor` | 58 |

## batch 分布

| batchKey | count |
|----------|-------|
| `adjudication_followup` | 2 |
| `manual_disambiguation_priority` | 78 |
| `translation_bridge_priority` | 246 |
| `missing_anchor_priority` | 58 |
| `deferred_special_mechanic` | 220 |

## Panel unresolved 排名（前 25）

| panelId | count |
|---------|-------|
| `god_Warlock` | 28 |
| `god_Warlord` | 26 |
| `god_Shadowmaster` | 26 |
| `god_Alchemist` | 26 |
| `god_Magister` | 25 |
| `god_Artisan` | 25 |
| `god_God_of_Machines` | 23 |
| `god_Prophet` | 23 |
| `god_Psychic` | 23 |
| `god_The_Brave` | 22 |
| `god_Elementalist` | 22 |
| `god_Ranger` | 22 |
| `god_Lich` | 22 |
| `god_Steel_Vanguard` | 22 |
| `god_Marksman` | 21 |
| `god_Bladerunner` | 21 |
| `god_Sentinel` | 21 |
| `god_Arcanist` | 20 |
| `god_Machinist` | 20 |
| `god_Assassin` | 19 |
| `god_Warrior` | 18 |
| `god_Shadowdancer` | 18 |
| `god_Druid` | 17 |
| `god_Ronin` | 17 |
| `god_Goddess_of_Deception` | 15 |

## candidateCount 最高的多候選案件（前 20）

| nodeId | panel | slot | candidates | reason |
|--------|-------|------|------------|--------|
| `talnode:ss12:god_Shadowmaster:s4` | god_Shadowmaster | 4 | 5 | `multiple_candidates_same_text_modifiers_tie` |
| `talnode:ss12:god_Assassin:s13` | god_Assassin | 13 | 4 | `multiple_candidates_same_text_modifiers_tie` |
| `talnode:ss12:god_Assassin:s27` | god_Assassin | 27 | 4 | `multiple_candidates_same_text_modifiers_tie` |
| `talnode:ss12:god_Bladerunner:s10` | god_Bladerunner | 10 | 4 | `multiple_candidates_same_text_modifiers_tie` |
| `talnode:ss12:god_God_of_Machines:s5` | god_God_of_Machines | 5 | 4 | `multiple_candidates_same_text_modifiers_tie` |
| `talnode:ss12:god_God_of_Machines:s11` | god_God_of_Machines | 11 | 4 | `multiple_candidates_same_text_modifiers_tie` |
| `talnode:ss12:god_God_of_Machines:s20` | god_God_of_Machines | 20 | 4 | `multiple_candidates_same_text_modifiers_tie` |
| `talnode:ss12:god_Marksman:s27` | god_Marksman | 27 | 4 | `multiple_candidates_same_text_modifiers_tie` |
| `talnode:ss12:god_Marksman:s32` | god_Marksman | 32 | 4 | `multiple_candidates_same_text_modifiers_tie` |
| `talnode:ss12:god_Marksman:s37` | god_Marksman | 37 | 4 | `multiple_candidates_same_text_modifiers_tie` |
| `talnode:ss12:god_Shadowmaster:s0` | god_Shadowmaster | 0 | 4 | `multiple_candidates_same_text_modifiers_tie` |
| `talnode:ss12:god_Shadowmaster:s11` | god_Shadowmaster | 11 | 4 | `multiple_candidates_same_text_modifiers_tie` |
| `talnode:ss12:god_Shadowmaster:s20` | god_Shadowmaster | 20 | 4 | `multiple_candidates_same_text_modifiers_tie` |
| `talnode:ss12:god_Shadowmaster:s29` | god_Shadowmaster | 29 | 4 | `multiple_candidates_same_text_modifiers_tie` |
| `talnode:ss12:god_Warlord:s29` | god_Warlord | 29 | 4 | `multiple_candidates_same_text_modifiers_tie` |
| `talnode:ss12:god_Arcanist:s5` | god_Arcanist | 5 | 3 | `multiple_candidates_same_text_modifiers_tie` |
| `talnode:ss12:god_Arcanist:s11` | god_Arcanist | 11 | 3 | `multiple_candidates_same_text_modifiers_tie` |
| `talnode:ss12:god_Arcanist:s20` | god_Arcanist | 20 | 3 | `multiple_candidates_same_text_modifiers_tie` |
| `talnode:ss12:god_Artisan:s0` | god_Artisan | 0 | 3 | `multiple_candidates_same_text_modifiers_tie` |
| `talnode:ss12:god_Artisan:s5` | god_Artisan | 5 | 3 | `multiple_candidates_same_text_modifiers_tie` |

## 建議優先補 translation bridge 的 effectLines（translation_bridge_priority 桶）

| English effectLine | 影響節點數 |
|--------------------|------------|
| `+6% Affliction Effect` | 5 |
| `+12% Affliction Effect` | 4 |
| `1.5% Blur Effect` | 3 |
| `+9% Area Damage` | 3 |
| `+4% Fervor effect` | 3 |
| `+18% Minion Fire Damage` | 3 |
| `-80% additional damage taken by Spirit Magi` | 2 |
| `+3% Energy Shield Charge Speed` | 2 |
| `+15% Max Mana` | 2 |
| `+3% Sealed Mana Compensation` | 2 |
| `+24% Sentry Damage` | 2 |
| `+3% Sentry Skill cast frequency` | 2 |
| `+9% Sentry Projectile Speed` | 2 |
| `+15% Sentry Skill Critical Strike Rating` | 2 |
| `+9% Lightning Damage` | 2 |
| `+9% Minion Lightning Damage` | 2 |
| `+9% damage for Channeled Skills` | 2 |
| `+7% Sentry Skill Area` | 2 |
| `+6 Affliction inflicted per second` | 2 |
| `+18% Damage Over Time` | 2 |
| `+4% Max Energy Shield` | 2 |
| `+4% Energy Shield Charge Speed` | 2 |
| `+8% Deterioration Chance` | 2 |
| `8% additional damage applied to Life` | 2 |
| `+20% Spell Critical Strike Rating` | 2 |
| `+5% Spell Critical Strike Damage` | 2 |
| `-4 Skill Cost` | 2 |
| `+4% Skill Effect Duration` | 2 |
| `+10% Focus Blessing Duration` | 2 |
| `4.5% Projectile Damage` | 2 |
| `+3% Projectile Speed` | 2 |
| `-4% additional Physical Damage taken` | 2 |
| `+18% Area Damage` | 2 |
| `+18% Cold Damage` | 2 |
| `+9% Cold Damage` | 2 |
| `+9% Minion Cold Damage` | 2 |
| `+3% Injury Buffer` | 2 |
| `+4% Erosion Resistance` | 2 |
| `+3% Wilt chance` | 2 |
| `+9% Ailment Damage` | 2 |

## 裁決後續（adjudication_followup + manual_disambiguation 摘要）

- adjudication_candidate_subset 筆數: 80

| nodeId | batchKey | tentative | rejected | candidates |
|--------|----------|-----------|----------|------------|
| `talnode:ss12:god_God_of_Might:s36` | `adjudication_followup` | true | false | 3 |
| `talnode:ss12:god_God_of_Might:s37` | `adjudication_followup` | false | true | 0 |
| `talnode:ss12:god_Alchemist:s0` | `manual_disambiguation_priority` | false | false | 2 |
| `talnode:ss12:god_Alchemist:s21` | `manual_disambiguation_priority` | false | false | 2 |
| `talnode:ss12:god_Arcanist:s0` | `manual_disambiguation_priority` | false | false | 2 |
| `talnode:ss12:god_Arcanist:s5` | `manual_disambiguation_priority` | false | false | 3 |
| `talnode:ss12:god_Arcanist:s11` | `manual_disambiguation_priority` | false | false | 3 |
| `talnode:ss12:god_Arcanist:s20` | `manual_disambiguation_priority` | false | false | 3 |
| `talnode:ss12:god_Artisan:s0` | `manual_disambiguation_priority` | false | false | 3 |
| `talnode:ss12:god_Artisan:s5` | `manual_disambiguation_priority` | false | false | 3 |
| `talnode:ss12:god_Artisan:s11` | `manual_disambiguation_priority` | false | false | 3 |
| `talnode:ss12:god_Artisan:s25` | `manual_disambiguation_priority` | false | false | 2 |
| `talnode:ss12:god_Artisan:s26` | `manual_disambiguation_priority` | false | false | 2 |
| `talnode:ss12:god_Artisan:s28` | `manual_disambiguation_priority` | false | false | 2 |
| `talnode:ss12:god_Artisan:s29` | `manual_disambiguation_priority` | false | false | 2 |
| `talnode:ss12:god_Assassin:s13` | `manual_disambiguation_priority` | false | false | 4 |
| `talnode:ss12:god_Assassin:s27` | `manual_disambiguation_priority` | false | false | 4 |
| `talnode:ss12:god_Bladerunner:s0` | `manual_disambiguation_priority` | false | false | 2 |
| `talnode:ss12:god_Bladerunner:s1` | `manual_disambiguation_priority` | false | false | 2 |
| `talnode:ss12:god_Bladerunner:s9` | `manual_disambiguation_priority` | false | false | 3 |
| `talnode:ss12:god_Bladerunner:s10` | `manual_disambiguation_priority` | false | false | 4 |
| `talnode:ss12:god_Bladerunner:s32` | `manual_disambiguation_priority` | false | false | 3 |
| `talnode:ss12:god_Druid:s27` | `manual_disambiguation_priority` | false | false | 2 |
| `talnode:ss12:god_God_of_Machines:s5` | `manual_disambiguation_priority` | false | false | 4 |
| `talnode:ss12:god_God_of_Machines:s11` | `manual_disambiguation_priority` | false | false | 4 |
| `talnode:ss12:god_God_of_Machines:s20` | `manual_disambiguation_priority` | false | false | 4 |
| `talnode:ss12:god_God_of_War:s4` | `manual_disambiguation_priority` | false | false | 2 |
| `talnode:ss12:god_God_of_War:s37` | `manual_disambiguation_priority` | false | false | 2 |
| `talnode:ss12:god_Goddess_of_Deception:s2` | `manual_disambiguation_priority` | false | false | 2 |
| `talnode:ss12:god_Goddess_of_Deception:s11` | `manual_disambiguation_priority` | false | false | 3 |
| `talnode:ss12:god_Goddess_of_Deception:s16` | `manual_disambiguation_priority` | false | false | 2 |
| `talnode:ss12:god_Goddess_of_Deception:s27` | `manual_disambiguation_priority` | false | false | 2 |
| `talnode:ss12:god_Goddess_of_Deception:s37` | `manual_disambiguation_priority` | false | false | 2 |
| `talnode:ss12:god_Goddess_of_Hunting:s4` | `manual_disambiguation_priority` | false | false | 3 |
| `talnode:ss12:god_Goddess_of_Hunting:s16` | `manual_disambiguation_priority` | false | false | 2 |

## 批次定義與建議路徑

見 `docs/talent-panels/translation-bridge-governance.md` 與 `docs/talent-panels/manual-adjudication-rules.md`。
