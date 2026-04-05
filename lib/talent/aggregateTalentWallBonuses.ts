import type { BuildSnapshot } from '@/types/build'
import type { AggregatedBuckets, StatBlock } from '@/types/combat'
import type { TalentPanelNode } from '@/types/talentPanel'
import { aggregateStatBlocks } from '@/lib/formula/aggregateStats'
import { suggestedTalentNodeId, TALENT_PANEL_NODES_FILE, TALENT_PANEL_SEASON } from '@/lib/talent/talentPanelClientData'
import { translateTalentEffectLineEnToZh } from '@/lib/talent/talentEffectLineZh'
import { statBlocksForTalentLineAndRank } from '@/lib/talent/parseTalentEffectLineToStatBlock'
import {
  lookupCoreTalentAffix,
  NAMED_GRAND_TALENT_SLOT_COUNT,
  normalizeNamedGrandAffixSlots,
} from '@/lib/talent/namedGrandTalentCatalog'
import { statBlocksFromAffixModifiers } from '@/lib/talent/affixModifiersToStatBlocks'

function buildNodeById(): Map<string, TalentPanelNode> {
  const m = new Map<string, TalentPanelNode>()
  const season = TALENT_PANEL_SEASON
  for (const n of TALENT_PANEL_NODES_FILE.nodes) {
    const id = n.nodeId?.trim() || suggestedTalentNodeId(n.panelId, n.slotIndex, season)
    m.set(id, n)
  }
  return m
}

const NODE_BY_ID = buildNodeById()

export type TalentWallUnbucketedRollup = {
  lineZh: string
  stackedWeight: number
}

export function aggregatedTalentWallBucketsToZh(b: AggregatedBuckets): string[] {
  const lines: string[] = []
  const r0 = (n: number) => Math.round(n * 100) / 100

  if (b.strength) lines.push(`力量 +${r0(b.strength)}`)
  if (b.dexterity) lines.push(`敏捷 +${r0(b.dexterity)}`)
  if (b.intelligence) lines.push(`智慧 +${r0(b.intelligence)}`)
  if (b.hpFlat) lines.push(`生命（固定） +${r0(b.hpFlat)}`)
  if (b.hpPct) lines.push(`最大生命 +${r0(b.hpPct)}%`)
  if (b.mpFlat) lines.push(`魔力（固定） +${r0(b.mpFlat)}`)
  if (b.mpPct) lines.push(`最大魔力 +${r0(b.mpPct)}%`)
  if (b.attackSpeedPct) lines.push(`攻擊／施法速度 +${r0(b.attackSpeedPct)}%`)
  if (b.baseDamageFlat) lines.push(`基礎傷害 +${r0(b.baseDamageFlat)}`)
  if (b.damagePct) lines.push(`傷害（遞增 %，泛用） +${r0(b.damagePct)}%`)
  if (b.channeledDamagePct)
    lines.push(`引導技能傷害（遞增 %） +${r0(b.channeledDamagePct)}%`)
  if (b.spellDamagePct) lines.push(`法術傷害（遞增 %） +${r0(b.spellDamagePct)}%`)
  if (b.attackDamagePct) lines.push(`攻擊傷害（遞增 %） +${r0(b.attackDamagePct)}%`)
  if (b.meleeDamagePct) lines.push(`近戰傷害（遞增 %） +${r0(b.meleeDamagePct)}%`)
  if (b.projectileDamagePct) lines.push(`投射物傷害（遞增 %） +${r0(b.projectileDamagePct)}%`)
  if (b.physicalDamagePct) lines.push(`物理傷害（遞增 %） +${r0(b.physicalDamagePct)}%`)
  if (b.erosionDamagePct) lines.push(`腐蝕傷害（遞增 %） +${r0(b.erosionDamagePct)}%`)
  if (b.fireDamagePct) lines.push(`火焰傷害（遞增 %） +${r0(b.fireDamagePct)}%`)
  if (b.lightningDamagePct) lines.push(`閃電傷害（遞增 %） +${r0(b.lightningDamagePct)}%`)
  if (b.coldDamagePct) lines.push(`冰冷傷害（遞增 %） +${r0(b.coldDamagePct)}%`)
  if (b.elementalDamagePct) lines.push(`元素傷害（遞增 %） +${r0(b.elementalDamagePct)}%`)
  if (b.dotDamagePct) lines.push(`持續傷害（遞增 %） +${r0(b.dotDamagePct)}%`)
  if (b.minionDamagePct) lines.push(`召喚物傷害（遞增 %） +${r0(b.minionDamagePct)}%`)
  if (b.minionFireDamagePct) lines.push(`召喚物火焰傷害（遞增 %） +${r0(b.minionFireDamagePct)}%`)
  if (b.minionLightningDamagePct)
    lines.push(`召喚物閃電傷害（遞增 %） +${r0(b.minionLightningDamagePct)}%`)
  if (b.minionColdDamagePct) lines.push(`召喚物冰冷傷害（遞增 %） +${r0(b.minionColdDamagePct)}%`)
  if (b.minionErosionDamagePct) lines.push(`召喚物腐蝕傷害（遞增 %） +${r0(b.minionErosionDamagePct)}%`)
  if (b.minionPhysicalDamagePct) lines.push(`召喚物物理傷害（遞增 %） +${r0(b.minionPhysicalDamagePct)}%`)
  if (b.weaponDamageEffectivenessPct) lines.push(`武器傷害效用 +${r0(b.weaponDamageEffectivenessPct)}%`)
  if (b.critChancePct) lines.push(`暴擊值相關 +${r0(b.critChancePct)}%`)
  if (b.critDamagePct) lines.push(`暴擊傷害 +${r0(b.critDamagePct)}%`)
  if (b.moreDamageMult !== 1) lines.push(`額外傷害（連乘） ×${r0(b.moreDamageMult)}`)
  if (b.coldResistancePct) lines.push(`冰冷抗性 +${r0(b.coldResistancePct)}%`)
  if (b.fireResistancePct) lines.push(`火焰抗性 +${r0(b.fireResistancePct)}%`)
  if (b.lightningResistancePct) lines.push(`閃電抗性 +${r0(b.lightningResistancePct)}%`)
  if (b.erosionResistancePct) lines.push(`腐蝕抗性 +${r0(b.erosionResistancePct)}%`)
  if (b.elementalResistancePct) lines.push(`元素抗性 +${r0(b.elementalResistancePct)}%`)
  if (b.skillCostFlat !== 0) {
    lines.push(`技能消耗（固定） ${b.skillCostFlat > 0 ? '+' : ''}${r0(b.skillCostFlat)}`)
  }

  lines.sort((a, x) => a.localeCompare(x, 'zh-Hant'))
  return lines
}

