# Talent panels — schema notes（結構層）

## 與詞綴庫的邊界

- `talent-affixes.json`：只存詞綴內容；不得寫入座標、requires、edges。`panelHints` 不用於真實座標。
- `talent-panels.json` / `talent-panel-nodes.json`：只存面板與節點拓撲；透過 `affixId` 或 **`affixGameDataId`**（+ 可選 **`affixSourceTab`**）引用詞綴庫。
- 根欄位 **`readMeZh`**（可選）：僅中文說明給編輯者；**不**取代詞綴庫，前端顯示仍應 Join `talent-affixes.json`。

## nodeId（已定案，可省略）

格式：`talnode:{season}:{panelId}:s{slotIndex}`

- `slotIndex` = `y * 8 + x`，範圍 **0–39**（面板 **8×5**：`x` 0–7，`y` 0–4）。
- 省略 `nodeId` 時，驗證與引用請視為上述自動 id；`requiresNodeIds` / `edgesTo` 須與之最終一致。
- 同一 `panelId` 每格最多一個 node 時，`nodeId` 可全域唯一。

## affixPending

- **`affixPending: true`**：略過詞綴庫檢查；內部以占位 `__pending__:panelId:slot` 通過驗證。僅過渡用，對應完 `talent-affixes` 後應移除。

## affixGameDataId

- 對應 `talent-affixes.json` 的 `gameDataId`（短數字字串）。
- 若同一 `gameDataId` 對應多列（核心／天賦樹），節點須帶 **`affixSourceTab`**: `"core_talent"` | `"talent_tree"`。

## requiresNodeIds 與 edgesTo

- `requiresNodeIds`：直接前置（不自動含所有祖先）。
- `edgesTo`：有向邊；僅限同 panel。

## nodeType

`entry` | `small` | `medium` | `major` | `keystone` | `special`。不確定時用 `special`。
