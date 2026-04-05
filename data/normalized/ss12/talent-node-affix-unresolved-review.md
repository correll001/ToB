# Talent node → affix unresolved review

Generated: 2026-04-05T06:08:40.901Z
Season: ss12

---

## talnode:ss12:god_God_of_Might:s12

- **panel**: `god_God_of_Might`  **slot**: 12  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +2% Max Life
- 1.5% Life Regain

### source notes

- `tli:ss11:node_608_176:ae7e2204-25aa-4080-84b2-7ecf54ade4c2`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Might:s13

- **panel**: `god_God_of_Might`  **slot**: 13  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +4% Max Life
- +3% Life Regain

### source notes

- `tli:ss11:node_736_176:dd1c9c5c-c976-44cb-a00a-9005855e7782`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Might:s20

- **panel**: `god_God_of_Might`  **slot**: 20  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +10% Tenacity Blessing Duration
- +10% Attack Damage while Tenacity Blessing is active

### source notes

- `tli:ss11:node_608_272:f6c14181-6c42-4d62-9559-4a3b90c1cb2d`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Might:s29

- **panel**: `god_God_of_Might`  **slot**: 29  **type**: small
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_736_368:a26e269e-13e5-4923-b7d3-0eec2a57abd7`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Might:s30

- **panel**: `god_God_of_Might`  **slot**: 30  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +2% Life Regeneration Speed per stack of Tenacity Blessing owned

### source notes

- `tli:ss11:node_864_368:6fae526c-f8bb-4ebd-8f85-245009930495`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Might:s36

- **panel**: `god_God_of_Might`  **slot**: 36  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `adjudication_followup` (priority 10) — 裁決表已有 tentative / rejected，或 approved 與節點狀態不一致；需延續治理流程。

### effectLines

- +9% Attack Damage

### source notes

- `tli:ss11:node_608_464:33502b7e-1f8f-4eac-a318-d2bcd3f63e0f`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:10020400` | 10020400 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:10050100` | 10050100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:10050500` | 10050500 | talent_tree | 小型天賦 |

### 裁決表上已有列

- `adj:ss12:might:s36:tentative_alt_row` **tentative** → `talaffix:ss12:talent_tree:10050500` (manual_override_after_review)

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Might:s37

- **panel**: `god_God_of_Might`  **slot**: 37  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `adjudication_followup` (priority 10) — 裁決表已有 tentative / rejected，或 approved 與節點狀態不一致；需延續治理流程。

### effectLines

- +10% Warcry Cooldown Recovery Speed

### source notes

- `tli:ss11:node_736_464:808a3d12-3192-47d8-b61c-e42c16b38fb8`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 裁決表上已有列

- `adj:ss12:might:s37:rejected_bad_guess` **rejected** → `talaffix:ss12:talent_tree:10020400` (manual_override_after_review)

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Might:s38

- **panel**: `god_God_of_Might`  **slot**: 38  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +8% additional Attack Damage if you have used a Warcry Skill in the last 8s

### source notes

- `tli:ss11:node_864_464:6c93a505-a8f1-49b8-aa31-3e925b9d4f18`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Hunting:s4

- **panel**: `god_Goddess_of_Hunting`  **slot**: 4  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +3% Attack and Cast Speed

### source notes

- `tli:ss11:node_608_80:cd30ff9a-9643-4273-8fdb-8dc2eb892b6a`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:20020200` | 20020200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:20050100` | 20050100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:20060400` | 20060400 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Hunting:s6

- **panel**: `god_Goddess_of_Hunting`  **slot**: 6  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +6% additional Attack Speed if you have dealt a Critical Strike recently

### source notes

- `tli:ss11:node_864_80:96817188-ac05-4dc9-a258-03a768fda0ad`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Hunting:s14

- **panel**: `god_Goddess_of_Hunting`  **slot**: 14  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +6% additional Cast Speed if you have dealt a Critical Strike recently

### source notes

- `tli:ss11:node_864_176:4d662f46-b6e3-4d3e-903e-19e122046764`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Hunting:s16

- **panel**: `god_Goddess_of_Hunting`  **slot**: 16  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% damage

### source notes

- `tli:ss11:node_96_272:7a8316c6-dd21-4435-9db4-b84e501b20ca`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:20010300` | 20010300 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:20050500` | 20050500 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Hunting:s21

- **panel**: `god_Goddess_of_Hunting`  **slot**: 21  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- 1.5% Life Regain
- 1.5% Energy Shield Regain

### source notes

- `tli:ss11:node_736_272:e6be88c9-9d84-42e1-96fd-872b2bad1f95`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Hunting:s22

- **panel**: `god_Goddess_of_Hunting`  **slot**: 22  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Life Regain
- +3% Energy Shield Regain

### source notes

- `tli:ss11:node_864_272:7415bcbd-5d8a-4f3f-ac8d-bf59dd81f776`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Hunting:s25

- **panel**: `god_Goddess_of_Hunting`  **slot**: 25  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Life
- +3% Max Energy Shield

### source notes

- `tli:ss11:node_224_368:90dd00db-b920-4e36-8c72-11808fb2418a`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Hunting:s26

- **panel**: `god_Goddess_of_Hunting`  **slot**: 26  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Max Life
- +6% Max Energy Shield

### source notes

- `tli:ss11:node_352_368:0f3cebff-d79a-4c25-a572-da464ae3e0c9`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Hunting:s27

- **panel**: `god_Goddess_of_Hunting`  **slot**: 27  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +12% damage if you have defeated an enemy recently

### source notes

- `tli:ss11:node_480_368:046c229f-abf9-4cba-b044-20d2e8ff3235`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Hunting:s28

- **panel**: `god_Goddess_of_Hunting`  **slot**: 28  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +5% damage and +1% Movement Speed for 4 s on defeat. Stacks up to 8 time(s)

### source notes

- `tli:ss11:node_608_368:5320970c-e12b-4a3e-a81e-274c10e088e6`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Hunting:s29

- **panel**: `god_Goddess_of_Hunting`  **slot**: 29  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +10% Agility Blessing Duration
- +3% Attack Speed and Cast Speed when having Agility Blessing

### source notes

- `tli:ss11:node_736_368:b2ce46df-f9f2-40ae-9d5e-ba9dd99d3f9f`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Hunting:s30

- **panel**: `god_Goddess_of_Hunting`  **slot**: 30  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +1 to Max Agility Blessing Stacks

### source notes

- `tli:ss11:node_864_368:a3c38825-189e-4c42-bb38-84ff4c88f639`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Hunting:s36

- **panel**: `god_Goddess_of_Hunting`  **slot**: 36  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% damage

### source notes

- `tli:ss11:node_608_464:36fbb4cd-4571-43d9-98de-078685a69432`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:20010300` | 20010300 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:20050500` | 20050500 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Hunting:s37

- **panel**: `god_Goddess_of_Hunting`  **slot**: 37  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +10% additional damage for 4s after using Mobility Skills

### source notes

- `tli:ss11:node_736_464:af45c416-65a3-4d32-9789-90de774231e3`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Knowledge:s3

- **panel**: `god_Goddess_of_Knowledge`  **slot**: 3  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +20% Spell Critical Strike Rating
- +5% Spell Critical Strike Damage

### source notes

- `tli:ss11:node_480_80:448a7f71-728c-4724-bd6d-449bbb3a1905`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Knowledge:s11

- **panel**: `god_Goddess_of_Knowledge`  **slot**: 11  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +4% Spell Burst Charge Speed

### source notes

- `tli:ss11:node_480_176:3f2d52e5-d1df-4e6b-a3d5-514183091e97`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Knowledge:s12

- **panel**: `god_Goddess_of_Knowledge`  **slot**: 12  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +20% Spell Burst Charge Speed

### source notes

- `tli:ss11:node_608_176:e97a949f-079d-4963-b43a-79442fe8818b`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Knowledge:s18

- **panel**: `god_Goddess_of_Knowledge`  **slot**: 18  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Life
- +3% Max Energy Shield

### source notes

- `tli:ss11:node_352_272:ee84d481-267b-4ef5-85d5-4ea28716791a`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Knowledge:s19

- **panel**: `god_Goddess_of_Knowledge`  **slot**: 19  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Max Life
- +6% Max Energy Shield

### source notes

- `tli:ss11:node_480_272:f2d29564-0d2f-45e9-9336-2ad1a2791674`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Knowledge:s20

- **panel**: `god_Goddess_of_Knowledge`  **slot**: 20  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- 1.5% Life Regain
- 1.5% Energy Shield Regain

### source notes

- `tli:ss11:node_608_272:bbd0d9f7-af3e-4f5f-82e9-14d216770087`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Knowledge:s21

- **panel**: `god_Goddess_of_Knowledge`  **slot**: 21  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Life Regain
- +3% Energy Shield Regain

### source notes

- `tli:ss11:node_736_272:6ffacc5a-5cc0-4261-97c3-04efd0fd1fdd`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Knowledge:s27

- **panel**: `god_Goddess_of_Knowledge`  **slot**: 27  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +9% Tangle Damage
- +5% Tangle Duration

### source notes

- `tli:ss11:node_480_368:e67a4093-7db5-4234-a1e3-1c0abdd5a1ba`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Knowledge:s28

- **panel**: `god_Goddess_of_Knowledge`  **slot**: 28  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +2% Movement Speed for each activated Tangle

### source notes

- `tli:ss11:node_608_368:30a8bd00-1bfb-46d0-a1ac-73889f9924e6`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Knowledge:s29

- **panel**: `god_Goddess_of_Knowledge`  **slot**: 29  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +10% Focus Blessing Duration
- +10% damage while Focus Blessing is active

### source notes

- `tli:ss11:node_736_368:10011fa7-e6e4-48ff-a3cd-bfc11cbd559d`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Knowledge:s30

- **panel**: `god_Goddess_of_Knowledge`  **slot**: 30  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +1 to Max Focus Blessing Stacks

### source notes

- `tli:ss11:node_864_368:3010312f-139d-4321-b8de-966ba51610f5`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Knowledge:s37

- **panel**: `god_Goddess_of_Knowledge`  **slot**: 37  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Energy Shield

### source notes

- `tli:ss11:node_736_464:f335b50b-eff3-4600-af12-818fbed048c9`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Knowledge:s38

- **panel**: `god_Goddess_of_Knowledge`  **slot**: 38  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_864_464:7411739e-fb74-4266-ad20-39c2006ec6fb`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_War:s4

- **panel**: `god_God_of_War`  **slot**: 4  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Physical Damage

### source notes

- `tli:ss11:node_608_80:09c3e399-addc-4289-8f03-54a44a32ad6f`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:40050100` | 40050100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:40060500` | 40060500 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_War:s18

- **panel**: `god_God_of_War`  **slot**: 18  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +2% Attack Block Chance
- +2% Spell Block Chance

### source notes

- `tli:ss11:node_352_272:f6562ce9-48c7-4f8d-8d2d-d7e4265386c8`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_War:s19

- **panel**: `god_God_of_War`  **slot**: 19  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +4% Attack Block Chance
- +4% Spell Block Chance

### source notes

- `tli:ss11:node_480_272:416dfdd4-d99d-483c-940f-d703bc6237a4`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_War:s20

- **panel**: `god_God_of_War`  **slot**: 20  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- 10% chance to restore 15% of Life, Energy Shield, and Mana when Blocking

### source notes

- `tli:ss11:node_608_272:5dd0de1d-8486-48e4-899e-ff5a21eb5025`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_War:s21

- **panel**: `god_God_of_War`  **slot**: 21  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- 1.5% Life Regain
- 1.5% Energy Shield Regain

### source notes

- `tli:ss11:node_736_272:df3be116-79c9-4461-a969-c647a7fd81b5`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_War:s22

- **panel**: `god_God_of_War`  **slot**: 22  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Life Regain
- +3% Energy Shield Regain

### source notes

- `tli:ss11:node_864_272:dbffcd34-5832-4b9e-b79f-2a8ca85928ff`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_War:s27

- **panel**: `god_God_of_War`  **slot**: 27  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +3% chance to inflict Trauma

### source notes

- `tli:ss11:node_480_368:fc4a6653-a399-43c7-a38c-ec361bea223c`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_War:s28

- **panel**: `god_God_of_War`  **slot**: 28  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +8% chance to inflict Trauma
- +16% Trauma Reaping Duration

### source notes

- `tli:ss11:node_608_368:2334d044-0971-4f7f-a52d-c6e91225d746`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_War:s34

- **panel**: `god_God_of_War`  **slot**: 34  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Life
- +3% Max Energy Shield

### source notes

- `tli:ss11:node_352_464:b55b70c5-798a-460c-aae5-3bc288e4cebf`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_War:s35

- **panel**: `god_God_of_War`  **slot**: 35  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Max Life
- +6% Max Energy Shield

### source notes

- `tli:ss11:node_480_464:fd55eeb7-4789-4a11-82c0-51fb8cf11bca`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_War:s37

- **panel**: `god_God_of_War`  **slot**: 37  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Physical Damage

### source notes

- `tli:ss11:node_736_464:68150b28-6e29-47a8-b85b-b4c46e694b68`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:40050100` | 40050100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:40060500` | 40060500 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_War:s38

- **panel**: `god_God_of_War`  **slot**: 38  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +8% additional Physical Damage while having Fervor

### source notes

- `tli:ss11:node_864_464:91eaea75-f8b8-493b-a8bf-84b7337f74cb`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Deception:s2

- **panel**: `god_Goddess_of_Deception`  **slot**: 2  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% damage

### source notes

- `tli:ss11:node_352_80:193bb27c-d404-4c05-a93e-d59065d4d277`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:50010300` | 50010300 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:50030100` | 50030100 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Deception:s3

- **panel**: `god_Goddess_of_Deception`  **slot**: 3  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +100% chance to gain Blur on defeat

### source notes

- `tli:ss11:node_480_80:000e3de8-6df8-4309-ad41-ef463d7e4c9f`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Deception:s4

- **panel**: `god_Goddess_of_Deception`  **slot**: 4  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +6 Affliction inflicted per second
- +9% Damage Over Time

### source notes

- `tli:ss11:node_608_80:046b5882-aabe-4960-b1d6-7c4bcae29e78`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Deception:s5

- **panel**: `god_Goddess_of_Deception`  **slot**: 5  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +12 Affliction inflicted per second
- +18% Damage Over Time

### source notes

- `tli:ss11:node_736_80:491d6359-480c-4ce4-a9ff-e48992142d9d`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Deception:s6

- **panel**: `god_Goddess_of_Deception`  **slot**: 6  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +1 Persistent Skill Level

### source notes

- `tli:ss11:node_864_80:3cb5a00c-a27f-4b49-9245-c26c278fe27c`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Deception:s11

- **panel**: `god_Goddess_of_Deception`  **slot**: 11  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Damage Over Time

### source notes

- `tli:ss11:node_480_176:96b88dec-be90-4cea-a809-90e144bcb0a3`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:50040200` | 50040200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:50050100` | 50050100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:50050200` | 50050200 | talent_tree | 中型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Deception:s16

- **panel**: `god_Goddess_of_Deception`  **slot**: 16  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% damage

### source notes

- `tli:ss11:node_96_272:6f377312-1a41-44d4-9745-06bd30b8384e`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:50010300` | 50010300 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:50030100` | 50030100 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Deception:s20

- **panel**: `god_Goddess_of_Deception`  **slot**: 20  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Energy Shield

### source notes

- `tli:ss11:node_608_272:30fc941c-1f52-4590-9597-e92915ad470b`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Deception:s21

- **panel**: `god_Goddess_of_Deception`  **slot**: 21  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +4% Max Energy Shield
- +4% Energy Shield Charge Speed

### source notes

- `tli:ss11:node_736_272:31413933-0976-456e-8f46-47f6817ca985`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Deception:s27

- **panel**: `god_Goddess_of_Deception`  **slot**: 27  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Erosion Damage

### source notes

- `tli:ss11:node_480_368:4a776ffb-0327-41e3-b7b8-ebb506c9038e`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:50040400` | 50040400 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:50060500` | 50060500 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Deception:s28

- **panel**: `god_Goddess_of_Deception`  **slot**: 28  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +8% Deterioration Chance

### source notes

- `tli:ss11:node_608_368:9f0dc554-fb8a-47a5-a1ff-e839f981643e`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Deception:s29

- **panel**: `god_Goddess_of_Deception`  **slot**: 29  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +4% Deterioration Damage

### source notes

- `tli:ss11:node_736_368:d07527fc-2582-4d2d-8994-b86e121dbb92`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Deception:s30

- **panel**: `god_Goddess_of_Deception`  **slot**: 30  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- 10% chance to inflict 1 additional stack(s) of Deterioration
- -15% additional Deterioration Duration

### source notes

- `tli:ss11:node_864_368:f9096954-73b6-4c88-9507-1b2ee2567486`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Deception:s37

- **panel**: `god_Goddess_of_Deception`  **slot**: 37  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Erosion Damage

### source notes

- `tli:ss11:node_736_464:c76e52d7-b4c8-4c9e-8608-ff4b968eb9d1`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:50040400` | 50040400 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:50060500` | 50060500 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Goddess_of_Deception:s38

- **panel**: `god_Goddess_of_Deception`  **slot**: 38  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- 8% additional damage applied to Life

### source notes

- `tli:ss11:node_864_464:2dcb96ca-eb2e-4a5e-b884-6033ca308d9c`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Machines:s2

- **panel**: `god_God_of_Machines`  **slot**: 2  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +15% Minion Critical Strike Rating
- +6% Minion Skill Area

### source notes

- `tli:ss11:node_352_80:efc4d65a-69f3-4554-a4e1-badd0e7fb296`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Machines:s3

- **panel**: `god_God_of_Machines`  **slot**: 3  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +15% Minion Critical Strike Damage
- +12% Minion Skill Area

### source notes

- `tli:ss11:node_480_80:87f1c2e9-1114-40e1-be0b-c2a87f597561`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Machines:s4

- **panel**: `god_God_of_Machines`  **slot**: 4  **type**: medium
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_608_80:ee1582d5-af98-4251-9525-f47a6ff29ef7`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Machines:s5

- **panel**: `god_God_of_Machines`  **slot**: 5  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Minion Damage

### source notes

- `tli:ss11:node_736_80:37129fa7-e91f-478d-9671-a92d85f429b5`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:60010300` | 60010300 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:60040200` | 60040200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:60050300` | 60050300 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:60060100` | 60060100 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Machines:s6

- **panel**: `god_God_of_Machines`  **slot**: 6  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +1 Minion Skill Level

### source notes

- `tli:ss11:node_864_80:9da80b7d-8dd6-4f8d-8362-bbab2f45838e`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Machines:s11

- **panel**: `god_God_of_Machines`  **slot**: 11  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Minion Damage

### source notes

- `tli:ss11:node_480_176:0f20b291-3d3b-48c9-9317-bb365110da09`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:60010300` | 60010300 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:60040200` | 60040200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:60050300` | 60050300 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:60060100` | 60060100 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Machines:s12

- **panel**: `god_God_of_Machines`  **slot**: 12  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +6% chance for Spirit Magi to use an Enhanced Skill
- +27% Spirit Magus Ultimate Damage and Ailment Damage dealt by Ultimate.

