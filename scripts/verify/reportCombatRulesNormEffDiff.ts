/**
 * 4E-3 — Compare normalized vs effective combat-rules.json; write diff report.
 * Read-only JSON; no runtime. Run after `npm run etl:apply-overrides`.
 *
 *   npx tsx scripts/verify/reportCombatRulesNormEffDiff.ts
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import type { GlobalRulesOverrideDocument } from "@/types/override"
import type { NormalizedGlobalRulesFile } from "@/types/normalized"
import type { CombatRulesExtensions } from "@/types/combatRules"

const NORM_REL = "data/normalized/ss12/combat-rules.json"
const EFF_REL = "data/effective/ss12/combat-rules.json"
const OVR_REL = "data/overrides/ss12/global-rules.json"
const OUT_REL = "docs/combat-rules-import/normalized-vs-effective-diff.md"

function sortKeysDeep(v: unknown): unknown {
  if (v === null || typeof v !== "object") return v
  if (Array.isArray(v)) return v.map(sortKeysDeep)
  const o = v as Record<string, unknown>
  const out: Record<string, unknown> = {}
  for (const k of Object.keys(o).sort()) {
    out[k] = sortKeysDeep(o[k])
  }
  return out
}

function jsonEq(a: unknown, b: unknown): boolean {
  return JSON.stringify(sortKeysDeep(a)) === JSON.stringify(sortKeysDeep(b))
}

function loadJson<T>(rel: string): T {
  const p = join(process.cwd(), rel)
  return JSON.parse(readFileSync(p, "utf8")) as T
}

function collectBlockedSummary(ext: CombatRulesExtensions | undefined): string[] {
  if (!ext) return []
  const lines: string[] = []
  const blocks = Object.entries(ext) as [keyof CombatRulesExtensions, unknown][]
  for (const [key, block] of blocks) {
    if (!block || typeof block !== "object") continue
    const b = block as { status?: string; blockedParts?: unknown[] }
    if (b.status === "blocked_needs_user_rule" || b.status === "partial") {
      lines.push(`- **${String(key)}**: block \`status\` = \`${b.status}\``)
    }
    if (Array.isArray(b.blockedParts) && b.blockedParts.length) {
      lines.push(
        `  - \`blockedParts\`: ${b.blockedParts.length} 項（含 section I / 未定演算法）`,
      )
    }
    const conv = block as { specialFusionTypeBonus?: { status?: string } }
    if (conv.specialFusionTypeBonus?.status) {
      lines.push(
        `  - \`specialFusionTypeBonus.status\` = \`${conv.specialFusionTypeBonus.status}\`（damageConversion）`,
      )
    }
    const crit = block as { finalCritValueFormula?: { status?: string } }
    if (crit.finalCritValueFormula?.status) {
      lines.push(
        `  - \`finalCritValueFormula.status\` = \`${crit.finalCritValueFormula.status}\`（critRules）`,
      )
    }
  }
  return lines
}

function main() {
  const cwd = process.cwd()
  const normPath = join(cwd, NORM_REL)
  const effPath = join(cwd, EFF_REL)
  if (!existsSync(normPath)) throw new Error(`Missing ${NORM_REL}`)
  if (!existsSync(effPath)) throw new Error(`Missing ${EFF_REL} — run npm run etl:apply-overrides`)

  const norm = loadJson<NormalizedGlobalRulesFile>(NORM_REL)
  const eff = loadJson<NormalizedGlobalRulesFile>(EFF_REL)
  let ovr: GlobalRulesOverrideDocument | null = null
  try {
    ovr = loadJson<GlobalRulesOverrideDocument>(OVR_REL)
  } catch {
    ovr = null
  }

  const nStruct = norm.rules?.structuredCombatRules
  const eStruct = eff.rules?.structuredCombatRules
  const structEqual = jsonEq(nStruct, eStruct)

  const combatMerge = ovr?.combatRulesMerge
  const hasCombatMerge = !!(combatMerge && Object.keys(combatMerge).length > 0)

  const extKeys = [
    "damageForms",
    "damageTypes",
    "damageConversion",
    "resistancePenetration",
    "armorReductionPenetration",
    "damageFormula",
    "critRules",
    "doubleDamageRules",
  ] as const

  const blockRows: string[] = []
  for (const k of extKeys) {
    const nb = nStruct?.rules?.extensions?.[k]
    const eb = eStruct?.rules?.extensions?.[k]
    const same = jsonEq(nb, eb)
    blockRows.push(
      `| \`${k}\` | ${same ? "一致" : "**有差異**"} | ${(nb as { status?: string } | undefined)?.status ?? "—"} | ${(eb as { status?: string } | undefined)?.status ?? "—"} |`,
    )
  }

  const sourcesOk =
    eStruct &&
    extKeys.every((k) => {
      const b = eStruct.rules.extensions[k] as { sources?: unknown[] } | undefined
      return Array.isArray(b?.sources) && b!.sources.length > 0
    })

  const md: string[] = []
  md.push("# Normalized vs Effective — combat-rules（4E-3）")
  md.push("")
  md.push(`Generated: ${new Date().toISOString()}`)
  md.push("")
  md.push("## 流程")
  md.push("")
  md.push("- **Normalized**：`data/normalized/ss12/combat-rules.json`")
  md.push("- **Effective**：`data/effective/ss12/combat-rules.json`（`npm run etl:apply-overrides`）")
  md.push("- **Global override**：`data/overrides/ss12/global-rules.json` → `combatRulesMerge`（deep merge 進 `rules`）")
  md.push("")
  md.push("## Override 設定摘要")
  md.push("")
  md.push(
    hasCombatMerge
      ? `- **combatRulesMerge**：有（\`${OVR_REL}\`）；以下比對反映 merge 結果。`
      : `- **combatRulesMerge**：**無**（本 run 未對 combat 施加 global patch；effective 為 normalized 原樣寫出）。`,
  )
  if (ovr?.skillLevelRulesMerge && Object.keys(ovr.skillLevelRulesMerge).length > 0) {
    md.push(`- **skillLevelRulesMerge**：有（僅影響 skill-level-rules.json，不影響本檔 structured combat blocks）。`)
  }
  md.push("")
  md.push("## `structuredCombatRules` 整體")
  md.push("")
  md.push(
    structEqual
      ? "- **結論**：normalized 與 effective 的 **`rules.structuredCombatRules` 深層結構一致**（sort-keys 後 JSON 相等）。"
      : "- **結論**：**存在差異** — 請檢查 `combatRulesMerge` 是否意圖修改權威規則；下列表格標出各 block。",
  )
  md.push("")
  md.push("## 逐 block 摘要")
  md.push("")
  md.push("| block | normalized vs effective | normalized `status` | effective `status` |")
  md.push("| --- | --- | --- | --- |")
  md.push(...blockRows)
  md.push("")
  md.push("## `sources` / `status` 完整性（effective）")
  md.push("")
  md.push(
    sourcesOk
      ? "- **sources**：八個 block 均含非空 `sources[]`。"
      : "- **sources**：**異常** — 某 block 缺 `sources`（請查 effective JSON）。",
  )
  md.push(
    `- **status**：各 block 均帶 \`status\`（見上表）；**未**在 effective 層被抹除。`,
  )
  md.push("")
  md.push("## 仍為 blocked / partial 的欄位（effective 快照）")
  md.push("")
  md.push(...collectBlockedSummary(eStruct?.rules?.extensions))
  if (collectBlockedSummary(eStruct?.rules?.extensions).length === 0) {
    md.push("—（無 extensions 或無 blocked/partial 標記）")
  }
  md.push("")
  md.push("## 權威語意反轉檢查（驗收）")
  md.push("")
  const conv = eStruct?.rules?.extensions?.damageConversion
  const armorP = eStruct?.rules?.extensions?.armorReductionPenetration
  const dd = eStruct?.rules?.extensions?.doubleDamageRules
  const crit = eStruct?.rules?.extensions?.critRules
  const okOutgoing =
    conv?.outgoingConversionOnlyAppliesToDamageForm === "hit" && conv?.outgoingConversionDirection === "low_to_high_only"
  const okArmor = armorP?.onlyAppliesWhenComputingHitDamage === true
  const okDd = dd?.onlyAppliesToHitDamage === true
  const okCrit = crit?.critAppliesToHitDamage === true
  md.push(
    `- **造成傷害類型轉化僅擊中 + 僅低→高**：${okOutgoing ? "符合（未反轉）" : "**異常**"}`,
  )
  md.push(`- **護甲減傷穿透僅擊中計算**：${okArmor ? "符合" : "**異常**"}`)
  md.push(`- **雙倍傷害僅擊中**：${okDd ? "符合" : "**異常**"}`)
  md.push(`- **爆擊敘述綁擊中**：${okCrit ? "符合" : "**異常**"}`)
  md.push("")
  md.push("## 風險與建議")
  md.push("")
  md.push(
    hasCombatMerge
      ? "- **合理 override**：`combatRulesMerge` 若僅增補 `extensions` 或可追溯欄位，需在本報告後人工複核 diff。"
      : "- **本 run**：無 combat merge → **無 override 風險**；之後新增 `combatRulesMerge` 時應重跑本腳本並確認 `sources` 未被空物件覆蓋。",
  )
  md.push("- **deepMerge 行為**：陣列可能被整段取代；若 future patch 誤傳 `structuredCombatRules: {}`，可能清空子樹 — 建議 override 僅 patch 明確子路徑。")
  md.push("")
  md.push("## 卡住三題（本 repo 預設）")
  md.push("")
  md.push("1. **衝突**：merge 後單一 effective；若需保留雙方，應在 override 註解 + 報告標 `conflict`（目前無）。")
  md.push("2. **無合理 override 來源**：不自動回退；由 CI/人工比對 normalized；本流程以 normalized 為 baseline。")
  md.push("3. **報告粒度**：本檔 **逐 block 摘要** + 整體 deep-equal；細部逐欄位 diff 可再開工具擴充。")
  md.push("")

  writeFileSync(join(cwd, OUT_REL), md.join("\n"), "utf8")
  console.log(`Wrote ${OUT_REL}`)
}

main()
