# Talent panels — schema notes（結構層）

## 與詞綴庫的邊界

- `talent-affixes.json`：只存詞綴內容；不得寫入座標、requires、edges。`panelHints` 不用於真實座標。
- `talent-panels.json` / `talent-panel-nodes.json`：只存面板與節點拓撲；透過 `affixId` 引用詞綴庫。

## nodeId（已定案）

格式：`talnode:{season}:{panelId}:s{slotIndex}`

- `slotIndex` = `y * 3 + x`，範圍 0–17。
- 同一 `panelId` 每格最多一個 node 時，`nodeId` 可全域唯一。

## requiresNodeIds 與 edgesTo

- `requiresNodeIds`：直接前置（不自動含所有祖先）。
- `edgesTo`：有向邊；僅限同 panel。

## nodeType

`entry` | `small` | `medium` | `major` | `keystone` | `special`。不確定時用 `special`。