### source notes

- `tli:ss11:node_608_176:7b2a7605-2770-48b8-9433-48896d27c202`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Machines:s14

- **panel**: `god_God_of_Machines`  **slot**: 14  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_864_176:7267de22-de30-464c-b8e5-4f5114e8131e`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Machines:s18

- **panel**: `god_God_of_Machines`  **slot**: 18  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Life
- +3% Max Energy Shield

### source notes

- `tli:ss11:node_352_272:e2999fd2-6aff-4b73-93a8-73c5c3d67b78`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Machines:s19

- **panel**: `god_God_of_Machines`  **slot**: 19  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Max Life
- +6% Max Energy Shield

### source notes

- `tli:ss11:node_480_272:15fbcd11-3d35-4a8d-8537-9dab229f9e69`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Machines:s20

- **panel**: `god_God_of_Machines`  **slot**: 20  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Minion Damage

### source notes

- `tli:ss11:node_608_272:a4760f25-bd4a-4d4d-b7fd-db031dda5c5d`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:60010300` | 60010300 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:60040200` | 60040200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:60050300` | 60050300 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:60060100` | 60060100 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Machines:s21

- **panel**: `god_God_of_Machines`  **slot**: 21  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_736_272:42feef91-b7b1-4419-a00c-c006da2f0b18`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Machines:s22

- **panel**: `god_God_of_Machines`  **slot**: 22  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_864_272:438f0111-093e-41b4-8c9b-63f54f1ca157`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Machines:s25

- **panel**: `god_God_of_Machines`  **slot**: 25  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +7% Sentry Skill Area
- +10% Sentry Duration
- 4.5% Sentry Projectile Speed

### source notes

- `tli:ss11:node_224_368:7925a88d-edd6-40ed-917e-7b02ee7ca9f1`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Machines:s26

- **panel**: `god_God_of_Machines`  **slot**: 26  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +7% Sentry Skill Area
- +20% Sentry Duration
- +9% Sentry Projectile Speed

### source notes

- `tli:ss11:node_352_368:6a9a00f8-e008-4c84-a334-31e2d27a2bf5`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Machines:s27

- **panel**: `god_God_of_Machines`  **slot**: 27  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +8% Barrier Shield

### source notes

- `tli:ss11:node_480_368:e4c52936-c5e3-4f62-9380-23f72d70be1a`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Machines:s28

- **panel**: `god_God_of_Machines`  **slot**: 28  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +16% Barrier Shield

### source notes

- `tli:ss11:node_608_368:3a5e5294-14e6-4c8c-9990-a5e27a7e21e6`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Machines:s29

- **panel**: `god_God_of_Machines`  **slot**: 29  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +4% Sentry Skill cast frequency

### source notes

- `tli:ss11:node_736_368:c91a9388-f54c-4eaa-82aa-ef6fa001b5da`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Machines:s30

- **panel**: `god_God_of_Machines`  **slot**: 30  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +8% Sentry Skill cast frequency

### source notes

- `tli:ss11:node_864_368:2b4be89d-7112-43f6-852c-18021e0fabe8`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Machines:s34

- **panel**: `god_God_of_Machines`  **slot**: 34  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +15% Sentry Skill Critical Strike Rating

### source notes

- `tli:ss11:node_352_464:1e773aeb-57de-4bed-96a4-3d3af0336d9c`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Machines:s35

- **panel**: `god_God_of_Machines`  **slot**: 35  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +20% Sentry Skill Critical Strike Rating
- +5% Sentry Skill Critical Strike Damage

### source notes

- `tli:ss11:node_480_464:5f92ae3f-c018-4778-a086-e161fdb94839`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Machines:s37

- **panel**: `god_God_of_Machines`  **slot**: 37  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +24% Sentry Damage

### source notes

- `tli:ss11:node_736_464:48dd04e8-bc6e-45e0-aa4f-ad6bf4bbc53a`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_God_of_Machines:s38

- **panel**: `god_God_of_Machines`  **slot**: 38  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +10% additional Sentry Damage if Sentry Skill is not used in the last 1 s

### source notes

- `tli:ss11:node_864_464:1bf2e7c1-befd-4139-9a2f-91c6a03e7c13`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_The_Brave:s0

- **panel**: `god_The_Brave`  **slot**: 0  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Attack Damage

### source notes

- `tli:ss11:node_96_80:7752a7c7-948f-493f-b184-d9bd38ed2850`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:11010100` | 11010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:11050100` | 11050100 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_The_Brave:s1

- **panel**: `god_The_Brave`  **slot**: 1  **type**: medium
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +18% Attack Damage

### source notes

- `tli:ss11:node_224_80:f92befa3-1a75-451d-8131-d240c4c686c8`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:11020100` | 11020100 | talent_tree | 中型天賦 |
| `talaffix:ss12:talent_tree:11060100` | 11060100 | talent_tree | 中型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_The_Brave:s4

- **panel**: `god_The_Brave`  **slot**: 4  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +9% Attack Damage when holding a One-Handed Weapon

### source notes

- `tli:ss11:node_608_80:d6c643dc-659b-4029-8433-52a7bcc5054b`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_The_Brave:s5

- **panel**: `god_The_Brave`  **slot**: 5  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +18% Attack Damage when holding a One-Handed Weapon

### source notes

- `tli:ss11:node_736_80:a21950ec-9136-4004-a855-909220cf3d34`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_The_Brave:s6

- **panel**: `god_The_Brave`  **slot**: 6  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +8% additional Attack Damage when holding a One-Handed Weapon

### source notes

- `tli:ss11:node_864_80:4aa33511-73ee-44c4-876e-af2bfaa914ff`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_The_Brave:s11

- **panel**: `god_The_Brave`  **slot**: 11  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- 1.5% Life Regain

### source notes

- `tli:ss11:node_480_176:c6143565-5a8c-4a06-9e2a-eb76048d34ae`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_The_Brave:s12

- **panel**: `god_The_Brave`  **slot**: 12  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Life Regain

### source notes

- `tli:ss11:node_608_176:1c65c1e8-6fc0-46db-87e8-90c78c117ed6`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_The_Brave:s13

- **panel**: `god_The_Brave`  **slot**: 13  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +12% damage dealt when holding a Shield
- +4% Attack Block Chance when holding a Shield

### source notes

- `tli:ss11:node_736_176:2917e102-6d38-4d53-84ca-d45265ef58d5`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_The_Brave:s14

- **panel**: `god_The_Brave`  **slot**: 14  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +5% Block Ratio when holding a Shield

### source notes

- `tli:ss11:node_864_176:c5f587c0-a312-4ef9-b293-d79f2217067b`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_The_Brave:s18

- **panel**: `god_The_Brave`  **slot**: 18  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +4% Attack Block Chance

### source notes

- `tli:ss11:node_352_272:93fd06b4-d6f1-4217-96e1-d5916588f9ae`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_The_Brave:s19

- **panel**: `god_The_Brave`  **slot**: 19  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +8% Attack Block Chance

### source notes

- `tli:ss11:node_480_272:474f06df-3aaa-4279-badc-160e62b3a429`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_The_Brave:s20

- **panel**: `god_The_Brave`  **slot**: 20  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +5% Warcry Cooldown Recovery Speed

### source notes

- `tli:ss11:node_608_272:fb815f4c-2be9-4bcf-94db-9cee5f18c18c`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_The_Brave:s21

- **panel**: `god_The_Brave`  **slot**: 21  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +6% Warcry Effect

### source notes

- `tli:ss11:node_736_272:d4d99116-12fd-40fc-93c4-8c2f68c0239f`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_The_Brave:s22

- **panel**: `god_The_Brave`  **slot**: 22  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +4 to the minimum number of enemies affected by Warcry

### source notes

- `tli:ss11:node_864_272:1ec12a31-47ac-49f9-b308-071387242e2c`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_The_Brave:s27

- **panel**: `god_The_Brave`  **slot**: 27  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +25% chance to gain 1 stacks of Tenacity Blessing when taking damage. Interval: 1 s

### source notes

- `tli:ss11:node_480_368:5d82e83e-961d-4427-af47-c35d0f0ca197`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_The_Brave:s28

- **panel**: `god_The_Brave`  **slot**: 28  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +6% Armor per stack of Tenacity Blessing owned

### source notes

- `tli:ss11:node_608_368:cef3fce5-21f5-45a3-84e8-990bc683b19d`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_The_Brave:s30

- **panel**: `god_The_Brave`  **slot**: 30  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +1% Armor for every 24 Strength

### source notes

- `tli:ss11:node_864_368:5cd05897-79f2-41e3-be3c-3461e9cb759c`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_The_Brave:s32

- **panel**: `god_The_Brave`  **slot**: 32  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +7% Armor

### source notes

- `tli:ss11:node_96_464:118a34e6-3519-4e6b-923b-cce02275888b`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:11010500` | 11010500 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:11030500` | 11030500 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_The_Brave:s34

- **panel**: `god_The_Brave`  **slot**: 34  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +7% Armor

### source notes

- `tli:ss11:node_352_464:30e1209b-0670-4015-bd82-540ad66c218f`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:11010500` | 11010500 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:11030500` | 11030500 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_The_Brave:s35

- **panel**: `god_The_Brave`  **slot**: 35  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +40% Defense gained from Chest Armor

### source notes

- `tli:ss11:node_480_464:82853e21-0969-474c-80e6-c3b182b2c9b6`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_The_Brave:s37

- **panel**: `god_The_Brave`  **slot**: 37  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +2% Elemental Resistance
- +2% Erosion Resistance

### source notes

- `tli:ss11:node_736_464:766b0638-c59d-4068-adba-e9f19b5096f4`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_The_Brave:s38

- **panel**: `god_The_Brave`  **slot**: 38  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- 0.5% Elemental Resistance per 3000 Armor. Stacks up to 6%
- 0.5% Erosion Resistance per 3000 Armor. Stacks up to 6%

### source notes

- `tli:ss11:node_864_464:aa9346f0-06cd-4043-b296-834d6e51e6cf`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Onslaughter:s4

- **panel**: `god_Onslaughter`  **slot**: 4  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +12% Attack Damage when holding a Two-Handed Weapon

### source notes

- `tli:ss11:node_608_80:b40ebe32-9df8-4e82-9288-d61e5f4b0a94`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Onslaughter:s5

- **panel**: `god_Onslaughter`  **slot**: 5  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +4% additional Base Damage for Two-Handed Weapons

### source notes

- `tli:ss11:node_736_80:c0af62c9-c92a-4e43-bf51-5c0bd1619e64`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Onslaughter:s6

- **panel**: `god_Onslaughter`  **slot**: 6  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +10% additional Base Damage for Two-Handed Weapons

### source notes

- `tli:ss11:node_864_80:51c8ab61-f80d-4acf-964e-fd75e78561b9`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Onslaughter:s13

- **panel**: `god_Onslaughter`  **slot**: 13  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +40% Attack Critical Strike Rating when holding a Two-Handed Weapon

### source notes

- `tli:ss11:node_736_176:3d09863c-5cdc-42ce-ba2e-48d7b3cbc8a4`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Onslaughter:s14

- **panel**: `god_Onslaughter`  **slot**: 14  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +80% inflicted Paralysis Effect when holding a Two-Handed Weapon

### source notes

- `tli:ss11:node_864_176:eae012a9-71c0-43b9-8b5f-8a50640f6365`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Onslaughter:s20

- **panel**: `god_Onslaughter`  **slot**: 20  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- -4% additional Physical Damage taken

### source notes

- `tli:ss11:node_608_272:451cac49-a2fb-4a0a-b267-23f78f40dd04`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Onslaughter:s21

- **panel**: `god_Onslaughter`  **slot**: 21  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- -6% additional damage taken

### source notes

- `tli:ss11:node_736_272:118c22a1-2a6a-4e4f-82b7-70c0d79ede74`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Onslaughter:s25

- **panel**: `god_Onslaughter`  **slot**: 25  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- 1.5% Life Regain

### source notes

- `tli:ss11:node_224_368:daca6b50-a6fd-4826-ba23-537baf6b1139`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Onslaughter:s26

- **panel**: `god_Onslaughter`  **slot**: 26  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Life Regain

### source notes

- `tli:ss11:node_352_368:d4e5a763-3339-4359-8a82-c79209a55e38`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Onslaughter:s27

- **panel**: `god_Onslaughter`  **slot**: 27  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +10% Tenacity Blessing Duration
- +10% Attack Damage while Tenacity Blessing is active

### source notes

- `tli:ss11:node_480_368:b73fba90-a4b6-454b-9159-b239c4b7034a`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Onslaughter:s28

- **panel**: `god_Onslaughter`  **slot**: 28  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_608_368:21fb522c-6aa2-4054-a8fc-db8887fdf901`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Onslaughter:s32

- **panel**: `god_Onslaughter`  **slot**: 32  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +9% Area Damage

### source notes

- `tli:ss11:node_96_464:64705e1e-a240-4b97-8faf-33772da1c658`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Onslaughter:s33

- **panel**: `god_Onslaughter`  **slot**: 33  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +18% Area Damage

### source notes

- `tli:ss11:node_224_464:a15177d3-0493-42ac-966c-ca1139ff8c87`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Onslaughter:s36

- **panel**: `god_Onslaughter`  **slot**: 36  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +9% Area Damage

### source notes

- `tli:ss11:node_608_464:2301b7d1-9fc4-4415-ad5a-3754c3fea7a9`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Onslaughter:s37

- **panel**: `god_Onslaughter`  **slot**: 37  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +40% Skill Area if Main Skill is not used in the last 2 s

### source notes

- `tli:ss11:node_736_464:ce7530d2-5482-4c24-b980-f6ee39b4be45`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlord:s0

- **panel**: `god_Warlord`  **slot**: 0  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Fire Damage
- +9% Minion Fire Damage

### source notes

- `tli:ss11:node_96_80:5f3d2bb8-e141-4e93-9d53-0624ab80c6f4`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:13010100` | 13010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:13040200` | 13040200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:13050100` | 13050100 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlord:s1

- **panel**: `god_Warlord`  **slot**: 1  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +18% Fire Damage
- +18% Minion Fire Damage

### source notes

- `tli:ss11:node_224_80:3dc4b295-9654-413b-badd-fe227b7fb921`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlord:s4

- **panel**: `god_Warlord`  **slot**: 4  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Fire Damage
- +9% Minion Fire Damage

### source notes

- `tli:ss11:node_608_80:461e9368-704b-4948-a3fb-92aff58285b5`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:13010100` | 13010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:13040200` | 13040200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:13050100` | 13050100 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlord:s5

- **panel**: `god_Warlord`  **slot**: 5  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_736_80:2ef381d2-59e1-4c60-990d-17f057df6e90`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlord:s11

- **panel**: `god_Warlord`  **slot**: 11  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Fire Damage
- +9% Minion Fire Damage

### source notes

- `tli:ss11:node_480_176:c07d4c3a-4e4d-47b9-9738-4a901a49b7e0`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:13010100` | 13010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:13040200` | 13040200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:13050100` | 13050100 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlord:s12

- **panel**: `god_Warlord`  **slot**: 12  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +18% Fire Damage
- +18% Minion Fire Damage

### source notes

- `tli:ss11:node_608_176:ac79eb02-ea30-445f-9ddd-cde2ca2cfd08`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlord:s14

- **panel**: `god_Warlord`  **slot**: 14  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +1% Fire Damage per 12 Strength
- +1% Minion Fire Damage per 12 Strength

### source notes

- `tli:ss11:node_864_176:dbb581da-a422-4e76-a7fd-e0b99fc7d44b`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlord:s16

- **panel**: `god_Warlord`  **slot**: 16  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Life
- +3% Max Energy Shield

### source notes

- `tli:ss11:node_96_272:bc34ec92-4af1-4291-b4cc-6b128f2c61a0`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlord:s17

- **panel**: `god_Warlord`  **slot**: 17  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Max Life
- +6% Max Energy Shield

### source notes

- `tli:ss11:node_224_272:ebd04e44-efbc-4d57-b4c5-e571239c6215`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlord:s18

- **panel**: `god_Warlord`  **slot**: 18  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- 1.5% Life Regain
- 1.5% Energy Shield Regain

### source notes

- `tli:ss11:node_352_272:4d77c4c4-eb23-46cd-a30a-0a943ca2cb7c`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlord:s19

- **panel**: `god_Warlord`  **slot**: 19  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Life Regain
- +3% Energy Shield Regain

### source notes

- `tli:ss11:node_480_272:a62f00b1-b4d6-4a13-b390-35a25da1c9c5`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlord:s20

- **panel**: `god_Warlord`  **slot**: 20  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +2% Fire Penetration against Ignited enemies
- +2% Minion Fire Penetration against Ignited enemies

### source notes

- `tli:ss11:node_608_272:884865d5-47ff-4d1c-97b2-ff43e944ded0`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlord:s21

- **panel**: `god_Warlord`  **slot**: 21  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_736_272:735f3269-712d-499b-89f4-f995bb429850`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlord:s25

- **panel**: `god_Warlord`  **slot**: 25  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +4% Fire Resistance

### source notes

- `tli:ss11:node_224_368:531325c3-a4a1-45d6-8b15-fef98639368d`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlord:s26

- **panel**: `god_Warlord`  **slot**: 26  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +4% Max Fire Resistance

### source notes

- `tli:ss11:node_352_368:1cb444ad-eb0b-4631-abce-173b7db606ad`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlord:s27

- **panel**: `god_Warlord`  **slot**: 27  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Life
- +3% Max Energy Shield

### source notes

- `tli:ss11:node_480_368:4162942a-a7a9-4b75-a41c-4557d4c69590`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlord:s28

- **panel**: `god_Warlord`  **slot**: 28  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_608_368:b17ba516-72e2-45b3-a4c8-8e2eaeae2c9d`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlord:s29

- **panel**: `god_Warlord`  **slot**: 29  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Fire Damage

### source notes

- `tli:ss11:node_736_368:c1cad1c8-5048-4af8-8844-49e66b4c030f`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:13010100` | 13010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:13040200` | 13040200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:13050100` | 13050100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:13060400` | 13060400 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlord:s30

- **panel**: `god_Warlord`  **slot**: 30  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +4% additional Fire Damage
- +8% chance to Ignite targets

### source notes

- `tli:ss11:node_864_368:e74ced0d-3e07-4f41-b01c-8cb84beb1998`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlord:s32

- **panel**: `god_Warlord`  **slot**: 32  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +9% Fire Damage Over Time
- +9% Minion Fire Damage

### source notes

- `tli:ss11:node_96_464:c0475e69-4e40-4086-b035-af7dc54864f1`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlord:s33

- **panel**: `god_Warlord`  **slot**: 33  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +18% Fire Damage Over Time
- +18% Minion Fire Damage

### source notes

- `tli:ss11:node_224_464:c090b82b-2e7f-49e7-b474-f38ab63eb4e3`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlord:s34

- **panel**: `god_Warlord`  **slot**: 34  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +3% chance to Ignite targets
- +6% Ignite chance for Minions

### source notes

- `tli:ss11:node_352_464:647f7e1a-a506-43ce-82c2-d7de1c56da62`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlord:s35

- **panel**: `god_Warlord`  **slot**: 35  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +6% chance to Ignite targets
- +12% Ignite chance for Minions

### source notes

- `tli:ss11:node_480_464:72518b7d-b5a6-4bfc-9066-052a5b1dea9b`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlord:s36

- **panel**: `god_Warlord`  **slot**: 36  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +9% Fire Damage Over Time
- +9% Minion Fire Damage

### source notes

- `tli:ss11:node_608_464:557cd666-ee10-4188-9228-31829cd09c07`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlord:s37

- **panel**: `god_Warlord`  **slot**: 37  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +15% Affliction Effect
- +15% Minion Affliction Effect
- +8 Affliction inflicted per second
- +8 Affliction inflicted per second by Minions

### source notes

- `tli:ss11:node_736_464:4f1b45d5-13f6-487d-8e79-fcc96a2cd45b`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlord:s38

- **panel**: `god_Warlord`  **slot**: 38  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_864_464:03a91170-6e37-4615-bf3a-1a8ad615224d`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warrior:s0

