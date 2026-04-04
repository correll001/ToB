# 神版結構 — 手動輸入規格

本層資料用於在 **`talent-affixes` 詞綴庫之上**建立 `panel → node → affix` 引用，供日後天賦頁聚合、點法比較。  
**不**包含：自動從 TLIDB 辨識位置、UI 繪製、戰鬥公式、玩家存檔格式。

---

## 1. 分層意義

| 檔案 | 內容 |
|------|------|
| `talent-panels.json` | 每一塊**固定神版**（或日後特殊板）的元資料：`panelId`、顯示名、3×6 網格宣告、`sourceKind`、備註。 |
| `talent-panel-nodes.json` | 該板上**實際存在的節點**（空格不要建 node）、座標、`affixId`、類型、點數上限、前置與連線。 |
| `talent-affixes.json` | **僅**詞綴文案與來源；不寫座標。 |

---

## 2. 座標與 `slotIndex`（寫死規則）

- 每個面板為 **3 欄 × 6 列**。
- **`x` ∈ {0, 1, 2}**（左→右）。
- **`y` ∈ {0, 1, 2, 3, 4, 5}**（上→下）。
- **`slotIndex` = `y * 3 + x`**（0–17）。
- **掃描順序**（僅供人工填寫與對照習慣）：固定為 **先橫向再縱向** — 即 (0,0)→(1,0)→(2,0)→(0,1)→…→(2,5)。
- 同一 `panelId` 內：**不得**兩個 node 共用同一組 `(x, y)` 或同一 `slotIndex`。

---

## 3. `panelId` / `nodeId` 命名

- **`panelId`**：建議人工指定穩定 ASCII id（例如 `god_God_of_Might`）。**不要**從 TLIDB 平面列表推測整張板清單；缺板就**不要**建 panel。
- **`nodeId`**（已定案）：

  `talnode:{season}:{panelId}:s{slotIndex}`

  例：`talnode:ss12:god_God_of_Might:s0`

---

## 4. `requiresNodeIds` 與 `edgesTo`

- 兩者陣列中的 id **必須**指向**同一 `panelId`** 內已宣告的其他 node。
- **不可**自指（不可包含自己的 `nodeId`）。
- **`requiresNodeIds`**：**僅直接前置**（上一層解鎖關係），不強制列出所有祖先。
- **`edgesTo`**：有向邊；可用於與 requires 一致，或額外描述路徑（仍限同 panel）。

---

## 5. 同一 `affixId` 多次出現

- **允許**同一 `affixId` 出現在不同 panel。
- **允許**同一 `affixId` 在同一 panel 內出現**多個** node（不同格）。驗證**不**禁止。

---

## 6. 其他欄位規則

- **`maxRank`**：正整數，**≥ 1**。
- **`nodeType`**：`entry` | `small` | `medium` | `major` | `keystone` | `special`。無法從遊戲資料區分時請填 **`special`** 並在 `notes` 說明。
- **`notes`**：panel / node 皆為**陣列**（可為空陣列 `[]`）。
- **不要**為空格建立 node；**不要**為了「好看」合併不同 `affixId` 的列。

---

## 7. 本版明確不處理

- 從 TLIDB / icon / 文案**自動**辨識位置或連線。
- 天賦頁 UI、動畫、互動。
- `computeDerivedCombat`、左側總傷、Skill Setup。
- 玩家存檔與雲端同步格式。
- 將 example 檔混入 `data/normalized`（範例見 `data/examples/ss12/talent-panel-nodes.example.json`，**僅示意**）。

---

## 8. 待你確認的產品決策（本卡不代答）

1. **完整固定神版清單**：目前 normalized 僅列 **六基神**（與 Profession 列 href 一致）；進階職業板、第 7 塊板、是否另有「新神獨立 panel」等 — **需你補 `panelId` 清單**。
2. **新神 affix**：現僅在詞綴庫；是否建 `panel_new_god` 類節點 — **由你決定**後再寫入 `talent-panels.json` / nodes。
3. **`requires` 是否只表示直接前置**：本 repo **採用「僅直接前置」**；若要改為「必列全祖先」，需另開卡改驗證與文件。

---

## 9. 合法結構範例（片段）

```json
{
  "nodeId": "talnode:ss12:god_God_of_Might:s4",
  "panelId": "god_God_of_Might",
  "affixId": "talaffix:ss12:talent_tree:12345678",
  "x": 1,
  "y": 1,
  "slotIndex": 4,
  "nodeType": "small",
  "maxRank": 1,
  "requiresNodeIds": ["talnode:ss12:god_God_of_Might:s1"],
  "edgesTo": ["talnode:ss12:god_God_of_Might:s7"],
  "notes": []
}
```

（`affixId` 必須真實存在於 `talent-affixes.json`。）

---

## 10. 重跑驗證

```bash
npm run verify:talent-panels
```
