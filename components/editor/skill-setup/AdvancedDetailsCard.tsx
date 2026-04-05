'use client'

import React from 'react'
import type { BuildSnapshot } from '@/types/build'
import type { SkillDefinition } from '@/types/skillData'
import type {
  SkillTabExplanation,
  SkillTabPassiveImpactTrace,
  SkillTabStripAllSupportsDelta,
  SkillTabSupportRemovalDelta,
} from '@/types/skillTabExplanation'
import type { SkillSetupAdvancedDetails } from '@/types/skillSetupPlayerView'
import { getBundledSkillDatasetMeta, getNormalizedSkillRecord, getSkillDefinitionById } from '@/lib/runtime/runtimeSkillLookup'
import { activeCanonicalTagSet } from '@/lib/formula/skills/tagVocabulary'
import { skillLocalStatLabelZh } from '@/lib/format/supportLinkExplanationFormat'
import { SkillTabDebugFoldoutPanel } from '@/components/editor/skill-setup/SkillSetupDebugFoldout'
import { SKILL_SETUP_SECTION_ADVANCED } from '@/components/editor/skill-setup/skillSetupCopy'
import {
  skillTabConfidenceChipClass,
  skillTabConfidenceLabel,
  skillTabParseStatusLabel,
} from '@/components/editor/skill-setup/skillSetupChips'
import { passiveMechanicalBadgePlayerLabel } from '@/components/editor/skill-setup/skillSetupCopy'

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

function effectiveTagsFromRecord(skillId: string | null | undefined): string[] {
  if (!skillId) return []
  const rec = getNormalizedSkillRecord(skillId)
  const raw = rec?.definition.tags ?? []
  return [...new Set(raw)]
}

function AdvancedFold({
  title,
  defaultOpen = false,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <details
      className="rounded-lg border border-slate-800/65 bg-black/20"
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="cursor-pointer px-3 py-2 text-[10px] font-semibold text-slate-400">{title}</summary>
      <div className="border-t border-slate-800/60 px-3 pb-3 pt-2 text-[11px] text-slate-300">{children}</div>
    </details>
  )
}