- **panel**: `god_Warrior`  **slot**: 0  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% damage

### source notes

- `tli:ss11:node_96_80:c3b6247d-bae6-4ebc-b681-f18c4f37c295`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:14010100` | 14010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:14050100` | 14050100 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warrior:s4

- **panel**: `god_Warrior`  **slot**: 4  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% damage

### source notes

- `tli:ss11:node_608_80:17b5f313-01cf-4932-bda5-cd0d81b5215c`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:14010100` | 14010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:14050100` | 14050100 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warrior:s5

- **panel**: `god_Warrior`  **slot**: 5  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +50% damage against Low Life enemies

### source notes

- `tli:ss11:node_736_80:912dff98-0c55-4684-a784-3c773cfe2bed`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warrior:s6

- **panel**: `god_Warrior`  **slot**: 6  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +25% additional damage against Low Life enemies

### source notes

- `tli:ss11:node_864_80:55b58010-0ff0-460f-b2d4-53d425bf65a4`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warrior:s11

- **panel**: `god_Warrior`  **slot**: 11  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- 0.3% Attack Speed for every 1% of Life lost

### source notes

- `tli:ss11:node_480_176:70536f41-a291-487b-8fc9-6423cd80d74d`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warrior:s19

- **panel**: `god_Warrior`  **slot**: 19  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- 1.5% Life Regain

### source notes

- `tli:ss11:node_480_272:b77618c9-0822-43c0-8b58-32c3b468809c`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warrior:s20

- **panel**: `god_Warrior`  **slot**: 20  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- -15% additional Life Regain Interval

### source notes

- `tli:ss11:node_608_272:b14eac88-1237-4163-a381-b56b2b17a86c`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warrior:s21

- **panel**: `god_Warrior`  **slot**: 21  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +12% damage if you have taken damage recently

### source notes

- `tli:ss11:node_736_272:a65cef38-8d60-45de-be9c-c1181215a2a9`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warrior:s22

- **panel**: `god_Warrior`  **slot**: 22  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_864_272:61ef2bb7-df2f-4e84-b2eb-dd7aedd99ca8`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warrior:s27

- **panel**: `god_Warrior`  **slot**: 27  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +3% Max Life

### source notes

- `tli:ss11:node_480_368:97cad1b9-581e-4ca4-b59e-61233af1dab1`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:14010500` | 14010500 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:14040400` | 14040400 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:14060500` | 14060500 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warrior:s28

- **panel**: `god_Warrior`  **slot**: 28  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_608_368:5c42d17e-d9f1-4d25-bbf5-eddf0178505e`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warrior:s30

- **panel**: `god_Warrior`  **slot**: 30  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +1 Max Life per 5 Strength

### source notes

- `tli:ss11:node_864_368:2432eaf4-5aab-45d9-a7db-96578fcaa9a8`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warrior:s32

- **panel**: `god_Warrior`  **slot**: 32  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +3% Max Life

### source notes

- `tli:ss11:node_96_464:39a9977d-456c-4555-af89-e57dfe5fccf7`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:14010500` | 14010500 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:14040400` | 14040400 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:14060500` | 14060500 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warrior:s34

- **panel**: `god_Warrior`  **slot**: 34  **type**: small
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_352_464:3c48cfc0-c006-4ddd-886b-3e579966f037`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warrior:s35

- **panel**: `god_Warrior`  **slot**: 35  **type**: medium
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_480_464:28b8c69b-817c-4019-893a-7c525577a232`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warrior:s36

- **panel**: `god_Warrior`  **slot**: 36  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +8% additional damage if you have lost Life recently

### source notes

- `tli:ss11:node_608_464:1840b899-5460-440b-b2bc-601b7c49402c`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warrior:s37

- **panel**: `god_Warrior`  **slot**: 37  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +3% Max Life

### source notes

- `tli:ss11:node_736_464:97d3c80a-7c52-4b31-ab83-ae998487acca`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:14010500` | 14010500 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:14040400` | 14040400 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:14060500` | 14060500 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warrior:s38

- **panel**: `god_Warrior`  **slot**: 38  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +3% Injury Buffer

### source notes

- `tli:ss11:node_864_464:ba8852ec-846a-4462-9b57-4c096f39275e`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Marksman:s0

- **panel**: `god_Marksman`  **slot**: 0  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Projectile Damage

### source notes

- `tli:ss11:node_96_80:19153e10-1549-4ac7-bc5d-2044d8e49788`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:21010100` | 21010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:21060200` | 21060200 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Marksman:s1

- **panel**: `god_Marksman`  **slot**: 1  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +18% Projectile Damage

### source notes

- `tli:ss11:node_224_80:cf4b606e-2ee0-4424-9c7b-920f16c5fb57`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Marksman:s2

- **panel**: `god_Marksman`  **slot**: 2  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- 4.5% Projectile Damage
- +3% Projectile Speed

### source notes

- `tli:ss11:node_352_80:b4004491-0d94-4bac-b0e0-76e5e96663c4`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Marksman:s6

- **panel**: `god_Marksman`  **slot**: 6  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +1 to Parabolic Projectile Splits quantity

### source notes

- `tli:ss11:node_864_80:24c9c7f3-9ef2-4803-b5d6-b72a6e0a012b`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Marksman:s11

- **panel**: `god_Marksman`  **slot**: 11  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +30% Projectile Critical Strike Rating

### source notes

- `tli:ss11:node_480_176:e6a8731b-1cae-438f-9f5d-735e65274861`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Marksman:s12

- **panel**: `god_Marksman`  **slot**: 12  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +60% Projectile Damage against enemies in proximity

### source notes

- `tli:ss11:node_608_176:729bd051-309a-4555-8528-ab22f51e1110`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Marksman:s13

- **panel**: `god_Marksman`  **slot**: 13  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Projectile Damage

### source notes

- `tli:ss11:node_736_176:95151bc6-52c3-4b18-b3f2-411eb048ac96`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:21010100` | 21010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:21060200` | 21060200 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Marksman:s14

- **panel**: `god_Marksman`  **slot**: 14  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +1 Jumps

### source notes

- `tli:ss11:node_864_176:ef9900db-191f-4bf8-badf-961cd587f3d8`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Marksman:s18

- **panel**: `god_Marksman`  **slot**: 18  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +15% Projectile Critical Strike Rating

### source notes

- `tli:ss11:node_352_272:a9754a8c-4362-427c-9a66-3f7c154cfb2e`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Marksman:s19

- **panel**: `god_Marksman`  **slot**: 19  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +15% Projectile Critical Strike Damage

### source notes

- `tli:ss11:node_480_272:ae899ab5-abcf-42aa-ba07-79b00f8e02bc`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Marksman:s21

- **panel**: `god_Marksman`  **slot**: 21  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +1% Evasion per 24 Dexterity

### source notes

- `tli:ss11:node_736_272:ce17d08f-b074-40e0-940b-e801ed5d3b34`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Marksman:s22

- **panel**: `god_Marksman`  **slot**: 22  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +2 Horizontal Projectile Penetration(s)

### source notes

- `tli:ss11:node_864_272:fe3dff6d-b74a-4d1b-8881-37d9957a14b8`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Marksman:s27

- **panel**: `god_Marksman`  **slot**: 27  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +7% Evasion

### source notes

- `tli:ss11:node_480_368:d306d6b6-6f78-42a6-b101-9f3bc954dcdd`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:21010500` | 21010500 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:21040400` | 21040400 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:21060400` | 21060400 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:21060500` | 21060500 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Marksman:s28

- **panel**: `god_Marksman`  **slot**: 28  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +12% Evasion
- +12% chance to avoid Elemental Ailments

### source notes

- `tli:ss11:node_608_368:c7b45a12-ba9d-4396-b25d-61f007318fad`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Marksman:s29

- **panel**: `god_Marksman`  **slot**: 29  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +10% Agility Blessing Duration
- +7% Evasion while Agility Blessing is active

### source notes

- `tli:ss11:node_736_368:7a7b310a-d306-41e5-8e7f-fcd4b5485b44`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Marksman:s30

- **panel**: `god_Marksman`  **slot**: 30  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +6% Evasion per stack of Agility Blessing owned

### source notes

- `tli:ss11:node_864_368:fd3ba4fa-275b-4632-9745-943508964c1b`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Marksman:s32

- **panel**: `god_Marksman`  **slot**: 32  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +7% Evasion

### source notes

- `tli:ss11:node_96_464:abf2d787-f2a8-46ec-94de-5499b8d91d77`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:21010500` | 21010500 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:21040400` | 21040400 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:21060400` | 21060400 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:21060500` | 21060500 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Marksman:s34

- **panel**: `god_Marksman`  **slot**: 34  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- 1.5% chance to avoid damage

### source notes

- `tli:ss11:node_352_464:f77a6bd2-ae08-4dc2-999a-8c7a6975625c`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Marksman:s35

- **panel**: `god_Marksman`  **slot**: 35  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +3% chance to avoid damage

### source notes

- `tli:ss11:node_480_464:dc2a9812-a7b6-433e-a233-5ee0d7edaa42`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Marksman:s37

- **panel**: `god_Marksman`  **slot**: 37  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +7% Evasion

### source notes

- `tli:ss11:node_736_464:93703f90-1b05-4c8c-b9a4-5df6ea6a7afb`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:21010500` | 21010500 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:21040400` | 21040400 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:21060400` | 21060400 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:21060500` | 21060500 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Marksman:s38

- **panel**: `god_Marksman`  **slot**: 38  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +20% additional Evasion on Spell Damage

### source notes

- `tli:ss11:node_864_464:f2f8151d-10ac-404c-913d-137f857b4274`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Bladerunner:s0

- **panel**: `god_Bladerunner`  **slot**: 0  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Attack Damage

### source notes

- `tli:ss11:node_96_80:4bbb46fa-2e9b-4cc6-976b-2e8246198d9d`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:22010100` | 22010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:22050100` | 22050100 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Bladerunner:s1

- **panel**: `god_Bladerunner`  **slot**: 1  **type**: medium
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +18% Attack Damage

### source notes

- `tli:ss11:node_224_80:03a46566-1abc-40bd-9a1b-842456029667`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:22020100` | 22020100 | talent_tree | 中型天賦 |
| `talaffix:ss12:talent_tree:22060200` | 22060200 | talent_tree | 中型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Bladerunner:s4

- **panel**: `god_Bladerunner`  **slot**: 4  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +9% Attack Damage while Dual Wielding

### source notes

- `tli:ss11:node_608_80:dd44b5b9-8785-4bde-acb6-8cb1d47761db`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Bladerunner:s5

- **panel**: `god_Bladerunner`  **slot**: 5  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +6% Attack Speed while Dual Wielding

### source notes

- `tli:ss11:node_736_80:71dc2df6-8310-466c-9473-90aad5207f1e`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Bladerunner:s6

- **panel**: `god_Bladerunner`  **slot**: 6  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +6% additional Attack Speed while Dual Wielding

### source notes

- `tli:ss11:node_864_80:09357c3d-11be-46eb-8df3-67b9820f0a89`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Bladerunner:s9

- **panel**: `god_Bladerunner`  **slot**: 9  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +3% Attack Speed

### source notes

- `tli:ss11:node_224_176:2a60f748-919b-452f-a1ce-0078a24f0ed7`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:22010500` | 22010500 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:22020200` | 22020200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:22060400` | 22060400 | talent_tree | 中型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Bladerunner:s10

- **panel**: `god_Bladerunner`  **slot**: 10  **type**: medium
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +6% Attack Speed

### source notes

- `tli:ss11:node_352_176:aec81ea9-df4c-45fb-bb71-4b7cb03c1f24`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:22020500` | 22020500 | talent_tree | 中型天賦 |
| `talaffix:ss12:talent_tree:22030200` | 22030200 | talent_tree | 中型天賦 |
| `talaffix:ss12:talent_tree:22060100` | 22060100 | talent_tree | 中型天賦 |
| `talaffix:ss12:talent_tree:22070100` | 22070100 | talent_tree | 傳奇中型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Bladerunner:s11

- **panel**: `god_Bladerunner`  **slot**: 11  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- 25% chance to gain Attack Aggression on defeat

### source notes

- `tli:ss11:node_480_176:caff28c3-dc54-496d-94fc-c83f808316be`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Bladerunner:s13

- **panel**: `god_Bladerunner`  **slot**: 13  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +18% Attack Damage while Dual Wielding

### source notes

- `tli:ss11:node_736_176:f71b2205-b8d4-49ea-be29-b44fff5d1319`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Bladerunner:s14

- **panel**: `god_Bladerunner`  **slot**: 14  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +5% additional Attack Damage for each unique type of weapon equipped while Dual Wielding

### source notes

- `tli:ss11:node_864_176:215a46f0-e815-48da-95cb-f9a4ad7f24dd`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Bladerunner:s16

- **panel**: `god_Bladerunner`  **slot**: 16  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Life
- +3% Max Energy Shield

### source notes

- `tli:ss11:node_96_272:01957ea1-3c4b-4fb6-a386-d54a90b31727`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Bladerunner:s17

- **panel**: `god_Bladerunner`  **slot**: 17  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Max Life
- +6% Max Energy Shield

### source notes

- `tli:ss11:node_224_272:d8ac2624-9e44-4bdf-9145-4936228b2b24`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Bladerunner:s18

- **panel**: `god_Bladerunner`  **slot**: 18  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- 1.5% Life Regain
- 1.5% Energy Shield Regain

### source notes

- `tli:ss11:node_352_272:3b381296-7a89-4eb3-8b1c-356e498540d0`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Bladerunner:s19

- **panel**: `god_Bladerunner`  **slot**: 19  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Life Regain
- +3% Energy Shield Regain

### source notes

- `tli:ss11:node_480_272:567fbdbc-dbc6-4f77-b163-f077d92c5e44`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Bladerunner:s21

- **panel**: `god_Bladerunner`  **slot**: 21  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- 35% of the bonuses for Movement Speed is also applied to the Cooldown Recovery Speed of Mobility skills
- 70% of the bonuses for Movement Speed is also applied to the Attack and Cast Speed of Mobility Skills

### source notes

- `tli:ss11:node_736_272:9b26e250-8f5f-4d3b-9ec4-188e3a78dccc`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Bladerunner:s22

- **panel**: `god_Bladerunner`  **slot**: 22  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_864_272:cad3a91a-df34-42bc-bad4-d3c6906bb372`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Bladerunner:s28

- **panel**: `god_Bladerunner`  **slot**: 28  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +6% chance to Multistrike
- +6% Minion Multistrike chance

### source notes

- `tli:ss11:node_608_368:47878666-0f0e-44f6-a608-4b2253cc544e`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Bladerunner:s29

- **panel**: `god_Bladerunner`  **slot**: 29  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +3% additional Attack Speed when performing Multistrikes

### source notes

- `tli:ss11:node_736_368:4ab8c0f8-ade7-4422-8bc6-d7a86b39d27e`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Bladerunner:s30

- **panel**: `god_Bladerunner`  **slot**: 30  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_864_368:f104df63-5ef7-456f-9a16-788e321bebe4`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Bladerunner:s32

- **panel**: `god_Bladerunner`  **slot**: 32  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +3% Attack Speed

### source notes

- `tli:ss11:node_96_464:c38fa48e-8c8c-4899-82dc-fcf76fb58235`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:22010500` | 22010500 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:22020200` | 22020200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:22060400` | 22060400 | talent_tree | 中型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Bladerunner:s38

- **panel**: `god_Bladerunner`  **slot**: 38  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +1% Attack and Cast Speed per 40 Dexterity

### source notes

- `tli:ss11:node_864_464:a20a79e6-bfee-4500-8627-b9ea3d671614`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Druid:s4

- **panel**: `god_Druid`  **slot**: 4  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +12% damage if you have Regained in the last 8s

### source notes

- `tli:ss11:node_608_80:75e9b1c3-4c26-4a9c-9f7d-270e053952e2`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Druid:s5

- **panel**: `god_Druid`  **slot**: 5  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +24% Attack Damage if you have Regained in the last 8s

### source notes

- `tli:ss11:node_736_80:13f8dedb-bf7c-4eca-9244-da55671d8f14`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Druid:s6

- **panel**: `god_Druid`  **slot**: 6  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +2% additional Attack Speed for each time you have Regained in the last 8s. Stacks up to 4 time(s)

### source notes

- `tli:ss11:node_864_80:cc19161c-66c4-483f-a0d9-fe1cce6686aa`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Druid:s12

- **panel**: `god_Druid`  **slot**: 12  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- -16% additional Regain Interval

### source notes

- `tli:ss11:node_608_176:0e7cd8ed-f8be-430f-ac70-538a902ca17e`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Druid:s13

- **panel**: `god_Druid`  **slot**: 13  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +24% Spell Damage if you have Regained in the last 8s

### source notes

- `tli:ss11:node_736_176:8d758996-155b-411a-8d4a-4da03840d080`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Druid:s14

- **panel**: `god_Druid`  **slot**: 14  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +2% additional Cast Speed for each time you have Regained in the last 8s. Stacks up to 4 time(s)

### source notes

- `tli:ss11:node_864_176:8c75d390-9bcf-4665-9ca3-d92cc9a6de60`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Druid:s16

- **panel**: `god_Druid`  **slot**: 16  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Life
- +3% Max Energy Shield

### source notes

- `tli:ss11:node_96_272:b99f55a9-52c2-46ea-a671-4a2e655af593`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Druid:s17

- **panel**: `god_Druid`  **slot**: 17  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Max Life
- +6% Max Energy Shield

### source notes

- `tli:ss11:node_224_272:5ae3f7b5-2d36-4660-bb56-ae1491ae7c11`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Druid:s18

- **panel**: `god_Druid`  **slot**: 18  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- 1.5% Life Regain
- 1.5% Energy Shield Regain

### source notes

- `tli:ss11:node_352_272:14dce0e0-177e-4a3e-b86d-dbd60141c1f8`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Druid:s19

- **panel**: `god_Druid`  **slot**: 19  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Life Regain
- +3% Energy Shield Regain

### source notes

- `tli:ss11:node_480_272:946abe1e-08d0-406d-bf77-de11b18c61c0`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Druid:s20

- **panel**: `god_Druid`  **slot**: 20  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_608_272:b5659991-f2fc-4fd0-ba7b-7abfcf178ebd`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Druid:s21

