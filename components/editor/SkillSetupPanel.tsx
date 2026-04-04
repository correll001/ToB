// components/editor/SkillSetupPanel.tsx
'use client'

import React from 'react'
import { useBuildStore } from '@/stores/useBuildStore'
import type { MainSkillSlot, PassiveApplyMode, SkillSetup } from '@/types/build'
import type { ParseStatus } from '@/types/normalized'
import type { SkillDefinition, SkillFamily } from '@/types/skillData'
import type { SkillInstance } from '@/types/skillInstance'
import {
  getBundledSkillDatasetMeta,
  getNormalizedSkillRecord,
  getSkillDefinitionById,
  listMainSlotSkillPickerRows,
  listSkillsByFamily,
} from '@/lib/runtime/runtimeSkillLookup'
import { computeSkillInstanceForMainSlot } from '@/lib/formula/collectBuildContributions'
import { useBuildComputedStats } from '@/hooks/useBuildComputedStats'
import { activeCanonicalTagSet } from '@/lib/formula/skills/tagVocabulary'
import { inferSkillCombatRole } from '@/lib/formula/skills/inferDamageRole'
import { nextSupportLinkSlot } from '@/lib/build/supportLinks'
import type {
  SkillTabDebugFoldout,
  SkillTabExplanation,
  SkillTabLevelRowFacts,
  SkillTabLocalNumericSummary,
  SkillTabPassiveImpactTrace,
  SkillTabStripAllSupportsDelta,
  SkillTabSupportLinkExplanation,
  SkillTabSupportRemovalDelta,
} from '@/types/skillTabExplanation'
import type { CalculationConfidence } from '@/types/skillInstance'
import type { SkillDamageRole } from '@/types/skillDamageRole'
import { formatSupportSkipReasonZh, skillLocalStatLabelZh } from '@/lib/format/supportLinkExplanationFormat'
import { selectSkillTabExplanation } from '@/selectors/skillTabExplanation'

/** PoB-style link group size cap for this editor (matches common 6L). */
const MAX_SKILL_SUPPORT_LINKS = 6

function skillTabParseStatusLabel(p: ParseStatus | null): string {
  if (p === 'ok') return '完整'
  if (p === 'partial') return '部分'
  if (p === 'failed') return '失敗'
  return '—'
}

function skillTabConfidenceLabel(c: CalculationConfidence | null): string {
  if (c === 'ready') return '可精算'
  if (c === 'partial') return '精算不完整'
  if (c === 'unsupported') return '不支援精算'
  return '—'
}

/** Central TAB — consistent chip styling for CalculationConfidence (ready / partial / unsupported). */
function skillTabConfidenceChipClass(c: CalculationConfidence | null): string {
  const base =
    'rounded-md border px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ring-1'
  if (c === 'ready') {
    return `${base} border-emerald-800/50 bg-emerald-950/45 text-emerald-100 ring-emerald-800/30`
  }
  if (c === 'partial') {
    return `${base} border-amber-800/50 bg-amber-950/40 text-amber-100 ring-amber-800/30`
  }
  if (c === 'unsupported') {
    return `${base} border-slate-600/55 bg-slate-900/55 text-slate-400 ring-slate-700/40`
  }
  return `${base} border-slate-700/60 bg-black/30 text-slate-500 ring-slate-800/45`
}

function skillTabDamageRoleLabel(r: SkillDamageRole | null): string {
  switch (r) {
    case 'damaging':
      return '輸出'
    case 'support-only':
      return '輔助'
    case 'aura-only':
      return '光環'
    case 'utility':
      return '功能'
    case 'summon-driver':
      return '召喚／圖騰'
    case 'unknown':
      return '未明'
    default:
      return '—'
  }
}

function skillTabLevelRowSourceLabel(source: SkillTabLevelRowFacts['source']): string {
  switch (source) {
    case 'levelTable':
      return '等級表（連續 Lv 表）'
    case 'breakpoints':
      return '稀疏斷點（breakpoints）'
    case 'none':
      return '無對應列'
    default:
      return source
  }
}

/** 目前檢視槽的解釋器導覽（非資料邏輯）。 */
function SkillLocalExplainerLaneIntro() {
  return (
    <div className="mt-4 rounded-lg border border-violet-800/40 bg-gradient-to-r from-violet-950/30 via-slate-950/20 to-slate-950/25 px-3 py-2.5 ring-1 ring-violet-900/30">
      <p className="text-[11px] leading-relaxed text-violet-100/90">
        <span className="font-bold tracking-wide text-violet-200">技能局部解釋器</span>
        ：以下區塊依序為 ① 基底 → ② 連結輔助 → ③ 數值預覽 → ④ 替換差異 → ⑤ 被動痕跡 → ⑥ 進階除錯。範圍僅
        <strong className="text-slate-200">目前檢視的這一槽</strong>主技能與連結，與左欄「全身 Build／最終命中與 DPS」
        <strong className="text-slate-300">不同</strong>；全局結論請以左欄為準。
      </p>
    </div>
  )
}