function SupportRemovalDeltaPanel({
  removal,
  stripAll,
}: {
  removal: SkillTabSupportRemovalDelta[]
  stripAll: SkillTabStripAllSupportsDelta | null
}) {
  return (
    <div className="rounded-md border border-fuchsia-900/35 bg-fuchsia-950/10 p-3 ring-1 ring-fuchsia-900/15">
      <h4 className="mb-2 text-[10px] font-bold tracking-wide text-fuchsia-200/85">輔助移除對照（試算）</h4>
      {removal.length === 0 ? (
        <p className="text-[11px] text-slate-500">目前沒有可評估的連結列。</p>
      ) : (
        <ul className="space-y-2">
          {removal.map((r) => (
            <li key={r.linkSlot} className="rounded-md border border-slate-800/70 bg-black/25 px-2 py-2">
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-200">
                <span className="font-mono text-slate-500">連結 {r.linkSlot}</span>
                <span>{r.supportName}</span>
                {r.editorDisabled ? (
                  <span className="rounded bg-slate-800/80 px-1 py-0.5 text-[10px] text-slate-500">連結已停</span>
                ) : r.applied ? (
                  <span className="rounded bg-emerald-950/50 px-1 py-0.5 text-[10px] text-emerald-200">已套用</span>
                ) : (
                  <span className="rounded bg-amber-950/50 px-1 py-0.5 text-[10px] text-amber-200">已跳過</span>
                )}
              </div>
              <ul className="mt-1 list-inside list-disc text-[10px] text-slate-400">
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
        <div className="mt-3 border-t border-slate-800/60 pt-2">
          <div className="text-[10px] font-bold text-slate-500">若停用此槽全部連結輔助</div>
          <ul className="mt-1 list-inside list-disc text-[10px] text-slate-400">
            {stripAll.deltaLines.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
          {stripAll.computedStatDeltas.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1">
              {stripAll.computedStatDeltas.slice(0, 8).map((d) => (
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
        </div>
      ) : null}
    </div>
  )
}

function PassiveImpactTracePanel({ traces }: { traces: SkillTabPassiveImpactTrace[] }) {
  if (traces.length === 0) {
    return <p className="text-[11px] text-slate-500">無被動／光環痕跡可列。</p>
  }
  return (
    <ul className="mt-1 space-y-2">
      {traces.map((t) => (
        <li
          key={`${t.passiveEditorSlot}-${t.passiveSkillId}`}
          className="rounded-md border border-slate-800/70 bg-black/25 px-2 py-2"
        >
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-200">
            <span className="font-mono text-slate-500">P{t.passiveEditorSlot}</span>
            <span className="font-medium">{t.passiveName}</span>
            <span className="font-mono text-[10px] text-slate-600">{t.passiveSkillId}</span>
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
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
            <p className="mt-2 text-[10px] text-slate-500">（尚無可列出的內部識別項目）</p>
          )}
          {t.partialHints.length > 0 ? (
            <div className="mt-2 rounded-md border border-amber-900/40 bg-amber-950/20 px-2 py-1.5 text-[10px] leading-relaxed text-amber-100/90">
              <span className="font-semibold text-amber-400/95">資料未齊</span>
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
  )
}

type Props = {
  advanced: SkillSetupAdvancedDetails
  explanation: SkillTabExplanation
  snapshot: BuildSnapshot
  inspectedPresentationMode: string
  inspectedActiveSkillId: string | null
  mainSkillDefinitionTags: string[]
  mainSkillNormWarnings: string[]
}

export function AdvancedDetailsCard({
  advanced,
  explanation,
  snapshot,
  inspectedPresentationMode,
  inspectedActiveSkillId,
  mainSkillDefinitionTags,
  mainSkillNormWarnings,
}: Props) {
  const [debugMode, setDebugMode] = React.useState(false)
  const meta = getBundledSkillDatasetMeta()

  const showEffective =
    explanation.inspectedDamageViewMode === 'damaging' ||
    explanation.inspectedDamageViewMode === 'dpsBlocked'

  const linkWarningBlocks = explanation.supportLinkExplanations.filter((l) => l.warnings.length > 0)

  return (
    <details className="mt-4 rounded-xl border border-slate-800/70 bg-slate-950/30 ring-1 ring-slate-800/45">
      <summary className="cursor-pointer px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
        4 · {SKILL_SETUP_SECTION_ADVANCED}
        <span className="ml-2 text-[10px] font-normal normal-case tracking-normal text-slate-600">
          （預設收合 · 技術細節）
        </span>
      </summary>
      <div className="space-y-2 border-t border-slate-800/70 px-3 pb-4 pt-3">
        <AdvancedFold title="① 範圍、版本與識別碼">
          <p className="text-[10px] leading-relaxed text-slate-500">
            此區為單一主技能槽＋連結；全身總傷以左側面板為準。
          </p>
          <p className="mt-2 text-[10px] text-slate-500">
            資料版本：v{meta.datasetVersionId} · {meta.versionLabel.slice(0, 14)}…
            {meta.effectiveLayer ? ` · ${meta.effectiveLayer}` : ''}
          </p>
          <p className="mt-2 text-[10px] text-slate-600">
            顯示模式 <span className="font-mono text-slate-500">{inspectedPresentationMode}</span>
          </p>
          {inspectedActiveSkillId ? (
            <p className="mt-1 font-mono text-[10px] text-slate-500">主技能 ID：{inspectedActiveSkillId}</p>
          ) : null}
        </AdvancedFold>

        <AdvancedFold title="② 解析狀態與計算信賴度（parseStatus / confidence）">
          <div className="flex flex-wrap items-center gap-2 text-[10px]">
            <span className="text-slate-500">解析</span>
            <span
              className={`rounded-md px-1.5 py-0.5 font-semibold ring-1 ${
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
            {explanation.calculationConfidence != null ? (
              <span className={skillTabConfidenceChipClass(explanation.calculationConfidence)}>
                本技能 {skillTabConfidenceLabel(explanation.calculationConfidence)}
              </span>
            ) : null}
            {showEffective && explanation.effectiveCalculationConfidence != null ? (
              <span className={skillTabConfidenceChipClass(explanation.effectiveCalculationConfidence)}>
                含全身加成 {skillTabConfidenceLabel(explanation.effectiveCalculationConfidence)}
              </span>
            ) : null}
          </div>
        </AdvancedFold>

        <AdvancedFold title="③ 標籤與被動槽技術標記（資料原文）">
          <div className="space-y-3 text-[10px]">
            <div>
              <div className="mb-1 font-semibold text-slate-500">主技能 · 標籤</div>
              {mainSkillDefinitionTags.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {mainSkillDefinitionTags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-slate-700/80 bg-black/30 px-1.5 py-0.5 text-slate-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600">（無）</p>
              )}
            </div>
            <div>
              <div className="mb-1 font-semibold text-slate-500">被動槽 · 標籤</div>
              <ul className="space-y-2">
                {snapshot.passives.map((p) => {
                  if (!p.skillId) return null
                  const tags = effectiveTagsFromRecord(p.skillId)
                  if (tags.length === 0) return null
                  return (
                    <li key={p.slot}>
                      <span className="text-slate-500">槽 {p.slot}：</span>
                      <span className="ml-1 inline-flex flex-wrap gap-1">
                        {tags.map((t) => (
                          <span
                            key={t}
                            className="rounded border border-slate-700/70 bg-black/25 px-1 py-0.5 text-slate-400"
                          >
                            {t}
                          </span>
                        ))}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div>
              <div className="mb-1 font-semibold text-slate-500">被動槽 · 機制標記</div>
              <ul className="space-y-1">
                {snapshot.passives.map((p) => {
                  if (!p.skillId) return null
                  const pdef = getSkillDefinitionById(p.skillId)
                  const badges = passiveMechanicalBadges(pdef)
                  if (badges.length === 0) return null
                  return (
                    <li key={p.slot} className="text-slate-400">
                      槽 {p.slot}：{badges.map(passiveMechanicalBadgePlayerLabel).join(' · ')}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </AdvancedFold>

        <AdvancedFold title="④ 提醒、缺資料與連結附註">
          {mainSkillNormWarnings.length > 0 ? (
            <div className="mb-2">
              <div className="mb-1 text-[10px] font-semibold text-amber-600/90">主技能 · 資料紀錄提醒</div>
              <ul className="list-inside list-disc text-[10px] text-amber-100/85">
                {mainSkillNormWarnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {snapshot.passives.map((p) => {
            const nw = p.skillId ? getNormalizedSkillRecord(p.skillId)?.warnings : undefined
            if (!nw?.length) return null
            return (
              <div key={`pw-${p.slot}`} className="mb-2">
                <div className="mb-1 text-[10px] font-semibold text-amber-600/90">被動槽 {p.slot} · 資料紀錄提醒</div>
                <ul className="list-inside list-disc text-[10px] text-amber-100/85">
                  {nw.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )
          })}
          {advanced.topLevelLocalWarnings.length > 0 ? (
            <div className="mb-2">
              <div className="mb-1 text-[10px] font-semibold text-slate-500">本頁（解釋器）提醒</div>
              <ul className="list-inside list-disc text-[10px] text-slate-400">
                {advanced.topLevelLocalWarnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {advanced.missingDataHintsTop.length > 0 ? (
            <div className="mb-2">
              <div className="mb-1 text-[10px] font-semibold text-amber-700/90">缺資料提示</div>
              <ul className="list-inside list-disc text-[10px] text-amber-100/85">
                {advanced.missingDataHintsTop.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {linkWarningBlocks.length > 0 ? (
            <div>
              <div className="mb-1 text-[10px] font-semibold text-slate-500">連結列 · 引擎附註</div>
              <ul className="space-y-2">
                {linkWarningBlocks.map((l) => (
                  <li key={l.linkSlot} className="rounded border border-slate-800/60 bg-black/20 px-2 py-1.5 text-[10px] text-slate-400">
                    <div className="font-medium text-slate-300">
                      連結 {l.linkSlot} · {l.supportName}
                    </div>
                    <ul className="mt-1 list-inside list-decimal text-[9px] text-slate-500">
                      {l.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {mainSkillNormWarnings.length === 0 &&
          !snapshot.passives.some((p) => {
            const w = p.skillId ? getNormalizedSkillRecord(p.skillId)?.warnings : undefined
            return (w?.length ?? 0) > 0
          }) &&
          advanced.topLevelLocalWarnings.length === 0 &&
          advanced.missingDataHintsTop.length === 0 &&
          linkWarningBlocks.length === 0 ? (
            <p className="text-[10px] text-slate-600">（此區暫無項目）</p>
          ) : null}
        </AdvancedFold>

        <AdvancedFold title="⑤ 輔助移除試算（對照差異）">
          <SupportRemovalDeltaPanel removal={explanation.supportRemovalDeltas} stripAll={explanation.stripAllSupportsDelta} />
        </AdvancedFold>

        <AdvancedFold title="⑥ 被動／光環 · 詳列（trace）">
          <PassiveImpactTracePanel traces={explanation.passiveImpactTraces} />
        </AdvancedFold>

        <AdvancedFold title="⑦ 引擎診斷（canonical · raw · trace）">
          <label className="mb-2 flex cursor-pointer items-center gap-2 text-[10px] uppercase tracking-wider text-slate-500">
            <input
              type="checkbox"
              className="rounded border-slate-600 bg-slate-900"
              checked={debugMode}
              onChange={(e) => setDebugMode(e.target.checked)}
            />
            顯示各被動槽標籤索引（canonical）
          </label>
          {debugMode
            ? snapshot.passives.map((p) => {
                if (!p.skillId) return null
                const canon = [
                  ...activeCanonicalTagSet(getNormalizedSkillRecord(p.skillId)?.definition.tags ?? []),
                ].sort((a, b) => a.localeCompare(b, 'en'))
                if (canon.length === 0) return null
                return (
                  <section key={p.slot} className="mb-2">
                    <h4 className="mb-1 text-[10px] font-bold uppercase text-slate-500">被動槽 {p.slot} · canonical</h4>
                    <div className="flex flex-wrap gap-1">
                      {canon.map((t) => (
                        <span
                          key={t}
                          className="rounded border border-indigo-900/50 bg-indigo-950/30 px-1.5 py-0.5 font-mono text-[9px] text-indigo-200/85"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </section>
                )
              })
            : null}
          <SkillTabDebugFoldoutPanel d={explanation.debugFoldout} />
        </AdvancedFold>
      </div>
    </details>
  )
}
