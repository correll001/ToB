# Added_Fire_Damage — 全專案引用分層圖（4E-1）

Generated: 2026-04-04T11:26:44.074Z

掃描關鍵字：`Added_Fire_Damage`、`skill:Added_Fire_Damage`、`added fire`（不分大小寫）、`附加火焰傷害`。

## 比對摘要（資料管線）

- **Raw 層有命中**: 是
- **Normalized 層有命中**: 是
- **Effective 層有命中**: 是
- **Runtime bundle 層有命中**: 是

### 情境對照（A / B / C）

- **情況 A**（只在 raw/normalized，未進 effective）：若 effective 無此 id 相關列 → ETL / override / import 鏈斷裂。本 repo 目前 effective 與 runtime 皆有 `Added_Fire_Damage` 命中 → **非 A**。
- **情況 B**（override / effective 內 `supportRules` 被標成 Spell-only）：若在同一檔案視窗內同時出現 `skill:Added_Fire_Damage` 與 `requiresSpell` / `allowedSkillTags: Spell` → **偏向 B**。
- **情況 C**（effective 正確但 runtime 吃到別版）：若 effective 與 generated bundle 規則不一致 → 打包/啟用層問題。需比對兩檔片段（下方各層區塊）。

## 第一個把此輔助導向 Spell-only 的資料來源（腳本判定）

依「管線層級由先到後」且在同一檔案視窗內（錨點 `skill:Added_Fire_Damage` 後 12000 字元）同時出現 Spell 門檻欄位，**第一個命中檔案**為：

- **路徑**: `data/overrides/ss12/support-skills.json`
- **層級**: Override 層
- **說明**: 此檔在錨點附近可見 `requiresSpell: true`、或 `allowedSkillTags` 含 `Spell`、或文案 `Spell skills (added fire)` → 即為把規則鎖成 Spell-only 的**最早可觀測層**（normalized 大檔若無此共現，則不會被判為早于 override）。

## 依層級分組 — 命中檔案總表

### Raw page / 原始抓頁層

#### `data/raw/ss12/indexes/Support_Skill.html`

- **全檔含 `requiresSpell` 字樣**: 否；**全檔含 `allowedSkillTags` 字樣**: 否
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 否

##### 片段 1（行 260–301）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
   260 |     <div  class='collapse show'>
   261 |     <div class="px-2 pt-2"><span data-skilltagid="Physical" data-filter="物理" class="btn btn-sm border mb-1">物理</span> <span data-skilltagid="Fire" data-filter="火焰" class="btn btn-sm border mb-1">火焰</span> <span data-skilltagid=" … [truncated 2812 chars] … r="貫注" class="btn btn-sm border mb-1">貫注</span> <span data-skilltagid="Aura" data-filter="光環" class="btn btn-sm border mb-1">光環</span> <span data-skilltagid="Combo" data-filter="連攜" class="btn btn-sm border mb-1">連攜</span></div>
   262 |     
   263 |     <script>
   264 | $(document).ready(function () {
   265 |     filterClick($('[name=filter]'));
   266 | });
   267 | </script>
   268 | 
   269 | <form><div class="input-group my-2">
   270 |     <button class="btn btn-outline-secondary" type="reset">Reset</button>
   271 |     <input name="filter" class="form-control" placeholder="Search">
   272 | </div></form><div class="row row-cols-1 row-cols-lg-3 g-2"><div class="col"><div class="d-flex border-top rounded"><div class="flex-shrink-0"><a data-hover="/cache/tw/Torchlight_ItemBase_hover/57ffaf2ca2687e945bcbda243c737d98a79 … [truncated 98829 chars] … se%3A_Purify">精密 淨化</a><div><span data-skilltagid="Support" data-filter="輔助" style="cursor: pointer">輔助</span>, <span data-skilltagid="Restoration" data-filter="恢復" style="cursor: pointer">恢復</span></div></div></div></div></div>
   273 |     
   274 |     </div>
   275 | </div></div id="輔助技能Tag"><div id="Item" class="tab-pane fade"><div   class='card mb-2 '>
   276 |     <div class="card-header">Item /122 </div>
   277 |     <div  class='collapse show'>
   278 |     
   279 |     
   280 |     <script>
   281 | $(document).ready(function () {
   282 |     filterClick($('[name=filter]'));
   283 | });
   284 | </script>
   285 | 
   286 | <form><div class="input-group my-2">
   287 |     <button class="btn btn-outline-secondary" type="reset">Reset</button>
   288 |     <input name="filter" class="form-control" placeholder="Search">
   289 | </div></form><div class="row row-cols-1 row-cols-lg-3 g-2"><div class="col"><div class="d-flex border-top rounded"><div class="flex-shrink-0"><img src="https://cdn.tlidb.com/UI/Textures/Common/Icon/Skill/CommonSkill/128/Icon_Sup … [truncated 172515 chars] … lt;/div&gt;&lt;div&gt;擊中時有機率引發的異常狀態，根據基礎創傷傷害每秒造成物理傷害，持續 4 秒，無法疊加&lt;br/&gt;基礎創傷傷害為 0 時，無法造成創傷&lt;/div&gt;&lt;/div&gt;">創傷</e> <small class="description">(Lv1:21/10) (Lv21:41/10) (Lv41:51/10)</small></div></div></div></div></div>
   290 |     
   291 |     </div>
   292 | </div></div id="Item"><div id="技能-輔助技能-幫助手冊" class="tab-pane fade"><div class="card">
   293 |   <div class="card-header">技能-輔助技能 - 幫助手冊</div>
   294 |   <div class="card-body">
   295 |     <img src="https://cdn.tlidb.com/UI/Textures/Common/ResError/NoAtlas/UI_ResError_Unknow.webp" alt="UIResErrorUnknow" loading="lazy" />
   296 |     <p class="card-text"><RichText>輔助技能可以</><RichText Id="1433">加強</><RichText>主動技能。 <br/>一個主動技能最多可以</><RichText Id="1433">連接</><RichText>五個輔助技能。 <br/>可以根據主動技能的標籤來選擇對應的輔助技能，以獲得最大程度的提升。</></p>
   297 |   </div>
   298 | </div>
   299 | </div id="技能-輔助技能-幫助手冊"></div class="tab-content">
   300 |     </div>
   301 |     </div>
```

#### `data/raw/ss12/indexes/Support_Skill.md`

- **全檔含 `requiresSpell` 字樣**: 否；**全檔含 `allowedSkillTags` 字樣**: 否
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 否

##### 片段 1（行 54–84）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
    54 |                 KO 한국어
    55 |                 JA Japanese
    56 |                 RU Русский
    57 |      sidebar160("leftside_banner", "left");
    58 |      sidebar160("rightside_banner", "right");
    59 |     輔助技能 Tag /122 Item /122 技能-輔助技能 - 幫助手冊
    60 |     輔助技能 Tag /122
    61 |     物理 火焰 冰冷 閃電 腐蝕 攻擊 法術 投射物 輔助 拋射 範圍 近戰 位移 持續 連鎖 直射 哨衛 墜落 影襲 引導 揮斬 破擊 恢復 地面 射線 召喚 魔靈 智械 激發 防護 戰吼 詛咒 轟炸 貫注 光環 連攜
    62 | $(document).ready(function () {
    63 |     filterClick($('[name=filter]'));
    64 | });
    65 |     Reset
    66 | 散射投射物, 輔助連續攻擊攻擊, 輔助投射物分裂投射物, 輔助, 拋射範圍擴大範圍, 輔助近戰擊退攻擊, 近戰, 輔助過載輔助, 法術斷筋鋒刃輔助, 物理凜冽冰凍輔助, 冰冷額外點燃輔助, 火焰高壓電輔助, 閃電急速位移位移, 輔助持續時間延長持續, 輔助法術集中法術, 範圍, 輔助附加腐蝕傷害腐蝕, 輔助提高暴擊值輔助提高暴擊傷害輔助物理轉火焰輔助, 物理, 火焰閃電轉冰冷輔助, 閃電, 冰冷傷口加深輔助, 物理強烈侵蝕輔助, 腐蝕鈍化輔助, 腐蝕速 … [truncated 869 chars] … 復隱遁輔助, 防護定力輔助調息輔助, 連攜法術糾纏輔助, 法術多重糾纏輔助, 法術精密 封印轉化輔助精密 無私輔助, 光環精密 自私輔助, 光環精密 多則能成輔助, 光環精密 律己輔助, 光環精密 全神貫注輔助, 光環精密 遇強則強輔助, 光環精密 人多勢眾輔助, 光環精密 貫注增效輔助, 貫注精密 超能共生召喚, 輔助, 魔靈精密 魔靈之友召喚, 輔助, 魔靈精密 保護力場召喚, 輔助, 魔靈精密 節流輔助精密 調合輔助, 恢復精密 淨化輔助, 恢復
    67 |     Item /122
    68 | $(document).ready(function () {
    69 |     filterClick($('[name=filter]'));
    70 | });
    71 |     Reset
    72 | 散射輔助投射物技能。 被輔助技能 +2 投射物數量被輔助技能額外 7.4% 傷害 (Lv1:37/5) (Lv21:77/5) (Lv41:117/5)被輔助技能 +2 投射物數量被輔助技能額外 7.4% 傷害 (Lv1:37/5) (Lv21:77/5) (Lv41:117/5)連續攻擊輔助攻擊技能。無法輔助位移和引導技能。 被輔助技能 +101% 機率觸發連續攻擊 (Lv1:101) (Lv21:121) (Lv41:141)被輔助技能連續攻擊時， … [truncated 28684 chars] … 0)釋放被輔助技能後，在 2.1 秒內免疫元素異常狀態 (Lv1:21/10) (Lv21:41/10) (Lv41:51/10)精密 淨化輔助恢復技能。該技能只能安裝在每個主動技能的第 5 個輔助技能欄位。釋放被輔助技能後，在 2.1 秒內免疫凋零和創傷 (Lv1:21/10) (Lv21:41/10) (Lv41:51/10)釋放被輔助技能後，在 2.1 秒內免疫凋零和創傷 (Lv1:21/10) (Lv21:41/10) (Lv41:51/10)
    73 |   技能-輔助技能 - 幫助手冊
    74 |     輔助技能可以加強主動技能。 一個主動技能最多可以連接五個輔助技能。 可以根據主動技能的標籤來選擇對應的輔助技能，以獲得最大程度的提升。
    75 |             Sites
    76 |                poedb.tw
    77 |                tlidb.com
    78 |                poe2db.tw
    79 |                paldb.cc
    80 |             About Site
    81 |               Privacy
    82 |                About US
    83 |             Community
    84 |                編年史 Discord
```

#### `data/raw/ss12/manifests/pages.manifest.json`

- **全檔含 `requiresSpell` 字樣**: 否；**全檔含 `allowedSkillTags` 字樣**: 否
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 否