/** 僅服務中央檢視槽：基底數值與資料缺口，不含輔助差異、不含全身 Build 明細。 */
function SkillBaseExplanationCard({ explanation }: { explanation: SkillTabExplanation }) {
  const def = explanation.activeSkillId ? getSkillDefinitionById(explanation.activeSkillId) : undefined
  const fact = explanation.levelRowFacts
  const showEffective =
    explanation.inspectedDamageViewMode === 'damaging' ||
    explanation.inspectedDamageViewMode === 'dpsBlocked'
  const instConf = explanation.calculationConfidence
  const effConf = explanation.effectiveCalculationConfidence

  return (
    <div className="mt-4 rounded-xl border border-cyan-950/55 bg-gradient-to-b from-cyan-950/20 to-slate-950/40 p-4 ring-1 ring-cyan-900/25">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-sm bg-cyan-400/90 shadow-[0_0_10px_rgba(34,211,238,0.35)]"
          aria-hidden
        />
        <h3 className="text-xs font-bold uppercase tracking-wide text-cyan-200/95">
          ① 技能基底說明
        </h3>
        <span className="text-[10px] text-slate-600">（本體／等級列 · 技能局部）</span>
      </div>
      <p className="mb-3 text-[10px] leading-relaxed text-slate-500">
        此卡只解釋<strong className="text-slate-400">目前檢視槽</strong>的主技能本體與等級列可讀欄位，是
        <strong className="text-cyan-200/80">技能局部解釋器</strong>
        的一環；<strong className="text-slate-400">不是</strong>
        左欄「全身 Build」的最終命中／DPS 定論。
      </p>

      <div className="flex flex-wrap gap-1.5">
        {explanation.presentationTags.map((t) => (
          <span
            key={t}
            className="rounded-md border border-cyan-900/45 bg-cyan-950/35 px-1.5 py-0.5 text-[10px] font-medium text-cyan-100/90"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-3 space-y-2 text-sm text-slate-200">
        <div>
          <span className="text-[11px] text-slate-500">名稱 · ID</span>
          <div className="font-medium text-slate-100">
            {explanation.activeSkillName ?? '—'}{' '}
            <span className="font-mono text-xs font-normal text-slate-500">
              {explanation.activeSkillId ? `(${explanation.activeSkillId})` : ''}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
          <span>
            <span className="text-slate-500">族別</span>{' '}
            <span className="text-slate-300">{explanation.activeSkillFamily ?? '—'}</span>
          </span>
          <span>
            <span className="text-slate-500">標籤</span>{' '}
            <span className="text-slate-400">
              {def?.tags?.length ? def.tags.slice(0, 12).join('、') : '—'}
            </span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-slate-800/60 pt-2 text-[11px]">
          <span className="inline-flex flex-wrap items-center gap-1.5">
            <span className="text-slate-500">資料解析</span>
            <span
              className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ring-1 ${
                explanation.parseStatus === 'ok'
                  ? 'bg-emerald-950/55 text-emerald-100 ring-emerald-800/40'
                  : explanation.parseStatus === 'partial'
                    ? 'bg-amber-950/50 text-amber-100 ring-amber-800/40'
                    : explanation.parseStatus === 'failed'
                      ? 'bg-rose-950/55 text-rose-100 ring-rose-800/40'
                      : 'bg-slate-900/60 text-slate-500 ring-slate-700/50'
              }`}
            >
              {skillTabParseStatusLabel(explanation.parseStatus)}
            </span>
          </span>
          <span>
            <span className="text-slate-500">公式角色</span>{' '}
            <span className="text-slate-300">{skillTabDamageRoleLabel(explanation.damageRole)}</span>
          </span>
          <span className="inline-flex flex-wrap items-center gap-1.5">
            <span className="text-slate-500">技能層信賴</span>
            <span className={skillTabConfidenceChipClass(instConf)}>{skillTabConfidenceLabel(instConf)}</span>
          </span>
          {showEffective ? (
            <span className="inline-flex flex-wrap items-center gap-1.5">
              <span className="text-slate-500">與衍生層合併</span>
              <span className={skillTabConfidenceChipClass(effConf)}>
                {skillTabConfidenceLabel(effConf)}
              </span>
              <span className="text-slate-600">（主 DPS 閘道語意；此卡仍不顯示 DPS 數字）</span>
            </span>
          ) : null}
        </div>

        <div className="border-t border-slate-800/60 pt-2">
          <span className="text-[11px] text-slate-500">主技能等級（gem）</span>
          <div className="mt-0.5 font-mono text-sm tabular-nums text-slate-200">
            {fact ? fact.skillGemLevel : '—'}
          </div>
        </div>

        <div className="border-t border-slate-800/60 pt-2">
          <span className="text-[11px] text-slate-500">等級列來源</span>
          <div className="mt-0.5 text-sm text-slate-200">
            {fact ? skillTabLevelRowSourceLabel(fact.source) : '—'}
            {fact?.rowPartial ? (
              <span className="ml-2 rounded bg-amber-950/50 px-1.5 py-0.5 text-[10px] text-amber-200">
                列資料 partial
              </span>
            ) : null}
          </div>
        </div>

        <div className="border-t border-slate-800/60 pt-2">
          <span className="text-[11px] text-slate-500">技能基底數值（資料有則顯示）</span>
          <dl className="mt-1.5 grid gap-1.5 text-[11px] sm:grid-cols-2">
            <div className="flex justify-between gap-2 border-b border-slate-800/40 pb-1">
              <dt className="text-slate-500">命中傷害基礎</dt>
              <dd className="text-right text-slate-200">
                {fact?.baseDamageDisplay ?? (
                  <span className="text-slate-600">無結構化 baseDamage</span>
                )}
              </dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-slate-800/40 pb-1">
              <dt className="text-slate-500">魔力消耗</dt>
              <dd className="text-right font-mono text-slate-200">
                {fact?.manaCost != null ? fact.manaCost : <span className="text-slate-600">—</span>}
              </dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-slate-800/40 pb-1">
              <dt className="text-slate-500">冷卻（秒）</dt>
              <dd className="text-right font-mono text-slate-200">
                {fact?.cooldownSec != null ? fact.cooldownSec : <span className="text-slate-600">—</span>}
              </dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-slate-800/40 pb-1">
              <dt className="text-slate-500">
                {fact?.weaponDamagePct != null ? '施放／攻擊時間（秒）' : '施放時間（秒）'}
              </dt>
              <dd className="text-right font-mono text-slate-200">
                {fact?.castTimeSec != null ? fact.castTimeSec : <span className="text-slate-600">—</span>}
              </dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-slate-800/40 pb-1">
              <dt className="text-slate-500">額傷效用（added effectiveness）</dt>
              <dd className="text-right font-mono text-slate-200">
                {fact?.addedDamageEffectiveness != null ? (
                  fact.addedDamageEffectiveness
                ) : (
                  <span className="text-slate-600">—</span>
                )}
              </dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-slate-800/40 pb-1">
              <dt className="text-slate-500">投射物數</dt>
              <dd className="text-right font-mono text-slate-200">
                {fact?.projectileCount != null ? fact.projectileCount : <span className="text-slate-600">—</span>}
              </dd>
            </div>
            <div className="flex justify-between gap-2 pb-1 sm:col-span-2">
              <dt className="text-slate-500">武器傷害係數（%）</dt>
              <dd className="text-right font-mono text-slate-200">
                {fact?.weaponDamagePct != null ? (
                  fact.weaponDamagePct
                ) : (
                  <span className="text-slate-600">—</span>
                )}
              </dd>
            </div>
          </dl>
          {fact?.baseDamageIsRangeMidpoint ? (
            <p className="mt-1.5 text-[10px] leading-relaxed text-amber-200/85">
              傷害區間取中點以估算；實戰上下限可能不同，精算信賴度可能為 partial。
            </p>
          ) : null}
        </div>
      </div>

      {explanation.localMissingDataHints.length > 0 || explanation.localWarnings.length > 0 ? (
        <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
          有資料缺口、引擎或解析相關提示時，請展開下方「Debug／缺資料說明」查看逐條細節（預設收合，不打擾一般檢視）。
        </p>
      ) : null}
    </div>
  )
}

function debugFoldoutEmptyMessage(d: SkillTabDebugFoldout): string | null {
  const has =
    d.canonicalTags.length > 0 ||
    d.mainSkillRawRequirementLines.length > 0 ||
    d.supportLinkRawRequirements.length > 0 ||
    d.instanceWarnings.length > 0 ||
    d.recordWarnings.length > 0 ||
    d.engineWarnings.length > 0 ||
    d.parseStatus != null ||
    d.levelRowDetailLines.length > 0 ||
    d.supportSkippedRows.length > 0 ||
    d.localMissingDataHints.length > 0 ||
    d.traceSummaryLines.length > 0 ||
    d.contextNotesWithoutInstance.length > 0
  return has ? null : '此檢視狀態下沒有可列出的進階細節。'
}

/** 卡 6 — 預設收合；格式化列點，不貼原始 JSON。 */
function SkillTabDebugFoldoutPanel({ d }: { d: SkillTabDebugFoldout }) {
  const emptyNote = debugFoldoutEmptyMessage(d)

  return (
    <details className="mt-4 rounded-xl border border-slate-800/80 bg-slate-950/35 ring-1 ring-slate-800/50">
      <summary className="cursor-pointer px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
        <span className="inline-flex items-center gap-2">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-sm bg-slate-500 shadow-[0_0_8px_rgba(148,163,184,0.35)]"
            aria-hidden
          />
          ⑥ Debug／缺資料說明
          <span className="text-[10px] font-normal normal-case tracking-normal text-slate-600">
            （點擊展開 · 進階／稽核用）
          </span>
        </span>
      </summary>
      <div className="space-y-4 border-t border-slate-800/70 px-4 pb-4 pt-3 text-[11px] leading-relaxed text-slate-300">
        {emptyNote ? <p className="text-slate-500">{emptyNote}</p> : null}

        <section>
          <h4 className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            1 · Canonical tags（tagVocabulary）
          </h4>
          {d.canonicalTags.length > 0 ? (
            <div className="flex max-h-32 flex-wrap gap-1 overflow-y-auto">
              {d.canonicalTags.map((t) => (
                <span
                  key={t}
                  className="rounded border border-indigo-900/45 bg-indigo-950/25 px-1.5 py-0.5 font-mono text-[9px] text-indigo-200/90"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-600">（無 — 無技能 ID 或 normalized 紀錄）</p>
          )}
        </section>

        <section>
          <h4 className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            2 · Raw requirement lines（主技能與連結輔助）
          </h4>
          <div className="space-y-2 text-slate-400">
            <div>
              <div className="mb-0.5 text-[10px] text-slate-600">主技能（資料列）</div>
              {d.mainSkillRawRequirementLines.length > 0 ? (
                <ul className="list-inside list-disc space-y-0.5 font-mono text-[10px] text-slate-400">
                  {d.mainSkillRawRequirementLines.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-600">（無）</p>
              )}
            </div>
            {d.supportLinkRawRequirements.length > 0 ? (
              <ul className="space-y-2">
                {d.supportLinkRawRequirements.map((blk) => (
                  <li key={`${blk.linkSlot}-${blk.supportId}`} className="rounded-md border border-slate-800/60 bg-black/20 p-2">
                    <div className="mb-1 font-mono text-[10px] text-slate-500">
                      Link {blk.linkSlot} · {blk.supportName}{' '}
                      <span className="text-slate-600">({blk.supportId})</span>
                    </div>
                    <ul className="list-inside list-disc space-y-0.5 font-mono text-[10px] text-slate-400">
                      {blk.lines.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[10px] text-slate-600">連結輔助：無 raw requirement 列可顯示。</p>
            )}
          </div>
        </section>

        <section>
          <h4 className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">3 · Engine warnings</h4>
          {d.engineWarnings.length > 0 ? (
            <ul className="list-inside list-disc space-y-0.5 text-slate-400">
              {d.engineWarnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-600">（無）</p>
          )}
        </section>

        <section>
          <h4 className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            4 · Record warnings · parseStatus
          </h4>
          <p className="mb-1 text-slate-400">
            <span className="text-slate-600">parseStatus：</span>
            {d.parseStatus != null ? skillTabParseStatusLabel(d.parseStatus) : '—'}
          </p>
          {d.recordWarnings.length > 0 ? (
            <ul className="list-inside list-disc space-y-0.5 text-slate-400">
              {d.recordWarnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-600">recordWarnings：（無）</p>
          )}
          {d.instanceWarnings.length > 0 ? (
            <div className="mt-2">
              <div className="mb-0.5 text-[10px] text-slate-600">Instance warnings（技能層）</div>
              <ul className="list-inside list-disc space-y-0.5 text-slate-400">
                {d.instanceWarnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <section>
          <h4 className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            5 · Level row · source / partial / 列解譯
          </h4>
          {d.levelRowDetailLines.length > 0 ? (
            <ul className="max-h-48 list-inside list-disc space-y-0.5 overflow-y-auto font-mono text-[10px] text-slate-400">
              {d.levelRowDetailLines.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-600">（無等級列除錯列）</p>
          )}
        </section>

        <section>
          <h4 className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">6 · Support skipped（引擎視角）</h4>
          {d.supportSkippedRows.length > 0 ? (
            <ul className="space-y-2">
              {d.supportSkippedRows.map((s) => (
                <li key={s.id} className="rounded-md border border-slate-800/60 bg-black/20 px-2 py-1.5">
                  <div className="font-medium text-slate-300">{s.name}</div>
                  <div className="font-mono text-[10px] text-slate-600">{s.id}</div>
                  <div className="mt-0.5 text-[10px] text-slate-500">
                    {formatSupportSkipReasonZh(s.skipReason)}
                    {s.skipReason ? (
                      <span className="ml-1 font-mono text-slate-600">({s.skipReason})</span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-600">（無略過的連結輔助，或尚未建立 instance）</p>
          )}
        </section>

        <section>
          <h4 className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">7 · 技能局部缺資料提示</h4>
          {d.localMissingDataHints.length > 0 ? (
            <ul className="list-inside list-disc space-y-0.5 text-amber-100/85">
              {d.localMissingDataHints.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-600">（無）</p>
          )}
        </section>

        {d.contextNotesWithoutInstance.length > 0 ? (
          <section>
            <h4 className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              情境說明（無技能 instance）
            </h4>
            <ul className="list-inside list-disc space-y-0.5 text-slate-400">
              {d.contextNotesWithoutInstance.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {d.traceSummaryLines.length > 0 ? (
          <section>
            <h4 className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Instance trace（摘要列，非 JSON）
            </h4>
            <ul className="max-h-40 list-inside list-disc space-y-0.5 overflow-y-auto font-mono text-[10px] text-slate-400">
              {d.traceSummaryLines.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </details>
  )
}

/** 卡 5 — 僅與「目前檢視技能」有注入關係的 passive／光環痕跡（非左欄全局報表）。 */
function PassiveImpactTracePanel({ traces }: { traces: SkillTabPassiveImpactTrace[] }) {
  return (
    <div className="mt-4 rounded-xl border border-teal-950/50 bg-gradient-to-b from-teal-950/20 to-slate-950/40 p-4 ring-1 ring-teal-900/25">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-sm bg-teal-400/90 shadow-[0_0_10px_rgba(45,212,191,0.3)]"
          aria-hidden
        />
        <h3 className="text-xs font-bold uppercase tracking-wide text-teal-200/95">
          ⑤ 被動／光環 · 本技能影響痕跡
        </h3>
        <span className="text-[10px] text-slate-600">（全域或連結命中此槽）</span>
      </div>
      <p className="text-[10px] leading-relaxed text-slate-500">
        只列 passive 族、且全域套用或連結命中「目前檢視主槽」的 gem；顯示會摺疊進本技能 instance 的 registry stat。
        不含裝備／天賦／石板明細，也<strong className="text-slate-400">不是</strong>左欄全身貢獻列表。
      </p>

      {traces.length === 0 ? (
        <p className="mt-2 text-[11px] text-slate-500">
          目前沒有符合條件的 passive 注入此檢視槽（或未配置 passive 槽／連結未命中）。
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {traces.map((t) => (
            <li
              key={`${t.passiveEditorSlot}-${t.passiveSkillId}`}
              className="rounded-lg border border-slate-800/70 bg-black/25 px-3 py-2.5"
            >
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-200">
                <span className="font-mono text-slate-500">P{t.passiveEditorSlot}</span>
                <span className="font-medium">{t.passiveName}</span>
                <span className="font-mono text-[10px] text-slate-600">{t.passiveSkillId}</span>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-medium ring-1 ${
                    t.applyMode === 'global'
                      ? 'bg-sky-950/50 text-sky-200 ring-sky-800/60'
                      : 'bg-violet-950/50 text-violet-200 ring-violet-800/55'
                  }`}
                >
                  {t.applyMode === 'global' ? '全域套用' : '僅連結槽'}
                </span>
                {t.applyMode === 'linked' ? (
                  <span className="rounded bg-slate-900/80 px-1.5 py-0.5 text-[10px] text-slate-400 ring-1 ring-slate-800/70">
                    連結 [{t.linkedMainSkillSlots.join(', ')}]
                  </span>
                ) : null}
                {t.hasAuraModifier || t.auraTagHint ? (
                  <span className="rounded bg-emerald-950/40 px-1.5 py-0.5 text-[10px] text-emerald-200/90 ring-1 ring-emerald-900/45">
                    光環相關
                  </span>
                ) : null}
                <span className="rounded bg-teal-950/35 px-1.5 py-0.5 text-[10px] text-teal-100/90 ring-1 ring-teal-900/40">
                  影響本技能
                </span>
              </div>
              {t.statKeys.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1">
                  {t.statKeys.map((k) => (
                    <span
                      key={k}
                      className="rounded border border-slate-700/60 px-1.5 py-0.5 text-[9px] text-slate-400"
                      title={k}
                    >
                      {skillLocalStatLabelZh(k)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-[10px] text-slate-500">（尚無可列出的技能局部 stat）</p>
              )}
              {t.partialHints.length > 0 ? (
                <div className="mt-2 rounded-md border border-amber-900/40 bg-amber-950/20 px-2 py-1.5 text-[10px] leading-relaxed text-amber-100/90">
                  <span className="font-semibold text-amber-400/95">Partial</span>
                  <ul className="mt-0.5 list-inside list-disc space-y-0.5">
                    {t.partialHints.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function fmtSkillLocalNum(n: number | null, digits = 1): string {
  if (n == null || !Number.isFinite(n)) return '—'
  if (Math.abs(n) >= 10000) return n.toFixed(0)
  return n.toFixed(digits)
}

/** 與左欄 inspected 同管道之「局部」預覽；文案避免冒充全局最終傷害。 */
function SkillLocalNumericSummaryCard({ summary }: { summary: SkillTabLocalNumericSummary }) {
  const showCombat = summary.previewKind === 'full_scoped_combat'
  const eff = summary.effectiveCalculationConfidence
  const instC = summary.calculationConfidence
  const pres = summary.damagingPresentation

  return (
    <div className="mt-4 rounded-xl border border-amber-900/40 bg-gradient-to-b from-amber-950/18 to-slate-950/45 p-4 ring-1 ring-amber-900/25">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-sm bg-amber-400/90 shadow-[0_0_10px_rgba(251,191,36,0.3)]"
          aria-hidden
        />
        <h3 className="text-xs font-bold uppercase tracking-wide text-amber-200/95">③ 技能局部數值摘要</h3>
        <span className="text-[10px] text-slate-600">預覽 · 非左欄全局定論</span>
      </div>

      <p className="text-[11px] leading-relaxed text-slate-400">
        已套用目前 Build 的全局基底（屬性、裝備、天賦、神格草稿等），但計算範圍與左欄「檢視技能」一致：僅合併
        <span className="text-slate-300">此槽主技能 contribution + 已套用輔助</span>。這是
        <strong className="text-amber-200/85">技能局部解釋</strong>
        ，<span className="text-amber-200/90">不是</span>
        左欄顯示的全身最終命中／DPS 唯一答案。
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="rounded-md border border-slate-700/70 bg-black/30 px-1.5 py-0.5 text-[10px] text-slate-400">
          {summary.previewKind === 'full_scoped_combat'
            ? '含命中／DPS 預覽'
            : summary.previewKind === 'resource_timing_only'
              ? '資源與時間為主'
              : '無法預覽'}
        </span>
        {instC ? (
          <span className={skillTabConfidenceChipClass(instC)}>
            技能層：{skillTabConfidenceLabel(instC)}
          </span>
        ) : null}
        {eff ? (
          <span className={skillTabConfidenceChipClass(eff)}>
            與衍生層：{skillTabConfidenceLabel(eff)}
          </span>
        ) : null}
        {pres === 'authoritative' ? (
          <span className="rounded-md border border-emerald-800/45 bg-emerald-950/35 px-1.5 py-0.5 text-[10px] font-medium text-emerald-100 ring-1 ring-emerald-800/30">
            命中／DPS：權威呈現（ready）
          </span>
        ) : null}
        {pres === 'estimate' ? (
          <span className="rounded-md border border-amber-800/50 bg-amber-950/40 px-1.5 py-0.5 text-[10px] font-medium text-amber-100 ring-1 ring-amber-800/35">
            命中／DPS：估算（partial／衍生層未 ready）
          </span>
        ) : null}
      </div>

      <dl className="mt-4 grid gap-2 text-[11px] sm:grid-cols-2">
        <div className="flex justify-between gap-2 border-b border-slate-800/50 pb-1.5">
          <dt className="text-slate-500">局部命中傷害</dt>
          <dd className="font-mono text-slate-200">
            {showCombat ? fmtSkillLocalNum(summary.scopedHitDamage) : '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-b border-slate-800/50 pb-1.5">
          <dt className="text-slate-500">局部 DPS 預覽</dt>
          <dd className="font-mono text-slate-200">
            {showCombat ? fmtSkillLocalNum(summary.scopedDpsPreview) : '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-b border-slate-800/50 pb-1.5">
          <dt className="text-slate-500">衍生攻擊速度（含全局）</dt>
          <dd className="font-mono text-slate-200">
            {showCombat ? fmtSkillLocalNum(summary.scopedAttackSpeed, 2) : '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-b border-slate-800/50 pb-1.5">
          <dt className="text-slate-500">魔耗（等級列）</dt>
          <dd className="font-mono text-slate-200">{fmtSkillLocalNum(summary.manaCost, 0)}</dd>
        </div>
        <div className="flex justify-between gap-2 border-b border-slate-800/50 pb-1.5">
          <dt className="text-slate-500">冷卻（秒）</dt>
          <dd className="font-mono text-slate-200">{fmtSkillLocalNum(summary.cooldownSec, 2)}</dd>
        </div>
        <div className="flex justify-between gap-2 border-b border-slate-800/50 pb-1.5">
          <dt className="text-slate-500">施放時間（秒）</dt>
          <dd className="font-mono text-slate-200">{fmtSkillLocalNum(summary.castTimeSec, 3)}</dd>
        </div>
        <div className="flex justify-between gap-2 border-b border-slate-800/50 pb-1.5">
          <dt className="text-slate-500">投射物數（列上）</dt>
          <dd className="font-mono text-slate-200">{fmtSkillLocalNum(summary.projectileCount, 0)}</dd>
        </div>
        <div className="flex justify-between gap-2 border-b border-slate-800/50 pb-1.5">
          <dt className="text-slate-500">技能層攻速增加%</dt>
          <dd className="font-mono text-slate-200">
            {summary.skillLocalAttackSpeedIncreased != null
              ? `${summary.skillLocalAttackSpeedIncreased}%`
              : '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2 pb-1.5 sm:col-span-2">
          <dt className="text-slate-500">技能層施放速度增加%</dt>
          <dd className="font-mono text-slate-200">
            {summary.skillLocalCastSpeedIncreased != null
              ? `${summary.skillLocalCastSpeedIncreased}%`
              : '—'}
          </dd>
        </div>
      </dl>

      {summary.confidenceCaveats.length > 0 ? (
        <div className="mt-3 rounded-lg border border-amber-800/40 bg-amber-950/20 px-3 py-2 text-[10px] leading-relaxed text-amber-100/90">
          <span className="font-semibold text-amber-400/95">信賴度與說明</span>
          <ul className="mt-1 list-inside list-disc space-y-0.5">
            {summary.confidenceCaveats.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

/** 卡 4 — 逐顆移除／全部停用連結的局部差異（非整組 Build before/after）。 */
function SupportRemovalDeltaPanel({
  removal,
  stripAll,
}: {
  removal: SkillTabSupportRemovalDelta[]
  stripAll: SkillTabStripAllSupportsDelta | null
}) {
  return (
    <div className="mt-4 rounded-xl border border-fuchsia-900/40 bg-gradient-to-b from-fuchsia-950/12 to-slate-950/45 p-4 ring-1 ring-fuchsia-900/20">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-sm bg-fuchsia-400/90 shadow-[0_0_10px_rgba(232,121,249,0.3)]"
          aria-hidden
        />
        <h3 className="text-xs font-bold uppercase tracking-wide text-fuchsia-200/95">
          ④ Support 移除／替換差異（技能局部）
        </h3>
      </div>
      <p className="text-[10px] leading-relaxed text-slate-500">
        以下為「關掉某一顆連結」或「全部連結停用」的對照試算，沿用與左欄檢視相同的<strong className="text-slate-400">技能層／局部 DPS 管道</strong>
        ；屬於<strong className="text-fuchsia-200/70">技能局部解釋</strong>，不是整組 Build 的全域 before／after，亦
        <strong className="text-slate-400">不能</strong>替代左欄最終總結。
      </p>

      {removal.length === 0 ? (
        <p className="mt-2 text-[11px] text-slate-500">目前沒有可評估的連結列（或主技能未就緒）。</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {removal.map((r) => (
            <li
              key={r.linkSlot}
              className="rounded-lg border border-slate-800/70 bg-black/25 px-3 py-2.5"
            >
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-200">
                <span className="font-mono text-slate-500">Link {r.linkSlot}</span>
                <span>{r.supportName}</span>
                {r.editorDisabled ? (
                  <span className="rounded bg-slate-800/80 px-1 py-0.5 text-[10px] text-slate-500">
                    連結已停
                  </span>
                ) : r.applied ? (
                  <span className="rounded bg-emerald-950/50 px-1 py-0.5 text-[10px] text-emerald-200">
                    已套用
                  </span>
                ) : (
                  <span className="rounded bg-amber-950/50 px-1 py-0.5 text-[10px] text-amber-200">
                    已跳過
                  </span>
                )}
              </div>
              <ul className="mt-2 list-inside list-disc space-y-1 text-[10px] leading-relaxed text-slate-400">
                {r.deltaLines.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
              {r.computedStatDeltas.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1">
                  {r.computedStatDeltas.slice(0, 8).map((d) => (
                    <span
                      key={d.key}
                      className="rounded border border-slate-700/60 px-1.5 py-0.5 font-mono text-[9px] text-slate-500"
                      title={d.labelZh}
                    >
                      {d.key}: {d.delta > 0 ? '+' : ''}
                      {d.delta.toFixed(Math.abs(d.delta) >= 10 ? 0 : 2)}
                    </span>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {stripAll && (stripAll.deltaLines.length > 0 || stripAll.computedStatDeltas.length > 0) ? (
        <div className="mt-4 border-t border-slate-800/60 pt-3">
          <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
            若停用此槽全部連結輔助
          </div>
          <ul className="mt-2 list-inside list-disc space-y-1 text-[10px] leading-relaxed text-slate-400">
            {stripAll.deltaLines.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

/** 單顆 support link：套用理由 + 技能層影響摘要（不含替換前後比較）。 */
function SupportLinkExplanationPanel({
  linkExp,
}: {
  linkExp: SkillTabSupportLinkExplanation
}) {
  const raw = linkExp.rawRequirementLines
  const showRaw = raw && raw.length > 0
  const showWarn = linkExp.warnings.length > 0

  return (
    <div className="w-full border-t border-slate-800/70 bg-slate-950/55 px-2 py-2 sm:col-span-full">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${
            linkExp.editorDisabled
              ? 'bg-slate-900/80 text-slate-500 ring-slate-700/60'
              : linkExp.applied
                ? 'bg-emerald-950/70 text-emerald-200 ring-emerald-700/45'
                : 'bg-amber-950/70 text-amber-200 ring-amber-700/45'
          }`}
        >
          {linkExp.editorDisabled ? '連結停用' : linkExp.applied ? '已套用' : '已跳過'}
        </span>
        {linkExp.noStructuredEffect ? (
          <span className="rounded-md bg-violet-950/50 px-1.5 py-0.5 text-[10px] text-violet-200/90 ring-1 ring-violet-800/40">
            無可量化摘要
          </span>
        ) : null}
        <span className="text-[10px] text-slate-500">
          對主技能之技能層影響（<strong className="text-slate-400">技能局部</strong>，非左欄全身最終傷害）
        </span>
      </div>

      <div className="mt-1.5 text-[11px] leading-relaxed text-slate-300">
        {linkExp.localStatEffects.length > 0 ? (
          <ul className="list-inside list-disc space-y-0.5 text-slate-400">
            {linkExp.localStatEffects.map((line, i) => (
              <li key={`${i}-${line.slice(0, 64)}`}>{line}</li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-400">{linkExp.skipReasonZh}</p>
        )}
      </div>

      {linkExp.affectedStatKeys.length > 0 ? (
        <div className="mt-2">
          <div className="mb-1 text-[10px] font-medium uppercase tracking-wide text-slate-600">
            影響的 skill-local 統計鍵
          </div>
          <div className="flex flex-wrap gap-1">
            {linkExp.affectedStatKeys.map((k) => (
              <span
                key={k}
                className="rounded border border-slate-700/70 bg-black/35 px-1.5 py-0.5 font-mono text-[9px] text-slate-400"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {showRaw || showWarn ? (
        <details className="mt-2 rounded-md border border-slate-800/80 bg-black/20 px-2 py-1.5">
          <summary className="cursor-pointer text-[10px] text-slate-500">原始需求 / 引擎細節（除錯）</summary>
          {showRaw ? (
            <ul className="mt-1 list-inside list-disc text-[9px] leading-relaxed text-slate-500">
              {raw!.map((line) => (
                <li key={line.slice(0, 80)}>{line}</li>
              ))}
            </ul>
          ) : null}
          {showWarn ? (
            <ul className="mt-1 list-inside list-decimal text-[9px] text-slate-600">
              {linkExp.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          ) : null}
        </details>
      ) : null}
    </div>
  )
}

function flipLinkedSlot(slots: MainSkillSlot[], n: MainSkillSlot): MainSkillSlot[] {
  if (slots.includes(n)) return slots.filter((s) => s !== n)
  return [...slots, n].sort((a, b) => a - b)
}

function parseStatusStyles(status: ParseStatus | undefined): { label: string; className: string } {
  switch (status) {
    case 'ok':
      return { label: 'ok', className: 'bg-emerald-950/70 text-emerald-200 ring-emerald-700/50' }
    case 'partial':
      return { label: 'partial', className: 'bg-amber-950/70 text-amber-200 ring-amber-700/45' }
    case 'failed':
      return { label: 'failed', className: 'bg-rose-950/80 text-rose-200 ring-rose-700/50' }
    default:
      return { label: '—', className: 'bg-slate-900/60 text-slate-500 ring-slate-700/50' }
  }
}

function familyBadgeClass(family: SkillFamily): string {
  switch (family) {
    case 'active':
      return 'bg-sky-950/70 text-sky-200 ring-sky-700/45'
    case 'support':
      return 'bg-violet-950/70 text-violet-200 ring-violet-700/45'
    case 'passive':
      return 'bg-teal-950/70 text-teal-200 ring-teal-700/45'
    default:
      return 'bg-slate-900/70 text-slate-300 ring-slate-600/45'
  }
}

/** Tags shown in UI: only from normalized `definition.tags` (no invented labels). */
function effectiveTagsFromRecord(skillId: string | null | undefined): string[] {
  if (!skillId) return []
  const rec = getNormalizedSkillRecord(skillId)
  const raw = rec?.definition.tags ?? []
  return [...new Set(raw)]
}

function canonicalTagsForDebug(skillId: string | null | undefined): string[] {
  if (!skillId) return []
  const rec = getNormalizedSkillRecord(skillId)
  if (!rec) return []
  return [...activeCanonicalTagSet(rec.definition.tags)].sort((a, b) => a.localeCompare(b, 'en'))
}

function passiveMechanicalBadges(def: SkillDefinition | undefined): string[] {
  if (!def) return []
  const badges: string[] = []
  if (def.family !== 'passive') badges.push('非 passive 族')
  const lower = def.tags.map((t) => t.toLowerCase())
  if (lower.some((t) => t === 'aura' || t.includes('aura'))) badges.push('aura')
  if (lower.some((t) => t === 'utility' || t.includes('utility'))) badges.push('utility')
  if (def.family === 'support') badges.push('support-only')
  return badges
}

function supportCompatById(instance: SkillInstance | null): Map<string, SkillInstance['supports'][number]> {
  const m = new Map<string, SkillInstance['supports'][number]>()
  if (!instance) return m
  for (const s of instance.supports) {
    m.set(s.supportRefId, s)
  }
  return m
}

type SupportLinksEditorSectionPropsFull = {
  skillRow: SkillSetup
  sortedLinks: SkillSetup['supports']
  compat: ReturnType<typeof supportCompatById>
  supports: ReturnType<typeof listSkillsByFamily>
  isInspected: boolean
  skillTabExplanation: SkillTabExplanation
  debugMode: boolean
  setSupportLink: (slot: MainSkillSlot, linkSlot: number, supportId: string | null) => void
  setSupportLevel: (slot: MainSkillSlot, linkSlot: number, level: number) => void
  toggleSupportEnabled: (slot: MainSkillSlot, linkSlot: number) => void
  clearSkillSupports: (slot: MainSkillSlot) => void
}

/** Link editor + per-link explainer (card 2); rendered twice when inspected — above numeric summary and again for non-inspected rows. */
function SupportLinksEditorSection({
  skillRow,
  sortedLinks,
  compat,
  supports,
  isInspected,
  skillTabExplanation,
  debugMode,
  setSupportLink,
  setSupportLevel,
  toggleSupportEnabled,
  clearSkillSupports,
}: SupportLinksEditorSectionPropsFull) {
  return (
    <div className="mt-4 border-t border-slate-800/70 pt-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
          {isInspected
            ? '② 連結輔助 · 套用與跳過（技能局部）'
            : `連結輔助（Link 1–${MAX_SKILL_SUPPORT_LINKS}）`}
        </span>
        {skillRow.skillId ? (
          <button
            type="button"
            className="text-[10px] text-slate-500 underline decoration-slate-700 hover:text-slate-300"
            onClick={() => clearSkillSupports(skillRow.slot)}
          >
            清除全部連結
          </button>
        ) : null}
      </div>
      {isInspected ? (
        <p className="mb-3 text-[10px] leading-relaxed text-slate-500">
          在此編輯連結；每列下方為引擎<strong className="text-slate-400">套用／跳過</strong>說明，屬於
          <strong className="text-violet-200/85">技能局部解釋</strong>
          ，與左欄全身最終命中／DPS<strong className="text-slate-400">不同</strong>。
        </p>
      ) : null}

      <div className="space-y-2 rounded-lg border border-slate-800/80 bg-black/20 p-2">
        {sortedLinks.map((link, idx) => {
          const att = compat.get(link.supportSkillId)
          const supDef = getSkillDefinitionById(link.supportSkillId)
          const linkExplain =
            isInspected &&
            skillTabExplanation.supportLinkExplanations.find((e) => e.linkSlot === link.linkSlot)
          return (
            <div
              key={`${link.linkSlot}-${link.supportSkillId}`}
              className="flex flex-col gap-2 rounded-md border border-slate-800/60 bg-slate-950/40 p-2 sm:flex-row sm:flex-wrap sm:items-center"
            >
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="font-mono text-slate-600">Link {idx + 1}</span>
                <span className="text-slate-700">·</span>
                <span className="truncate">{supDef?.name ?? link.supportSkillId}</span>
              </div>
              <select
                value={link.supportSkillId}
                disabled={!skillRow.skillId}
                onChange={(e) => {
                  const v = e.target.value
                  setSupportLink(skillRow.slot, link.linkSlot, v || null)
                }}
                className="min-w-[10rem] flex-1 rounded-lg border border-slate-700/80 bg-slate-900/90 px-2 py-1.5 text-xs text-white disabled:opacity-40"
              >
                <option value="">（移除此連結）</option>
                {supports.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-1 text-[11px] text-slate-500">
                Lv
                <input
                  type="number"
                  min={1}
                  max={99}
                  disabled={!skillRow.skillId}
                  value={link.level}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10)
                    setSupportLevel(skillRow.slot, link.linkSlot, Number.isFinite(v) ? v : 1)
                  }}
                  className="w-14 rounded border border-slate-700 bg-slate-950 px-1 py-0.5 text-center font-mono text-xs text-slate-200 disabled:opacity-40"
                />
              </label>
              <label className="flex cursor-pointer items-center gap-1 text-[11px] text-slate-500">
                <input
                  type="checkbox"
                  className="rounded border-slate-600 bg-slate-900"
                  checked={link.enabled}
                  disabled={!skillRow.skillId}
                  onChange={() => toggleSupportEnabled(skillRow.slot, link.linkSlot)}
                />
                啟用
              </label>
              <div className="min-w-0 flex-1 text-[10px] leading-snug sm:basis-full">
                {!skillRow.skillId ? (
                  <span className="text-slate-600">先選擇主技能</span>
                ) : link.enabled === false ? (
                  <span className="text-slate-600">已停用 · 未送入引擎的相容評估</span>
                ) : att ? (
                  <span className={att.applied ? 'text-emerald-300/90' : 'text-amber-200/85'}>
                    {att.applied ? '✓ 已套用' : '✗ 已跳過'}
                    {!att.applied && att.skipReason ? ` · ${att.skipReason}` : ''}
                    {att.warnings?.length ? ` · ${att.warnings.join('; ')}` : ''}
                  </span>
                ) : (
                  <span className="text-slate-600">（無相容資料：可能非 support 或已被過濾）</span>
                )}
                {debugMode && att?.rawRequirementLines?.length ? (
                  <div className="mt-1 max-h-16 overflow-y-auto font-mono text-[9px] text-slate-500">
                    raw: {att.rawRequirementLines.join(' | ')}
                  </div>
                ) : null}
              </div>
              {linkExplain ? <SupportLinkExplanationPanel linkExp={linkExplain} /> : null}
            </div>
          )
        })}

        {skillRow.skillId && sortedLinks.length < MAX_SKILL_SUPPORT_LINKS ? (
          <div className="flex flex-wrap items-center gap-2 rounded-md border border-dashed border-slate-700/80 bg-slate-950/25 px-2 py-2">
            <span className="text-[10px] text-slate-600">新增連結</span>
            <select
              defaultValue=""
              disabled={!skillRow.skillId}
              onChange={(e) => {
                const id = e.target.value
                if (!id) return
                const slot = nextSupportLinkSlot(skillRow.supports)
                if (slot > MAX_SKILL_SUPPORT_LINKS) return
                setSupportLink(skillRow.slot, slot, id)
                e.target.selectedIndex = 0
              }}
              className="min-w-[12rem] rounded-lg border border-slate-700/80 bg-slate-900/90 px-2 py-1.5 text-xs text-white"
            >
              <option value="">選擇輔助 gem…</option>
              {supports.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {skillRow.skillId && sortedLinks.length >= MAX_SKILL_SUPPORT_LINKS ? (
          <p className="text-[10px] text-slate-600">已達此編輯器連結上限（{MAX_SKILL_SUPPORT_LINKS}）。</p>
        ) : null}
      </div>
    </div>
  )
}

export default function SkillSetupPanel() {
  const snapshot = useBuildStore((s) => s.snapshot)
  const skills = snapshot.skills
  const passives = snapshot.passives
  const setSkill = useBuildStore((s) => s.setSkill)
  const setSkillLevel = useBuildStore((s) => s.setSkillLevel)
  const setSupportLink = useBuildStore((s) => s.setSupportLink)
  const setSupportLevel = useBuildStore((s) => s.setSupportLevel)
  const toggleSupportEnabled = useBuildStore((s) => s.toggleSupportEnabled)
  const clearSkillSupports = useBuildStore((s) => s.clearSkillSupports)
  const clearSkill = useBuildStore((s) => s.clearSkill)
  const setMainSkillEnabled = useBuildStore((s) => s.setMainSkillEnabled)
  const setPassiveSkill = useBuildStore((s) => s.setPassiveSkill)
  const setPassiveApplyMode = useBuildStore((s) => s.setPassiveApplyMode)
  const setPassiveLinkedSlots = useBuildStore((s) => s.setPassiveLinkedSlots)
  const setPassiveSkillLevel = useBuildStore((s) => s.setPassiveSkillLevel)
  const togglePassiveEnabled = useBuildStore((s) => s.togglePassiveEnabled)
  const clearPassive = useBuildStore((s) => s.clearPassive)
  const setInspectedMainSkill = useBuildStore((s) => s.setInspectedMainSkill)
  const inspectedMainSkillSlot = snapshot.meta.inspectedMainSkillSlot
  const { inspectedTargetSlot, inspectedPresentationMode, inspectedSkillDamageView } = useBuildComputedStats()
  const skillTabExplanation = React.useMemo(() => selectSkillTabExplanation(snapshot), [snapshot])

  const [debugMode, setDebugMode] = React.useState(false)

  const actives = listMainSlotSkillPickerRows()
  const supports = listSkillsByFamily('support')
  const meta = getBundledSkillDatasetMeta()

  const inspectedRow = inspectedMainSkillSlot != null ? skills[inspectedMainSkillSlot - 1] : undefined
  const inspectedName =
    inspectedRow?.skillId && getSkillDefinitionById(inspectedRow.skillId)?.name
      ? String(getSkillDefinitionById(inspectedRow.skillId)?.name)
      : inspectedRow?.skillId
        ? inspectedRow.skillId
        : '（空槽）'

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="rounded-2xl border border-slate-800/55 bg-gradient-to-b from-slate-900/35 to-slate-950/20 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-sm bg-sky-500/85 shadow-[0_0_12px_rgba(56,189,248,0.4)]"
              aria-hidden
            />
            <h2 className="text-base font-bold tracking-tight text-slate-100 md:text-lg">Skill Setup（技能組）</h2>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-[10px] uppercase tracking-wider text-slate-500">
            <input
              type="checkbox"
              className="rounded border-slate-600 bg-slate-900"
              checked={debugMode}
              onChange={(e) => setDebugMode(e.target.checked)}
            />
            Debug（canonical tags / raw requirements）
          </label>
        </div>
        <p className="mt-1.5 pl-4 text-xs text-slate-500">
          資料來自內嵌 <span className="text-slate-400">effective-runtime-bundle</span>（ss12 · v
          {meta.datasetVersionId} · {meta.versionLabel.slice(0, 12)}…）
          {meta.effectiveLayer ? ` · ${meta.effectiveLayer}` : ''}。主／輔／被動 gem 等級獨立於角色 Lv。
        </p>
        <p className="mt-2 pl-4 text-[11px] leading-relaxed text-slate-500">
          <span className="text-slate-400">中央本頁</span>在「檢視中」槽位會顯示
          <strong className="text-sky-200/90">技能局部解釋</strong>（單槽主技能＋連結）；左欄為
          <strong className="text-slate-400">全身 Build 與檢視技能的全局結果</strong>
          ，兩者用途不同，請勿混為同一結論。
        </p>

        <div className="mt-3 rounded-lg border border-slate-800/80 bg-black/25 px-3 py-2.5 pl-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">目前檢視（inspected）</div>
          <div className="mt-1 text-sm text-slate-200">
            {inspectedMainSkillSlot != null ? (
              <>
                <span className="font-mono text-violet-300">Slot {inspectedMainSkillSlot}</span>
                <span className="text-slate-500"> · </span>
                <span>{inspectedName}</span>
              </>
            ) : (
              <span className="text-slate-500">未選取 — 可在主技能卡片按「檢查此技能」或下方編號</span>
            )}
          </div>
          <div className="mt-1.5 text-[10px] leading-relaxed text-slate-500">
            {inspectedTargetSlot != null ? (
              <>
                面板模式 <span className="font-mono text-slate-400">{inspectedPresentationMode}</span>
                {inspectedSkillDamageView.mode === 'damaging' ? null : (
                  <span className="text-slate-600"> · 左欄不會當成主 DPS 輸出卡（與此一致）</span>
                )}
              </>
            ) : (
              <span className="text-slate-600">左欄檢查技能區以「未選槽」狀態顯示。</span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-600">快速切槽</span>
            <button
              type="button"
              onClick={() => setInspectedMainSkill(null)}
              className="rounded-lg px-2 py-1 text-[10px] text-slate-500 underline decoration-slate-700 hover:text-slate-300"
            >
              清除
            </button>
            {([1, 2, 3, 4, 5] as const).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setInspectedMainSkill(n)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold tabular-nums ring-1 transition ${
                  inspectedMainSkillSlot === n
                    ? 'bg-violet-950/70 text-violet-200 ring-violet-600/50'
                    : 'bg-slate-900/60 text-slate-400 ring-slate-700/60 hover:text-slate-200'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {skills.map((skillRow) => {
        const selected = actives.find((s) => s.id === skillRow.skillId)
        const norm = getNormalizedSkillRecord(skillRow.skillId)
        const def = skillRow.skillId ? getSkillDefinitionById(skillRow.skillId) : undefined
        const parseStatus = norm?.parseStatus
        const ps = parseStatusStyles(parseStatus)
        const tagChips = effectiveTagsFromRecord(skillRow.skillId)
        const canonTags = debugMode ? canonicalTagsForDebug(skillRow.skillId) : []
        const dmgRole = def
          ? inferSkillCombatRole(def, skillRow.skillLevel, { parseStatus: norm?.parseStatus })
          : null

        const preview =
          skillRow.skillId && skillRow.enabled !== false
            ? computeSkillInstanceForMainSlot(skillRow, snapshot)
            : null
        const compat = supportCompatById(preview)
        const sortedLinks = [...skillRow.supports].sort((a, b) => a.linkSlot - b.linkSlot)

        const isInspected = inspectedMainSkillSlot === skillRow.slot

        return (
          <div
            key={skillRow.slot}
            className={`rounded-xl border bg-slate-950/40 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] md:p-5 ${
              isInspected
                ? 'border-violet-600/50 ring-1 ring-violet-500/25'
                : 'border-slate-800/70'
            }`}
          >
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] text-slate-600">#{skillRow.slot}</span>
                  {def ? (
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${familyBadgeClass(def.family)}`}
                    >
                      {def.family}
                    </span>
                  ) : null}
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${ps.className}`}
                  >
                    parse {ps.label}
                  </span>
                  {isInspected ? (
                    <span className="rounded-md bg-violet-950/80 px-1.5 py-0.5 text-[10px] font-bold text-violet-200 ring-1 ring-violet-600/45">
                      檢視中
                    </span>
                  ) : null}
                </div>
                <div>
                  <div className="text-lg font-semibold leading-snug text-slate-100">
                    {selected?.name ?? def?.name ?? '未配置主技能'}
                  </div>
                  {skillRow.skillId ? (
                    <div className="mt-0.5 font-mono text-[10px] text-slate-600">{skillRow.skillId}</div>
                  ) : null}
                </div>
                {norm?.warnings?.length ? (
                  <div className="rounded-md border border-amber-900/40 bg-amber-950/20 px-2 py-1.5 text-[10px] leading-relaxed text-amber-200/90">
                    <span className="font-semibold text-amber-400/95">Warnings </span>
                    {norm.warnings.join(' · ')}
                  </div>
                ) : null}
                {parseStatus === 'failed' ? (
                  <div className="rounded-md border border-rose-900/45 bg-rose-950/25 px-2 py-1.5 text-[10px] leading-relaxed text-rose-200/90">
                    此技能 normalized 狀態為 <strong>failed</strong>
                    ：下列等級列、相容性與貢獻僅反映目前 bundle 解析結果，<strong>不應</strong>假設與遊戲內完全一致。
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700/80 bg-black/20 px-2.5 py-1.5 text-[11px] text-slate-400">
                  <input
                    type="checkbox"
                    className="rounded border-slate-600 bg-slate-900"
                    checked={skillRow.enabled !== false}
                    disabled={!skillRow.skillId}
                    onChange={(e) => setMainSkillEnabled(skillRow.slot, e.target.checked)}
                  />
                  啟用組合
                </label>
                <button
                  type="button"
                  disabled={!skillRow.skillId}
                  onClick={() => setInspectedMainSkill(skillRow.slot)}
                  className="rounded-lg border border-violet-700/50 bg-violet-950/40 px-3 py-1.5 text-xs font-medium text-violet-200 hover:bg-violet-950/65 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  檢查此技能
                </button>
                <button
                  type="button"
                  onClick={() => clearSkill(skillRow.slot)}
                  className="rounded-lg border border-slate-600/80 px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-slate-800/60"
                >
                  清空
                </button>
              </div>
            </div>

            <select
              value={skillRow.skillId ?? ''}
              onChange={(e) => setSkill(skillRow.slot, e.target.value || null)}
              className="w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-500/70"
            >
              <option value="">請選擇主動技能</option>
              {actives.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-400">
                主技能 Lv（gem）
                <input
                  type="number"
                  min={1}
                  max={99}
                  disabled={!skillRow.skillId}
                  value={skillRow.skillLevel}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10)
                    setSkillLevel(skillRow.slot, Number.isFinite(v) ? v : 1)
                  }}
                  className="w-16 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-center font-mono text-sm text-slate-100 disabled:opacity-40"
                />
              </label>
              {dmgRole ? (
                <span className="text-[11px] text-slate-500">
                  公式角色: <span className="font-mono text-slate-400">{dmgRole}</span>
                </span>
              ) : null}
            </div>

            {skillRow.enabled === false ? (
              <p className="mt-3 text-[11px] text-slate-500">此槽已停用：不參與聚合／預覽／左欄 breakdown。</p>
            ) : null}

            {tagChips.length > 0 ? (
              <div className="mt-3">
                <div className="mb-1 text-[10px] font-medium uppercase tracking-wide text-slate-600">
                  Tags（effective）
                </div>
                <div className="flex max-h-28 flex-wrap gap-1 overflow-y-auto">
                  {tagChips.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-slate-700/80 bg-black/30 px-1.5 py-0.5 text-[10px] text-slate-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : skillRow.skillId ? (
              <p className="mt-3 text-[10px] text-slate-600">此技能在 normalized 中無 tags 列表。</p>
            ) : null}

            {debugMode && canonTags.length > 0 ? (
              <div className="mt-2">
                <div className="mb-1 text-[10px] font-medium uppercase tracking-wide text-slate-600">
                  Canonical（debug · tagVocabulary）
                </div>
                <div className="flex max-h-20 flex-wrap gap-1 overflow-y-auto">
                  {canonTags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-indigo-900/50 bg-indigo-950/30 px-1.5 py-0.5 text-[9px] text-indigo-200/85"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {isInspected ? <SkillLocalExplainerLaneIntro /> : null}
            {isInspected ? <SkillBaseExplanationCard explanation={skillTabExplanation} /> : null}
            {isInspected ? (
              <SupportLinksEditorSection
                skillRow={skillRow}
                sortedLinks={sortedLinks}
                compat={compat}
                supports={supports}
                isInspected={isInspected}
                skillTabExplanation={skillTabExplanation}
                debugMode={debugMode}
                setSupportLink={setSupportLink}
                setSupportLevel={setSupportLevel}
                toggleSupportEnabled={toggleSupportEnabled}
                clearSkillSupports={clearSkillSupports}
              />
            ) : null}
            {isInspected ? (
              <SkillLocalNumericSummaryCard summary={skillTabExplanation.localNumericSummary} />
            ) : null}
            {isInspected ? (
              <SupportRemovalDeltaPanel
                removal={skillTabExplanation.supportRemovalDeltas}
                stripAll={skillTabExplanation.stripAllSupportsDelta}
              />
            ) : null}
            {isInspected ? (
              <PassiveImpactTracePanel traces={skillTabExplanation.passiveImpactTraces} />
            ) : null}
            {isInspected ? <SkillTabDebugFoldoutPanel d={skillTabExplanation.debugFoldout} /> : null}

            {!isInspected ? (
              <SupportLinksEditorSection
                skillRow={skillRow}
                sortedLinks={sortedLinks}
                compat={compat}
                supports={supports}
                isInspected={isInspected}
                skillTabExplanation={skillTabExplanation}
                debugMode={debugMode}
                setSupportLink={setSupportLink}
                setSupportLevel={setSupportLevel}
                toggleSupportEnabled={toggleSupportEnabled}
                clearSkillSupports={clearSkillSupports}
              />
            ) : null}
          </div>
        )
      })}

      <div className="rounded-2xl border border-slate-800/55 bg-gradient-to-b from-slate-900/35 to-slate-950/20 p-5">
        <div className="mb-3 text-base font-semibold text-slate-100">被動 / 光環（global 或 linked）</div>
        <p className="mb-3 text-xs text-slate-500">
          僅 <strong className="text-slate-400">passive 族</strong> 會注入主技能实例；標籤來自 normalized effective tags。
        </p>
        <div className="space-y-3">
          {passives.map((p) => {
            const passiveList = listSkillsByFamily('passive')
            const pdef = p.skillId ? getSkillDefinitionById(p.skillId) : undefined
            const pNorm = getNormalizedSkillRecord(p.skillId)
            const pTags = effectiveTagsFromRecord(p.skillId)
            const pCanon = debugMode ? canonicalTagsForDebug(p.skillId) : []
            const mechBadges = passiveMechanicalBadges(pdef)
            const ps = parseStatusStyles(pNorm?.parseStatus)

            return (
              <div key={p.slot} className="rounded-lg border border-slate-800/50 bg-black/15 p-3">
                <div className="flex flex-wrap items-end gap-2">
                  <div className="min-w-[8rem] text-xs text-slate-500">Passive {p.slot}</div>
                  <select
                    value={p.skillId ?? ''}
                    onChange={(e) => setPassiveSkill(p.slot, e.target.value || null)}
                    className="min-w-[12rem] flex-1 rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-500/70"
                  >
                    <option value="">（無）</option>
                    {passiveList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <label className="flex cursor-pointer items-center gap-2 text-[11px] text-slate-500">
                    <input
                      type="checkbox"
                      className="rounded border-slate-600 bg-slate-900"
                      checked={p.enabled !== false}
                      disabled={!p.skillId}
                      onChange={() => togglePassiveEnabled(p.slot)}
                    />
                    啟用
                  </label>
                  <button
                    type="button"
                    onClick={() => clearPassive(p.slot)}
                    className="rounded-lg border border-slate-600/80 px-2 py-1.5 text-xs text-slate-400 hover:bg-slate-800/60"
                  >
                    清空
                  </button>
                </div>

                {p.skillId ? (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-slate-200">{pdef?.name ?? p.skillId}</span>
                    {pdef ? (
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${familyBadgeClass(pdef.family)}`}
                      >
                        {pdef.family}
                      </span>
                    ) : null}
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${ps.className}`}
                    >
                      parse {ps.label}
                    </span>
                    {mechBadges.map((b) => (
                      <span
                        key={b}
                        className="rounded-md bg-amber-950/50 px-1.5 py-0.5 text-[10px] text-amber-200/90 ring-1 ring-amber-800/40"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                ) : null}

                {pNorm?.warnings?.length ? (
                  <div className="mt-2 text-[10px] text-amber-200/85">{pNorm.warnings.join(' · ')}</div>
                ) : null}

                {pTags.length > 0 ? (
                  <div className="mt-2">
                    <div className="mb-1 text-[9px] font-medium uppercase tracking-wide text-slate-600">Tags</div>
                    <div className="flex flex-wrap gap-1">
                      {pTags.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-slate-700/80 bg-black/30 px-1.5 py-0.5 text-[10px] text-slate-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {debugMode && pCanon.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {pCanon.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-indigo-900/50 bg-indigo-950/30 px-1.5 py-0.5 text-[9px] text-indigo-200/85"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <label className="text-xs text-slate-500">
                    套用模式
                    <select
                      value={p.applyMode}
                      onChange={(e) =>
                        setPassiveApplyMode(p.slot, e.target.value as PassiveApplyMode)
                      }
                      className="ml-2 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-200"
                    >
                      <option value="global">全域（所有主技能）</option>
                      <option value="linked">僅連結槽位</option>
                    </select>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-500">
                    等級
                    <input
                      type="number"
                      min={1}
                      max={99}
                      disabled={!p.skillId}
                      value={p.skillLevel}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10)
                        setPassiveSkillLevel(p.slot, Number.isFinite(v) ? v : 1)
                      }}
                      className="w-14 rounded border border-slate-700 bg-slate-950 px-1 py-0.5 text-center font-mono text-xs text-slate-200 disabled:opacity-40"
                    />
                  </label>
                </div>
                {p.applyMode === 'linked' ? (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-slate-600">連結主槽</span>
                    {([1, 2, 3, 4, 5] as const).map((n) => (
                      <label key={n} className="flex cursor-pointer items-center gap-1 text-[11px] text-slate-400">
                        <input
                          type="checkbox"
                          className="rounded border-slate-600 bg-slate-900"
                          checked={p.linkedMainSkillSlots.includes(n)}
                          disabled={!p.skillId}
                          onChange={() =>
                            setPassiveLinkedSlots(p.slot, flipLinkedSlot(p.linkedMainSkillSlots, n))
                          }
                        />
                        {n}
                      </label>
                    ))}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