- **panel**: `god_Druid`  **slot**: 21  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- 1.5% Life Regain
- 1.5% Energy Shield Regain

### source notes

- `tli:ss11:node_736_272:44142cf9-b994-487c-a298-fb17a58a41eb`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Druid:s22

- **panel**: `god_Druid`  **slot**: 22  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_864_272:fe956adb-d0c9-4511-95d2-6c782bc6cd07`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Druid:s27

- **panel**: `god_Druid`  **slot**: 27  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +3% Max Life

### source notes

- `tli:ss11:node_480_368:d3135255-2386-48c7-b446-29a7acd77f1c`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:23010300` | 23010300 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:23040400` | 23040400 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Druid:s28

- **panel**: `god_Druid`  **slot**: 28  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +8% Injury Buffer if you have triggered Life Regain in the last 8s

### source notes

- `tli:ss11:node_608_368:5d474cce-a0dd-4d85-bb2b-22777734c5f4`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Druid:s35

- **panel**: `god_Druid`  **slot**: 35  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Energy Shield

### source notes

- `tli:ss11:node_480_464:97455b11-d1b7-41ae-a823-101e423cf276`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Druid:s36

- **panel**: `god_Druid`  **slot**: 36  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +8% additional Max Energy Shield if you have triggered Shield Regain in the last 8s

### source notes

- `tli:ss11:node_608_464:815d78af-49ba-4354-bd8e-31b6a733c345`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Assassin:s0

- **panel**: `god_Assassin`  **slot**: 0  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +9% Lightning Damage
- +9% Minion Lightning Damage

### source notes

- `tli:ss11:node_96_80:52759cd3-63c6-4635-a6d4-a446f40d91e2`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Assassin:s1

- **panel**: `god_Assassin`  **slot**: 1  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +18% Lightning Damage
- +18% Minion Lightning Damage

### source notes

- `tli:ss11:node_224_80:cc8f7a04-e002-4f27-8e30-fd83cb9e1e06`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Assassin:s6

- **panel**: `god_Assassin`  **slot**: 6  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +20% Numbed Effect

### source notes

- `tli:ss11:node_864_80:693e7193-d0bc-4faf-a399-1b78c8393a6e`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Assassin:s11

- **panel**: `god_Assassin`  **slot**: 11  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +9% Lightning Damage
- +9% Minion Lightning Damage

### source notes

- `tli:ss11:node_480_176:e0f81601-69cb-45c0-a3a0-20542d347bdc`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Assassin:s12

- **panel**: `god_Assassin`  **slot**: 12  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_608_176:ca07c2d0-2b4b-4b76-9812-121b6bf745f0`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Assassin:s13

- **panel**: `god_Assassin`  **slot**: 13  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Lightning Damage

### source notes

- `tli:ss11:node_736_176:46b123c7-a35c-4d13-a4ad-94b790cbc1a3`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:24010100` | 24010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:24040200` | 24040200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:24040400` | 24040400 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:24060200` | 24060200 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Assassin:s14

- **panel**: `god_Assassin`  **slot**: 14  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- -4% to the Max Life and Energy Shield thresholds for inflicting Numbed

### source notes

- `tli:ss11:node_864_176:dd4703d8-7773-4632-8a5d-ec31031d45a8`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Assassin:s16

- **panel**: `god_Assassin`  **slot**: 16  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Life
- +3% Max Energy Shield

### source notes

- `tli:ss11:node_96_272:3e2f8e90-59ba-4178-a004-7a70fc9ca68b`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Assassin:s17

- **panel**: `god_Assassin`  **slot**: 17  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Max Life
- +6% Max Energy Shield

### source notes

- `tli:ss11:node_224_272:6843e7ea-5e77-4a38-9e31-742ad124b6ee`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Assassin:s18

- **panel**: `god_Assassin`  **slot**: 18  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +4% Lightning Resistance

### source notes

- `tli:ss11:node_352_272:1876c6cb-eb6c-4500-9569-d8f390153e70`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Assassin:s19

- **panel**: `god_Assassin`  **slot**: 19  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_480_272:4bd34002-dd33-411b-871a-224aead444ed`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Assassin:s20

- **panel**: `god_Assassin`  **slot**: 20  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_608_272:a8172293-f35a-4596-ac43-d3ff25070368`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Assassin:s22

- **panel**: `god_Assassin`  **slot**: 22  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_864_272:8992ee55-e413-4f92-bb6b-d627e380219d`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Assassin:s27

- **panel**: `god_Assassin`  **slot**: 27  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Lightning Damage

### source notes

- `tli:ss11:node_480_368:13624486-f776-4922-b175-33105e12ea71`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:24010100` | 24010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:24040200` | 24040200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:24040400` | 24040400 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:24060200` | 24060200 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Assassin:s28

- **panel**: `god_Assassin`  **slot**: 28  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_608_368:7fbae268-5ec8-4f3f-a360-b7d66c5842d6`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Assassin:s29

- **panel**: `god_Assassin`  **slot**: 29  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- 1.5% Lightning Penetration
- 1.5% Lightning Penetration for Minions

### source notes

- `tli:ss11:node_736_368:79e40350-52fd-4b91-9aff-04f7faecf26d`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Assassin:s30

- **panel**: `god_Assassin`  **slot**: 30  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_864_368:59fd18a7-16f6-4275-839e-fc7e232fd2fe`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Assassin:s37

- **panel**: `god_Assassin`  **slot**: 37  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +2% additional Max Damage
- +2% additional Max Damage for Minions

### source notes

- `tli:ss11:node_736_464:46b93cb4-6b4c-408a-9bc2-2c7fb682ee30`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Assassin:s38

- **panel**: `god_Assassin`  **slot**: 38  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +12% additional Max Damage
- +12% additional Max Damage for Minions

### source notes

- `tli:ss11:node_864_464:7adee8ae-fb22-4a87-83e3-8d9a76c9c2a4`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Magister:s0

- **panel**: `god_Magister`  **slot**: 0  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Spell Damage

### source notes

- `tli:ss11:node_96_80:833c3b2e-438c-41a1-a3b0-02fb87575fd5`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:31010100` | 31010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:31060400` | 31060400 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Magister:s3

- **panel**: `god_Magister`  **slot**: 3  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +20% Spell Critical Strike Rating
- +5% Spell Critical Strike Damage

### source notes

- `tli:ss11:node_480_80:c6303554-34db-4542-9350-7105d1fadac8`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Magister:s4

- **panel**: `god_Magister`  **slot**: 4  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +4% Spell Burst Charge Speed

### source notes

- `tli:ss11:node_608_80:ad0f063c-af5d-45c8-8492-fbaa494c4dcc`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Magister:s5

- **panel**: `god_Magister`  **slot**: 5  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +8% Spell Burst Charge Speed

### source notes

- `tli:ss11:node_736_80:f25a29d2-e8fe-4bd6-92f9-f26e4342de90`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Magister:s6

- **panel**: `god_Magister`  **slot**: 6  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +1 Max Spell Burst

### source notes

- `tli:ss11:node_864_80:9f8afc67-9d6a-4e8b-adf1-e944f2a3111f`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Magister:s11

- **panel**: `god_Magister`  **slot**: 11  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +10% Focus Blessing Duration
- +10% Spell Damage when having Focus Blessing

### source notes

- `tli:ss11:node_480_176:19d94291-5f27-4413-b316-2c677c63477e`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Magister:s12

- **panel**: `god_Magister`  **slot**: 12  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_608_176:9f41281b-0bd2-477d-971f-9f8b1630f932`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Magister:s13

- **panel**: `god_Magister`  **slot**: 13  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +10% Focus Blessing Duration
- +4% Cast Speed when Focus Blessing is active

### source notes

- `tli:ss11:node_736_176:921ea180-2fb9-43cf-aff3-0405e299916e`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Magister:s14

- **panel**: `god_Magister`  **slot**: 14  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +5% Spell Critical Strike Damage per stack of Focus Blessing owned

### source notes

- `tli:ss11:node_864_176:51672ccf-d550-47d1-bbdb-c55b591d0593`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Magister:s17

- **panel**: `god_Magister`  **slot**: 17  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +6% Max Mana
- +18% Mana Regeneration Speed

### source notes

- `tli:ss11:node_224_272:a77b2399-cb53-4659-8552-5c0e42a1e61d`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Magister:s18

- **panel**: `god_Magister`  **slot**: 18  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Energy Shield

### source notes

- `tli:ss11:node_352_272:05921be6-f990-4443-98e0-2c69a3904be5`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Magister:s19

- **panel**: `god_Magister`  **slot**: 19  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_480_272:43524b8f-6efb-4aa8-abdb-5e102312c5f1`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Magister:s25

- **panel**: `god_Magister`  **slot**: 25  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +12% Spell Damage when holding a Shield

### source notes

- `tli:ss11:node_224_368:6e7616c2-c466-4740-8a35-a57d569bb2f8`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Magister:s26

- **panel**: `god_Magister`  **slot**: 26  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +24% Spell Damage when holding a Shield

### source notes

- `tli:ss11:node_352_368:a4eb1848-6a01-4ea3-9817-a4b8b3c46f32`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Magister:s27

- **panel**: `god_Magister`  **slot**: 27  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- 1.5% Energy Shield Regain

### source notes

- `tli:ss11:node_480_368:7c568351-2460-4051-9e61-15ddc0fea386`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Magister:s28

- **panel**: `god_Magister`  **slot**: 28  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- -8% additional Energy Shield Regain Interval
- +8% Energy Shield Regain

### source notes

- `tli:ss11:node_608_368:f20a2751-6fae-4f99-a534-9fa5f8a1a4e6`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Magister:s29

- **panel**: `god_Magister`  **slot**: 29  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Spell Damage

### source notes

- `tli:ss11:node_736_368:d1fdfc4f-fbed-4faf-92b9-ae3ca702f55b`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:31010100` | 31010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:31060400` | 31060400 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Magister:s30

- **panel**: `god_Magister`  **slot**: 30  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_864_368:866ff7ba-5dc3-4deb-98ea-a82ff8e146e5`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Magister:s32

- **panel**: `god_Magister`  **slot**: 32  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Energy Shield

### source notes

- `tli:ss11:node_96_464:529e9432-0f54-4ab6-88cd-eee3fcae58cb`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Magister:s33

- **panel**: `god_Magister`  **slot**: 33  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Max Energy Shield

### source notes

- `tli:ss11:node_224_464:38de5d00-fcbc-431f-a604-4e80f80b345b`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Magister:s34

- **panel**: `god_Magister`  **slot**: 34  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +4% Spell Block Chance

### source notes

- `tli:ss11:node_352_464:a5f82b19-da30-47b0-aadb-7b393355f232`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Magister:s35

- **panel**: `god_Magister`  **slot**: 35  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +12% Spell Block Chance
- +15% Energy Shield gained from Shield

### source notes

- `tli:ss11:node_480_464:0ee94417-de73-47cd-9f54-4ae722d11d21`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Magister:s36

- **panel**: `god_Magister`  **slot**: 36  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +75 Max Energy Shield

### source notes

- `tli:ss11:node_608_464:4ee7e5ea-9124-4603-9120-baa9d987e9ff`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Magister:s37

- **panel**: `god_Magister`  **slot**: 37  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +2 Max Energy Shield per 5 Intelligence

### source notes

- `tli:ss11:node_736_464:e18f39d9-5c9b-415d-a304-a92255ea4fa5`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Magister:s38

- **panel**: `god_Magister`  **slot**: 38  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_864_464:5715e908-1a83-4177-a40a-88c29ad238ac`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Arcanist:s0

- **panel**: `god_Arcanist`  **slot**: 0  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Spell Damage

### source notes

- `tli:ss11:node_96_80:748311ef-8c0b-4f1a-b95c-a11abacccc25`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:32010100` | 32010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:32060500` | 32060500 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Arcanist:s4

- **panel**: `god_Arcanist`  **slot**: 4  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +20% Attack and Cast Speed when at Full Mana
- +15% Max Mana

### source notes

- `tli:ss11:node_608_80:d2343fa7-f243-433a-8e83-fd55bc29e378`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Arcanist:s5

- **panel**: `god_Arcanist`  **slot**: 5  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +4% Max Mana

### source notes

- `tli:ss11:node_736_80:54197873-0d24-4a31-930a-45cb4e6541fa`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:32040200` | 32040200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:32050300` | 32050300 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:32060100` | 32060100 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Arcanist:s6

- **panel**: `god_Arcanist`  **slot**: 6  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- 8% of damage is taken from Mana before life

### source notes

- `tli:ss11:node_864_80:32866c65-8587-4100-92da-b666bd894693`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Arcanist:s11

- **panel**: `god_Arcanist`  **slot**: 11  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +4% Max Mana

### source notes

- `tli:ss11:node_480_176:9fc683d7-dd1b-4543-80a7-cb74d87409f3`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:32040200` | 32040200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:32050300` | 32050300 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:32060100` | 32060100 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Arcanist:s12

- **panel**: `god_Arcanist`  **slot**: 12  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +20% Spell Damage at Low Mana
- +15% Max Mana

### source notes

- `tli:ss11:node_608_176:eed82107-508e-4078-b970-195b475ebf4b`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Arcanist:s13

- **panel**: `god_Arcanist`  **slot**: 13  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +10% Focus Blessing Duration

### source notes

- `tli:ss11:node_736_176:c5c6b43f-509e-41f5-9aab-406453618e8f`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Arcanist:s14

- **panel**: `god_Arcanist`  **slot**: 14  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +1 to Max Focus Blessing Stacks

### source notes

- `tli:ss11:node_864_176:56d44de3-13ee-4d90-859a-abed84d27fb8`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Arcanist:s16

- **panel**: `god_Arcanist`  **slot**: 16  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Energy Shield

### source notes

- `tli:ss11:node_96_272:d2fb27e2-18b8-49ac-a645-1d0bfb86b284`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Arcanist:s17

- **panel**: `god_Arcanist`  **slot**: 17  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Max Energy Shield

### source notes

- `tli:ss11:node_224_272:8192637e-36a9-4629-8026-143fa1297fbf`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Arcanist:s18

- **panel**: `god_Arcanist`  **slot**: 18  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- 1.5% Energy Shield Regain

### source notes

- `tli:ss11:node_352_272:75cfc2e5-d43a-46df-a170-9fdc4f502024`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Arcanist:s19

- **panel**: `god_Arcanist`  **slot**: 19  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Energy Shield Regain

### source notes

- `tli:ss11:node_480_272:5f260f80-09b0-4175-8883-29e8f3eebfe8`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Arcanist:s20

- **panel**: `god_Arcanist`  **slot**: 20  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +4% Max Mana

### source notes

- `tli:ss11:node_608_272:4662b735-6adb-4fab-8f9e-05ec3542c3bb`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:32040200` | 32040200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:32050300` | 32050300 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:32060100` | 32060100 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Arcanist:s21

- **panel**: `god_Arcanist`  **slot**: 21  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +3% Sealed Mana Compensation

### source notes

- `tli:ss11:node_736_272:897d1b5b-9e0e-4f16-b675-dbb88c2c6d1f`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Arcanist:s27

- **panel**: `god_Arcanist`  **slot**: 27  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Energy Shield

### source notes

- `tli:ss11:node_480_368:6fd15e0c-32cd-4791-be1c-baa1afa50e86`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Arcanist:s28

- **panel**: `god_Arcanist`  **slot**: 28  **type**: medium
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_608_368:ea39b0cc-f985-4e65-86b5-45985e08d7f6`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Arcanist:s30

- **panel**: `god_Arcanist`  **slot**: 30  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +1 Mana per 6 Intelligence

### source notes

- `tli:ss11:node_864_368:1453f73a-355d-4f07-be0c-157e659e17a3`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Arcanist:s34

- **panel**: `god_Arcanist`  **slot**: 34  **type**: small
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_352_464:a3f93027-0249-4a48-b87d-28cd5dec6f7a`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Arcanist:s35

- **panel**: `god_Arcanist`  **slot**: 35  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +20% Mana Regeneration Speed

### source notes

- `tli:ss11:node_480_464:a0987878-3846-45e3-b0ac-12860480ceae`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Arcanist:s38

- **panel**: `god_Arcanist`  **slot**: 38  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +8% additional Spell Damage

### source notes

- `tli:ss11:node_864_464:4b4bbfc5-864e-469d-a0f4-98b019c4191f`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Elementalist:s0

- **panel**: `god_Elementalist`  **slot**: 0  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +9% damage for Channeled Skills

### source notes

- `tli:ss11:node_96_80:584366a1-f132-4e01-8e7b-47218918fc9c`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Elementalist:s1

- **panel**: `god_Elementalist`  **slot**: 1  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +18% damage for Channeled Skills

### source notes

- `tli:ss11:node_224_80:2eb86415-569d-47d1-80d5-30f9eac4ea1f`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Elementalist:s4

- **panel**: `god_Elementalist`  **slot**: 4  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +3% Attack and Cast Speed for Channeled Skills

### source notes

- `tli:ss11:node_608_80:0e0fa301-78ac-45a0-96c2-39447e7c9ef5`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Elementalist:s5

- **panel**: `god_Elementalist`  **slot**: 5  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +6% damage for every +1 additional Max Channeled Stack(s)

### source notes

- `tli:ss11:node_736_80:45d3773f-39f0-43c3-8efc-f546abb21180`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Elementalist:s6

- **panel**: `god_Elementalist`  **slot**: 6  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +1 to Max Channeled Stacks

### source notes

- `tli:ss11:node_864_80:4dc6ebb0-4e95-40fe-9608-248ad22634fd`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Elementalist:s11

- **panel**: `god_Elementalist`  **slot**: 11  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +9% damage for Channeled Skills

### source notes

- `tli:ss11:node_480_176:74e183c9-683b-4354-8d14-7734624306a1`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Elementalist:s12

- **panel**: `god_Elementalist`  **slot**: 12  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +60% damage while standing still

### source notes

- `tli:ss11:node_608_176:ab02be62-5133-43d8-8685-941690b651b3`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Elementalist:s13

- **panel**: `god_Elementalist`  **slot**: 13  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +12% Attack and Cast Speed when channeled stacks have not reached cap

### source notes

- `tli:ss11:node_736_176:18f0636f-ccb7-4c68-837f-5f7e7cff2885`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Elementalist:s14

- **panel**: `god_Elementalist`  **slot**: 14  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +40% additional Beam Length

### source notes

- `tli:ss11:node_864_176:b98e8340-1528-4024-9f14-161953f84ef7`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Elementalist:s16

- **panel**: `god_Elementalist`  **slot**: 16  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Life
- +3% Max Energy Shield

### source notes

- `tli:ss11:node_96_272:9896a4c1-780e-4bda-a549-38635ab797a5`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Elementalist:s17

- **panel**: `god_Elementalist`  **slot**: 17  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Max Life
- +6% Max Energy Shield

### source notes

- `tli:ss11:node_224_272:9ce437b4-3598-40a5-a7a6-6a4dc0e8f1ff`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Elementalist:s18

- **panel**: `god_Elementalist`  **slot**: 18  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +3% chance to avoid Elemental Ailments