##### 片段 1（行 2131–2162）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
  2131 |       "sourceUrl": "https://tlidb.com/tw/Shortened_Duration",
  2132 |       "kind": "support",
  2133 |       "locale": "tw",
  2134 |       "season": "ss12",
  2135 |       "fetchedAt": "2026-04-04T08:35:33.181Z",
  2136 |       "status": "skipped",
  2137 |       "outputPath": "data/raw/ss12/pages/tw/Shortened_Duration.html",
  2138 |       "parseCandidateName": "持續時間縮短",
  2139 |       "contentSha256": "aa9e0bc76f98f1ee7bc1d569a54b24d18e44636b94fd88ab902cff8b7db5c4a0",
  2140 |       "parserVersion": "1"
  2141 |     },
  2142 |     {
  2143 |       "sourceUrl": "https://tlidb.com/tw/Added_Fire_Damage",
  2144 |       "kind": "support",
  2145 |       "locale": "tw",
  2146 |       "season": "ss12",
  2147 |       "fetchedAt": "2026-04-04T08:35:33.182Z",
  2148 |       "status": "skipped",
  2149 |       "outputPath": "data/raw/ss12/pages/tw/Added_Fire_Damage.html",
  2150 |       "parseCandidateName": "附加火焰傷害",
  2151 |       "contentSha256": "937ddb10346756d8223abb7a1a628daccb00282faf479f7dfd08de38528ab0f5",
  2152 |       "parserVersion": "1"
  2153 |     },
  2154 |     {
  2155 |       "sourceUrl": "https://tlidb.com/tw/Added_Cold_Damage",
  2156 |       "kind": "support",
  2157 |       "locale": "tw",
  2158 |       "season": "ss12",
  2159 |       "fetchedAt": "2026-04-04T08:35:33.182Z",
  2160 |       "status": "skipped",
  2161 |       "outputPath": "data/raw/ss12/pages/tw/Added_Cold_Damage.html",
  2162 |       "parseCandidateName": "附加冰冷傷害",
```

#### `data/raw/ss12/manifests/skill-urls.json`

- **全檔含 `requiresSpell` 字樣**: 否；**全檔含 `allowedSkillTags` 字樣**: 否
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 否

##### 片段 1（行 1260–1288）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
  1260 |       "locale": "tw",
  1261 |       "parseCandidateName": "彈射",
  1262 |       "slug": "Jump"
  1263 |     },
  1264 |     {
  1265 |       "sourceUrl": "https://tlidb.com/tw/Shortened_Duration",
  1266 |       "kind": "support",
  1267 |       "locale": "tw",
  1268 |       "parseCandidateName": "持續時間縮短",
  1269 |       "slug": "Shortened_Duration"
  1270 |     },
  1271 |     {
  1272 |       "sourceUrl": "https://tlidb.com/tw/Added_Fire_Damage",
  1273 |       "kind": "support",
  1274 |       "locale": "tw",
  1275 |       "parseCandidateName": "附加火焰傷害",
  1276 |       "slug": "Added_Fire_Damage"
  1277 |     },
  1278 |     {
  1279 |       "sourceUrl": "https://tlidb.com/tw/Added_Cold_Damage",
  1280 |       "kind": "support",
  1281 |       "locale": "tw",
  1282 |       "parseCandidateName": "附加冰冷傷害",
  1283 |       "slug": "Added_Cold_Damage"
  1284 |     },
  1285 |     {
  1286 |       "sourceUrl": "https://tlidb.com/tw/Added_Lightning_Damage",
  1287 |       "kind": "support",
  1288 |       "locale": "tw",
```

#### `data/raw/ss12/pages/tw/Added_Fire_Damage.html`

- **全檔含 `requiresSpell` 字樣**: 否；**全檔含 `allowedSkillTags` 字樣**: 否
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 否

##### 片段 1（行 1–19）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
     1 | <!DOCTYPE html>
     2 | <html lang="tw" data-bs-theme="dark">
     3 |   <head>
     4 |     <meta charset="utf-8">
     5 |     <meta http-equiv="X-UA-Compatible" content="IE=edge">
     6 |     <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
     7 |     <title>Added_Fire_Damage - 火炬編年史, Torchlight: Infinite Wiki</title>
     8 |     <meta name="color-scheme" content="dark">
     9 |     <link href="/favicon.ico" rel="shortcut icon" >
    10 | 
    11 |     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.1/css/bootstrap.min.css" integrity="sha512-Z/def5z5u2aR89OuzYcxmDJ0Bnd5V1cKqBEbvLOiUNWdg9PQeXVvXLI90SE4QOHGlfLqUnDNVAYyZi8UwUTmWQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    12 |     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/themes/base/jquery-ui.min.css" integrity="sha512-ELV+xyi8IhEApPS/pSj66+Jiw+sOT1Mqkzlh8ExXihe4zfqbWkxPRi8wptXIO9g73FSlhmquFlUOuMSoXz5IRw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    13 |     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" integrity="sha512-xh6O/CkQoPOWDdYTDqeRdPCVd1SpvCA9XXcUnZS2FmJNp1coAFzvtCN9BmamE+4aHK8yyUHUSCcJHgXloTyT2A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    14 |     <link rel="stylesheet" href="https://cdn.datatables.net/1.12.1/css/dataTables.bootstrap5.min.css" crossorigin="anonymous"/>
    15 |     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/css/bootstrap-datepicker.min.css" integrity="sha512-mSYUmp1HYZDFaVKK//63EcZq4iFWFjxSL+Z3T/aCt4IO9Cejm03q3NKKYN6pFQzY0SBOr8h+eCIAZHPXcpZaNw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    16 |     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/11.6.16/sweetalert2.min.css" integrity="sha512-NvuRGlPf6cHpxQqBGnPe7fPoACpyrjhlSNeXVUY7BZAj1nNhuNpRBq3osC4yr2vswUEuHq2HtCsY2vfLNCndYA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    17 |     <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/modal-video@2.4.6/css/modal-video.min.css" integrity="sha256-nd8IBqNn9uqwZKfZcLIXQcNxk5TjqrxiLx7PzN5PFW0=" crossorigin="anonymous">
    18 |     <link rel="stylesheet" href="/css/stdtheme.css?1768377002
    19 | "/>
```

##### 片段 2（行 247–287）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
   247 |     <a href="Arcana_Season"><img src="https://cdn.tlidb.com/UI/Textures/Common/Icon/Item/128/UI_S9Pet_FateStar_128.webp" class="size48"/></a>
   248 |     <a href="The_Frozen_Canvas_Season"><img src="https://cdn.tlidb.com/UI/Textures/Common/Icon/GamePlay/UI_Item_S8Gameplay_Snow2_128.webp" class="size48"/></a>
   249 |     <a href="Clockwork_Ballet_Season"><img src="https://cdn.tlidb.com/UI/Textures/Common/Icon/Item/128/UI_MysticTreeRespecPoint_Icon_128.webp" class="size48"/></a>
   250 |     <a href="Whispering_Mist_Season"><img src="https://cdn.tlidb.com/UI/Textures/Common/Icon/GamePlay/UI_S6Gameplay_Tile_bench.webp" class="size48"/></a>
   251 |     <a href="Nightmare_Season"><img src="https://cdn.tlidb.com/UI/Textures/Common/Icon/GamePlay/UI_Item_S5Gameplay_DreamTreasure_Almighty_C_128.webp" class="size48"/></a>
   252 |     <a href="Aeterna_Season"><img src="https://cdn.tlidb.com/UI/Textures/Common/Icon/Silhouette/Talent/S4/UI_S4Gameplay_talent01_Icon_128.webp" class="size48"/></a>
   253 |     <a href="Cube_Season"><img src="https://cdn.tlidb.com/UI/Textures/Common/Icon/Item/128/UI_S3Gameplay_Beads_Icon_128.webp" class="size48"/></a>
   254 |     <a href="Blacksail_Season"><img src="https://cdn.tlidb.com/UI/Textures/Common/Icon/Item/128/UI_S2BossTicket3_Icon_128.webp" class="size48"/></a>
   255 |     <a href="Dark_Surge_Season"><img src="https://cdn.tlidb.com/UI/Textures/Common/Icon/Item/128/UI_Item_yimozhihe_Icon_128.webp" class="size48"/></a>
   256 |     </div>
   257 |     <div class="text-center mb-2"><a href="https://tap.io/MFOnPjs" target="_blank"><img src="https://cdn.tlidb.com/image/torchlight/p3_20260327_tw.webp" style="max-width: 100%;"/></a></div>
   258 |     <script>
   259 | if (document.title.indexOf("附加火焰傷害") == -1) {
   260 |     document.title = "附加火焰傷害" + " - " + document.title;
   261 | }
   262 | </script>
   263 | <h1>附加火焰傷害</h1>
   264 | 
   265 | <div class="row row-cols-1 row-cols-lg-3 g-2">
   266 | 
   267 | <div class="col">
   268 | <div class="card ui_item popupItem">
   269 |     <div class="item_ver">SS11賽季</div>
   270 |     <div class="text-center icon">
   271 |         <img src="https://cdn.tlidb.com/UI/Textures/Common/Icon/Skill/CommonSkill/128/Icon_Support_AddedFireDamage_128.webp" alt="IconSupportAddedFireDamage128" class="size128" loading="lazy" />
   272 |         <div class="level">20</div>
   273 |     </div>
   274 |     <div class="text-center px-3 banner bannerskill">
   275 |       <h5 class="card-title" style="margin-top: 0.5rem">附加火焰傷害</h5>
   276 |       <div class="d-flex flex-wrap justify-content-center">
   277 |         <span class="border p-1 mb-1 tag tlborder">火焰</span>
   278 |         <span class="border p-1 mb-1 tag tlborder">輔助</span>
   279 |       </div>
   280 |     </div>
   281 | 
   282 |     <div class="px-3 pt-1 pb-3">
   283 | 
   284 | 
   285 |         <div>
   286 |           <div class="d-flex justify-content-center">
   287 |             <div>魔力消耗倍率</div>
```

##### 片段 3（行 307–331）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
   307 |     </div>
   308 | </div>
   309 | </div>
   310 | 
   311 | <div class="col">
   312 | <div class="card ui_item popupItem previousItem">
   313 |     <div class="item_ver">SS10賽季</div>
   314 |     <div class="text-center icon">
   315 |         <img src="https://cdn.tlidb.com/UI/Textures/Common/Icon/Skill/CommonSkill/128/Icon_Support_AddedFireDamage_128.webp" class="size128" loading="lazy" />
   316 |         <div class="level">20</div>
   317 |     </div>
   318 |     <div class="text-center px-3 banner bannerskill">
   319 |       <h5 class="card-title" style="margin-top: 0.5rem">附加火焰傷害</h5>
   320 |       <div class="d-flex flex-wrap justify-content-center">
   321 |         <span class="border p-1 mb-1 tag tlborder">火焰</span>
   322 |         <span class="border p-1 mb-1 tag tlborder">輔助</span>
   323 |       </div>
   324 |     </div>
   325 | 
   326 |     <div class="px-3 pt-1 pb-3">
   327 | 
   328 | 
   329 |         <div>
   330 |           <div class="d-flex justify-content-center">
   331 |             <div>魔力消耗倍率</div>
```

##### 片段 4（行 348–372）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
   348 | 
   349 | 
   350 | 
   351 |     </div>
   352 | </div>
   353 | </div>
   354 | 
   355 | 
   356 | <div class="col">
   357 | <div class="card ui_item">
   358 |     <div class="card-header">Alts</div>
   359 |     <div class="card-body">
   360 |     <li><a data-hover="/cache/tw/Torchlight_ItemBase_hover/ce63dde3ac07c6b855e0f7b2ab4c0c8dd07f51ca7ec348e818a7383b9f713183" href="Added_Fire_Damage">附加火焰傷害</a></li>
   361 |     </div>
   362 | </div>
   363 | </div>
   364 | 
   365 | <div class="col">
   366 | <div class="card ui_item">
   367 |     <div class="card-header"><span data-i18n="TextTable_GameFunc|value|Func_Skill_SkillStore">Skill Shop</span> <span data-i18n="TextTable_GameFunc|value|Func_Common_CanBeUnlock">Unlock</span> <span data-i18n="TextTable_GameFunc|value|Func_Common_LV">Level</span></div>
   368 |     <div class="card-body">
   369 |       <button class="btn btn-sm mb-1 border"><a href="Anger">怒火</a>: 22</button>
   370 |       <button class="btn btn-sm mb-1 border"><a href="Seething_Silhouette">怒影</a>: 22</button>
   371 |       <button class="btn btn-sm mb-1 border"><a href="Ranger_of_Glory">榮光遊俠</a>: 22</button>
   372 |       <button class="btn btn-sm mb-1 border"><a href="Lethal_Flash">致命掠影</a>: 22</button>
```

#### `data/raw/ss12/pages/tw/Added_Fire_Damage.md`

- **全檔含 `requiresSpell` 字樣**: 否；**全檔含 `allowedSkillTags` 字樣**: 否
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 否

##### 片段 1（行 1–13）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
     1 | sourceUrl: https://tlidb.com/tw/Added_Fire_Damage
     2 | fetchedAt: 2026-04-04T05:21:33.109Z
     3 | season: ss12
     4 | locale: tw
     5 | parserVersion: 1
     6 | 
     7 | ---
     8 | window.dataLayer = window.dataLayer || [];
     9 |       function gtag(){dataLayer.push(arguments);}
    10 |       gtag('js', new Date());
    11 |       gtag('config', 'G-P6KT6L9KX8');
    12 |         TLIDB
    13 |                 Hero
```

##### 片段 2（行 47–96）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
    47 |                 Shop
    48 |                 Outfit
    49 |                 Commodity
    50 |                 Boon
    51 |                 EN English
    52 |                 TW 繁體中文
    53 |                 CN 简体中文
    54 |                 KO 한국어
    55 |                 JA Japanese
    56 |                 RU Русский
    57 |      sidebar160("leftside_banner", "left");
    58 |      sidebar160("rightside_banner", "right");
    59 | if (document.title.indexOf("附加火焰傷害") == -1) {
    60 |     document.title = "附加火焰傷害" + " - " + document.title;
    61 | }
    62 | 附加火焰傷害
    63 |     SS11賽季
    64 |         20
    65 |       附加火焰傷害
    66 |         火焰
    67 |         輔助
    68 |             魔力消耗倍率
    69 |             110.0%
    70 |         Simple
    71 |         輔助擊中敵人的技能。 被輔助技能附加 1 - 3 點火焰傷害 (Lv1:1) (Lv2:2) (Lv3:3) (Lv4:4) (Lv5:4) (Lv6:5) (Lv7:6) (Lv8:6) (Lv9:8) (Lv10:9) (Lv11:11) (Lv12:12) (Lv13:14) (Lv14:18) (Lv15:25) (Lv16:35) (Lv17:42) (Lv18:49) (Lv19:60) (Lv20:73) (Lv21:74 … [truncated 346 chars] … v20:135) (Lv21:137) (Lv22:138) (Lv23:140) (Lv24:141) (Lv25:142) (Lv26:144) (Lv27:145) (Lv28:147) (Lv29:148) (Lv30:150) (Lv31:151) (Lv32:153) (Lv33:154) (Lv34:156) (Lv35:157) (Lv36:159) (Lv37:160) (Lv38:162) (Lv39:164) (Lv40:165)
    72 |         被輔助技能附加 1 - 3 點火焰傷害 (Lv1:1) (Lv2:2) (Lv3:3) (Lv4:4) (Lv5:4) (Lv6:5) (Lv7:6) (Lv8:6) (Lv9:8) (Lv10:9) (Lv11:11) (Lv12:12) (Lv13:14) (Lv14:18) (Lv15:25) (Lv16:35) (Lv17:42) (Lv18:49) (Lv19:60) (Lv20:73) (Lv21:74) (Lv22:74) … [truncated 335 chars] … v20:135) (Lv21:137) (Lv22:138) (Lv23:140) (Lv24:141) (Lv25:142) (Lv26:144) (Lv27:145) (Lv28:147) (Lv29:148) (Lv30:150) (Lv31:151) (Lv32:153) (Lv33:154) (Lv34:156) (Lv35:157) (Lv36:159) (Lv37:160) (Lv38:162) (Lv39:164) (Lv40:165)
    73 |     SS10賽季
    74 |         20
    75 |       附加火焰傷害
    76 |         火焰
    77 |         輔助
    78 |             魔力消耗倍率
    79 |             110.0%
    80 |         Simple
    81 |         輔助擊中敵人的技能。 被輔助技能附加 1 - 3 點火焰傷害 (Lv1:1) (Lv2:2) (Lv3:3) (Lv4:4) (Lv5:4) (Lv6:5) (Lv7:6) (Lv8:6) (Lv9:8) (Lv10:9) (Lv11:11) (Lv12:12) (Lv13:14) (Lv14:18) (Lv15:25) (Lv16:35) (Lv17:42) (Lv18:49) (Lv19:60) (Lv20:73) (Lv21:74 … [truncated 476 chars] … (Lv32:153) (Lv33:154) (Lv34:156) (Lv35:157) (Lv36:159) (Lv37:160) (Lv38:162) (Lv39:164) (Lv40:165)被輔助技能獲得技能傷害的 13.4% 至基礎點燃傷害 (Lv1:67/5) (Lv21:107/5) (Lv41:147/5)被輔助技能附加主手武器傷害的 8.7% 至基礎點燃傷害 (Lv1:87/10) (Lv21:127/10) (Lv41:167/10)
    82 |         被輔助技能附加 1 - 3 點火焰傷害 (Lv1:1) (Lv2:2) (Lv3:3) (Lv4:4) (Lv5:4) (Lv6:5) (Lv7:6) (Lv8:6) (Lv9:8) (Lv10:9) (Lv11:11) (Lv12:12) (Lv13:14) (Lv14:18) (Lv15:25) (Lv16:35) (Lv17:42) (Lv18:49) (Lv19:60) (Lv20:73) (Lv21:74) (Lv22:74) … [truncated 465 chars] … (Lv32:153) (Lv33:154) (Lv34:156) (Lv35:157) (Lv36:159) (Lv37:160) (Lv38:162) (Lv39:164) (Lv40:165)被輔助技能獲得技能傷害的 13.4% 至基礎點燃傷害 (Lv1:67/5) (Lv21:107/5) (Lv41:147/5)被輔助技能附加主手武器傷害的 8.7% 至基礎點燃傷害 (Lv1:87/10) (Lv21:127/10) (Lv41:167/10)
    83 |     Alts
    84 |     附加火焰傷害
    85 |     Skill Shop Unlock Level
    86 |       怒火: 22
    87 |       怒影: 22
    88 |       榮光遊俠: 22
    89 |       致命掠影: 22
    90 |       戰火狂徒: 22
    91 |       疾風追獵: 22
    92 |       電光貓影: 22
    93 |       爆破新星: 22
    94 |       歡愉之焰: 22
    95 |       冰結之心: 22
    96 |       冰火融合: 22
```

#### `data/raw/ss12/pages/tw/Aeterna_Season.html`

- **全檔含 `requiresSpell` 字樣**: 否；**全檔含 `allowedSkillTags` 字樣**: 否
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 否

##### 片段 1（行 293–317）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
   293 |     <div  class='collapse show'>
   294 |     
   295 |     
   296 |     <script>
   297 | $(document).ready(function () {
   298 |     filterClick($('[name=filter]'));
   299 | });
   300 | </script>
   301 | 
   302 | <form><div class="input-group my-2">
   303 |     <button class="btn btn-outline-secondary" type="reset">Reset</button>
   304 |     <input name="filter" class="form-control" placeholder="Search">
   305 | </div></form><div class="row row-cols-1 row-cols-lg-2 g-2"><div class="col"><div class="d-flex border-top rounded"><div class="flex-shrink-0"><a href="Lone_Survivor"><img src="https://cdn.tlidb.com/UI/Textures/Common/Icon/EquipC … [truncated 24185 chars] … ext-mod">+(20&ndash;30)</span>% 射線技能施法速度</span></div><div class="t1"><span class="tier tier1"></span><span data-modifier-id="51526461"><span class="text-mod">+(20&ndash;30)</span>% 射線長度</span></div></div></div></div></div></div>
   306 |     
   307 |     </div>
   308 | </div></div id="橙色裝備"><div id="技能介面" class="tab-pane fade"><div   class='card mb-2 '>
   309 |     <div class="card-header">技能介面 /5 </div>
   310 |     <div  class='collapse show'>
   311 |     
   312 |     
   313 |     <script>
   314 | $(document).ready(function () {
   315 |     filterClick($('[name=filter]'));
   316 | });
   317 | </script>
```

#### `data/raw/ss12/pages/tw/Aeterna_Season.md`

- **全檔含 `requiresSpell` 字樣**: 否；**全檔含 `allowedSkillTags` 字樣**: 否
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 否

##### 片段 1（行 64–88）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
    64 |         賽季發布影片
    65 |         迷城版圖
    66 |         永恆詩篇
    67 |         永恆殘頁
    68 | 迷城賽季 /0 橙色裝備 /12 技能介面 /5 契靈 /10 Boss /1 賽季玩法：永恆迷城
    69 |     迷城賽季 /0
    70 |     賽季背景傳說，在我們的故鄉，永恆不滅的偉大國度。那被世人稱為迷城的，荒蕪破敗之地。無盡的財富，永生的奧秘，都被埋葬在那破敗的表象之下。濃霧彌漫，斷壁殘垣之間，我們的族人在此遊蕩，等待著永恆的恩典。當燭火燃起，坍塌了一千遍的城池再度重築，倒下了一千次的親族再次站起。直到無盡的永恆之中，出現了誰人的身影？獵人啊，注定要踏破迷城的萬座殘垣，卻始終不願臣服於永恆的獵人啊。我看到了，你正向著燭火的最深處走去。全新玩法獵人交互地圖中永恆豐碑，可以進入迷城的 … [truncated 499 chars] … 魂燭融合時，兩支魂燭中效果和等階相同的詞綴會融合成一條，並使等階發生改變；剩餘的詞綴則會被隨機保留或捨棄。當兩支魂燭都擁有等階為T1的相同詞綴時，融合後的詞綴有幾率進化為強力的T0詞綴，但必然會附加一條隨機負面詞綴。融合結束後，魂燭中的T0詞綴有較小概率發生畸變，出現極其珍貴的特殊詞綴。畸變後的詞綴非常強大，但也會對獵人帶來嚴重的負面影響。因此，獵人需要平衡魂燭帶來的力量和影響，最大程度利用正面詞綴，盡可能規避負面詞綴，讓強大而危險的魂燭真正為你所用。
    71 |     橙色裝備 /12
    72 | $(document).ready(function () {
    73 |     filterClick($('[name=filter]'));
    74 | });
    75 |     Reset
    76 | 獨活需求等級 5+(60–70) 最大生命如果只裝備了一個戒指， +35% 受傷緩衝如果只裝備了一個戒指，額外 -20% 返還間隔如果只裝備了一個戒指， +(10–20)% 生命返還如果只裝備了一個戒指， -99% 生命自然恢復速度孤膽需求等級 5+(25–30) 最大魔力如果只裝備了一個戒指，則核心技能被 (1–7) 級附加火焰傷害輔助如果只裝備了一個戒指，則核心技能被 (1–7) 級附加冰冷傷害輔助如果只裝備了一個戒指，則核心技能被 (1–7) 級 … [truncated 1316 chars] … +25% 投射物傷害，隨距離遞減召喚物的直射投射物無法穿透統御值不超過 -60 時，周圍的智械召喚物體型 +30%周圍的智械召喚物 +100% 連續攻擊機率， +25% 連續攻擊傷害遞增+20% 移動速度+20% 位移技能冷卻恢復速度永生挽歌需求等級 58每引導 3 次，位移技能獲得1充能點數靜止時，額外 -20% 受到的元素傷害靜止時，額外 +(60–70)% 射線技能傷害靜止時，額外 +(20–30)% 射線技能施法速度+(20–30)% 射線長度
    77 |     技能介面 /5
    78 | $(document).ready(function () {
    79 |     filterClick($('[name=filter]'));
    80 | });
    81 |     Reset
    82 | 迅法幻身釋放該技能，朝指定方向位移，在位移開始和結束時，留下一個殘影，對周圍一定距離的敵人造成反向擊退。殘影在 0.65 秒後爆炸，對敵人造成一次傷害，每命中一個敵人，角色自身獲得 1 層亢奮：每擁有 1 層該亢奮，額外 2.5% 法術傷害，最多 8 層，持續 1.2 秒。殘影：殘影持續 0.65 秒最多擁有 2 個殘影殘影爆炸命中敵人時，造成 542-904 法術物理傷害殘影爆炸每命中一個敵人，角色自身獲得 1 層亢奮亢奮：每擁有 1 層該亢奮，額外 … [truncated 562 chars] … 250) (Lv21:1/50) (Lv41:7/250)被輔助技能召喚的召喚物累計釋放 8 次技能後獲得增益，持續 5 秒；增益持續時不會再次獲得增益增益持續時，魔靈 +150 初始生長值；該加成在 5 秒內降低至 +60被輔助技能召喚的召喚物每 1 點生長值，額外 0.012% 傷害 (Lv1:3/250) (Lv21:1/50) (Lv41:7/250)被輔助技能召喚的召喚物累計釋放 8 次技能後獲得增益，持續 5 秒；增益持續時不會再次獲得增益
    83 |     契靈 /10
    84 | $(document).ready(function () {
    85 |     filterClick($('[name=filter]'));
    86 | });
    87 |     Reset
    88 | 哀怨線球-霜寒掉落 稀有增加掉落數量額外 +6% 裝備掉落數量+6% 掉落數量移動電子掉落 魔法增加掉落數量當玩家開啟永恆迷城中獎勵玩法時，有4%概率獎勵翻倍+8% 掉落數量春困小萵掉落 稀有增加掉落數量當玩家開啟永恆迷城中獎勵玩法時，有8%概率獎勵翻倍+8% 掉落數量豐碑騎士掉落 傳奇增加掉落數量玩家每完成一個永恆殘垣中的燭臺玩法，有21%概率在迷城版圖中額外增加1個獎勵點，最多增加15次。迷城重築後，增加的所有獎勵點會隨機分配到迷城版圖的可通行區域 … [truncated 257 chars] …  魔法增加魔靈封印解除，傷害，技能持續額外 +7% 傷害；額外 +7% 召喚物傷害+28% 魔靈技能傷害額外 +4% 召喚物傷害春困小萵-紫晶召喚 稀有增加魔靈封印解除，傷害，技能持續額外 +7% 傷害；額外 +7% 召喚物傷害+56% 魔靈技能傷害額外 +4% 召喚物傷害原罪天秤召喚 傳奇增加魔靈封印解除，傷害，技能持續力量、敏捷和智慧中任意二者相等時，額外 +53% 魔靈終極技能傷害和終極技能造成的異常傷害+2 魔靈技能等級額外 +4% 召喚物傷害
```

#### `data/raw/ss12/pages/tw/Craft.html`

- **全檔含 `requiresSpell` 字樣**: 否；**全檔含 `allowedSkillTags` 字樣**: 否
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 否

##### 片段 1（行 4962–4986）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
  4962 | <tr><td><span data-modifier-id="51511651">額外 <span class="text-mod">+(25&ndash;30)</span>% 雷霆貫注傷害</span></td><td>戒指</td><td><a data-hover="/cache/tw/Torchlight_ItemGold_hover/a556249794ab230a2dfdc3d4b8eb306ae861b89b1ba56c383dcf7fcb691b434c" href="Exemption_Thunderhell" class="item_rarity100">破厄雷獄</a></td></tr>
  4963 | <tr><td><span data-modifier-id="51511711"><span class="text-mod">+(7&ndash;11)</span> 點敏捷與智慧</span></td><td>戒指</td><td><a data-hover="/cache/tw/Torchlight_ItemGold_hover/ea3c35c750373a08ef63458b78e41b9f725a8fb09751d4ce5aa2c72c62718019" href="Frozen_Lightning" class="item_rarity100">冰結雷光</a></td></tr>
  4964 | <tr><td><span data-modifier-id="51511721"><span class="text-mod">+(36&ndash;43)</span>% <e id=120 class="Hyperlink" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="&lt;div class=&quot;text-start&quot;&gt;&lt;div&gt;元 … [truncated 25 chars] … ;/div&gt;">元素</e>傷害</span></td><td>戒指</td><td><a data-hover="/cache/tw/Torchlight_ItemGold_hover/ea3c35c750373a08ef63458b78e41b9f725a8fb09751d4ce5aa2c72c62718019" href="Frozen_Lightning" class="item_rarity100">冰結雷光</a></td></tr>
  4965 | <tr><td><span data-modifier-id="51511731"><span class="text-mod">+3</span>% 冰冷與閃電抗性</span></td><td>戒指</td><td><a data-hover="/cache/tw/Torchlight_ItemGold_hover/ea3c35c750373a08ef63458b78e41b9f725a8fb09751d4ce5aa2c72c62718019" href="Frozen_Lightning" class="item_rarity100">冰結雷光</a></td></tr>
  4966 | <tr><td><span data-modifier-id="51511741"><span class="text-mod">50</span>% 閃電傷害轉化為冰冷傷害</span></td><td>戒指</td><td><a data-hover="/cache/tw/Torchlight_ItemGold_hover/ea3c35c750373a08ef63458b78e41b9f725a8fb09751d4ce5aa2c72c62718019" href="Frozen_Lightning" class="item_rarity100">冰結雷光</a></td></tr>
  4967 | <tr><td><span data-modifier-id="51511751">擊中敵人時，附加一層<e id=706 class="Hyperlink" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="&lt;div class=&quot;text-start&quot;&gt;&lt;div&gt;減速&lt;/div&gt;&lt;div&gt;每層降低 6% 攻擊速度 … [truncated 43 chars] … ext-mod">2</span> 秒</span></td><td>戒指</td><td><a data-hover="/cache/tw/Torchlight_ItemGold_hover/ea3c35c750373a08ef63458b78e41b9f725a8fb09751d4ce5aa2c72c62718019" href="Frozen_Lightning" class="item_rarity100">冰結雷光</a></td></tr>
  4968 | <tr><td><span data-modifier-id="51511811"><span class="text-mod">+(60&ndash;70)</span> 最大生命</span></td><td>戒指</td><td><a data-hover="/cache/tw/Torchlight_ItemGold_hover/98ebf48ab786670b710bcf24f0b618689500a92560985dd69c78dd4ba9f22d7f" href="Lone_Survivor" class="item_rarity100">獨活</a></td></tr>
  4969 | <tr><td><span data-modifier-id="51511821">如果只裝備了一個戒指， <span class="text-mod">+35</span>% 受傷緩衝</span></td><td>戒指</td><td><a data-hover="/cache/tw/Torchlight_ItemGold_hover/98ebf48ab786670b710bcf24f0b618689500a92560985dd69c78dd4ba9f22d7f" href="Lone_Survivor" class="item_rarity100">獨活</a></td></tr>
  4970 | <tr><td><span data-modifier-id="51511831">如果只裝備了一個戒指，額外 <span class="text-mod">-20</span>% 返還間隔</span></td><td>戒指</td><td><a data-hover="/cache/tw/Torchlight_ItemGold_hover/98ebf48ab786670b710bcf24f0b618689500a92560985dd69c78dd4ba9f22d7f" href="Lone_Survivor" class="item_rarity100">獨活</a></td></tr>
  4971 | <tr><td><span data-modifier-id="51511841">如果只裝備了一個戒指， <span class="text-mod">+(10&ndash;20)</span>% 生命返還</span></td><td>戒指</td><td><a data-hover="/cache/tw/Torchlight_ItemGold_hover/98ebf48ab786670b710bcf24f0b618689500a92560985dd69c78dd4ba9f22d7f" href="Lone_Survivor" class="item_rarity100">獨活</a></td></tr>
  4972 | <tr><td><span data-modifier-id="51511851">如果只裝備了一個戒指， <span class="text-mod">-99</span>% 生命自然恢復速度</span></td><td>戒指</td><td><a data-hover="/cache/tw/Torchlight_ItemGold_hover/98ebf48ab786670b710bcf24f0b618689500a92560985dd69c78dd4ba9f22d7f" href="Lone_Survivor" class="item_rarity100">獨活</a></td></tr>
  4973 | <tr><td><span data-modifier-id="51511911"><span class="text-mod">+(25&ndash;30)</span> 最大魔力</span></td><td>戒指</td><td><a data-hover="/cache/tw/Torchlight_ItemGold_hover/58ddf5ca61db486e2e89c962a750ce2619e2897067f8e9a263c7382e6b372583" href="Lonesome" class="item_rarity100">孤膽</a></td></tr>
  4974 | <tr><td><span data-modifier-id="51511921">如果只裝備了一個戒指，則核心技能被 <span class="text-mod">(1&ndash;7)</span> 級附加火焰傷害輔助</span></td><td>戒指</td><td><a data-hover="/cache/tw/Torchlight_ItemGold_hover/58ddf5ca61db486e2e89c962a750ce2619e2897067f8e9a263c7382e6b372583" href="Lonesome" class="item_rarity100">孤膽</a></td></tr>
  4975 | <tr><td><span data-modifier-id="51511931">如果只裝備了一個戒指，則核心技能被 <span class="text-mod">(1&ndash;7)</span> 級附加冰冷傷害輔助</span></td><td>戒指</td><td><a data-hover="/cache/tw/Torchlight_ItemGold_hover/58ddf5ca61db486e2e89c962a750ce2619e2897067f8e9a263c7382e6b372583" href="Lonesome" class="item_rarity100">孤膽</a></td></tr>
  4976 | <tr><td><span data-modifier-id="51511941">如果只裝備了一個戒指，則核心技能被 <span class="text-mod">(1&ndash;7)</span> 級附加閃電傷害輔助</span></td><td>戒指</td><td><a data-hover="/cache/tw/Torchlight_ItemGold_hover/58ddf5ca61db486e2e89c962a750ce2619e2897067f8e9a263c7382e6b372583" href="Lonesome" class="item_rarity100">孤膽</a></td></tr>
  4977 | <tr><td><span data-modifier-id="51511951">如果只裝備了一個戒指，則核心技能被 <span class="text-mod">(1&ndash;7)</span> 級附加腐蝕傷害輔助</span></td><td>戒指</td><td><a data-hover="/cache/tw/Torchlight_ItemGold_hover/58ddf5ca61db486e2e89c962a750ce2619e2897067f8e9a263c7382e6b372583" href="Lonesome" class="item_rarity100">孤膽</a></td></tr>
  4978 | <tr><td><span data-modifier-id="52512011"><span class="text-mod">+(60&ndash;70)</span>% 近戰傷害</span></td><td>戒指</td><td><a data-hover="/cache/tw/Torchlight_ItemGold_hover/3ddc3a0ca7dc1ced76d2a6ba16f1debf6a3cd3029d32b7828add24ee4f0c53ff" href="Stream_of_Steel" class="item_rarity100">鋼鐵涓流</a></td></tr>
  4979 | <tr><td><span data-modifier-id="52512021"><span class="text-mod">+(60&ndash;70)</span>% 堅固<e id=130 class="Hyperlink" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="&lt;div class=&quot;text-start&quot;&gt;&lt;div&gt … [truncated 51 chars] … /div&gt;">魔力封印</e>補償</span></td><td>戒指</td><td><a data-hover="/cache/tw/Torchlight_ItemGold_hover/3ddc3a0ca7dc1ced76d2a6ba16f1debf6a3cd3029d32b7828add24ee4f0c53ff" href="Stream_of_Steel" class="item_rarity100">鋼鐵涓流</a></td></tr>
  4980 | <tr><td><span data-modifier-id="52512031">對非物理傷害， <span class="text-mod">+(8&ndash;12)</span>% <e id=161 class="Hyperlink" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="&lt;div class=&quot;text-start&quot;&gt;&lt;d … [truncated 75 chars] … ;/div&gt;">護甲有效率</e></span></td><td>戒指</td><td><a data-hover="/cache/tw/Torchlight_ItemGold_hover/3ddc3a0ca7dc1ced76d2a6ba16f1debf6a3cd3029d32b7828add24ee4f0c53ff" href="Stream_of_Steel" class="item_rarity100">鋼鐵涓流</a></td></tr>
  4981 | <tr><td><span data-modifier-id="51512211"><span class="text-mod">+(20&ndash;24)</span>% 最大生命和最大護盾</span></td><td>戒指</td><td><a data-hover="/cache/tw/Torchlight_ItemGold_hover/805d990223922fb70e61b3207651f861da85ad511f40ac197186d34d610bafbf" href="Frozen_Flame" class="item_rarity100">不燃之火</a></td></tr>
  4982 | <tr><td><span data-modifier-id="55512231"><span class="text-mod">+(3&ndash;5)</span> 激發技能等級</span></td><td>戒指</td><td><a data-hover="/cache/tw/Torchlight_ItemGold_hover/805d990223922fb70e61b3207651f861da85ad511f40ac197186d34d610bafbf" href="Frozen_Flame" class="item_rarity100">不燃之火</a></td></tr>
  4983 | <tr><td><span data-modifier-id="51512241">擊中敵人時， <span class="text-mod">+(50&ndash;80)</span>% 機率觸發 <span class="text-mod">30</span> 級公牛之怒，冷卻4秒</span></td><td>戒指</td><td><a data-hover="/cache/tw/Torchlight_ItemGold_hover/805d990223922fb70e61b3207651f861da85ad511f40ac197186d34d610bafbf" href="Frozen_Flame" class="item_rarity100">不燃之火</a></td></tr>
  4984 | <tr><td><span data-modifier-id="51512251"><span class="text-mod">+(35&ndash;42)</span>% 火焰與閃電抗性</span></td><td>戒指</td><td><a data-hover="/cache/tw/Torchlight_ItemGold_hover/805d990223922fb70e61b3207651f861da85ad511f40ac197186d34d610bafbf" href="Frozen_Flame" class="item_rarity100">不燃之火</a></td></tr>
  4985 | <tr><td><span data-modifier-id="51512261">無法造成<e id=710 class="Hyperlink" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="&lt;div class=&quot;text-start&quot;&gt;&lt;div&gt;點燃&lt;/div&gt;&lt;div&gt;擊中時有機率引發的異常狀態，根據基礎 … [truncated 38 chars] … gt;&lt;/div&gt;">點燃</e></span></td><td>戒指</td><td><a data-hover="/cache/tw/Torchlight_ItemGold_hover/805d990223922fb70e61b3207651f861da85ad511f40ac197186d34d610bafbf" href="Frozen_Flame" class="item_rarity100">不燃之火</a></td></tr>
  4986 | <tr><td><span data-modifier-id="51512311"><span class="text-mod">+(20&ndash;24)</span>% 最大生命和最大護盾</span></td><td>戒指</td><td><a data-hover="/cache/tw/Torchlight_ItemGold_hover/d8d0e3a87db43915e84632ea4f3449e6cdc82bfb448c66804c5cb08456160f43" href="Burning_Ice" class="item_rarity100">不凍之冰</a></td></tr>
```

#### `data/raw/ss12/pages/tw/Craft.md`

- **全檔含 `requiresSpell` 字樣**: 否；**全檔含 `allowedSkillTags` 字樣**: 否
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 否

##### 片段 1（行 4732–4756）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
  4732 | 額外 +(25–30)% 雷霆貫注傷害戒指破厄雷獄
  4733 | +(7–11) 點敏捷與智慧戒指冰結雷光
  4734 | +(36–43)% 元素傷害戒指冰結雷光
  4735 | +3% 冰冷與閃電抗性戒指冰結雷光
  4736 | 50% 閃電傷害轉化為冰冷傷害戒指冰結雷光
  4737 | 擊中敵人時，附加一層減速，持續 2 秒戒指冰結雷光
  4738 | +(60–70) 最大生命戒指獨活
  4739 | 如果只裝備了一個戒指， +35% 受傷緩衝戒指獨活
  4740 | 如果只裝備了一個戒指，額外 -20% 返還間隔戒指獨活
  4741 | 如果只裝備了一個戒指， +(10–20)% 生命返還戒指獨活
  4742 | 如果只裝備了一個戒指， -99% 生命自然恢復速度戒指獨活
  4743 | +(25–30) 最大魔力戒指孤膽
  4744 | 如果只裝備了一個戒指，則核心技能被 (1–7) 級附加火焰傷害輔助戒指孤膽
  4745 | 如果只裝備了一個戒指，則核心技能被 (1–7) 級附加冰冷傷害輔助戒指孤膽
  4746 | 如果只裝備了一個戒指，則核心技能被 (1–7) 級附加閃電傷害輔助戒指孤膽
  4747 | 如果只裝備了一個戒指，則核心技能被 (1–7) 級附加腐蝕傷害輔助戒指孤膽
  4748 | +(60–70)% 近戰傷害戒指鋼鐵涓流
  4749 | +(60–70)% 堅固魔力封印補償戒指鋼鐵涓流
  4750 | 對非物理傷害， +(8–12)% 護甲有效率戒指鋼鐵涓流
  4751 | +(20–24)% 最大生命和最大護盾戒指不燃之火
  4752 | +(3–5) 激發技能等級戒指不燃之火
  4753 | 擊中敵人時， +(50–80)% 機率觸發 30 級公牛之怒，冷卻4秒戒指不燃之火
  4754 | +(35–42)% 火焰與閃電抗性戒指不燃之火
  4755 | 無法造成點燃戒指不燃之火
  4756 | +(20–24)% 最大生命和最大護盾戒指不凍之冰
```

#### `data/raw/ss12/pages/tw/Legendary_Gear.html`

- **全檔含 `requiresSpell` 字樣**: 否；**全檔含 `allowedSkillTags` 字樣**: 否
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 否

##### 片段 1（行 350–374）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
   350 |     <div  class='collapse show'>
   351 |     
   352 |     
   353 |     <script>
   354 | $(document).ready(function () {
   355 |     filterClick($('[name=filter]'));
   356 | });
   357 | </script>
   358 | 
   359 | <form><div class="input-group my-2">
   360 |     <button class="btn btn-outline-secondary" type="reset">Reset</button>
   361 |     <input name="filter" class="form-control" placeholder="Search">
   362 | </div></form><div class="row row-cols-1 row-cols-lg-2 g-2"><div class="col"><div class="d-flex border-top rounded"><div class="flex-shrink-0"><a href="Sparks_of_Moth_Fire"><img src="https://cdn.tlidb.com/UI/Textures/Common/Icon/ … [truncated 571816 chars] … s-html="true" data-bs-title="&lt;div class=&quot;text-start&quot;&gt;&lt;div&gt;永恆主宰&lt;/div&gt;&lt;div&gt;每層永恆主宰 +10% 額外傷害（疊乘），+10% 體型，上限 10 層，持續 45 秒&lt;/div&gt;&lt;/div&gt;">永恆主宰</e></span></div></div></div></div></div></div>
   363 |     
   364 |     </div>
   365 | </div></div id="傳奇裝備"><div id="傳奇裝備_cache" class="tab-pane fade"><div   class='card mb-2 '>
   366 |     <div class="card-header">傳奇裝備</div>
   367 |     <div  class='collapse show'>
   368 |     
   369 |     <div class='card-body clearfix'><div><RichText>在巨力之神的矮人機甲和黑潮玩法中大量掉落。</></div><div class="pt-2"><RichText>全域掉落，在巨力之神的矮人機甲和黑潮玩法中大量掉落。</></div></div>
   370 |     
   371 |     
   372 |     </div>
   373 | </div></div id="傳奇裝備_cache"></div class="tab-content">
   374 |     </div>
```

#### `data/raw/ss12/pages/tw/Legendary_Gear.md`

- **全檔含 `requiresSpell` 字樣**: 否；**全檔含 `allowedSkillTags` 字樣**: 否
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 否

##### 片段 1（行 116–140）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
   116 |             Vorax Aberrant Limb: Legs
   117 |             Vorax Limb: Neck
   118 |             Vorax Limb: Digits
   119 |             Vorax Aberrant Limb: Digits
   120 |             Vorax Limb: Waist
   121 |             Vorax Aberrant Limb: Waist
   122 | 傳奇裝備 /330 傳奇裝備
   123 |     傳奇裝備 /330
   124 | $(document).ready(function () {
   125 |     filterClick($('[name=filter]'));
   126 | });
   127 |     Reset
   128 | 星星蛾火需求等級 1複製上側相鄰石板的最後一條天賦到該石板，無法複製核心天賦複製左側相鄰石板的最後一條天賦到該石板，無法複製核心天賦複製下側相鄰石板的最後一條天賦到該石板，無法複製核心天賦複製右側相鄰石板的最後一條天賦到該石板，無法複製核心天賦群星輝隕需求等級 1<小型天賦><小型天賦><小型天賦或中型天賦><中型天賦>神性一角需求等級 1<傳奇中型天賦><傳奇中型天賦>寰空神隙需求等級 1複製左側相鄰石板的中型天賦到該石板複製右側相鄰石板的中型天賦到 … [truncated 32298 chars] … 秒自然恢復 (4–6)% 生命啟動法術迸發時，獲得 (1–2) 層隨機祝福永恆需求等級 66+(160–220) 最大生命擊敗時， +(30–50)% 機率獲得 1 層永恆鬥志擊敗時， +(30–50)% 機率獲得 1 層永恆夢魘擊敗時， +(10–20)% 機率獲得 1 層永恆虛影擊敗魔法怪物時， +(30–50)% 機率獲得 1 層永恆守護擊敗魔法怪物時， +(10–20)% 機率獲得 1 層永恆擬像擊敗勁敵時， +50% 機率獲得 1 層永恆主宰
   129 |     傳奇裝備
   130 |     在巨力之神的矮人機甲和黑潮玩法中大量掉落。全域掉落，在巨力之神的矮人機甲和黑潮玩法中大量掉落。
   131 |             Sites
   132 |                poedb.tw
   133 |                tlidb.com
   134 |                poe2db.tw
   135 |                paldb.cc
   136 |             About Site
   137 |               Privacy
   138 |                About US
   139 |             Community
   140 |                編年史 Discord
```

#### `data/raw/ss12/pages/tw/Netherrealm.html`

- **全檔含 `requiresSpell` 字樣**: 否；**全檔含 `allowedSkillTags` 字樣**: 否
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 否

##### 片段 1（行 280–304）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
   280 |     <div  class='collapse show'>
   281 |     <div class="card-body"><a href="Drop_Source" data-i18n="TextTable_GameFunc|value|Func_Tips_DropSource">Drop Source</a></div>
   282 |     
   283 |     <script>
   284 | $(document).ready(function () {
   285 |     filterClick($('[name=filter]'));
   286 | });
   287 | </script>
   288 | 
   289 | <form><div class="input-group my-2">
   290 |     <button class="btn btn-outline-secondary" type="reset">Reset</button>
   291 |     <input name="filter" class="form-control" placeholder="Search">
   292 | </div></form><div class="row row-cols-1 row-cols-lg-3 g-2"><div class="col"><div class="d-flex border-top rounded"><div class="flex-shrink-0"><img src="https://cdn.tlidb.com/UI/Textures/Common/Icon/Item/128/UI_Goods_Return1_Icon … [truncated 893524 chars] … s-html="true" data-bs-title="&lt;div class=&quot;text-start&quot;&gt;&lt;div&gt;永恆主宰&lt;/div&gt;&lt;div&gt;每層永恆主宰 +10% 額外傷害（疊乘），+10% 體型，上限 10 層，持續 45 秒&lt;/div&gt;&lt;/div&gt;">永恆主宰</e></span></div></div></div></div></div></div>
   293 |     
   294 |     </div>
   295 | </div></div id="異界全域掉落"><div id="Area" class="tab-pane fade"><div   class='card mb-2 '>
   296 |     <div class="card-header">Area /6 </div>
   297 |     <div  class='collapse show'>
   298 |     
   299 |     
   300 |     <table class='table table-hover table-striped DataTable '><thead><tr>
   301 | <th  >require_flame1</th>
   302 | <th  >name</th></tr></thead><tbody>
   303 | <tr><td>0</td><td><a href="Glacial_Abyss">冰封寒淵</a></td></tr>
   304 | <tr><td>3</td><td><a href="Blistering_Lava_Sea">沸湧炎海</a></td></tr>
```

#### `data/raw/ss12/pages/tw/Netherrealm.md`

- **全檔含 `requiresSpell` 字樣**: 否；**全檔含 `allowedSkillTags` 字樣**: 否
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 否

##### 片段 1（行 67–91）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
    67 | 位面解鎖沸湧炎海3
    68 | 位面解鎖鋼鐵煉境8
    69 | 位面解鎖雷鳴廢土15
    70 | 位面解鎖幽夜暗域24
    71 | Boss 解鎖萬界之主35
    72 | Boss 解鎖虛空裂隙31
    73 |     異界全域掉落 /895
    74 |     Drop Source
    75 | $(document).ready(function () {
    76 |     filterClick($('[name=filter]'));
    77 | });
    78 |     Reset
    79 | 遺忘之水使用後獲得一個天賦重置點數；也可用於移除命運異界迴響用來為異界關卡添加基礎詞綴逆轉發條使用後獲得一個逆轉點逆轉點是在異界虛空星圖中回退天賦節點時需要使用的的資源深空迴響用來為深空的異界關卡添加基礎詞綴與異界迴響不同，深空迴響添加的詞綴更危險，獎勵也更高能量核心在洗練中使用寒淵的秘密收集指定數量的記憶熒光可在雜貨商處兌換對應物品集齊%s張可向時空浪客兌換隨機初火*10烏鴉的悲鳴收集指定數量的記憶熒光可在雜貨商處兌換對應物品集齊%s張可向時空浪客兌 … [truncated 44516 chars] … 秒自然恢復 (4–6)% 生命啟動法術迸發時，獲得 (1–2) 層隨機祝福永恆需求等級 66+(160–220) 最大生命擊敗時， +(30–50)% 機率獲得 1 層永恆鬥志擊敗時， +(30–50)% 機率獲得 1 層永恆夢魘擊敗時， +(10–20)% 機率獲得 1 層永恆虛影擊敗魔法怪物時， +(30–50)% 機率獲得 1 層永恆守護擊敗魔法怪物時， +(10–20)% 機率獲得 1 層永恆擬像擊敗勁敵時， +50% 機率獲得 1 層永恆主宰
    80 |     Area /6
    81 | require_flame1
    82 | name
    83 | 0冰封寒淵
    84 | 3沸湧炎海
    85 | 8鋼鐵煉境
    86 | 15雷鳴廢土
    87 | 24幽夜暗域
    88 | 0深空
    89 |   異界 - 幫助手冊
    90 |     通關異界關卡，可獲得大量的經驗、裝備、灰燼材料等。 某些關卡還有限定的稀有掉落。
    91 |   異界-信標 - 幫助手冊
```

### Normalized 層

#### `data/normalized/ss12/support-skills.json`

- **全檔含 `requiresSpell` 字樣**: 是；**全檔含 `allowedSkillTags` 字樣**: 是
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 否

##### 片段 1（行 10836–10867）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
 10836 |             ],
 10837 |             "partial": false
 10838 |           }
 10839 |         },
 10840 |         "supportRules": {},
 10841 |         "levelScalingMode": "table",
 10842 |         "parserVersion": "1/3"
 10843 |       }
 10844 |     },
 10845 |     {
 10846 |       "parseStatus": "ok",
 10847 |       "definition": {
 10848 |         "id": "skill:Added_Fire_Damage",
 10849 |         "name": "附加火焰傷害",
 10850 |         "family": "support",
 10851 |         "tags": [
 10852 |           "火焰",
 10853 |           "輔助"
 10854 |         ],
 10855 |         "sourceUrl": "https://tlidb.com/tw/Added_Fire_Damage",
 10856 |         "locale": "tw",
 10857 |         "season": "ss12",
 10858 |         "version": "1.0.0",
 10859 |         "summaryText": [
 10860 |           "輔助擊中敵人的技能。 被輔助技能附加 1 - 3 點火焰傷害 (Lv1:1) (Lv2:2) (Lv3:3) (Lv4:4) (Lv5:4) (Lv6:5) (Lv7:6) (Lv8:6) (Lv9:8) (Lv10:9) (Lv11:11) (Lv12:12) (Lv13:14) (Lv14:18) (Lv15:25) (Lv16:35) (Lv17:42) (Lv18:49) (Lv19:60) (Lv20:73) (Lv21 … [truncated 350 chars] … 20:135) (Lv21:137) (Lv22:138) (Lv23:140) (Lv24:141) (Lv25:142) (Lv26:144) (Lv27:145) (Lv28:147) (Lv29:148) (Lv30:150) (Lv31:151) (Lv32:153) (Lv33:154) (Lv34:156) (Lv35:157) (Lv36:159) (Lv37:160) (Lv38:162) (Lv39:164) (Lv40:165)"
 10861 |         ],
 10862 |         "detailText": [
 10863 |           "被輔助技能附加 1 - 3 點火焰傷害 (Lv1:1) (Lv2:2) (Lv3:3) (Lv4:4) (Lv5:4) (Lv6:5) (Lv7:6) (Lv8:6) (Lv9:8) (Lv10:9) (Lv11:11) (Lv12:12) (Lv13:14) (Lv14:18) (Lv15:25) (Lv16:35) (Lv17:42) (Lv18:49) (Lv19:60) (Lv20:73) (Lv21:74) (Lv22: … [truncated 339 chars] … 20:135) (Lv21:137) (Lv22:138) (Lv23:140) (Lv24:141) (Lv25:142) (Lv26:144) (Lv27:145) (Lv28:147) (Lv29:148) (Lv30:150) (Lv31:151) (Lv32:153) (Lv33:154) (Lv34:156) (Lv35:157) (Lv36:159) (Lv37:160) (Lv38:162) (Lv39:164) (Lv40:165)"
 10864 |         ],
 10865 |         "levelBreakpoints": [
 10866 |           {
 10867 |             "level": 1,
```

### Override 層

#### `data/overrides/ss12/support-skills.json`

- **全檔含 `requiresSpell` 字樣**: 是；**全檔含 `allowedSkillTags` 字樣**: 是
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 是

##### 片段 1（行 70–99）

- 本片段含 `requiresSpell`: 是；含 `allowedSkillTags`: 是

```text
    70 |       }
    71 |     },
    72 |     {
    73 |       "id": "skill:Added_Physical_Damage",
    74 |       "notes": ["4E-2: attack gem — requires Attack"],
    75 |       "supportRulesMerge": {
    76 |         "requiresAttack": true,
    77 |         "allowedSkillTags": ["Attack"],
    78 |         "rawRequirementLines": ["[override 4E-2] 輔助擊中 — attack skills."]
    79 |       }
    80 |     },
    81 |     {
    82 |       "id": "skill:Added_Fire_Damage",
    83 |       "notes": ["4E-2: spell gem"],
    84 |       "supportRulesMerge": {
    85 |         "requiresSpell": true,
    86 |         "allowedSkillTags": ["Spell"],
    87 |         "rawRequirementLines": ["[override 4E-2] Spell skills (added fire)."]
    88 |       }
    89 |     },
    90 |     {
    91 |       "id": "skill:Added_Cold_Damage",
    92 |       "notes": ["4E-2: spell gem"],
    93 |       "supportRulesMerge": {
    94 |         "requiresSpell": true,
    95 |         "allowedSkillTags": ["Spell"],
    96 |         "rawRequirementLines": ["[override 4E-2] Spell skills (added cold)."]
    97 |       }
    98 |     },
    99 |     {
```

### Effective 層

#### `data/effective/ss12/override-report.json`

- **全檔含 `requiresSpell` 字樣**: 否；**全檔含 `allowedSkillTags` 字樣**: 是
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 否

##### 片段 1（行 70–124）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 是

```text
    70 |     {
    71 |       "file": "support-skills.json",
    72 |       "overrideSource": "data\\overrides\\ss12\\support-skills.json",
    73 |       "touchedIds": [
    74 |         "skill:Multiple_Projectiles",
    75 |         "skill:Multistrike",
    76 |         "skill:Projectile_Split",
    77 |         "skill:Increased_Area",
    78 |         "skill:Melee_Knockback",
    79 |         "skill:Overload",
    80 |         "skill:Tendonslicer",
    81 |         "skill:Glacial_Freeze",
    82 |         "skill:Added_Fire_Damage",
    83 |         "skill:Added_Cold_Damage",
    84 |         "skill:Steamroll",
    85 |         "skill:Added_Physical_Damage"
    86 |       ],
    87 |       "notesById": {
    88 |         "skill:Multiple_Projectiles": [
    89 |           "4E-2: allowedSkillTags must match active tags (Projectile), not support-gem tag only."
    90 |         ],
    91 |         "skill:Multistrike": [
    92 |           "4E-2: remove erroneous requiresChanneled from auto-parse; keep attack"
    93 |         ],
    94 |         "skill:Projectile_Split": [
    95 |           "4E-2: projectile pairing"
    96 |         ],
    97 |         "skill:Increased_Area": [
    98 |           "4E-2: 範圍技能 → Area canonical tag"
    99 |         ],
   100 |         "skill:Melee_Knockback": [
   101 |           "4E-2: melee attack"
   102 |         ],
   103 |         "skill:Overload": [
   104 |           "4E-2: spell-only"
   105 |         ],
   106 |         "skill:Tendonslicer": [
   107 |           "4E-2: hitting skills — Attack or Spell"
   108 |         ],
   109 |         "skill:Glacial_Freeze": [
   110 |           "4E-2: cold hits"
   111 |         ],
   112 |         "skill:Added_Fire_Damage": [
   113 |           "4E-2: spell gem"
   114 |         ],
   115 |         "skill:Added_Cold_Damage": [
   116 |           "4E-2: spell gem"
   117 |         ],
   118 |         "skill:Steamroll": [
   119 |           "4E-2: melee attack-only for regression (spell mains skip on requiresAttack)"
   120 |         ],
   121 |         "skill:Added_Physical_Damage": [
   122 |           "4E-2: attack gem — requires Attack"
   123 |         ]
   124 |       }
```

#### `data/effective/ss12/support-skills.json`

- **全檔含 `requiresSpell` 字樣**: 是；**全檔含 `allowedSkillTags` 字樣**: 是
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 否

##### 片段 1（行 10919–10950）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
 10919 |             ],
 10920 |             "partial": false
 10921 |           }
 10922 |         },
 10923 |         "supportRules": {},
 10924 |         "levelScalingMode": "table",
 10925 |         "parserVersion": "1/3"
 10926 |       }
 10927 |     },
 10928 |     {
 10929 |       "parseStatus": "ok",
 10930 |       "definition": {
 10931 |         "id": "skill:Added_Fire_Damage",
 10932 |         "name": "附加火焰傷害",
 10933 |         "family": "support",
 10934 |         "tags": [
 10935 |           "火焰",
 10936 |           "輔助"
 10937 |         ],
 10938 |         "sourceUrl": "https://tlidb.com/tw/Added_Fire_Damage",
 10939 |         "locale": "tw",
 10940 |         "season": "ss12",
 10941 |         "version": "1.0.0",
 10942 |         "summaryText": [
 10943 |           "輔助擊中敵人的技能。 被輔助技能附加 1 - 3 點火焰傷害 (Lv1:1) (Lv2:2) (Lv3:3) (Lv4:4) (Lv5:4) (Lv6:5) (Lv7:6) (Lv8:6) (Lv9:8) (Lv10:9) (Lv11:11) (Lv12:12) (Lv13:14) (Lv14:18) (Lv15:25) (Lv16:35) (Lv17:42) (Lv18:49) (Lv19:60) (Lv20:73) (Lv21 … [truncated 350 chars] … 20:135) (Lv21:137) (Lv22:138) (Lv23:140) (Lv24:141) (Lv25:142) (Lv26:144) (Lv27:145) (Lv28:147) (Lv29:148) (Lv30:150) (Lv31:151) (Lv32:153) (Lv33:154) (Lv34:156) (Lv35:157) (Lv36:159) (Lv37:160) (Lv38:162) (Lv39:164) (Lv40:165)"
 10944 |         ],
 10945 |         "detailText": [
 10946 |           "被輔助技能附加 1 - 3 點火焰傷害 (Lv1:1) (Lv2:2) (Lv3:3) (Lv4:4) (Lv5:4) (Lv6:5) (Lv7:6) (Lv8:6) (Lv9:8) (Lv10:9) (Lv11:11) (Lv12:12) (Lv13:14) (Lv14:18) (Lv15:25) (Lv16:35) (Lv17:42) (Lv18:49) (Lv19:60) (Lv20:73) (Lv21:74) (Lv22: … [truncated 339 chars] … 20:135) (Lv21:137) (Lv22:138) (Lv23:140) (Lv24:141) (Lv25:142) (Lv26:144) (Lv27:145) (Lv28:147) (Lv29:148) (Lv30:150) (Lv31:151) (Lv32:153) (Lv33:154) (Lv34:156) (Lv35:157) (Lv36:159) (Lv37:160) (Lv38:162) (Lv39:164) (Lv40:165)"
 10947 |         ],
 10948 |         "levelBreakpoints": [
 10949 |           {
 10950 |             "level": 1,
```

##### 片段 2（行 12396–12420）

- 本片段含 `requiresSpell`: 是；含 `allowedSkillTags`: 是

```text
 12396 |             "textLines": [
 12397 |               "被輔助技能附加 1 - 3 點火焰傷害: 89,165"
 12398 |             ],
 12399 |             "partial": false,
 12400 |             "baseDamage": 127
 12401 |           }
 12402 |         },
 12403 |         "supportRules": {
 12404 |           "allowedSkillTags": [
 12405 |             "Spell"
 12406 |           ],
 12407 |           "rawRequirementLines": [
 12408 |             "[override 4E-2] Spell skills (added fire)."
 12409 |           ],
 12410 |           "requiresSpell": true
 12411 |         },
 12412 |         "levelScalingMode": "table",
 12413 |         "parserVersion": "1/3"
 12414 |       },
 12415 |       "warnings": [
 12416 |         "[override-note] 4E-2: spell gem"
 12417 |       ]
 12418 |     },
 12419 |     {
 12420 |       "parseStatus": "ok",
```

### Frozen snapshot 層

#### `data/frozen/ss12/frozen-ss12-2fa05d141b4dab64.json`

- **全檔含 `requiresSpell` 字樣**: 否；**全檔含 `allowedSkillTags` 字樣**: 否
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 否

##### 片段 1（行 1–2）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
     1 | {"schemaVersion":1,"season":"ss12","frozenDatasetVersion":"ss12-2fa05d141b4dab64","datasetVersionId":3,"frozenAt":"2026-04-04T07:40:50.645Z","effectiveGeneratedAt":"2026-04-04T07:40:45.782Z","parserVersion":"1","normalizeParserV … [truncated 14209 chars] … arseStatusSummary":{"ok":323,"partial":7,"failed":0}},"dataQualityNote":"parseStatus ok/partial/failed and warnings_json are authoritative; the engine must not invent numeric skill fields from free text. Unknown stays unknown."}
     2 | 
```

#### `data/frozen/ss12/frozen-ss12-4c6daa13687bb819.json`

- **全檔含 `requiresSpell` 字樣**: 否；**全檔含 `allowedSkillTags` 字樣**: 否
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 否

##### 片段 1（行 1–2）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
     1 | {"schemaVersion":1,"season":"ss12","frozenDatasetVersion":"ss12-4c6daa13687bb819","datasetVersionId":1,"frozenAt":"2026-04-04T06:44:04.452Z","effectiveGeneratedAt":"2026-04-04T05:42:44.558Z","parserVersion":"1","normalizeParserV … [truncated 14210 chars] … rseStatusSummary":{"ok":319,"partial":11,"failed":0}},"dataQualityNote":"parseStatus ok/partial/failed and warnings_json are authoritative; the engine must not invent numeric skill fields from free text. Unknown stays unknown."}
     2 | 
```

#### `data/frozen/ss12/frozen-ss12-804867749ec910e6.json`

- **全檔含 `requiresSpell` 字樣**: 否；**全檔含 `allowedSkillTags` 字樣**: 否
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 否

##### 片段 1（行 1–2）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
     1 | {"schemaVersion":1,"season":"ss12","frozenDatasetVersion":"ss12-804867749ec910e6","datasetVersionId":2,"frozenAt":"2026-04-04T07:36:21.557Z","effectiveGeneratedAt":"2026-04-04T07:36:11.704Z","parserVersion":"1","normalizeParserV … [truncated 14209 chars] … arseStatusSummary":{"ok":323,"partial":7,"failed":0}},"dataQualityNote":"parseStatus ok/partial/failed and warnings_json are authoritative; the engine must not invent numeric skill fields from free text. Unknown stays unknown."}
     2 | 
```

#### `data/frozen/ss12/frozen-ss12-dc14cf39076467b5.json`

- **全檔含 `requiresSpell` 字樣**: 否；**全檔含 `allowedSkillTags` 字樣**: 否
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 否

##### 片段 1（行 1–2）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
     1 | {"schemaVersion":1,"season":"ss12","frozenDatasetVersion":"ss12-dc14cf39076467b5","datasetVersionId":4,"frozenAt":"2026-04-04T08:42:23.807Z","effectiveGeneratedAt":"2026-04-04T08:42:13.037Z","parserVersion":"1","normalizeParserV … [truncated 14211 chars] … arseStatusSummary":{"ok":330,"partial":0,"failed":0}},"dataQualityNote":"parseStatus ok/partial/failed and warnings_json are authoritative; the engine must not invent numeric skill fields from free text. Unknown stays unknown."}
     2 | 
```

### Runtime bundle / lookup 層

#### `lib/gameData/generated/effective-runtime-bundle.json`

- **全檔含 `requiresSpell` 字樣**: 是；**全檔含 `allowedSkillTags` 字樣**: 是
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 否

##### 片段 1（行 53838–53869）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
 53838 |               ],
 53839 |               "partial": false
 53840 |             }
 53841 |           },
 53842 |           "supportRules": {},
 53843 |           "levelScalingMode": "table",
 53844 |           "parserVersion": "1/3"
 53845 |         }
 53846 |       },
 53847 |       {
 53848 |         "parseStatus": "ok",
 53849 |         "definition": {
 53850 |           "id": "skill:Added_Fire_Damage",
 53851 |           "name": "附加火焰傷害",
 53852 |           "family": "support",
 53853 |           "tags": [
 53854 |             "火焰",
 53855 |             "輔助"
 53856 |           ],
 53857 |           "sourceUrl": "https://tlidb.com/tw/Added_Fire_Damage",
 53858 |           "locale": "tw",
 53859 |           "season": "ss12",
 53860 |           "version": "1.0.0",
 53861 |           "summaryText": [
 53862 |             "輔助擊中敵人的技能。 被輔助技能附加 1 - 3 點火焰傷害 (Lv1:1) (Lv2:2) (Lv3:3) (Lv4:4) (Lv5:4) (Lv6:5) (Lv7:6) (Lv8:6) (Lv9:8) (Lv10:9) (Lv11:11) (Lv12:12) (Lv13:14) (Lv14:18) (Lv15:25) (Lv16:35) (Lv17:42) (Lv18:49) (Lv19:60) (Lv20:73) (Lv … [truncated 352 chars] … 20:135) (Lv21:137) (Lv22:138) (Lv23:140) (Lv24:141) (Lv25:142) (Lv26:144) (Lv27:145) (Lv28:147) (Lv29:148) (Lv30:150) (Lv31:151) (Lv32:153) (Lv33:154) (Lv34:156) (Lv35:157) (Lv36:159) (Lv37:160) (Lv38:162) (Lv39:164) (Lv40:165)"
 53863 |           ],
 53864 |           "detailText": [
 53865 |             "被輔助技能附加 1 - 3 點火焰傷害 (Lv1:1) (Lv2:2) (Lv3:3) (Lv4:4) (Lv5:4) (Lv6:5) (Lv7:6) (Lv8:6) (Lv9:8) (Lv10:9) (Lv11:11) (Lv12:12) (Lv13:14) (Lv14:18) (Lv15:25) (Lv16:35) (Lv17:42) (Lv18:49) (Lv19:60) (Lv20:73) (Lv21:74) (Lv2 … [truncated 341 chars] … 20:135) (Lv21:137) (Lv22:138) (Lv23:140) (Lv24:141) (Lv25:142) (Lv26:144) (Lv27:145) (Lv28:147) (Lv29:148) (Lv30:150) (Lv31:151) (Lv32:153) (Lv33:154) (Lv34:156) (Lv35:157) (Lv36:159) (Lv37:160) (Lv38:162) (Lv39:164) (Lv40:165)"
 53866 |           ],
 53867 |           "levelBreakpoints": [
 53868 |             {
 53869 |               "level": 1,
```

##### 片段 2（行 55315–55339）

- 本片段含 `requiresSpell`: 是；含 `allowedSkillTags`: 是

```text
 55315 |               "textLines": [
 55316 |                 "被輔助技能附加 1 - 3 點火焰傷害: 89,165"
 55317 |               ],
 55318 |               "partial": false,
 55319 |               "baseDamage": 127
 55320 |             }
 55321 |           },
 55322 |           "supportRules": {
 55323 |             "allowedSkillTags": [
 55324 |               "Spell"
 55325 |             ],
 55326 |             "rawRequirementLines": [
 55327 |               "[override 4E-2] Spell skills (added fire)."
 55328 |             ],
 55329 |             "requiresSpell": true
 55330 |           },
 55331 |           "levelScalingMode": "table",
 55332 |           "parserVersion": "1/3"
 55333 |         },
 55334 |         "warnings": [
 55335 |           "[override-note] 4E-2: spell gem"
 55336 |         ]
 55337 |       },
 55338 |       {
 55339 |         "parseStatus": "ok",
```

##### 片段 3（行 96731–96785）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 是

```text
 96731 |       {
 96732 |         "file": "support-skills.json",
 96733 |         "overrideSource": "data\\overrides\\ss12\\support-skills.json",
 96734 |         "touchedIds": [
 96735 |           "skill:Multiple_Projectiles",
 96736 |           "skill:Multistrike",
 96737 |           "skill:Projectile_Split",
 96738 |           "skill:Increased_Area",
 96739 |           "skill:Melee_Knockback",
 96740 |           "skill:Overload",
 96741 |           "skill:Tendonslicer",
 96742 |           "skill:Glacial_Freeze",
 96743 |           "skill:Added_Fire_Damage",
 96744 |           "skill:Added_Cold_Damage",
 96745 |           "skill:Steamroll",
 96746 |           "skill:Added_Physical_Damage"
 96747 |         ],
 96748 |         "notesById": {
 96749 |           "skill:Multiple_Projectiles": [
 96750 |             "4E-2: allowedSkillTags must match active tags (Projectile), not support-gem tag only."
 96751 |           ],
 96752 |           "skill:Multistrike": [
 96753 |             "4E-2: remove erroneous requiresChanneled from auto-parse; keep attack"
 96754 |           ],
 96755 |           "skill:Projectile_Split": [
 96756 |             "4E-2: projectile pairing"
 96757 |           ],
 96758 |           "skill:Increased_Area": [
 96759 |             "4E-2: 範圍技能 → Area canonical tag"
 96760 |           ],
 96761 |           "skill:Melee_Knockback": [
 96762 |             "4E-2: melee attack"
 96763 |           ],
 96764 |           "skill:Overload": [
 96765 |             "4E-2: spell-only"
 96766 |           ],
 96767 |           "skill:Tendonslicer": [
 96768 |             "4E-2: hitting skills — Attack or Spell"
 96769 |           ],
 96770 |           "skill:Glacial_Freeze": [
 96771 |             "4E-2: cold hits"
 96772 |           ],
 96773 |           "skill:Added_Fire_Damage": [
 96774 |             "4E-2: spell gem"
 96775 |           ],
 96776 |           "skill:Added_Cold_Damage": [
 96777 |             "4E-2: spell gem"
 96778 |           ],
 96779 |           "skill:Steamroll": [
 96780 |             "4E-2: melee attack-only for regression (spell mains skip on requiresAttack)"
 96781 |           ],
 96782 |           "skill:Added_Physical_Damage": [
 96783 |             "4E-2: attack gem — requires Attack"
 96784 |           ]
 96785 |         }
```

### Verify / audit / test 腳本

#### `scripts/audit/findAddedFireDamageReferences.ts`

- **全檔含 `requiresSpell` 字樣**: 是；**全檔含 `allowedSkillTags` 字樣**: 是
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 是

##### 片段 1（行 1–14）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
     1 | /**
     2 |  * 4E-1 — Repo-wide reference map for Added_Fire_Damage (read-only scan).
     3 |  * Writes docs/debug-added-fire-damage-reference-map.md
     4 |  *
     5 |  *   npx tsx scripts/audit/findAddedFireDamageReferences.ts
     6 |  */
     7 | import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
     8 | import { join, relative, sep } from 'node:path'
     9 | 
    10 | const CONTEXT_BEFORE = 12
    11 | const CONTEXT_AFTER = 12
    12 | const MERGE_GAP = 8
    13 | const SPELL_WINDOW_CHARS = 12_000
    14 | /** Avoid embedding multi‑MB single-line JSON into the markdown report. */
```

##### 片段 2（行 82–109）

- 本片段含 `requiresSpell`: 是；含 `allowedSkillTags`: 是

```text
    82 |   'Override 層': 30,
    83 |   'Effective 層': 40,
    84 |   'Frozen snapshot 層': 45,
    85 |   'Runtime bundle / lookup 層': 50,
    86 |   'ETL / import 腳本': 15,
    87 |   'Verify / audit / test 腳本': 90,
    88 |   'Application / lib（非 runtime bundle）': 80,
    89 |   Docs: 95,
    90 |   Other: 99,
    91 | }
    92 | 
    93 | function lineMatches(line: string): boolean {
    94 |   if (line.includes('Added_Fire_Damage')) return true
    95 |   if (line.includes('skill:Added_Fire_Damage')) return true
    96 |   if (line.includes('附加火焰傷害')) return true
    97 |   if (/added fire/i.test(line)) return true
    98 |   return false
    99 | }
   100 | 
   101 | function scanFlags(text: string): { requiresSpell: boolean; allowedSkillTags: boolean } {
   102 |   return {
   103 |     requiresSpell: /requiresSpell/.test(text),
   104 |     allowedSkillTags: /allowedSkillTags/.test(text),
   105 |   }
   106 | }
   107 | 
   108 | function mergeIntervals(intervals: Array<{ lo: number; hi: number }>): Array<{ lo: number; hi: number }> {
   109 |   if (intervals.length === 0) return []
```

##### 片段 3（行 174–207）

- 本片段含 `requiresSpell`: 是；含 `allowedSkillTags`: 是

```text
   174 |         continue
   175 |       }
   176 |       if (st.isDirectory()) stack.push(full)
   177 |       else {
   178 |         const ext = name.includes('.') ? name.slice(name.lastIndexOf('.')).toLowerCase() : ''
   179 |         if (TEXT_EXT.has(ext)) out.push(full)
   180 |       }
   181 |     }
   182 |   }
   183 |   return out
   184 | }
   185 | 
   186 | /** True if this file appears to tie Added_Fire_Damage to Spell-only rules in one JSON-ish window. */
   187 | function spellOnlyForAddedFireInFile(content: string): boolean {
   188 |   const anchor = 'skill:Added_Fire_Damage'
   189 |   const idx = content.indexOf(anchor)
   190 |   if (idx < 0) return false
   191 |   const slice = content.slice(idx, idx + SPELL_WINDOW_CHARS)
   192 |   const hasSpellGate =
   193 |     /"requiresSpell"\s*:\s*true/.test(slice) ||
   194 |     /"allowedSkillTags"\s*:\s*\[[^\]]*"Spell"/.test(slice) ||
   195 |     /Spell skills \(added fire\)/.test(slice)
   196 |   return hasSpellGate
   197 | }
   198 | 
   199 | type FileHit = {
   200 |   rel: string
   201 |   layer: Layer
   202 |   regions: Array<{ lo: number; hi: number; snippet: string }>
   203 |   flagsInFile: { requiresSpell: boolean; allowedSkillTags: boolean }
   204 |   flagsInRegions: Array<{ requiresSpell: boolean; allowedSkillTags: boolean }>
   205 |   spellOnlyForGem: boolean
   206 | }
   207 | 
```

##### 片段 4（行 268–345）

- 本片段含 `requiresSpell`: 是；含 `allowedSkillTags`: 是

```text
   268 |     'Frozen snapshot 層',
   269 |     'Runtime bundle / lookup 層',
   270 |     'ETL / import 腳本',
   271 |     'Verify / audit / test 腳本',
   272 |     'Application / lib（非 runtime bundle）',
   273 |     'Docs',
   274 |     'Other',
   275 |   ]
   276 | 
   277 |   const firstSpellSteer = hits.filter((h) => h.spellOnlyForGem).sort((a, b) => PIPELINE_ORDER[a.layer] - PIPELINE_ORDER[b.layer] || a.rel.localeCompare(b.rel, 'en'))[0]
   278 | 
   279 |   const md: string[] = []
   280 |   md.push('# Added_Fire_Damage — 全專案引用分層圖（4E-1）')
   281 |   md.push('')
   282 |   md.push(`Generated: ${new Date().toISOString()}`)
   283 |   md.push('')
   284 |   md.push('掃描關鍵字：`Added_Fire_Damage`、`skill:Added_Fire_Damage`、`added fire`（不分大小寫）、`附加火焰傷害`。')
   285 |   md.push('')
   286 |   md.push('## 比對摘要（資料管線）')
   287 |   md.push('')
   288 |   const inNorm = hits.some((h) => h.layer === 'Normalized 層')
   289 |   const inEff = hits.some((h) => h.layer === 'Effective 層')
   290 |   const inRt = hits.some((h) => h.layer === 'Runtime bundle / lookup 層')
   291 |   const rawOnly = hits.some((h) => h.layer === 'Raw page / 原始抓頁層')
   292 |   md.push(`- **Raw 層有命中**: ${rawOnly ? '是' : '否'}`)
   293 |   md.push(`- **Normalized 層有命中**: ${inNorm ? '是' : '否'}`)
   294 |   md.push(`- **Effective 層有命中**: ${inEff ? '是' : '否'}`)
   295 |   md.push(`- **Runtime bundle 層有命中**: ${inRt ? '是' : '否'}`)
   296 |   md.push('')
   297 |   md.push('### 情境對照（A / B / C）')
   298 |   md.push('')
   299 |   md.push('- **情況 A**（只在 raw/normalized，未進 effective）：若 effective 無此 id 相關列 → ETL / override / import 鏈斷裂。本 repo 目前 effective 與 runtime 皆有 `Added_Fire_Damage` 命中 → **非 A**。')
   300 |   md.push('- **情況 B**（override / effective 內 `supportRules` 被標成 Spell-only）：若在同一檔案視窗內同時出現 `skill:Added_Fire_Damage` 與 `requiresSpell` / `allowedSkillTags: Spell` → **偏向 B**。')
   301 |   md.push('- **情況 C**（effective 正確但 runtime 吃到別版）：若 effective 與 generated bundle 規則不一致 → 打包/啟用層問題。需比對兩檔片段（下方各層區塊）。')
   302 |   md.push('')
   303 |   md.push('## 第一個把此輔助導向 Spell-only 的資料來源（腳本判定）')
   304 |   md.push('')
   305 |   if (firstSpellSteer) {
   306 |     md.push(
   307 |       `依「管線層級由先到後」且在同一檔案視窗內（錨點 \`skill:Added_Fire_Damage\` 後 ${SPELL_WINDOW_CHARS} 字元）同時出現 Spell 門檻欄位，**第一個命中檔案**為：`,
   308 |     )
   309 |     md.push('')
   310 |     md.push(`- **路徑**: \`${firstSpellSteer.rel}\``)
   311 |     md.push(`- **層級**: ${firstSpellSteer.layer}`)
   312 |     md.push(
   313 |       `- **說明**: 此檔在錨點附近可見 \`requiresSpell: true\`、或 \`allowedSkillTags\` 含 \`Spell\`、或文案 \`Spell skills (added fire)\` → 即為把規則鎖成 Spell-only 的**最早可觀測層**（normalized 大檔若無此共現，則不會被判為早于 override）。`,
   314 |     )
   315 |   } else {
   316 |     md.push('腳本未在任何檔案中找到「`skill:Added_Fire_Damage` + Spell 門檻」共現視窗；請人工檢查拆檔或非 JSON 來源。')
   317 |   }
   318 |   md.push('')
   319 |   md.push('## 依層級分組 — 命中檔案總表')
   320 |   md.push('')
   321 | 
   322 |   for (const layer of layerOrder) {
   323 |     const group = byLayer.get(layer)
   324 |     if (!group?.length) continue
   325 |     md.push(`### ${layer}`)
   326 |     md.push('')
   327 |     for (const h of group) {
   328 |       md.push(`#### \`${h.rel}\``)
   329 |       md.push('')
   330 |       md.push(
   331 |         `- **全檔含 \`requiresSpell\` 字樣**: ${h.flagsInFile.requiresSpell ? '是' : '否'}；**全檔含 \`allowedSkillTags\` 字樣**: ${h.flagsInFile.allowedSkillTags ? '是' : '否'}`,
   332 |       )
   333 |       md.push(`- **錨點視窗內 Spell-only（Added_Fire_Damage）**: ${h.spellOnlyForGem ? '是' : '否'}`)
   334 |       md.push('')
   335 |       h.regions.forEach((r, i) => {
   336 |         const rf = h.flagsInRegions[i]
   337 |         md.push(`##### 片段 ${i + 1}（行 ${r.lo + 1}–${r.hi + 1}）`)
   338 |         md.push('')
   339 |         md.push(
   340 |           `- 本片段含 \`requiresSpell\`: ${rf.requiresSpell ? '是' : '否'}；含 \`allowedSkillTags\`: ${rf.allowedSkillTags ? '是' : '否'}`,
   341 |         )
   342 |         md.push('')
   343 |         md.push('```text')
   344 |         md.push(r.snippet)
   345 |         md.push('```')
```

#### `scripts/verify/debugAddedFireDamagePath.ts`

- **全檔含 `requiresSpell` 字樣**: 是；**全檔含 `allowedSkillTags` 字樣**: 是
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 否

##### 片段 1（行 1–26）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
     1 | /**
     2 |  * 4E-0 — Baseline evidence: Added_Fire_Damage vs Hammer_of_Ash (Spell-only diagnosis).
     3 |  * Read-only: loads effective JSON + summarizes applySupportRules; writes docs/debug-added-fire-damage-baseline.md
     4 |  *
     5 |  *   npx tsx scripts/verify/debugAddedFireDamagePath.ts
     6 |  */
     7 | import { readFileSync, writeFileSync } from 'node:fs'
     8 | import { join } from 'node:path'
     9 | import { evaluateSupportAttachment } from '@/lib/formula/skills/applySupportRules'
    10 | import { activeCanonicalTagSet } from '@/lib/formula/skills/tagVocabulary'
    11 | import type { SkillDefinition } from '@/types/skillData'
    12 | 
    13 | const MAIN_ID = 'skill:Hammer_of_Ash'
    14 | const SUPPORT_ID = 'skill:Added_Fire_Damage'
    15 | 
    16 | type EffectiveSkillFile = {
    17 |   meta?: Record<string, unknown>
    18 |   skills: Array<{ parseStatus?: string; definition: SkillDefinition; warnings?: string[] }>
    19 | }
    20 | 
    21 | function loadEffectiveJson(rel: string): EffectiveSkillFile {
    22 |   const p = join(process.cwd(), 'data', 'effective', 'ss12', rel)
    23 |   const raw = readFileSync(p, 'utf8')
    24 |   return JSON.parse(raw) as EffectiveSkillFile
    25 | }
    26 | 
```

##### 片段 2（行 46–151）

- 本片段含 `requiresSpell`: 是；含 `allowedSkillTags`: 是

```text
    46 | }
    47 | 
    48 | function main() {
    49 |   const activeFile = loadEffectiveJson('active-skills.json')
    50 |   const supportFile = loadEffectiveJson('support-skills.json')
    51 | 
    52 |   const hammer = findDef(activeFile, MAIN_ID)
    53 |   const addedFire = findDef(supportFile, SUPPORT_ID)
    54 | 
    55 |   const lines: string[] = []
    56 |   const md: string[] = []
    57 | 
    58 |   md.push('# Debug baseline — Added_Fire_Damage × Hammer_of_Ash（4E-0）')
    59 |   md.push('')
    60 |   md.push(`Generated: ${new Date().toISOString()}`)
    61 |   md.push('')
    62 |   md.push('## A. 主技能 `skill:Hammer_of_Ash`（effective active-skills）')
    63 |   if (!hammer) {
    64 |     lines.push(`NOT_FOUND_IN_EFFECTIVE_ACTIVES: ${MAIN_ID}`)
    65 |     md.push(`- **存在性**: 否 → \`NOT_FOUND_IN_EFFECTIVE_ACTIVES\``)
    66 |   } else {
    67 |     lines.push(`FOUND: ${MAIN_ID} name=${hammer.name}`)
    68 |     md.push(`- **存在性**: 是（name: ${hammer.name}）`)
    69 |     md.push(`- **原始 tags**: \`${JSON.stringify(hammer.tags)}\``)
    70 |     const canon = [...activeCanonicalTagSet(hammer.tags)]
    71 |     canon.sort((a, b) => a.localeCompare(b, 'en'))
    72 |     md.push(`- **canonical 展開（含原文 + 對照）**: \`${JSON.stringify(canon)}\``)
    73 |     const hasSpellCanon = canon.includes('Spell')
    74 |     const hasAttackCanon = canon.includes('Attack')
    75 |     md.push(`- **含 Attack（canonical）**: ${hasAttackCanon}`)
    76 |     md.push(`- **含 Spell（canonical）**: ${hasSpellCanon}`)
    77 |     md.push(
    78 |       `- **結論（A）**: 若僅有 Attack、無 Spell，則「主技能被誤標成 Spell」**不是**此組資料下的原因；與 \`requiresSpell\` 衝突時應往 **support 規則 / override 合併** 追查。`,
    79 |     )
    80 |   }
    81 |   md.push('')
    82 | 
    83 |   md.push('## B. 輔助 `skill:Added_Fire_Damage`（effective support-skills）')
    84 |   if (!addedFire) {
    85 |     lines.push(`NOT_FOUND_IN_EFFECTIVE_SUPPORTS: ${SUPPORT_ID}`)
    86 |     md.push(`- **存在性**: 否 → \`NOT_FOUND_IN_EFFECTIVE_SUPPORTS\`（問題含資料缺漏或 runtime 未吃 effective）`)
    87 |   } else {
    88 |     lines.push(`FOUND: ${SUPPORT_ID} name=${addedFire.name}`)
    89 |     md.push(`- **存在性**: 是（name: ${addedFire.name}）`)
    90 |     md.push(`- **原始 tags**: \`${JSON.stringify(addedFire.tags)}\``)
    91 |     const rules = addedFire.supportRules
    92 |     if (!rules || Object.keys(rules).length === 0) {
    93 |       md.push('- **supportRules**: `{}` 或缺漏（引擎會視為相容）')
    94 |     } else {
    95 |       md.push(`- **supportRules（effective 合併後）**:`)
    96 |       md.push('```json')
    97 |       md.push(JSON.stringify(rules, null, 2))
    98 |       md.push('```')
    99 |     }
   100 |     const wr = supportFile.skills.find((s) => s.definition?.id === SUPPORT_ID)
   101 |     if (wr?.warnings?.length) {
   102 |       md.push(`- **record warnings**: ${wr.warnings.map((w) => `\`${w}\``).join(', ')}`)
   103 |     }
   104 |   }
   105 |   md.push('')
   106 | 
   107 |   md.push('## C. 引擎試算：`evaluateSupportAttachment(Hammer_of_Ash, Added_Fire_Damage)`')
   108 |   if (hammer && addedFire) {
   109 |     const ev = evaluateSupportAttachment(hammer, addedFire)
   110 |     md.push('```json')
   111 |     md.push(JSON.stringify(ev, null, 2))
   112 |     md.push('```')
   113 |     md.push(
   114 |       `- **applied**: ${ev.applied}；**skipReason**: \`${ev.skipReason ?? '—'}\`（與 \`applySupportRules\` 一致）`,
   115 |     )
   116 |     md.push(
   117 |       '- **規則順序備註**：`ruleFailsOnTags` 先檢查 `allowedSkillTags`，再檢查 `requiresSpell`。本例同時設了 `allowedSkillTags: [\"Spell\"]` 與 `requiresSpell: true`，實際命中的是 **`allowedSkillTags_unsatisfied`**（若僅有後者，會顯示 `requires_spell`）。',
   118 |     )
   119 |   } else {
   120 |     md.push('- （略：缺主技能或輔助定義）')
   121 |   }
   122 |   md.push('')
   123 | 
   124 |   md.push('## D. `applySupportRules.ts`（`ruleFailsOnTags`）判斷摘要')
   125 |   md.push('')
   126 |   md.push(applySupportRulesSummaryMd())
   127 |   md.push('')
   128 | 
   129 |   md.push('## E. 與 override 層的對照（只讀路徑）')
   130 |   md.push('')
   131 |   md.push(
   132 |     '若 effective 中 `Added_Fire_Damage.supportRules` 出現 `requiresSpell` / `allowedSkillTags: [\"Spell\"]`，請打開 **`data/overrides/ss12/support-skills.json`** 搜尋 `\"id\": \"skill:Added_Fire_Damage\"` 的 `supportRulesMerge`（本 repo 目前註記為 **4E-2: spell gem**，會合併進 effective；本輪僅記錄路徑，不修改）。',
   133 |   )
   134 |   md.push('')
   135 | 
   136 |   md.push('## F. 回歸缺口')
   137 |   md.push('')
   138 |   md.push(
   139 |     '- `scripts/verify/skillRegressionCases.ts` 目前**無** `Added_Fire_Damage` + `Hammer_of_Ash` 的固定案例（後續 4E-x 可補）。',
   140 |   )
   141 | 
   142 |   const outPath = join(process.cwd(), 'docs', 'debug-added-fire-damage-baseline.md')
   143 |   writeFileSync(outPath, md.join('\n'), 'utf8')
   144 | 
   145 |   console.log('[debug:added-fire-damage-path] wrote', outPath)
   146 |   for (const l of lines) console.log(l)
   147 |   console.log('[debug:added-fire-damage-path] OK')
   148 | }
   149 | 
   150 | main()
   151 | 
```

#### `scripts/verify/p0SkillIds.ts`

- **全檔含 `requiresSpell` 字樣**: 否；**全檔含 `allowedSkillTags` 字樣**: 否
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 否

##### 片段 1（行 17–36）

- 本片段含 `requiresSpell`: 否；含 `allowedSkillTags`: 否

```text
    17 |   'skill:Chain_Lightning',
    18 |   'skill:Ring_of_Ice',
    19 | ] as const
    20 | 
    21 | /** Entries from `data/overrides/ss12/support-skills.json` (4E-2 curated supports). */
    22 | export const P0_SUPPORT_SKILL_IDS = [
    23 |   'skill:Multiple_Projectiles',
    24 |   'skill:Projectile_Split',
    25 |   'skill:Increased_Area',
    26 |   'skill:Tendonslicer',
    27 |   'skill:Glacial_Freeze',
    28 |   'skill:Added_Physical_Damage',
    29 |   'skill:Added_Fire_Damage',
    30 |   'skill:Added_Cold_Damage',
    31 |   'skill:Melee_Knockback',
    32 |   'skill:Steamroll',
    33 |   'skill:Multistrike',
    34 |   'skill:Overload',
    35 | ] as const
    36 | 