/**
 * 四盤天賦牆：節點效果解析進 StatBlock 後以 aggregateStatBlocks 合併；無法解析的列附在 unbucketed。
 * effectLineManifestZh 列出每一條已匯入效果（譯文）× 階級，含已進桶列，供 UI 完整展示。
 * 具名頂級天賦（核心天賦詞綴）修飾符一併併入同一套桶。
 */
export function aggregateTalentWallBonuses(snapshot: BuildSnapshot): {
  totalTalentPoints: number
  buckets: AggregatedBuckets
  bucketLinesZh: string[]
  /** 無法解析進 StatBlock 的列（舊欄位，供除錯／腳本）。 */
  unbucketed: TalentWallUnbucketedRollup[]
  /** 已投入節點的每一條效果（譯文）× 階級加權；含已進數值桶者，不省略。 */
  effectLineManifestZh: TalentWallUnbucketedRollup[]
} {
  const blocks: StatBlock[] = []
  const textTally = new Map<string, number>()
  const manifestTally = new Map<string, number>()
  let totalTalentPoints = 0

  const boards = snapshot.talentWallBoards
  if (!Array.isArray(boards)) {
    const empty = aggregateStatBlocks([])
    return {
      totalTalentPoints: 0,
      buckets: empty,
      bucketLinesZh: [],
      unbucketed: [],
      effectLineManifestZh: [],
    }
  }

  for (const board of boards) {
    if (!board?.ranks || typeof board.ranks !== 'object') continue

    const slots = normalizeNamedGrandAffixSlots(board.namedGrandAffixSlots)
    for (let i = 0; i < NAMED_GRAND_TALENT_SLOT_COUNT; i++) {
      const id = slots[i]
      if (typeof id !== 'string' || id.trim() === '') continue
      const affix = lookupCoreTalentAffix(id.trim())
      if (!affix) continue
      blocks.push(...statBlocksFromAffixModifiers(affix.modifiers ?? []))
      for (const raw of affix.descriptionLines ?? []) {
        const t = raw.trim()
        if (t) manifestTally.set(t, (manifestTally.get(t) ?? 0) + 1)
      }
    }

    for (const [nodeId, raw] of Object.entries(board.ranks)) {
      const r = Math.floor(Number(raw))
      if (!Number.isFinite(r) || r < 1) continue
      totalTalentPoints += r

      const node = NODE_BY_ID.get(nodeId)
      const lines = node?.effectLines
      if (!lines?.length) {
        const key = `（無匯入效果摘要 · ${board.panelId}）`
        textTally.set(key, (textTally.get(key) ?? 0) + r)
        manifestTally.set(key, (manifestTally.get(key) ?? 0) + r)
        continue
      }
      for (const line of lines) {
        const zhLine = translateTalentEffectLineEnToZh(line)
        manifestTally.set(zhLine, (manifestTally.get(zhLine) ?? 0) + r)

        const parsed = statBlocksForTalentLineAndRank(line, r)
        if (parsed.length > 0) {
          blocks.push(...parsed)
        } else {
          textTally.set(zhLine, (textTally.get(zhLine) ?? 0) + r)
        }
      }
    }
  }

  const buckets = aggregateStatBlocks(blocks)
  const bucketLinesZh = aggregatedTalentWallBucketsToZh(buckets)
  const unbucketed: TalentWallUnbucketedRollup[] = [...textTally.entries()]
    .map(([lineZh, stackedWeight]) => ({ lineZh, stackedWeight }))
    .sort((a, b) => b.stackedWeight - a.stackedWeight || a.lineZh.localeCompare(b.lineZh, 'zh-Hant'))

  const effectLineManifestZh: TalentWallUnbucketedRollup[] = [...manifestTally.entries()]
    .map(([lineZh, stackedWeight]) => ({ lineZh, stackedWeight }))
    .sort((a, b) => b.stackedWeight - a.stackedWeight || a.lineZh.localeCompare(b.lineZh, 'zh-Hant'))

  return { totalTalentPoints, buckets, bucketLinesZh, unbucketed, effectLineManifestZh }
}
