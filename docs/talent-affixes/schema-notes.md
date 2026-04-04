# Talent affix library — schema notes

## affixId 規則（穩定、可引用）

- **有 TLIDB `data-id`（遊戲資料列 id）**  
  `talaffix:{season}:{sourceTab}:{gameDataId}`  
  例：`talaffix:ss12:core_talent:700024`、`talaffix:ss12:talent_tree:700024`  
  同一 `gameDataId` 在「核心天賦點」與「天賦」兩個分頁各出現一次時，**因 `sourceTab` 不同而為兩筆不同 affix**（描述可能含／不含「神格生效上限」註記）。

- **無 `data-id`（多為 Profession 列或頁面未標 id）**  
  `talaffix:{season}:{sourceTab}:i{sourceOrderIndex}_{slug}`  
  - `sourceOrderIndex`：整頁合併後的 0-based 順序（先 Profession → 核心 → 天賦）。  
  - `slug`：顯示名稱的 ASCII slug；若全中文則為名稱的 **32-bit hash hex**（`uxxxxxxxx`），避免只靠中文當 key。

- **極少數同 tab + 同 gameDataId 重複列**（若未來頁面變更）  
  自動加後綴 `__dup2`、`__dup3`…

## 與後續「節點／座標」的關係

- `panelHints` 在 v1 **恒為空陣列**。  
- 後續人工輸入神版拓撲時，應以 **`affixId` 外鍵** 指向本詞綴庫，**不得**在本卡產物中寫入座標或連線。

## availability 陣列

可多值並列，語意為「從扁平頁面可合理主張的出處類型」，**不是**遊戲內唯一掉落來源：

| 值 | 意義 |
|----|------|
| `profession_meta` | Profession 分頁列（神系／進階職業說明卡） |
| `core_talent` | 核心天賦點分頁列 |
| `talent_tree` | 天賦分頁列（含小型／中型／傳奇等） |
| `new_god_related` | 列上神系連結為新神（`New_God`） |
| `god_grid_cap_hint` | 描述含「神格生效上限」 |
| `slate_related_hint` | 描述含「石板」字樣（本快照中可能為 0） |
| `unresolved` | 無法歸類時使用（v1 在有三個分頁列來源時通常不會出現） |

## modifiers（保守結構化）

- 僅以正則從 `rawText` 擷取 **`+數值% …`** 片段，產生 `TalentAffixModifierStub`（`labelZh` 為原文剩餘字串，**不是**專案內 stat key）。  
- 含吞噬、祝福、條件句、多段機制者：**仍保留完整 `rawText`**，不依賴 `modifiers` 還原語義。
