/**
 * 天賦樹面板文案（繁中）。未來新增語系時複製結構並在 catalog 註冊。
 */
export const talentTreePanelZh = {
  boardTabs: {
    godTree: '神系天賦',
    classTree: '職業天賦',
    extraBoards: '第三／四盤',
    divinity: '神格天賦',
  },
  nodeType: {
    entry: '起點',
    small: '小型',
    medium: '中型',
    major: '大型',
    keystone: '傳奇',
    special: '特殊',
  },
  pageTitle: '天賦樹',
  pageSubtitle:
    '四塊盤面皆可自 30 張天賦牆擇一；主區 8×5 含牆上傳奇，右側以「第一階／第二階」下拉選擇具名頂級天賦（核心詞綴）。底部先列綠字數值桶，其下為四盤總覽與逐行明細（條件式單獨分組）。',
  currentWall: '本盤牆面：',
  sixGodsSection: '六神',
  professionWallsSection: '職業牆',
  mainStageCaption: '8×5 牆面 + 具名頂級（階段下拉）',
  pointsInvestedThisBoard: (n: number) => `本盤已投入 ${n} 天賦點`,
  sidePanelTitle: '附屬資訊',
  sidePanelBlurb:
    '四塊盤可各選不同牆面；切換牆面會清空該盤階級與右側兩階具名天賦。牆上傳奇請直接點主格。',
  nodeDetailPlaceholder: '點選主舞台節點後，此處顯示詳細。',
  tooltipNoEffects: '（尚無效果摘要）',
  tooltipRank: (rank: number, max: number) => `目前階級：${rank} / ${max}`,
  tooltipAffixPending: '詞綴尚未對應 talent-affixes（affixPending）。',
  tooltipReference: (line: string) => `參考：${line}`,
  keystoneTitleWithEffect: (effectZh: string) => `傳奇天賦 · ${effectZh}`,
  keystoneTitleFallback: '傳奇天賦',
  keystoneExtraEffectCount: (n: number) => `另有 ${n} 條效果（見浮層）`,
  detailNodeType: '節點類型',
  detailMaxPoints: (max: number) => `（最多 ${max} 點）`,
  detailEffectsZh: '效果（摘要）',
  detailGridCoords: '格座標',
  detailGridCoordsLine: (x: number, y: number, slot: number) => `橫 ${x}、直 ${y}、格序 ${slot}`,
  detailNodeIdLabel: '節點識別碼',
  affixPendingBody:
    '詞綴尚未對應（affixPending）。請對照備註中的 TLI 參考後接上 talent-affixes 資料。',
  prereqRequires: '前置需求節點',
  edgesTo: '連出節點',
  notesLabel: '備註',
  rankLabel: '階級',
  rankClickHint: (max: number) => `主格點擊為 0→1→…→${max}→0 循環。`,
  emptyCellAria: (x: number, y: number) => `空格 · 欄 ${x} · 列 ${y}`,
  namedGrandTitle: '具名頂級天賦',
  namedGrandTier1Tooltip: '第一階具名頂級',
  namedGrandTier2Tooltip: '第二階具名頂級',
  namedGrandRowPrimary: '第一階',
  namedGrandRowSecondary: '第二階',
  namedGrandPerPanelPoints: (minPts: number) => ` · ≥${minPts} 點牆面`,
  namedGrandPickOne: '下拉擇一',
  namedGrandNeedPoints: (need: number, have: number) =>
    `需本盤牆面至少 ${need} 點（目前 ${have}）`,
  selectNoAffixThisTier: '（此階無對應詞綴）',
  selectNone: '（未選擇）',
  tooltipNotSelected: '（未選擇）',
  namedGrandHelpPerPanel:
    '每階一個下拉：達門檻後從該階可選詞綴中擇一（三或五選一等，依神系資料）；牆上傳奇請點主格。',
  namedGrandHelpLegacy: '每階一個下拉；與左側牆面格座標無關。牆上傳奇請點主格。',
  rollupTitle: '四盤效果總覽',
  rollupIntroBeforePoints: '合計已投入 ',
  rollupIntroAfterPoints:
    ' 牆面天賦點。上方綠字為可進引擎桶的合計；條件式加成不併入綠字桶，僅列於下方明細。泛用「傷害」與法術／攻擊／元素等分項分列。具名頂級說明亦在明細中。',
  rollupBucketsTitle: '數值桶合計（引擎式）',
  rollupBucketsEmpty: '尚無可解析進桶的加成。',
  rollupUnbucketedTitle: '其他效果（未進數值桶）',
  rollupManifestTitle: '常駐效果（逐行）',
  rollupManifestBlurb: '牆面節點 × 階級；與綠字桶對照時，多列可能合併為同一欄。',
  rollupManifestConditionalTitle: '條件式／場景效果（不進桶）',
  rollupManifestConditionalBlurb:
    '對特定敵人狀態、時間窗、持有祝福等才生效；不計入上方綠字合計。',
} as const

export type TalentTreePanelMessages = typeof talentTreePanelZh