### source notes

- `tli:ss11:node_352_272:9edcf226-9b8c-4ecb-9deb-dac79383257f`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Elementalist:s19

- **panel**: `god_Elementalist`  **slot**: 19  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +7% chance to avoid Elemental Ailments

### source notes

- `tli:ss11:node_480_272:13ee4886-939f-4859-a3fd-2cb7eb7a7915`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Elementalist:s22

- **panel**: `god_Elementalist`  **slot**: 22  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +1 Fire Skill Level

### source notes

- `tli:ss11:node_864_272:b49cc8c2-390a-4e3f-a940-2037a9dfb7cd`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Elementalist:s29

- **panel**: `god_Elementalist`  **slot**: 29  **type**: small
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_736_368:1474be7f-905c-46cd-bdf8-cec69c064170`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Elementalist:s30

- **panel**: `god_Elementalist`  **slot**: 30  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +1 Lightning Skill Level

### source notes

- `tli:ss11:node_864_368:8c2434d0-09c4-424f-9977-3bc440b73ee5`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Elementalist:s32

- **panel**: `god_Elementalist`  **slot**: 32  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +9% Elemental Damage

### source notes

- `tli:ss11:node_96_464:ee705d0c-3a50-4d65-b1e2-4adfaf9f0e9b`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Elementalist:s33

- **panel**: `god_Elementalist`  **slot**: 33  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +18% Elemental Damage

### source notes

- `tli:ss11:node_224_464:d9c88020-daf4-40df-9b56-edfa36ce5fe4`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Elementalist:s34

- **panel**: `god_Elementalist`  **slot**: 34  **type**: small
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_352_464:14829bdb-314a-48fd-ae4f-314c0979491f`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Elementalist:s35

- **panel**: `god_Elementalist`  **slot**: 35  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_480_464:a89c638f-23b9-4582-a2ad-de9be21726b4`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Elementalist:s37

- **panel**: `god_Elementalist`  **slot**: 37  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- -5% additional Elemental Damage taken for every type of Elemental Damage recently received

### source notes

- `tli:ss11:node_736_464:5fd6da2c-ee09-48bd-8556-89be8210ded8`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Elementalist:s38

- **panel**: `god_Elementalist`  **slot**: 38  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +1 Cold Skill Level

### source notes

- `tli:ss11:node_864_464:f2dc94c5-5bd6-44e7-a75d-95e87dd2e4b3`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Prophet:s0

- **panel**: `god_Prophet`  **slot**: 0  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Cold Damage

### source notes

- `tli:ss11:node_96_80:51848901-d03e-46e9-afb2-0263792163db`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:34010100` | 34010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:34010500` | 34010500 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:34060500` | 34060500 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Prophet:s1

- **panel**: `god_Prophet`  **slot**: 1  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +18% Cold Damage

### source notes

- `tli:ss11:node_224_80:a687a5a9-fbf0-43a8-8b4a-a3a5413fa8d0`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Prophet:s4

- **panel**: `god_Prophet`  **slot**: 4  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +2 to Max Frostbite Rating

### source notes

- `tli:ss11:node_608_80:25f48b83-8d30-4483-83fc-1176e91876e0`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Prophet:s5

- **panel**: `god_Prophet`  **slot**: 5  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +5 to Max Frostbite Rating

### source notes

- `tli:ss11:node_736_80:c82c2359-34ec-420b-8e07-701678f828e1`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Prophet:s6

- **panel**: `god_Prophet`  **slot**: 6  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +10% additional damage against Frozen enemies

### source notes

- `tli:ss11:node_864_80:03ca5d25-a030-4d1f-82cd-99967e6b77bb`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Prophet:s11

- **panel**: `god_Prophet`  **slot**: 11  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_480_176:7b8d08e0-70f0-4075-98a2-006c7e309762`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Prophet:s12

- **panel**: `god_Prophet`  **slot**: 12  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +20% Critical Strike Rating against Frostbitten enemies

### source notes

- `tli:ss11:node_608_176:05761575-59e6-4627-bb35-bd2b6cfbf3fc`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Prophet:s13

- **panel**: `god_Prophet`  **slot**: 13  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +20% Critical Strike Damage against Frostbitten enemies

### source notes

- `tli:ss11:node_736_176:a1070035-4a94-4c54-8620-5e0717e13dbb`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Prophet:s14

- **panel**: `god_Prophet`  **slot**: 14  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +100 Critical Strike Rating against Frostbitten enemies

### source notes

- `tli:ss11:node_864_176:03333c9e-51e0-4576-89a9-6de9f64f8002`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Prophet:s16

- **panel**: `god_Prophet`  **slot**: 16  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Life
- +3% Max Energy Shield

### source notes

- `tli:ss11:node_96_272:67e7815d-34c6-4fa4-85b6-c2e5bb216cf6`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Prophet:s17

- **panel**: `god_Prophet`  **slot**: 17  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Max Life
- +6% Max Energy Shield

### source notes

- `tli:ss11:node_224_272:7f06a64f-4ce9-4cdf-8ada-1f8f20397380`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Prophet:s18

- **panel**: `god_Prophet`  **slot**: 18  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +4% Cold Resistance

### source notes

- `tli:ss11:node_352_272:adc81923-446d-4d87-9427-f6b43bc8f181`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Prophet:s19

- **panel**: `god_Prophet`  **slot**: 19  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +18% Cold Resistance

### source notes

- `tli:ss11:node_480_272:bf68d89e-5095-48a6-8835-7c02196d55ec`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Prophet:s27

- **panel**: `god_Prophet`  **slot**: 27  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- 1.5% Life Regain
- 1.5% Energy Shield Regain

### source notes

- `tli:ss11:node_480_368:5fd5c8d8-d585-478c-9dc3-2cdbfa56f383`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Prophet:s28

- **panel**: `god_Prophet`  **slot**: 28  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Life Regain
- +3% Energy Shield Regain

### source notes

- `tli:ss11:node_608_368:a81cedbd-0602-486b-a61b-3532010364cf`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Prophet:s29

- **panel**: `god_Prophet`  **slot**: 29  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +10% Focus Blessing Duration
- +10% damage while Focus Blessing is active

### source notes

- `tli:ss11:node_736_368:1384ff61-035e-46b0-a1ff-c8348def3790`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Prophet:s30

- **panel**: `god_Prophet`  **slot**: 30  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +100% chance to gain a stack of Focus Blessing upon inflicting damage to a Frostbitten enemy. Interval: 0.1s

### source notes

- `tli:ss11:node_864_368:09ea2028-dcde-4857-9f88-d914d2a879d0`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Prophet:s32

- **panel**: `god_Prophet`  **slot**: 32  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +9% Cold Damage
- +9% Minion Cold Damage

### source notes

- `tli:ss11:node_96_464:16b3bed4-bf8b-4cbd-a67a-bf64441af100`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Prophet:s33

- **panel**: `god_Prophet`  **slot**: 33  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +18% Cold Damage
- +18% Minion Cold Damage

### source notes

- `tli:ss11:node_224_464:b621e20d-700e-4bb0-911c-5f65cb72aa54`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Prophet:s35

- **panel**: `god_Prophet`  **slot**: 35  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- 1.5% Cold Penetration
- 1.5% Cold Penetration for Minions

### source notes

- `tli:ss11:node_480_464:dacb4f90-c97c-4ea9-b041-a6e79467ba90`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Prophet:s36

- **panel**: `god_Prophet`  **slot**: 36  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_608_464:f4e564fe-b535-4271-929d-e951a7511bd4`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Prophet:s37

- **panel**: `god_Prophet`  **slot**: 37  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +9% Cold Damage
- +9% Minion Cold Damage

### source notes

- `tli:ss11:node_736_464:af8d3eb3-d7e5-4c53-8134-7110e0419756`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Prophet:s38

- **panel**: `god_Prophet`  **slot**: 38  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_864_464:e39ca625-42ce-4085-99e5-a5e06eeba021`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowdancer:s0

- **panel**: `god_Shadowdancer`  **slot**: 0  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +9% Physical Damage
- +9% Physical Damage for Minions

### source notes

- `tli:ss11:node_96_80:95bb3733-65f5-413b-9151-6d0d19a1555a`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowdancer:s1

- **panel**: `god_Shadowdancer`  **slot**: 1  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +18% Physical Damage
- +18% Physical Damage for Minions

### source notes

- `tli:ss11:node_224_80:7d5dd2d2-4083-448a-8e2a-8b144664a735`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowdancer:s4

- **panel**: `god_Shadowdancer`  **slot**: 4  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +9% Physical Damage
- +9% Physical Damage for Minions

### source notes

- `tli:ss11:node_608_80:f0afcc5a-167f-47c5-b006-f03e36ffb901`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowdancer:s5

- **panel**: `god_Shadowdancer`  **slot**: 5  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +22% Physical Damage
- -12% Elemental Damage
- +22% Physical Damage for Minions

### source notes

- `tli:ss11:node_736_80:2f8ad85d-654d-4569-896a-11a74e03abca`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowdancer:s9

- **panel**: `god_Shadowdancer`  **slot**: 9  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +3% chance to inflict Trauma
- +6% chance for Minions to inflict Trauma

### source notes

- `tli:ss11:node_224_176:320b93d4-c0c8-4da3-9cb0-b7a4c0b21ae2`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowdancer:s10

- **panel**: `god_Shadowdancer`  **slot**: 10  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +6% chance to inflict Trauma
- +12% chance for Minions to inflict Trauma

### source notes

- `tli:ss11:node_352_176:7b3cdf76-9c73-4725-9af7-2affcdc9cfc4`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowdancer:s12

- **panel**: `god_Shadowdancer`  **slot**: 12  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +9% Armor
- +9% Evasion
- -4% additional Physical Damage taken

### source notes

- `tli:ss11:node_608_176:69b3aa2b-0728-43d7-9493-9e8e956cd2a5`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowdancer:s13

- **panel**: `god_Shadowdancer`  **slot**: 13  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +9% Physical Damage
- +9% Physical Damage for Minions

### source notes

- `tli:ss11:node_736_176:d3fd7283-0220-445a-a349-15c971f8d7c2`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowdancer:s14

- **panel**: `god_Shadowdancer`  **slot**: 14  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +8% Armor DMG Mitigation Penetration
- +8% Armor DMG Mitigation Penetration for Minions

### source notes

- `tli:ss11:node_864_176:1d4d9d27-db70-4a53-99c4-7a4b20be10ac`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowdancer:s18

- **panel**: `god_Shadowdancer`  **slot**: 18  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Energy Shield

### source notes

- `tli:ss11:node_352_272:5a77d64a-707d-470a-9bb0-4de077b9b34c`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowdancer:s19

- **panel**: `god_Shadowdancer`  **slot**: 19  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Max Energy Shield

### source notes

- `tli:ss11:node_480_272:a158b59b-3b0d-4126-94d2-e908d07c6c3a`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowdancer:s21

- **panel**: `god_Shadowdancer`  **slot**: 21  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +9% Trauma Damage

### source notes

- `tli:ss11:node_736_272:46390b04-7ba8-49ad-a744-e2339a61d2db`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowdancer:s22

- **panel**: `god_Shadowdancer`  **slot**: 22  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +12% additional Trauma Damage dealt by Critical Strikes

### source notes

- `tli:ss11:node_864_272:4d978345-6466-4070-8f19-35d860d14732`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowdancer:s26

- **panel**: `god_Shadowdancer`  **slot**: 26  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_352_368:8ffdc69f-7d0b-4214-9c67-d4d9b4d033cc`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowdancer:s27

- **panel**: `god_Shadowdancer`  **slot**: 27  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +4% Fervor effect

### source notes

- `tli:ss11:node_480_368:03b4e7b0-0ac5-4628-89eb-99c24422b974`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowdancer:s28

- **panel**: `god_Shadowdancer`  **slot**: 28  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +1% Movement Speed per 10 Fervor Rating

### source notes

- `tli:ss11:node_608_368:1fea20f4-17df-45cb-a024-6c833f7ed153`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowdancer:s37

- **panel**: `god_Shadowdancer`  **slot**: 37  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +9% damage for Triggered Skills

### source notes

- `tli:ss11:node_736_464:029d568e-8646-4adf-92da-af5347a430fd`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowdancer:s38

- **panel**: `god_Shadowdancer`  **slot**: 38  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +50% chance to Weaken nearby enemies when triggering any skill

### source notes

- `tli:ss11:node_864_464:dc008f24-8ec6-4d67-b3a4-5d252cebb1b3`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ronin:s0

- **panel**: `god_Ronin`  **slot**: 0  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Melee Damage

### source notes

- `tli:ss11:node_96_80:4dbf9a3f-c8c2-4724-9073-13821dc025e2`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:42010100` | 42010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:42060200` | 42060200 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ronin:s4

- **panel**: `god_Ronin`  **slot**: 4  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +6% Attack Speed
- -6% Melee Damage

### source notes

- `tli:ss11:node_608_80:76c3f91b-8f8b-4c13-8792-8fbf0fd02c9b`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ronin:s5

- **panel**: `god_Ronin`  **slot**: 5  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +32% chance to Multistrike

### source notes

- `tli:ss11:node_736_80:335498dc-242c-461f-bb36-55ee22679eb3`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ronin:s6

- **panel**: `god_Ronin`  **slot**: 6  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +12% Steep Strike chance.

### source notes

- `tli:ss11:node_864_80:86fbbb20-87c0-455b-adcc-71126b77088c`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ronin:s13

- **panel**: `god_Ronin`  **slot**: 13  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Melee Damage

### source notes

- `tli:ss11:node_736_176:608d9ac8-1edd-4d4f-82b7-2323622d37fa`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:42010100` | 42010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:42060200` | 42060200 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ronin:s14

- **panel**: `god_Ronin`  **slot**: 14  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +33% Demolisher Charge Restoration Speed

### source notes

- `tli:ss11:node_864_176:8e58c88a-178a-4d3e-8a62-bfaa23b2fdc7`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ronin:s16

- **panel**: `god_Ronin`  **slot**: 16  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Life
- +3% Max Energy Shield

### source notes

- `tli:ss11:node_96_272:26924371-1bf2-4bb2-b92e-ba8e9c3d03d6`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ronin:s17

- **panel**: `god_Ronin`  **slot**: 17  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Max Life
- +6% Max Energy Shield

### source notes

- `tli:ss11:node_224_272:a9d3aceb-6dfa-41be-b5cd-bd1f2f68dbc8`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ronin:s18

- **panel**: `god_Ronin`  **slot**: 18  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +2% Attack Block Chance
- +2% Spell Block Chance

### source notes

- `tli:ss11:node_352_272:02ec9b15-bb48-4bc6-9a93-760d35f6c471`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ronin:s19

- **panel**: `god_Ronin`  **slot**: 19  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +4% Attack Block Chance
- +4% Spell Block Chance

### source notes

- `tli:ss11:node_480_272:84e42fbc-1d8c-465f-a62a-52a52fef3cf4`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ronin:s21

- **panel**: `god_Ronin`  **slot**: 21  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_736_272:f2890888-73f4-45d5-bfba-1fa1a0104a7c`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ronin:s22

- **panel**: `god_Ronin`  **slot**: 22  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- Shadow Quantity +1

### source notes

- `tli:ss11:node_864_272:65d9219d-afae-4558-8027-4bb27f9ffb47`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ronin:s28

- **panel**: `god_Ronin`  **slot**: 28  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- 1.5% Life Regain
- 1.5% Energy Shield Regain

### source notes

- `tli:ss11:node_608_368:b8b5bde4-e13f-4af7-ac6c-e54265f9aba7`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ronin:s29

- **panel**: `god_Ronin`  **slot**: 29  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Life Regain
- +3% Energy Shield Regain

### source notes

- `tli:ss11:node_736_368:5b69aadd-6957-4d7e-a721-0718b1309ab0`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ronin:s36

- **panel**: `god_Ronin`  **slot**: 36  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +4% Fervor effect

### source notes

- `tli:ss11:node_608_464:2c876090-8842-42c2-9ffe-d22473580069`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ronin:s37

- **panel**: `god_Ronin`  **slot**: 37  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +8% Fervor effect

### source notes

- `tli:ss11:node_736_464:c2bca996-96c7-429a-a91c-42ce90753be4`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ronin:s38

- **panel**: `god_Ronin`  **slot**: 38  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +20% Fervor effect

### source notes

- `tli:ss11:node_864_464:bd384b4c-afe9-4610-89e8-2149c14c167e`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ranger:s0

- **panel**: `god_Ranger`  **slot**: 0  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +15% Critical Strike Rating

### source notes

- `tli:ss11:node_96_80:df42ba07-ce8c-46c8-ab48-915f6687aebf`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:43010100` | 43010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:43050300` | 43050300 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ranger:s4

- **panel**: `god_Ranger`  **slot**: 4  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +4% Fervor effect

### source notes

- `tli:ss11:node_608_80:0fa8708a-675a-4dc6-8f3e-2adfe54b1a99`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ranger:s5

- **panel**: `god_Ranger`  **slot**: 5  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- 0.5% Critical Strike Damage per Fervor Rating

### source notes

- `tli:ss11:node_736_80:f6af9c6a-a8ef-4e9b-8d47-c454402d8ad7`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ranger:s11

- **panel**: `god_Ranger`  **slot**: 11  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- 100% chance to gain Agility Blessing on Critical Strike

### source notes

- `tli:ss11:node_480_176:347c5558-7d4e-4329-98fa-b5fcd3dcb772`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ranger:s13

- **panel**: `god_Ranger`  **slot**: 13  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% damage

### source notes

- `tli:ss11:node_736_176:438afa1f-a164-42a3-a46e-7f1cc2f7e929`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:43010500` | 43010500 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:43060200` | 43060200 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ranger:s14

- **panel**: `god_Ranger`  **slot**: 14  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_864_176:35002324-466b-428c-bb8b-d18f07acdefe`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ranger:s16

- **panel**: `god_Ranger`  **slot**: 16  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Life
- +3% Max Energy Shield

### source notes

- `tli:ss11:node_96_272:0d76f889-b5d6-4e9a-be28-c3c476ed3c0d`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ranger:s17

- **panel**: `god_Ranger`  **slot**: 17  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Max Life
- +6% Max Energy Shield

### source notes

- `tli:ss11:node_224_272:f49f5086-bb7f-4ca9-967b-ea2adfe789b4`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ranger:s18

- **panel**: `god_Ranger`  **slot**: 18  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +2% Attack Block Chance
- +2% Spell Block Chance

### source notes

- `tli:ss11:node_352_272:d79717c6-9de5-4ba3-b747-8b87da1a5491`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ranger:s19

- **panel**: `god_Ranger`  **slot**: 19  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +4% Attack Block Chance
- +4% Spell Block Chance

### source notes

- `tli:ss11:node_480_272:13c859c3-09be-469a-bd9b-a4cdaef5acea`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ranger:s20

- **panel**: `god_Ranger`  **slot**: 20  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +15% Critical Strike Rating

### source notes

- `tli:ss11:node_608_272:9c1bebcb-d756-456d-83fe-27f5f2a079a4`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:43010100` | 43010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:43050300` | 43050300 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ranger:s21

