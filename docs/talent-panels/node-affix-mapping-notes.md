# Talent panel nodes → talent-affixes 對應策略

## 目標

在**不猜 displayName**、**不語義腦補**的前提下，將 `talent-panel-nodes.json`（TLI SS11 拓撲 + 英文 `effectLines`）對到 `talent-affixes.json`（TLIDB 匯入、繁中正文）。

## 可用錨點

### Node 端（`talent-panel-nodes.json`）

| 欄位 | 用途 |
|------|------|
| `panelId` | 轉成 `deity:{God_of_Might}` 形式，與 affix `tags` **精確**篩選同神系候選。 |
| `effectLines` | TLI `mods.description`（英文）；經 `translateTalentEffectLineEnToZh` 轉中文後做文字比對。 |
| `notes` 內 `tli:ss11:node_*:uuid` | **追溯來源**；目前管線**不用**此字串當唯一 gameDataId 錨點（SS12 詞綴表無對應欄位時不猜）。 |
| `x` / `y` / `slotIndex` | 版面拓撲；**不**參與 affix 選擇（避免 8×5 座標硬套 TLIDB 扁平原表）。 |

### Affix 端（`talent-affixes.json`）

| 欄位 | 用途 |
|------|------|
| `sourceKind` | 首選池：`talent_tree_node`；次選池：`core_talent_node`（僅當樹上池無唯一命中）。 |
| `tags`（`deity:*`） | 與 `panelId` 對齊，**精確**篩選。 |
| `rawText` + `descriptionLines` | 合併為 primary haystack（正規化後比對）。 |
| `modifiersText` | 次階 haystack：僅在 primary 命中多筆時，用於**縮小候選**（仍多筆則 unresolved）。 |
| `gameDataId` / `affixId` | 寫回 node；**不**從 node 反推未給定的 id。 |

## 管線層級（`lib/talent/mapTalentNodesToAffixes.ts`）

1. **deity 範圍**：候選 = 同 `deity:{Panel}`。
2. **Primary（talent_tree）**：各 `effectLines` 譯句（去「（原文：…）」尾綴）經 `normalizeTextForAffixMatch` 後，**每一行**皆須出現在候選 affix 的 primary haystack 中。
3. **唯一命中** → `mappingConfidence: normalized_text_talent_tree`。
4. **多筆命中** → 用 **modifiersText** 再篩：
   - 僅剩 1 筆 → `constrained_fallback_unique`。
   - 仍 ≥2 筆 → `unresolvedReason: multiple_candidates_same_text` 或 `multiple_candidates_same_text_modifiers_tie`。
5. **樹上 0 筆** → 對 **core_talent** 池重複同規則；唯一 → `normalized_text_core_talent`；多筆 → `multiple_candidates_core_talent_tab`。
6. **仍 0 筆** → `no_affix_text_match`（常見於譯表未覆蓋英文行、或 SS11/SS12 文案不一致）。
7. **無 effectLines** → `missing_effect_lines_anchor`。

## 與 sourceTab 的關係

- **不**自動合併 `talent_tree` 與 `core_talent` 的同 gameDataId 列；樹上優先，核心僅在樹上無命中時使用。
- 若兩池各自多筆，維持 **unresolved**，不指定優先權。

## 重跑與產物

```bash
npx tsx scripts/ingest/applyTalentNodeAffixMapping.ts
```

- 更新：`data/normalized/ss12/talent-panel-nodes.json`
- 報告：`data/normalized/ss12/talent-node-affix-map-report.json`

```bash
npx tsx scripts/verify/verifyTalentNodeAffixMapping.ts
```

## Schema（`types/talentPanel.ts`）

- `mappingStatus`: `resolved` | `unresolved`
- `mappingConfidence`（resolved）
- `unresolvedReason`（unresolved，機讀碼）
- `mappingProvenance`: `mapTalentNodesToAffixes:v1`
- 保留 `effectLines`、`notes`、`requiresNodeIds`、`edgesTo`；已移除對應成功節點的 `affixPending`。

## 已知限制（後續工作）

- 譯句未覆蓋的英文行會導致 `no_affix_text_match`；應**增量**擴充 `talentEffectLineZh.ts` 的 EXACT / PHRASE（可驗證、非語義猜測）。
- `multiple_candidates_*` 需外部唯一鍵（例如官方 node↔gameDataId 表）或人工裁決表；**禁止**以 displayName 或模糊相似度自動選擇。