```

### Docs

#### `docs/debug-added-fire-damage-baseline.md`

- **全檔含 `requiresSpell` 字樣**: 是；**全檔含 `allowedSkillTags` 字樣**: 是
- **錨點視窗內 Spell-only（Added_Fire_Damage）**: 是

##### 片段 1（行 1–66）

- 本片段含 `requiresSpell`: 是；含 `allowedSkillTags`: 是

```text
     1 | # Debug baseline — Added_Fire_Damage × Hammer_of_Ash（4E-0）
     2 | 
     3 | Generated: 2026-04-04T11:22:01.741Z
     4 | 
     5 | ## A. 主技能 `skill:Hammer_of_Ash`（effective active-skills）
     6 | - **存在性**: 是（name: 灰燼之鎚）
     7 | - **原始 tags**: `["範圍","火焰","攻擊","投射物","近戰","破擊","直射"]`
     8 | - **canonical 展開（含原文 + 對照）**: `["Area","Attack","Demolish","Fire","Melee","Projectile","投射物","攻擊","火焰","直射","破擊","範圍","近戰"]`
     9 | - **含 Attack（canonical）**: true
    10 | - **含 Spell（canonical）**: false
    11 | - **結論（A）**: 若僅有 Attack、無 Spell，則「主技能被誤標成 Spell」**不是**此組資料下的原因；與 `requiresSpell` 衝突時應往 **support 規則 / override 合併** 追查。
    12 | 
    13 | ## B. 輔助 `skill:Added_Fire_Damage`（effective support-skills）
    14 | - **存在性**: 是（name: 附加火焰傷害）
    15 | - **原始 tags**: `["火焰","輔助"]`
    16 | - **supportRules（effective 合併後）**:
    17 | ```json
    18 | {
    19 |   "allowedSkillTags": [
    20 |     "Spell"
    21 |   ],
    22 |   "rawRequirementLines": [
    23 |     "[override 4E-2] Spell skills (added fire)."
    24 |   ],
    25 |   "requiresSpell": true
    26 | }
    27 | ```
    28 | - **record warnings**: `[override-note] 4E-2: spell gem`
    29 | 
    30 | ## C. 引擎試算：`evaluateSupportAttachment(Hammer_of_Ash, Added_Fire_Damage)`
    31 | ```json
    32 | {
    33 |   "applied": false,
    34 |   "warnings": [
    35 |     "allowedSkillTags_unsatisfied:Spell"
    36 |   ],
    37 |   "skipReason": "allowedSkillTags_unsatisfied:Spell",
    38 |   "rawRequirementLines": [
    39 |     "[override 4E-2] Spell skills (added fire)."
    40 |   ]
    41 | }
    42 | ```
    43 | - **applied**: false；**skipReason**: `allowedSkillTags_unsatisfied:Spell`（與 `applySupportRules` 一致）
    44 | - **規則順序備註**：`ruleFailsOnTags` 先檢查 `allowedSkillTags`，再檢查 `requiresSpell`。本例同時設了 `allowedSkillTags: ["Spell"]` 與 `requiresSpell: true`，實際命中的是 **`allowedSkillTags_unsatisfied`**（若僅有後者，會顯示 `requires_spell`）。
    45 | 
    46 | ## D. `applySupportRules.ts`（`ruleFailsOnTags`）判斷摘要
    47 | 
    48 | 資料來源：`lib/formula/skills/applySupportRules.ts`（只讀摘要，非修改）。
    49 | 
    50 | 1. **forbiddenSkillTags**：主技能 canonical tag 集若命中任一禁止 tag → `forbidden_tag:<t>`。
    51 | 2. **allowedSkillTags**：若陣列非空，主技能須至少命中其中一個（中英對照經 `zhTagToCanonical`）→ 否則 `allowedSkillTags_unsatisfied:...`。
    52 | 3. **requiresAttack**：`true` 且主技能無 canonical `Attack` → `requires_attack`。
    53 | 4. **requiresSpell**：`true` 且主技能無 canonical `Spell` → `requires_spell`。
    54 | 5. **requiresProjectile / requiresChanneled / requiresMelee**：同理對應 canonical 鍵。
    55 | 6. **無 supportRules 或空物件**：視為相容，`applied: true`（帶 warning）。
    56 | 
    57 | 主技能 tag 集：`activeCanonicalTagSet(active.tags)` — 同時保留原文與 `zhTagToCanonical` 結果（見 `tagVocabulary.ts`）。
    58 | 
    59 | 
    60 | ## E. 與 override 層的對照（只讀路徑）
    61 | 
    62 | 若 effective 中 `Added_Fire_Damage.supportRules` 出現 `requiresSpell` / `allowedSkillTags: ["Spell"]`，請打開 **`data/overrides/ss12/support-skills.json`** 搜尋 `"id": "skill:Added_Fire_Damage"` 的 `supportRulesMerge`（本 repo 目前註記為 **4E-2: spell gem**，會合併進 effective；本輪僅記錄路徑，不修改）。
    63 | 
    64 | ## F. 回歸缺口
    65 | 
    66 | - `scripts/verify/skillRegressionCases.ts` 目前**無** `Added_Fire_Damage` + `Hammer_of_Ash` 的固定案例（後續 4E-x 可補）。