- **panel**: `god_Ranger`  **slot**: 21  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +25% chance to Mark the enemy on Critical Strike
- +20% Mark effect

### source notes

- `tli:ss11:node_736_272:3e3b0744-52a7-4051-b18d-7ed4d02fdea1`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ranger:s25

- **panel**: `god_Ranger`  **slot**: 25  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +25% damage dealt to Nearby enemies

### source notes

- `tli:ss11:node_224_368:c2438096-79f1-476c-8b65-a62de618b3b1`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ranger:s26

- **panel**: `god_Ranger`  **slot**: 26  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +9% Area Damage

### source notes

- `tli:ss11:node_352_368:dc3ebd59-0158-4cae-830b-3e48577773a3`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ranger:s27

- **panel**: `god_Ranger`  **slot**: 27  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +18% Area Damage

### source notes

- `tli:ss11:node_480_368:1e4a6d64-11c3-48c5-838a-4fe132217c7a`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ranger:s30

- **panel**: `god_Ranger`  **slot**: 30  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +10% additional damage taken by enemies in Proximity

### source notes

- `tli:ss11:node_864_368:a0dc6a26-8388-479c-91f9-0d03f4352f42`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ranger:s32

- **panel**: `god_Ranger`  **slot**: 32  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% damage

### source notes

- `tli:ss11:node_96_464:c043277a-f797-4979-95f6-862c99def3dd`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:43010500` | 43010500 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:43060200` | 43060200 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ranger:s33

- **panel**: `god_Ranger`  **slot**: 33  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +25% damage to Distant enemies

### source notes

- `tli:ss11:node_224_464:2cd30779-e01a-483b-953d-4df6fe88a596`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ranger:s34

- **panel**: `god_Ranger`  **slot**: 34  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- 4.5% Projectile Damage
- +3% Projectile Speed

### source notes

- `tli:ss11:node_352_464:6a9d5ea3-f04d-4a6b-9685-cf09e8d14eed`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ranger:s36

- **panel**: `god_Ranger`  **slot**: 36  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +10% Knockback Chance

### source notes

- `tli:ss11:node_608_464:048d8fcc-f5c1-4fd3-8cc5-52d69e85b467`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ranger:s37

- **panel**: `god_Ranger`  **slot**: 37  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +15% Knockback distance

### source notes

- `tli:ss11:node_736_464:e6c00007-029f-4591-a813-66716116e795`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Ranger:s38

- **panel**: `god_Ranger`  **slot**: 38  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- 120% of the increase/decrease on Knockback distance is also applied to damage bonus

### source notes

- `tli:ss11:node_864_464:7d018eed-6ac4-4aed-b71a-c9d284a2259d`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Sentinel:s4

- **panel**: `god_Sentinel`  **slot**: 4  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +2% Attack Block Chance
- +2% Spell Block Chance

### source notes

- `tli:ss11:node_608_80:74f84645-652a-412b-980c-580cd9d25df2`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Sentinel:s5

- **panel**: `god_Sentinel`  **slot**: 5  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_736_80:92a07c4e-dce7-410e-abaf-b1f3ab24aac2`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Sentinel:s11

- **panel**: `god_Sentinel`  **slot**: 11  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +12% damage dealt when holding a Shield

### source notes

- `tli:ss11:node_480_176:50310b22-b9dd-4d3b-af01-2825905ead44`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Sentinel:s12

- **panel**: `god_Sentinel`  **slot**: 12  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +12% damage dealt when holding a Shield
- +4% Attack and Cast Speed when holding a Shield

### source notes

- `tli:ss11:node_608_176:6a996501-e886-46be-9127-7d83eca9592d`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Sentinel:s13

- **panel**: `god_Sentinel`  **slot**: 13  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Life
- +3% Max Energy Shield

### source notes

- `tli:ss11:node_736_176:d6d8df8b-ab4e-42e4-8f7d-269b2563ea03`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Sentinel:s14

- **panel**: `god_Sentinel`  **slot**: 14  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +5% Block Ratio

### source notes

- `tli:ss11:node_864_176:0f43b233-68ab-44df-8c4d-e685513d45f5`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Sentinel:s16

- **panel**: `god_Sentinel`  **slot**: 16  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Life
- +3% Max Energy Shield

### source notes

- `tli:ss11:node_96_272:ee0d3ea2-4511-46cf-a65a-7a7a923bcb4a`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Sentinel:s17

- **panel**: `god_Sentinel`  **slot**: 17  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Max Life
- +6% Max Energy Shield

### source notes

- `tli:ss11:node_224_272:86775d00-b78d-4a28-bfd0-d1ed3cb4a1eb`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Sentinel:s18

- **panel**: `god_Sentinel`  **slot**: 18  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- 1.5% Life Regain
- 1.5% Energy Shield Regain

### source notes

- `tli:ss11:node_352_272:1b17a521-641b-4946-ba29-4860e9007cb9`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Sentinel:s19

- **panel**: `god_Sentinel`  **slot**: 19  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Life Regain

### source notes

- `tli:ss11:node_480_272:897fb906-0742-4795-ae6f-a9c327464e01`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Sentinel:s22

- **panel**: `god_Sentinel`  **slot**: 22  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +35% Armor if you have Blocked recently

### source notes

- `tli:ss11:node_864_272:5d223c4f-2f08-4129-ba42-1433dc45b809`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Sentinel:s25

- **panel**: `god_Sentinel`  **slot**: 25  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +4% Spell Block Chance

### source notes

- `tli:ss11:node_224_368:1afba1ae-e54c-4882-9935-d23ab96fe1ba`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Sentinel:s26

- **panel**: `god_Sentinel`  **slot**: 26  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +8% Spell Block Chance

### source notes

- `tli:ss11:node_352_368:0d6acc4d-fd12-48b0-afda-d5c7b027d1dd`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Sentinel:s27

- **panel**: `god_Sentinel`  **slot**: 27  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Energy Shield Regain

### source notes

- `tli:ss11:node_480_368:c75f22bf-f81f-4d61-ab64-8677957ba688`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Sentinel:s29

- **panel**: `god_Sentinel`  **slot**: 29  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +2% Attack Block Chance
- +2% Spell Block Chance

### source notes

- `tli:ss11:node_736_368:d1e84251-7a1d-4312-bf62-2c6b49640ac1`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Sentinel:s30

- **panel**: `god_Sentinel`  **slot**: 30  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +4% Attack Block Chance
- +4% Spell Block Chance
- +40% damage if you have Blocked recently

### source notes

- `tli:ss11:node_864_368:2de221c3-af17-49fd-b2c1-9d700c871fa3`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Sentinel:s32

- **panel**: `god_Sentinel`  **slot**: 32  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +2% Attack Block Chance
- +6% damage

### source notes

- `tli:ss11:node_96_464:a6c2e4d6-34e9-4106-bf03-a6f45e56eb2e`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Sentinel:s33

- **panel**: `god_Sentinel`  **slot**: 33  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +4% Attack Block Chance
- +12% damage

### source notes

- `tli:ss11:node_224_464:47429daf-e630-4987-bdf2-261f371e54a4`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Sentinel:s35

- **panel**: `god_Sentinel`  **slot**: 35  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +3 Defensive Skill Level

### source notes

- `tli:ss11:node_480_464:bea3ad3b-6bd2-4d0a-9584-6717221fea48`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Sentinel:s36

- **panel**: `god_Sentinel`  **slot**: 36  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +4% Defense when holding a Shield

### source notes

- `tli:ss11:node_608_464:1b589525-e6a6-4a04-bd35-d6c4ab2f7b34`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Sentinel:s37

- **panel**: `god_Sentinel`  **slot**: 37  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +40% Defense from Shield

### source notes

- `tli:ss11:node_736_464:0f65177a-4d41-4fc4-bcd9-b307bf269844`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowmaster:s0

- **panel**: `god_Shadowmaster`  **slot**: 0  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Erosion Damage
- +9% Minion Erosion Damage

### source notes

- `tli:ss11:node_96_80:9e41d8da-1d61-46b0-aac6-4768f91d07dc`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:51010100` | 51010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:51040200` | 51040200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:51050300` | 51050300 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:51060400` | 51060400 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowmaster:s1

- **panel**: `god_Shadowmaster`  **slot**: 1  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +18% Erosion Damage
- +18% Minion Erosion Damage

### source notes

- `tli:ss11:node_224_80:ad3d0b59-28e9-44b7-94a3-1694d974879a`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowmaster:s4

- **panel**: `god_Shadowmaster`  **slot**: 4  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Erosion Damage

### source notes

- `tli:ss11:node_608_80:35edd954-327e-4380-8d94-deb70cd81a00`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:51010100` | 51010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:51040200` | 51040200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:51050100` | 51050100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:51050300` | 51050300 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:51060400` | 51060400 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowmaster:s5

- **panel**: `god_Shadowmaster`  **slot**: 5  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- 6% chance to inflict 1 additional stack(s) of Wilt

### source notes

- `tli:ss11:node_736_80:2ad52772-1929-46fd-91a6-a68ab7df5871`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowmaster:s6

- **panel**: `god_Shadowmaster`  **slot**: 6  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- 1.2% Erosion Damage per stack of Wilt inflicted, stacking up to 60 times

### source notes

- `tli:ss11:node_864_80:f6365a35-058e-4897-9ac1-bd78deb56dd6`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowmaster:s11

- **panel**: `god_Shadowmaster`  **slot**: 11  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Erosion Damage
- +9% Minion Erosion Damage

### source notes

- `tli:ss11:node_480_176:32cd7fa3-4ed1-4b0b-8821-6219bb73bbb9`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:51010100` | 51010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:51040200` | 51040200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:51050300` | 51050300 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:51060400` | 51060400 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowmaster:s12

- **panel**: `god_Shadowmaster`  **slot**: 12  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_608_176:ce3bd75c-c192-4965-a671-7aba28df8593`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowmaster:s13

- **panel**: `god_Shadowmaster`  **slot**: 13  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +8% Deterioration Chance

### source notes

- `tli:ss11:node_736_176:d2461422-510f-44f1-8821-b37797ddf02a`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowmaster:s14

- **panel**: `god_Shadowmaster`  **slot**: 14  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +8% additional Deterioration Damage
- +5% additional Deterioration Duration

### source notes

- `tli:ss11:node_864_176:097bae08-c186-40e2-b69b-ff33b8e3a5e4`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowmaster:s16

- **panel**: `god_Shadowmaster`  **slot**: 16  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Energy Shield
- +3% Max Life

### source notes

- `tli:ss11:node_96_272:18b5d39a-36bf-432b-9ece-f769723d381e`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowmaster:s17

- **panel**: `god_Shadowmaster`  **slot**: 17  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Max Energy Shield
- +6% Max Life

### source notes

- `tli:ss11:node_224_272:d54a8a29-56f1-4a22-8015-56350a716de3`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowmaster:s18

- **panel**: `god_Shadowmaster`  **slot**: 18  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +4% Erosion Resistance

### source notes

- `tli:ss11:node_352_272:248cea08-7537-4a19-b2aa-27cbf4a4ffe1`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowmaster:s19

- **panel**: `god_Shadowmaster`  **slot**: 19  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_480_272:4933f996-ec31-4a71-886f-beb6ec9c67fd`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowmaster:s20

- **panel**: `god_Shadowmaster`  **slot**: 20  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Erosion Damage
- +9% Minion Erosion Damage

### source notes

- `tli:ss11:node_608_272:17495765-a3ee-43f5-8a31-64bc7486c885`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:51010100` | 51010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:51040200` | 51040200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:51050300` | 51050300 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:51060400` | 51060400 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowmaster:s21

- **panel**: `god_Shadowmaster`  **slot**: 21  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +1 Erosion Skill Level

### source notes

- `tli:ss11:node_736_272:996192fe-dfe1-4488-8029-87b22de5f783`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowmaster:s25

- **panel**: `god_Shadowmaster`  **slot**: 25  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +4% Deterioration Chance

### source notes

- `tli:ss11:node_224_368:8a061a60-d7dd-4c26-be11-60853bc51ad7`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowmaster:s26

- **panel**: `god_Shadowmaster`  **slot**: 26  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +8% Deterioration Damage

### source notes

- `tli:ss11:node_352_368:fe32a419-f695-4403-8ab5-de8739fa21f8`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowmaster:s27

- **panel**: `god_Shadowmaster`  **slot**: 27  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- 1.5% Life Regain
- 1.5% Energy Shield Regain

### source notes

- `tli:ss11:node_480_368:65a8261c-e6dc-4ad7-87b1-51757d83a9b6`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowmaster:s28

- **panel**: `god_Shadowmaster`  **slot**: 28  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Life Regain
- +3% Energy Shield Regain

### source notes

- `tli:ss11:node_608_368:8b6e40b9-04bd-4396-a669-9907a6e30d72`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowmaster:s29

- **panel**: `god_Shadowmaster`  **slot**: 29  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Erosion Damage
- +9% Minion Erosion Damage

### source notes

- `tli:ss11:node_736_368:b401326a-806b-4d1f-ba4b-aca40466399c`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:51010100` | 51010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:51040200` | 51040200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:51050300` | 51050300 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:51060400` | 51060400 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowmaster:s30

- **panel**: `god_Shadowmaster`  **slot**: 30  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_864_368:d38a16aa-20ba-4d1b-9b8c-dec1b751691e`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowmaster:s32

- **panel**: `god_Shadowmaster`  **slot**: 32  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +3% Wilt chance

### source notes

- `tli:ss11:node_96_464:872098b0-2d68-416a-884e-7923a71a0e4c`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowmaster:s33

- **panel**: `god_Shadowmaster`  **slot**: 33  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +6% Wilt chance

### source notes

- `tli:ss11:node_224_464:a9c31e5c-7133-4c20-a03c-9e50aeabfd75`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowmaster:s35

- **panel**: `god_Shadowmaster`  **slot**: 35  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +3% Wilt chance

### source notes

- `tli:ss11:node_480_464:2531993e-7fae-4852-8728-5824568bdb07`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowmaster:s36

- **panel**: `god_Shadowmaster`  **slot**: 36  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +12% Wilt chance
- +6%  Wilt  Duration

### source notes

- `tli:ss11:node_608_464:6105b0bf-6220-4efe-a1d9-b43978e42a64`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Shadowmaster:s37

- **panel**: `god_Shadowmaster`  **slot**: 37  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_736_464:23bf7078-f1a9-4d43-b1b5-207318cd4547`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Psychic:s0

- **panel**: `god_Psychic`  **slot**: 0  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Damage Over Time

### source notes

- `tli:ss11:node_96_80:a8403ce6-76aa-41d2-9bbf-3266b2888742`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:52010100` | 52010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:52050500` | 52050500 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Psychic:s1

- **panel**: `god_Psychic`  **slot**: 1  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +18% Damage Over Time

### source notes

- `tli:ss11:node_224_80:ee8afce1-882c-4cff-a921-18d279422aa2`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Psychic:s2

- **panel**: `god_Psychic`  **slot**: 2  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +9% Terra Skill Damage

### source notes

- `tli:ss11:node_352_80:fc05657e-6dc9-446e-9414-4f2a6ba6be03`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Psychic:s3

- **panel**: `god_Psychic`  **slot**: 3  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +18% Terra Skill Damage

### source notes

- `tli:ss11:node_480_80:636887c2-b484-49ca-a062-5ac670011ea1`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Psychic:s4

- **panel**: `god_Psychic`  **slot**: 4  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +6% Reaping Recovery Speed

### source notes

- `tli:ss11:node_608_80:c37c3668-faa1-4169-9d05-c9741e4113cc`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Psychic:s5

- **panel**: `god_Psychic`  **slot**: 5  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +12% Reaping Recovery Speed

### source notes

- `tli:ss11:node_736_80:cdd83566-115d-4574-ba8f-cf525232dbce`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Psychic:s6

- **panel**: `god_Psychic`  **slot**: 6  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_864_80:a8c2d6cb-58f4-483a-aadb-dbd8b4ca141d`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Psychic:s10

- **panel**: `god_Psychic`  **slot**: 10  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +4% Skill Effect Duration

### source notes

- `tli:ss11:node_352_176:3c7c2256-54a2-4c23-b492-cb85a4adbe5b`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Psychic:s11

- **panel**: `god_Psychic`  **slot**: 11  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +12% Terra Charge Recovery Speed

### source notes

- `tli:ss11:node_480_176:100351ec-d6c2-4bc4-a3c9-3508a099d250`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Psychic:s13

- **panel**: `god_Psychic`  **slot**: 13  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +6 Affliction inflicted per second
- +6% Affliction Effect

### source notes

- `tli:ss11:node_736_176:7647c454-6733-4e0f-9f89-b6d2313cfdc2`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Psychic:s14

- **panel**: `god_Psychic`  **slot**: 14  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +18 Affliction inflicted per second
- -8% All Resistance when the enemy has max Affliction

### source notes

- `tli:ss11:node_864_176:b68c2f3e-4ac2-411e-b193-f747b7faceb2`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Psychic:s16

- **panel**: `god_Psychic`  **slot**: 16  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Energy Shield

### source notes

- `tli:ss11:node_96_272:33c7ba47-04fc-4ed6-8cac-decd23a8e91c`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Psychic:s17

- **panel**: `god_Psychic`  **slot**: 17  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Max Energy Shield

### source notes

- `tli:ss11:node_224_272:ac9b773b-cdbf-43a1-bd9c-3725ed9ef8d5`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Psychic:s21

- **panel**: `god_Psychic`  **slot**: 21  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- 1.5% Blur Effect

### source notes

- `tli:ss11:node_736_272:04e64740-6194-4f94-8408-e31269cab6e9`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Psychic:s22

- **panel**: `god_Psychic`  **slot**: 22  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +10% Movement Speed while Blur is active

### source notes

- `tli:ss11:node_864_272:06547751-0d3b-4f48-9dea-310aa5ad9e8a`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Psychic:s26

- **panel**: `god_Psychic`  **slot**: 26  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +3% Injury Buffer

### source notes

- `tli:ss11:node_352_368:5983a74a-6e07-4112-a947-2876e19080ce`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Psychic:s27

- **panel**: `god_Psychic`  **slot**: 27  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +6% Reaping Duration

### source notes

- `tli:ss11:node_480_368:5948b516-7006-4fd0-bfd6-b4f6d9b2a34c`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Psychic:s28

- **panel**: `god_Psychic`  **slot**: 28  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +12% Reaping Duration

### source notes

- `tli:ss11:node_608_368:30a26d6a-cf2e-48c0-9667-4e8ab06655b1`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Psychic:s29

- **panel**: `god_Psychic`  **slot**: 29  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +5% chance to gain Blur when Reaping

### source notes

- `tli:ss11:node_736_368:2efb42d4-4c75-4584-bc2a-bb5516681e3f`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Psychic:s34

- **panel**: `god_Psychic`  **slot**: 34  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +6% Affliction Effect

### source notes

- `tli:ss11:node_352_464:51b6ba97-9c8f-4479-b667-48c5ed4466dd`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Psychic:s35

- **panel**: `god_Psychic`  **slot**: 35  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +12% Affliction Effect

### source notes

- `tli:ss11:node_480_464:991b8a24-d11c-413c-b40e-589efcd032f7`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Psychic:s36

- **panel**: `god_Psychic`  **slot**: 36  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Damage Over Time

### source notes

- `tli:ss11:node_608_464:e17093a5-0f34-4358-b5d6-919c39cf7f7b`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:52010100` | 52010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:52050500` | 52050500 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Psychic:s37

- **panel**: `god_Psychic`  **slot**: 37  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_736_464:2df6398e-6784-4996-83da-15b20af8e052`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s0

