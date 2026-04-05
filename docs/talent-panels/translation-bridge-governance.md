# Translation bridge 治理（talentEffectLineZh）

## 目標

在 **不重寫** `mapTalentNodesToAffixes.ts` 決策哲學的前提下，用 **可審計、決定性** 的英文效果行 → 繁中子字串對照，縮小 `no_affix_text_match` 中「純翻譯缺口」子集。

## Backlog 批次（與 buildTalentNodeAffixBacklog 對齊）

| batchKey | priority（越小越先） | 含義 |
|----------|---------------------|------|
| `adjudication_followup` | 10 | 裁決表已有 tentative / rejected，或 approved 與節點狀態不一致 |
| `manual_disambiguation_priority` | 20 | `multiple_candidates_*` 且候選數 > 0 |
| `translation_bridge_priority` | 30 | `no_affix_text_match`、譯文仍含「（原文：…）」、且非延後機制句 |
| `missing_anchor_priority` | 40 | `missing_effect_lines_anchor` 或無 effectLines 的 no_affix |
| `deferred_special_mechanic` | 50–70 | 條件句/多段/過長行，或譯文已完整仍無 haystack 命中（文案漂移） |

## 可接受的 bridge

- **整行 EXACT**：`EXACT_LINE_ZH['+9% Fire Damage'] = '+9% 火焰傷害'` 且已在 `talent-affixes.json` **實際正文**中 grep 到相同子字串。
- **窄片語 PHRASE**：僅當不會造成跨語境誤譯時加入；優先仍用整行 EXACT。

## 必須拒絕的 bridge

- **同一英文行、不同神系對應不同繁中**（例如多 panel 共用 `+10% Focus Blessing Duration` 但 TLIDB 分別為聚能/專注/其他）：**禁止**單一全域 EXACT；應走 **adjudication** 或日後 **panel 感知**的顯式表（本卡未做 panel 感知）。
- **寬鬆關鍵字包含**、**displayName 聯想**、**僅 sourceOrderIndex** 作為對應依據。
- **多值映射**（一個 English 對多個 Zh 讓 matcher 抽一個）：禁止。

## 何時改走 adjudication

- 多候選、`core_talent` vs `talent_tree` 需證據排除。
- 英文與 SS12 正文關係僅能靠人類或官方表確認（`manual_missing_translation_bridge` 等）。

## 何時維持 unresolved

- 無足夠證據、或屬條件/特殊機制（`deferred_special_mechanic`）。
- Bridge 補強後 **仍** no_affix：代表非翻譯問題，**不可**為了數字再加寬規則。

## 與 ingest 報告

重跑 `npm run ingest:talent-node-affix-map` 後，`talent-node-affix-map-report.json` 的 `comparison.vsPreviousRun` 可對照 resolved / unresolved 與各 reason 變化。