```

## 扁平清單（路徑 + 層級）

| 層級 | 路徑 | 錨點視窗 Spell-only |
| --- | --- | --- |
| Raw page / 原始抓頁層 | `data/raw/ss12/indexes/Support_Skill.html` | 否 |
| Raw page / 原始抓頁層 | `data/raw/ss12/indexes/Support_Skill.md` | 否 |
| Raw page / 原始抓頁層 | `data/raw/ss12/manifests/pages.manifest.json` | 否 |
| Raw page / 原始抓頁層 | `data/raw/ss12/manifests/skill-urls.json` | 否 |
| Raw page / 原始抓頁層 | `data/raw/ss12/pages/tw/Added_Fire_Damage.html` | 否 |
| Raw page / 原始抓頁層 | `data/raw/ss12/pages/tw/Added_Fire_Damage.md` | 否 |
| Raw page / 原始抓頁層 | `data/raw/ss12/pages/tw/Aeterna_Season.html` | 否 |
| Raw page / 原始抓頁層 | `data/raw/ss12/pages/tw/Aeterna_Season.md` | 否 |
| Raw page / 原始抓頁層 | `data/raw/ss12/pages/tw/Craft.html` | 否 |
| Raw page / 原始抓頁層 | `data/raw/ss12/pages/tw/Craft.md` | 否 |
| Raw page / 原始抓頁層 | `data/raw/ss12/pages/tw/Legendary_Gear.html` | 否 |
| Raw page / 原始抓頁層 | `data/raw/ss12/pages/tw/Legendary_Gear.md` | 否 |
| Raw page / 原始抓頁層 | `data/raw/ss12/pages/tw/Netherrealm.html` | 否 |
| Raw page / 原始抓頁層 | `data/raw/ss12/pages/tw/Netherrealm.md` | 否 |
| Normalized 層 | `data/normalized/ss12/support-skills.json` | 否 |
| Override 層 | `data/overrides/ss12/support-skills.json` | 是 |
| Effective 層 | `data/effective/ss12/override-report.json` | 否 |
| Effective 層 | `data/effective/ss12/support-skills.json` | 否 |
| Frozen snapshot 層 | `data/frozen/ss12/frozen-ss12-2fa05d141b4dab64.json` | 否 |
| Frozen snapshot 層 | `data/frozen/ss12/frozen-ss12-4c6daa13687bb819.json` | 否 |
| Frozen snapshot 層 | `data/frozen/ss12/frozen-ss12-804867749ec910e6.json` | 否 |
| Frozen snapshot 層 | `data/frozen/ss12/frozen-ss12-dc14cf39076467b5.json` | 否 |
| Runtime bundle / lookup 層 | `lib/gameData/generated/effective-runtime-bundle.json` | 否 |
| Verify / audit / test 腳本 | `scripts/audit/findAddedFireDamageReferences.ts` | 是 |
| Verify / audit / test 腳本 | `scripts/verify/debugAddedFireDamagePath.ts` | 否 |
| Verify / audit / test 腳本 | `scripts/verify/p0SkillIds.ts` | 否 |
| Docs | `docs/debug-added-fire-damage-baseline.md` | 是 |