- **panel**: `god_Warlock`  **slot**: 0  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% damage
- +9% Minion Damage

### source notes

- `tli:ss11:node_96_80:78c19efc-04ea-4941-a42e-1fffe9c26b19`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:53010100` | 53010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:53060400` | 53060400 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s2

- **panel**: `god_Warlock`  **slot**: 2  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +8% damage against Cursed enemies
- +8% Curse Skill Area

### source notes

- `tli:ss11:node_352_80:9f1b1492-1e15-484f-bc8f-3504fe6f3c1e`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s3

- **panel**: `god_Warlock`  **slot**: 3  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +16% damage against Cursed enemies
- +16% Curse Skill Area

### source notes

- `tli:ss11:node_480_80:4317f4d8-bec0-4f51-8410-4149d038b7a3`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s4

- **panel**: `god_Warlock`  **slot**: 4  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_608_80:6ee0d579-4ba1-4988-8f06-81b5c9d6e9e7`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s6

- **panel**: `god_Warlock`  **slot**: 6  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +5% chance to inflict Slow on hit

### source notes

- `tli:ss11:node_864_80:7472ff70-8864-4315-aa1d-3ec06702f59d`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s9

- **panel**: `god_Warlock`  **slot**: 9  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +6% Affliction Effect

### source notes

- `tli:ss11:node_224_176:cd4f3ea5-3e8a-4d44-86b4-7c22d21985d7`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s10

- **panel**: `god_Warlock`  **slot**: 10  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- -4 Skill Cost
- +12% Affliction Effect

### source notes

- `tli:ss11:node_352_176:7f4b86a9-5d62-4136-8cec-ca07d7169cde`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s11

- **panel**: `god_Warlock`  **slot**: 11  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +4% Curse Effect

### source notes

- `tli:ss11:node_480_176:7451bf5f-adc0-499c-8987-462a0c669cf4`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s12

- **panel**: `god_Warlock`  **slot**: 12  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +8% additional damage against Cursed enemies

### source notes

- `tli:ss11:node_608_176:7443c860-74fa-4325-84ae-14347d530862`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s13

- **panel**: `god_Warlock`  **slot**: 13  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +2% Crowd Control Effects

### source notes

- `tli:ss11:node_736_176:256b3c84-f8e1-46e9-a1e2-f52b9ed406fc`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s14

- **panel**: `god_Warlock`  **slot**: 14  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +20% chance to Blind the target on hit
- +25% Critical Strike Damage Mitigation against Blinded enemies

### source notes

- `tli:ss11:node_864_176:d9ab1048-8d0c-4769-9707-8b3a2a75003f`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s16

- **panel**: `god_Warlock`  **slot**: 16  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Life
- +3% Max Energy Shield

### source notes

- `tli:ss11:node_96_272:ae89035f-b638-417b-9d4c-828f8c7edd55`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s17

- **panel**: `god_Warlock`  **slot**: 17  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Max Life
- +6% Max Energy Shield

### source notes

- `tli:ss11:node_224_272:00b3e1e6-a6d7-418c-bc87-b726fac2e8c9`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s18

- **panel**: `god_Warlock`  **slot**: 18  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +3% chance to avoid Elemental Ailments

### source notes

- `tli:ss11:node_352_272:230215e8-a080-4953-8b44-46c4d8bb021a`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s19

- **panel**: `god_Warlock`  **slot**: 19  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +20% chance to avoid Elemental Ailments

### source notes

- `tli:ss11:node_480_272:dd73557d-e433-401c-bf1c-b6edf9ab474b`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s20

- **panel**: `god_Warlock`  **slot**: 20  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- 1.5% Blur Effect

### source notes

- `tli:ss11:node_608_272:836eec9e-16f7-49ac-9095-10a0ee1cffdb`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s21

- **panel**: `god_Warlock`  **slot**: 21  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +10% chance to gain Blur when inflicting crowd control effects

### source notes

- `tli:ss11:node_736_272:468ceeb6-8513-4511-84bc-27d536af301f`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s25

- **panel**: `god_Warlock`  **slot**: 25  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +3% chance to inflict Damaging Ailments
- +6% chance for Minions to inflict Damaging Ailments

### source notes

- `tli:ss11:node_224_368:ea6f6fd4-14e1-4912-a55f-5e0462e4c1ff`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s26

- **panel**: `god_Warlock`  **slot**: 26  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +6% chance to inflict Damaging Ailments
- +12% chance for Minions to inflict Damaging Ailments

### source notes

- `tli:ss11:node_352_368:dbadee8a-8c28-4675-9304-af490ae1944c`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s27

- **panel**: `god_Warlock`  **slot**: 27  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +6% Affliction Effect

### source notes

- `tli:ss11:node_480_368:71dc2911-8925-4d44-9c37-7ed19d2682a9`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s28

- **panel**: `god_Warlock`  **slot**: 28  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +12% Affliction Effect

### source notes

- `tli:ss11:node_608_368:571e81e0-b21a-4f10-8a05-5c0a50afdc15`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s29

- **panel**: `god_Warlock`  **slot**: 29  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% damage
- +9% Minion Damage

### source notes

- `tli:ss11:node_736_368:4c9e38d4-2020-48d2-bdaa-ae8d117e9d05`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:53010100` | 53010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:53060400` | 53060400 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s30

- **panel**: `god_Warlock`  **slot**: 30  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_864_368:8bbf2097-12a2-40a8-bbf3-0d73cde6ebc7`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s32

- **panel**: `god_Warlock`  **slot**: 32  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +9% Ailment Damage

### source notes

- `tli:ss11:node_96_464:95666bd6-72ed-4aa7-9a7c-f3f63bccc53b`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s33

- **panel**: `god_Warlock`  **slot**: 33  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +18% Ailment Damage

### source notes

- `tli:ss11:node_224_464:394f076c-8eda-4f76-acde-17d234275edd`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s35

- **panel**: `god_Warlock`  **slot**: 35  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +20% Critical Strike Rating
- +20% Minion Critical Strike Rating
- +14% Critical Strike Damage against enemies affected by Ailments
- +14% Minion Critical Strike Damage against enemies affected by Ailments

### source notes

- `tli:ss11:node_480_464:3e48dfb1-55a3-4cbc-9e38-e55fe0855229`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s36

- **panel**: `god_Warlock`  **slot**: 36  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +9% Ailment Damage

### source notes

- `tli:ss11:node_608_464:a665ba92-705c-45b4-815c-0dd14118d77a`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Warlock:s37

- **panel**: `god_Warlock`  **slot**: 37  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_736_464:0677b381-0c47-4449-ad27-be082cd6ff63`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Lich:s0

- **panel**: `god_Lich`  **slot**: 0  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% damage
- +9% Minion Damage

### source notes

- `tli:ss11:node_96_80:cc17d81a-e90a-46d2-85c8-8f92e18990bf`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:54010100` | 54010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:54050100` | 54050100 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Lich:s4

- **panel**: `god_Lich`  **slot**: 4  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% damage
- +9% Minion Damage

### source notes

- `tli:ss11:node_608_80:9b0bdf48-b86b-4a52-a0cf-cf8e7b927e6b`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:54010100` | 54010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:54050100` | 54050100 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Lich:s5

- **panel**: `god_Lich`  **slot**: 5  **type**: medium
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +6% Attack and Cast Speed
- +6% Minion Attack and Cast Speed

### source notes

- `tli:ss11:node_736_80:d449983d-6fff-48ff-822b-5342dcca9567`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:54030400` | 54030400 | talent_tree | 中型天賦 |
| `talaffix:ss12:talent_tree:54060100` | 54060100 | talent_tree | 中型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Lich:s6

- **panel**: `god_Lich`  **slot**: 6  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +1 to All Skills' Levels

### source notes

- `tli:ss11:node_864_80:f5e4be5d-759f-4be4-86fe-2946e3416504`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Lich:s9

- **panel**: `god_Lich`  **slot**: 9  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +6% Affliction Effect

### source notes

- `tli:ss11:node_224_176:9597d59c-4c0e-44b3-9282-95487d4b79bf`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Lich:s10

- **panel**: `god_Lich`  **slot**: 10  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- -4 Skill Cost
- +12% Affliction Effect

### source notes

- `tli:ss11:node_352_176:39090e4c-c4d4-4b57-8bfe-e11ad606b3ea`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Lich:s11

- **panel**: `god_Lich`  **slot**: 11  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +5 to All Stats

### source notes

- `tli:ss11:node_480_176:19529ebe-3086-4d4d-97a4-a78553eebdc7`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Lich:s12

- **panel**: `god_Lich`  **slot**: 12  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +10 to All Stats

### source notes

- `tli:ss11:node_608_176:db1ff632-1502-4503-9ddf-2865d232f203`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Lich:s13

- **panel**: `god_Lich`  **slot**: 13  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- 1.5% Cooldown Recovery Speed

### source notes

- `tli:ss11:node_736_176:2b46ea1a-fe9f-43ee-b873-9860f6cd14d3`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Lich:s14

- **panel**: `god_Lich`  **slot**: 14  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +8% Cooldown Recovery Speed
- +1 Max Charges

### source notes

- `tli:ss11:node_864_176:a86384fd-9545-41ba-bcfe-d391c378ee3d`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Lich:s16

- **panel**: `god_Lich`  **slot**: 16  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Life
- +3% Max Energy Shield

### source notes

- `tli:ss11:node_96_272:a292cd18-ca17-4ed7-8845-16b2898564ed`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Lich:s17

- **panel**: `god_Lich`  **slot**: 17  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Max Life
- +6% Max Energy Shield

### source notes

- `tli:ss11:node_224_272:e2bd33c6-3097-473b-8d5e-0f6f964099b9`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Lich:s18

- **panel**: `god_Lich`  **slot**: 18  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +3% Max Energy Shield
- +3% Energy Shield Charge Speed

### source notes

- `tli:ss11:node_352_272:aa6fdcc2-976e-49b2-8f09-a91ff36d0b78`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Lich:s19

- **panel**: `god_Lich`  **slot**: 19  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +10% Max Energy Shield

### source notes

- `tli:ss11:node_480_272:f2df7308-f02a-42a0-b221-02f7a58c0956`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Lich:s21

- **panel**: `god_Lich`  **slot**: 21  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +4% Skill Effect Duration

### source notes

- `tli:ss11:node_736_272:fc90181e-df07-4a1a-8301-10e014b1d15b`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Lich:s27

- **panel**: `god_Lich`  **slot**: 27  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- 1.5% Blur Effect

### source notes

- `tli:ss11:node_480_368:862be2ee-200d-414b-8cdf-8d4cd1970064`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Lich:s28

- **panel**: `god_Lich`  **slot**: 28  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- 0.2% Blur effect for every 1% of Life lost

### source notes

- `tli:ss11:node_608_368:4259abe5-9599-48f3-944b-22d7a952e7f6`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Lich:s29

- **panel**: `god_Lich`  **slot**: 29  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Life
- +3% Max Energy Shield

### source notes

- `tli:ss11:node_736_368:36af749d-d02b-4f6c-92a8-33a987e75207`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Lich:s30

- **panel**: `god_Lich`  **slot**: 30  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +10% additional damage when having both Sealed Mana and Life

### source notes

- `tli:ss11:node_864_368:63d985d3-491a-4993-bc56-d6e6c70e246d`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Lich:s36

- **panel**: `god_Lich`  **slot**: 36  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- 1.5% Sealed Mana Compensation

### source notes

- `tli:ss11:node_608_464:5774a20b-a962-4dcc-865b-a0568fa2698c`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Lich:s37

- **panel**: `god_Lich`  **slot**: 37  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +3% Sealed Mana Compensation

### source notes

- `tli:ss11:node_736_464:39667dad-e209-4140-a8da-4565914f7958`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Lich:s38

- **panel**: `god_Lich`  **slot**: 38  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +8% Sealed Mana Compensation

### source notes

- `tli:ss11:node_864_464:dd37a090-49f3-4d12-919b-5c4f54d59120`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Machinist:s0

- **panel**: `god_Machinist`  **slot**: 0  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Minion Damage

### source notes

- `tli:ss11:node_96_80:6f6c9918-0172-4c68-a901-6414ce8d4c9c`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:61010100` | 61010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:61050100` | 61050100 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Machinist:s4

- **panel**: `god_Machinist`  **slot**: 4  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Minion Damage

### source notes

- `tli:ss11:node_608_80:80b661cf-46d6-4247-9aa9-841af811c99d`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:61010100` | 61010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:61050100` | 61050100 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Machinist:s5

- **panel**: `god_Machinist`  **slot**: 5  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +4% chance for Synthetic Troop Minions to deal Double Damage

### source notes

- `tli:ss11:node_736_80:6c856dfc-395f-4d77-9ac6-2bf3fabc7f22`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Machinist:s6

- **panel**: `god_Machinist`  **slot**: 6  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +1 Synthetic Troop Skill Level

### source notes

- `tli:ss11:node_864_80:cec7a645-d2c0-4853-b7cf-1ad40085c660`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Machinist:s12

- **panel**: `god_Machinist`  **slot**: 12  **type**: small
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_608_176:9ef32cae-b3bd-4630-be8e-de21def670fe`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Machinist:s13

- **panel**: `god_Machinist`  **slot**: 13  **type**: medium
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_736_176:e64a558e-a773-4fac-8055-f3fd17127ba3`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Machinist:s14

- **panel**: `god_Machinist`  **slot**: 14  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +1% Minion Attack and Cast Speed for every 2 Command owned

### source notes

- `tli:ss11:node_864_176:7c9b5e63-ed5b-40b6-8f0e-48e2f7ced6c3`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Machinist:s16

- **panel**: `god_Machinist`  **slot**: 16  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Life
- +3% Max Energy Shield

### source notes

- `tli:ss11:node_96_272:719598aa-d265-435d-8134-39891d65531e`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Machinist:s17

- **panel**: `god_Machinist`  **slot**: 17  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Max Life
- +6% Max Energy Shield

### source notes

- `tli:ss11:node_224_272:a34437c2-ec9d-4209-a0e6-d74a245c75f8`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Machinist:s18

- **panel**: `god_Machinist`  **slot**: 18  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +7% Minion Max Life

### source notes

- `tli:ss11:node_352_272:2c10693b-7683-431b-8f5c-89c41da84700`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Machinist:s19

- **panel**: `god_Machinist`  **slot**: 19  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +14% Minion Max Life

### source notes

- `tli:ss11:node_480_272:fbfb70dc-f44a-4290-943b-6c2a18c966cd`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Machinist:s20

- **panel**: `god_Machinist`  **slot**: 20  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +3% Minion Life Regeneration Speed

### source notes

- `tli:ss11:node_608_272:49b2a85b-e442-459c-a3e7-e60ae1363aa8`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Machinist:s21

- **panel**: `god_Machinist`  **slot**: 21  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +6% Minion Life Regeneration Speed

### source notes

- `tli:ss11:node_736_272:cd95443c-a0bc-4da7-b212-5c44c39061fd`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Machinist:s27

- **panel**: `god_Machinist`  **slot**: 27  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +8% Minion Damage
- +12% chance for Minions to inflict Damaging Ailments

### source notes

- `tli:ss11:node_480_368:89f1a0ef-6618-43ce-8877-2ea71235e05a`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Machinist:s28

- **panel**: `god_Machinist`  **slot**: 28  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +16% Minion Damage
- +24% chance for Minions to inflict Damaging Ailments

### source notes

- `tli:ss11:node_608_368:36557cc0-bc71-4699-997d-96d00b56c8d8`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Machinist:s29

- **panel**: `god_Machinist`  **slot**: 29  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_736_368:99cec3c3-b793-453a-a180-4e9b647b8627`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Machinist:s34

- **panel**: `god_Machinist`  **slot**: 34  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +2% Max Energy Shield
- +2% Energy Shield Charge Speed

### source notes

- `tli:ss11:node_352_464:35a0cfaf-3205-43aa-9193-3d4228076cb1`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Machinist:s35

- **panel**: `god_Machinist`  **slot**: 35  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +4% Max Energy Shield
- +4% Energy Shield Charge Speed

### source notes

- `tli:ss11:node_480_464:c3c616dc-8a0f-40c1-8111-d0fa4dcacac5`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Machinist:s36

- **panel**: `god_Machinist`  **slot**: 36  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +12% Minion Damage if a Synthetic Troop Skill has been cast recently

### source notes

- `tli:ss11:node_608_464:9d7c5858-6bda-411e-858c-f709d61a358c`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Machinist:s37

- **panel**: `god_Machinist`  **slot**: 37  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +8% additional Minion Damage if a Synthetic Troop Skill has been cast recently

### source notes

- `tli:ss11:node_736_464:a68e4dcf-234d-40a5-9956-6c3678dc18d2`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Steel_Vanguard:s0

- **panel**: `god_Steel_Vanguard`  **slot**: 0  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% damage
- +9% Minion Damage

### source notes

- `tli:ss11:node_96_80:5054314d-40dd-41b1-ae25-0ad60dd64e71`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:62010100` | 62010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:62040200` | 62040200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:62060200` | 62060200 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Steel_Vanguard:s4

- **panel**: `god_Steel_Vanguard`  **slot**: 4  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +2% Aura Effect

### source notes

- `tli:ss11:node_608_80:63d06d41-8bc8-4b3d-bfac-ffe35ad2ee5a`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Steel_Vanguard:s5

- **panel**: `god_Steel_Vanguard`  **slot**: 5  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +3% Aura Effect

### source notes

- `tli:ss11:node_736_80:bce54eb0-05ac-41c7-a5ec-ac58414b8ff7`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Steel_Vanguard:s11

- **panel**: `god_Steel_Vanguard`  **slot**: 11  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% damage
- +9% Minion Damage

### source notes

- `tli:ss11:node_480_176:57b5d0ba-33f8-4a65-9a90-3adea3a05164`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:62010100` | 62010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:62040200` | 62040200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:62060200` | 62060200 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Steel_Vanguard:s12

- **panel**: `god_Steel_Vanguard`  **slot**: 12  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +1 Empower Skill Level

### source notes

- `tli:ss11:node_608_176:293b5089-4ed8-4f08-b40b-ed9b13f0cdf1`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Steel_Vanguard:s13

- **panel**: `god_Steel_Vanguard`  **slot**: 13  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% damage
- +9% Minion Damage

### source notes

- `tli:ss11:node_736_176:43c4f669-2c36-424a-a73b-fba89a9c9e42`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:62010100` | 62010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:62040200` | 62040200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:62060200` | 62060200 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Steel_Vanguard:s14

- **panel**: `god_Steel_Vanguard`  **slot**: 14  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- 8% additional damage applied to Life

### source notes

- `tli:ss11:node_864_176:3a51e576-229d-42cf-947b-5fb2d7a73879`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Steel_Vanguard:s16

- **panel**: `god_Steel_Vanguard`  **slot**: 16  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Life
- +3% Max Energy Shield

### source notes

- `tli:ss11:node_96_272:f042b246-08fb-4211-9431-73f60c1c815b`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Steel_Vanguard:s17

- **panel**: `god_Steel_Vanguard`  **slot**: 17  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Max Life
- +6% Max Energy Shield

### source notes

- `tli:ss11:node_224_272:7e0cecbd-a880-4998-9f7f-b1b99e9a4c58`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Steel_Vanguard:s18

- **panel**: `god_Steel_Vanguard`  **slot**: 18  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- 1.5% Life Regain
- 1.5% Energy Shield Regain

### source notes

- `tli:ss11:node_352_272:c53be152-c28f-4b57-9831-152a83f083aa`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Steel_Vanguard:s19

- **panel**: `god_Steel_Vanguard`  **slot**: 19  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Life Regain
- +3% Energy Shield Regain

### source notes

- `tli:ss11:node_480_272:5785e6bc-0be0-4f67-b8d1-562d98fd5727`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Steel_Vanguard:s20

- **panel**: `god_Steel_Vanguard`  **slot**: 20  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- 4.5% Focus Speed

### source notes

- `tli:ss11:node_608_272:92f157d5-3587-4b58-988e-17759e7f2fc9`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Steel_Vanguard:s21

- **panel**: `god_Steel_Vanguard`  **slot**: 21  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +9% Focus Speed

### source notes

- `tli:ss11:node_736_272:bd9061fc-9873-40a2-8680-6d879891dcf6`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Steel_Vanguard:s22

- **panel**: `god_Steel_Vanguard`  **slot**: 22  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +1 Focus Skill Level

### source notes

- `tli:ss11:node_864_272:57fcb9e7-eb50-4a45-9a06-801a5d21d252`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Steel_Vanguard:s25

- **panel**: `god_Steel_Vanguard`  **slot**: 25  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +4% Erosion Resistance

### source notes

- `tli:ss11:node_224_368:ad1060f5-949f-4448-8b70-c1cf2c4260ef`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Steel_Vanguard:s26

- **panel**: `god_Steel_Vanguard`  **slot**: 26  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +8% Erosion Resistance

### source notes

- `tli:ss11:node_352_368:dc49169a-6b76-4159-848e-f2e900e7e433`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Steel_Vanguard:s30

- **panel**: `god_Steel_Vanguard`  **slot**: 30  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +40% Barrier Shield

### source notes

- `tli:ss11:node_864_368:7dbb6b95-1bff-455b-80aa-58dade19a800`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Steel_Vanguard:s33

- **panel**: `god_Steel_Vanguard`  **slot**: 33  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +4% Elemental Resistance

### source notes

- `tli:ss11:node_224_464:242b523f-c06a-40a7-bc0e-c4da33cf1180`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Steel_Vanguard:s34

- **panel**: `god_Steel_Vanguard`  **slot**: 34  **type**: small
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_352_464:fa391b77-6a18-410d-93d7-c3a679680680`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Steel_Vanguard:s35

- **panel**: `god_Steel_Vanguard`  **slot**: 35  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +1% Restoration Skill Effect for every 2% of Life lost

### source notes

- `tli:ss11:node_480_464:283ceaa4-2d3a-44e0-90bc-4667e5cb5f49`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Steel_Vanguard:s36

- **panel**: `god_Steel_Vanguard`  **slot**: 36  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- -4% additional Elemental Damage taken

### source notes

- `tli:ss11:node_608_464:a1f552ed-bced-431f-8da1-bfd0ba3774a2`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Steel_Vanguard:s37

- **panel**: `god_Steel_Vanguard`  **slot**: 37  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_736_464:43c495da-026a-433b-8ed9-fdb92a33eb56`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Alchemist:s0

- **panel**: `god_Alchemist`  **slot**: 0  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Minion Damage
- +9% damage

### source notes

- `tli:ss11:node_96_80:7a5c7c78-b74e-4b4d-81c2-b692d8aecffd`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:63010100` | 63010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:63060300` | 63060300 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Alchemist:s5

- **panel**: `god_Alchemist`  **slot**: 5  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +9% Spirit Magus Skill Damage

### source notes

- `tli:ss11:node_736_80:c21e7b99-2a59-421a-8b1f-d922e47a00d0`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Alchemist:s6

- **panel**: `god_Alchemist`  **slot**: 6  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +1 Spirit Magus Skill Level
- -80% additional damage taken by Spirit Magi

### source notes

- `tli:ss11:node_864_80:82a69272-290b-4504-9abc-d980e5c3d632`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Alchemist:s11

- **panel**: `god_Alchemist`  **slot**: 11  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +2% chance for Spirit Magi to use an Enhanced Skill

### source notes

- `tli:ss11:node_480_176:7a6ff7ac-3131-4b8c-8323-0c1e85d76447`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Alchemist:s12

- **panel**: `god_Alchemist`  **slot**: 12  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +4% chance for Spirit Magi to use an Enhanced Skill

### source notes

- `tli:ss11:node_608_176:fb9da8fe-1605-44a4-8e61-89cde3d9290e`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Alchemist:s13

- **panel**: `god_Alchemist`  **slot**: 13  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +4% Origin of Spirit Magus effect

### source notes

- `tli:ss11:node_736_176:d99106d5-e96e-40bd-818d-7f079ffbbf6e`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Alchemist:s14

- **panel**: `god_Alchemist`  **slot**: 14  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +1 to Max Spirit Magi In Map
- -40% additional Spirit Magus Skill Damage

### source notes

- `tli:ss11:node_864_176:38b1a415-1cdb-453f-94ce-83d5e287843d`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Alchemist:s16

- **panel**: `god_Alchemist`  **slot**: 16  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Life
- +3% Max Energy Shield

### source notes

- `tli:ss11:node_96_272:8d7ddea0-226f-4319-9758-89cf8a20503c`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Alchemist:s17

- **panel**: `god_Alchemist`  **slot**: 17  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Max Life
- +6% Max Energy Shield

### source notes

- `tli:ss11:node_224_272:5717e917-b2ff-4ab2-8fc9-bc29576139bd`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Alchemist:s19

- **panel**: `god_Alchemist`  **slot**: 19  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- 4.5% Spirit Magus Ultimate Cooldown Recovery Speed

### source notes

- `tli:ss11:node_480_272:a187d6d7-14d3-4873-9e88-5bbbcd0f22ba`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Alchemist:s20

- **panel**: `god_Alchemist`  **slot**: 20  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +9% Spirit Magus Ultimate Cooldown Recovery Speed

### source notes

- `tli:ss11:node_608_272:6e76722a-0857-4282-b101-03ee318c52ca`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Alchemist:s21

- **panel**: `god_Alchemist`  **slot**: 21  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +9% Minion Damage
- +9% damage

### source notes

- `tli:ss11:node_736_272:44d6d4a4-3a5a-47b5-94f0-133ae1756c15`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:63010100` | 63010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:63060300` | 63060300 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Alchemist:s22

- **panel**: `god_Alchemist`  **slot**: 22  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +1 Passive Skill Level

### source notes

- `tli:ss11:node_864_272:f140518d-7b19-40b9-b625-ec27e97a6b6d`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Alchemist:s25

- **panel**: `god_Alchemist`  **slot**: 25  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +8% Minion Damage
- +12% chance for Minions to inflict Damaging Ailments

### source notes

- `tli:ss11:node_224_368:88959646-1995-4cef-80b4-710b67fa0b65`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Alchemist:s26

- **panel**: `god_Alchemist`  **slot**: 26  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 60) — 效果含條件句、多段敘述或過長行；不適合窄 bridge 硬解。

### effectLines

- +16% Minion Damage
- +24% chance for Minions to inflict Damaging Ailments

### source notes

- `tli:ss11:node_352_368:cb49f713-8986-41fa-bbcb-bf2c9376b85b`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Alchemist:s27

- **panel**: `god_Alchemist`  **slot**: 27  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +12% Spirit Magus Ultimate Damage and Ailment Damage dealt by Ultimate.

### source notes

- `tli:ss11:node_480_368:771c9ca1-5761-4111-8bfd-1c4f56e0128c`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Alchemist:s28

- **panel**: `god_Alchemist`  **slot**: 28  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +24% Spirit Magus Ultimate Damage and Ailment Damage dealt by Ultimate.

### source notes

- `tli:ss11:node_608_368:8a49fe8b-5714-4451-a0cb-b6175d909b30`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Alchemist:s29

- **panel**: `god_Alchemist`  **slot**: 29  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- 12.5% Sealed Mana Compensation for Spirit Magus Skills

### source notes

- `tli:ss11:node_736_368:a89bfc7b-fc46-417d-bfad-731d96beb48b`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Alchemist:s30

- **panel**: `god_Alchemist`  **slot**: 30  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- 8% of damage taken is transferred to a random Minion
- -80% additional damage taken by Spirit Magi

### source notes

- `tli:ss11:node_864_368:3a267094-453b-402b-ab57-de02fb7570fa`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Alchemist:s32

- **panel**: `god_Alchemist`  **slot**: 32  **type**: small
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_96_464:77a1a605-8b35-4938-87aa-ae01feec4bda`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Alchemist:s33

- **panel**: `god_Alchemist`  **slot**: 33  **type**: medium
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_224_464:9f3e8649-b598-47b3-a701-6cd35a4e9a70`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Alchemist:s34

- **panel**: `god_Alchemist`  **slot**: 34  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +3% Energy Shield Charge Speed

### source notes

- `tli:ss11:node_352_464:3d9e0f3b-61ce-46e9-942b-f80ff162af6a`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Alchemist:s35

- **panel**: `god_Alchemist`  **slot**: 35  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +6% Energy Shield Charge Speed

### source notes

- `tli:ss11:node_480_464:ccfa5528-50a5-4a7e-a890-dcf7a9abb1d9`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Alchemist:s36

- **panel**: `god_Alchemist`  **slot**: 36  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Life
- +3% Max Energy Shield

### source notes

- `tli:ss11:node_608_464:d465dec8-7037-43f8-be1b-a79db688e106`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Alchemist:s37

- **panel**: `god_Alchemist`  **slot**: 37  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Max Life
- +6% Max Energy Shield

### source notes

- `tli:ss11:node_736_464:41bf220d-df3b-4cc8-9358-0a3637e4b8b2`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Alchemist:s38

- **panel**: `god_Alchemist`  **slot**: 38  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +15% Life Regeneration Speed
- -15% additional Energy Shield Charge Interval

### source notes

- `tli:ss11:node_864_464:3647a87b-07d9-43c9-9c22-839d3fa669c4`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Artisan:s0

- **panel**: `god_Artisan`  **slot**: 0  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +12% Sentry Damage

### source notes

- `tli:ss11:node_96_80:8d17fe8a-59f3-4537-9857-846e45448eed`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:64010100` | 64010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:64040200` | 64040200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:64060100` | 64060100 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Artisan:s1

- **panel**: `god_Artisan`  **slot**: 1  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +24% Sentry Damage

### source notes

- `tli:ss11:node_224_80:f2b6ac59-d9ab-4612-8719-2dab56a09f81`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Artisan:s2

- **panel**: `god_Artisan`  **slot**: 2  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +8% Sentry Skill Critical Strike Damage

### source notes

- `tli:ss11:node_352_80:bf2a1c74-4a68-4d44-a3e4-abc0888e8f1e`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Artisan:s3

- **panel**: `god_Artisan`  **slot**: 3  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +15% Sentry Skill Critical Strike Damage

### source notes

- `tli:ss11:node_480_80:8c140f7a-25d3-46f6-8c12-420d4f9ccf93`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Artisan:s5

- **panel**: `god_Artisan`  **slot**: 5  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +12% Sentry Damage

### source notes

- `tli:ss11:node_736_80:4a1f995e-c9a5-439e-bd97-84d1f00bdcc2`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:64010100` | 64010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:64040200` | 64040200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:64060100` | 64060100 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Artisan:s6

- **panel**: `god_Artisan`  **slot**: 6  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +1 Sentry quantity that can be deployed at a time

### source notes

- `tli:ss11:node_864_80:ec49fd04-bcf9-4209-8b5e-bf2d0fcf5e04`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Artisan:s9

- **panel**: `god_Artisan`  **slot**: 9  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +3% Sentry Skill cast frequency

### source notes

- `tli:ss11:node_224_176:dc0b43ff-92a7-426b-84f3-800206d467b2`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Artisan:s10

- **panel**: `god_Artisan`  **slot**: 10  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +6% Sentry Skill cast frequency

### source notes

- `tli:ss11:node_352_176:ffd782d9-debb-4af0-97a8-6acb0a6a383d`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Artisan:s11

- **panel**: `god_Artisan`  **slot**: 11  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +12% Sentry Damage

### source notes

- `tli:ss11:node_480_176:d518277e-1d3b-48c7-a53c-b4db0345edcd`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:64010100` | 64010100 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:64040200` | 64040200 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:64060100` | 64060100 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Artisan:s12

- **panel**: `god_Artisan`  **slot**: 12  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +20% Sentry Damage
- +18% Sentry Skill Area
- +9% Sentry Projectile Speed

### source notes

- `tli:ss11:node_608_176:14a0fbe7-90c8-4d9a-821b-ab9429c713d5`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Artisan:s13

- **panel**: `god_Artisan`  **slot**: 13  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +3% Sentry Skill cast frequency

### source notes

- `tli:ss11:node_736_176:decb9675-52e8-4d54-9b6d-75b26d3b5b01`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Artisan:s14

- **panel**: `god_Artisan`  **slot**: 14  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +30% Sentry Skill cast frequency
- -5% additional Sentry Damage

### source notes

- `tli:ss11:node_864_176:a51db887-4b5d-4863-8d0d-68b6d2a3e574`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Artisan:s18

- **panel**: `god_Artisan`  **slot**: 18  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +3% Max Energy Shield

### source notes

- `tli:ss11:node_352_272:8db229a7-dada-4dc7-815a-0967c3cc37b0`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Artisan:s19

- **panel**: `god_Artisan`  **slot**: 19  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `deferred_special_mechanic` (priority 50) — 非 bridge 尾綴問題；EXACT/PHRASE 已產出純中文針但仍 no_affix_text_match（多為池內無對應列或文本漂移）。

### effectLines

- +6% Max Energy Shield

### source notes

- `tli:ss11:node_480_272:96bbdf45-3d7a-4c85-9526-3cd8a6049e7b`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Artisan:s20

- **panel**: `god_Artisan`  **slot**: 20  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +8% Sentry Damage
- -8% additional Sentry Start Time

### source notes

- `tli:ss11:node_608_272:eeca8e13-67f6-4a39-b9d0-8a5ba7095750`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Artisan:s21

- **panel**: `god_Artisan`  **slot**: 21  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +8% additional Sentry Damage
- -25% additional Sentry Start Time

### source notes

- `tli:ss11:node_736_272:e26d9134-bde6-4210-9d23-fb4cec645406`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Artisan:s25

- **panel**: `god_Artisan`  **slot**: 25  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +7% Barrier Shield

### source notes

- `tli:ss11:node_224_368:b72c7f86-276d-492a-be1a-0dcbc1dcaa1b`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:64020400` | 64020400 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:64050400` | 64050400 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Artisan:s26

- **panel**: `god_Artisan`  **slot**: 26  **type**: medium
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +14% Barrier Shield

### source notes

- `tli:ss11:node_352_368:ef64b5a6-be47-493d-abba-f99256d8864e`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:64030400` | 64030400 | talent_tree | 中型天賦 |
| `talaffix:ss12:talent_tree:64060400` | 64060400 | talent_tree | 中型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Artisan:s27

- **panel**: `god_Artisan`  **slot**: 27  **type**: keystone
- **unresolvedReason**: `missing_effect_lines_anchor`
- **backlog**: `missing_anchor_priority` (priority 40) — 無 effectLines，無法做決定性文字錨點比對。

### effectLines


### source notes

- `tli:ss11:node_480_368:c9fb3edb-6b0b-4fb8-b055-0f80b653fbe3`

### 為何自動層無法決定

Node has no effectLines; no deterministic text anchor.

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Artisan:s28

- **panel**: `god_Artisan`  **slot**: 28  **type**: small
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +7% Barrier Shield

### source notes

- `tli:ss11:node_608_368:cbda0783-37c6-4bca-aa82-b0154273cd58`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:64020400` | 64020400 | talent_tree | 小型天賦 |
| `talaffix:ss12:talent_tree:64050400` | 64050400 | talent_tree | 小型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Artisan:s29

- **panel**: `god_Artisan`  **slot**: 29  **type**: medium
- **unresolvedReason**: `multiple_candidates_same_text_modifiers_tie`
- **backlog**: `manual_disambiguation_priority` (priority 20) — 自動層已縮池但仍多筆；不可靠 displayName 或 sourceOrderIndex 自動選（僅可作人工證據輔助）。

### effectLines

- +14% Barrier Shield

### source notes

- `tli:ss11:node_736_368:fe708178-29d2-4beb-93e9-a072eba3dbcd`

### 為何自動層無法決定

Multiple affix rows pass normalized text / modifier containment; matcher refuses to pick without disambiguation.

### candidate affix（自動層留下的候選）

| affixId | gameDataId | sourceTab | displayName |
|---------|------------|-------------|-------------|
| `talaffix:ss12:talent_tree:64030400` | 64030400 | talent_tree | 中型天賦 |
| `talaffix:ss12:talent_tree:64060400` | 64060400 | talent_tree | 中型天賦 |

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Artisan:s30

- **panel**: `god_Artisan`  **slot**: 30  **type**: keystone
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +8% Barrier Absorption Rate

### source notes

- `tli:ss11:node_864_368:7e040d72-1f44-4caf-b2a5-c3a47ef2e625`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Artisan:s32

- **panel**: `god_Artisan`  **slot**: 32  **type**: small
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +15% Sentry Skill Critical Strike Rating

### source notes

- `tli:ss11:node_96_464:d730961a-a127-4970-abbb-168fae2fa9bf`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Artisan:s33

- **panel**: `god_Artisan`  **slot**: 33  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +30% Sentry Skill Critical Strike Rating

### source notes

- `tli:ss11:node_224_464:3636fe50-0b5b-4ebb-97c4-ba9fcafa6ab1`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---

## talnode:ss12:god_Artisan:s35

- **panel**: `god_Artisan`  **slot**: 35  **type**: medium
- **unresolvedReason**: `no_affix_text_match`
- **backlog**: `translation_bridge_priority` (priority 30) — 譯文仍含「（原文：…）」尾綴或明顯未覆蓋片語，疑為可審計 bridge 缺口。

### effectLines

- +4% Movement Speed
- +20% Sentry Damage when moving

### source notes

- `tli:ss11:node_480_464:0611a24e-b5f3-49d1-b953-69ce812029aa`

### 為何自動層無法決定

No affix haystack contains all translated effect lines (translation gap or SS11/SS12 text drift).

### candidate affix

（無 — 多為 no_affix_text_match 或缺 effectLines）

### 建議人工決策欄（填寫後寫入 adjudications.json）

- chosenAffixId: 
- reason: 
- evidence: 
- reviewedBy: 

---
