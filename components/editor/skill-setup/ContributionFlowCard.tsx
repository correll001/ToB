'use client'

import type { ReactNode } from 'react'
import type { SkillSetupContributionFlow } from '@/types/skillSetupPlayerView'
import { SKILL_SETUP_SECTION_CONTRIBUTION_FLOW } from '@/components/editor/skill-setup/skillSetupCopy'

type Props = {
  flow: SkillSetupContributionFlow
}

function FlowArrow() {
  return (
    <div className="flex justify-center py-1" aria-hidden>
      <span className="text-lg font-light text-sky-600/90">↓</span>
    </div>
  )
}

function LayerShell({
  stepLabel,
  title,
  children,
}: {
  stepLabel: string
  title: string
  children: ReactNode
}) {
  return (
    <div className="rounded-lg border border-slate-800/70 bg-slate-950/40 p-3 ring-1 ring-slate-800/40">
      <div className="mb-2 border-b border-slate-800/60 pb-2">
        <span className="text-[11px] font-bold text-sky-100/95">
          <span className="mr-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-sky-400/95">
            {stepLabel}
          </span>
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}

export function ContributionFlowCard({ flow }: Props) {
  const { base, supports, passivesAura, final } = flow
  const baseHasContent = base.narrativeLines.length > 0 || base.levelRowFactLines.length > 0
  const passiveHasContent =
    passivesAura.narrativeLines.length > 0 || passivesAura.traces.length > 0

  return (
    <section className="rounded-xl border border-sky-950/45 bg-gradient-to-b from-sky-950/10 to-slate-950/40 p-4 ring-1 ring-sky-900/20">
      <h3 className="mb-1 text-[11px] font-bold uppercase tracking-wide text-sky-200/90">
        3 · {SKILL_SETUP_SECTION_CONTRIBUTION_FLOW}
      </h3>
      <p className="mb-3 text-[10px] text-slate-600">
        順序：基底 → 連結輔助 → 被動／光環 → 結果（未生效的輔助不列在這裡）
      </p>

      <div className="space-y-0">
        <LayerShell stepLabel="①" title="基底：技能本體與等級">
          {!baseHasContent ? (
            <p className="text-[10px] text-slate-500">（尚無可顯示的基底說明）</p>
          ) : null}
          {base.narrativeLines.length > 0 ? (
            <div className="mb-2">
              <div className="mb-1 text-[9px] font-semibold text-slate-600">說明摘要</div>
              <ul className="list-inside list-disc space-y-1 text-[10px] leading-relaxed text-slate-400">
                {base.narrativeLines.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {base.levelRowFactLines.length > 0 ? (
            <div>
              <div className="mb-1 text-[9px] font-semibold text-slate-600">等級表重點</div>
              <ul className="list-inside list-disc space-y-1 text-[10px] leading-relaxed text-slate-400">
                {base.levelRowFactLines.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </LayerShell>

        <FlowArrow />

        <LayerShell stepLabel="②" title="連結輔助（僅已生效）">
          {supports.items.length === 0 ? (
            <p className="text-[10px] leading-relaxed text-slate-500">{supports.emptyHint}</p>
          ) : (
            <ul className="space-y-3">
              {supports.items.map((s) => (
                <li
                  key={s.linkSlot}
                  className="rounded-md border border-violet-900/35 bg-violet-950/10 px-2.5 py-2 ring-1 ring-violet-900/15"
                >
                  <div className="text-[11px] font-medium text-slate-200">
                    連結 {s.linkSlot} · {s.supportName}{' '}
                    <span className="font-mono text-[10px] text-slate-500">Lv {s.gemLevel}</span>
                  </div>
                  {s.noStructuredEffect && s.effectLines.length > 0 ? (
                    <span className="mt-1 inline-block rounded border border-violet-800/40 px-1 py-0.5 text-[9px] text-violet-200/85">
                      暫無數字摘要
                    </span>
                  ) : null}
                  <ul className="mt-1.5 list-inside list-disc space-y-0.5 text-[10px] text-slate-400">
                    {s.effectLines.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                  {s.moreEffectCount > 0 ? (
                    <p className="mt-1 text-[9px] text-slate-600">
                      上方「輔助套用結果」還有 {s.moreEffectCount} 條說明
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
          {supports.items.length > 0 ? (
            <p className="mt-2 text-[9px] text-slate-600">
              若拔掉輔助的試算差異見「進階詳情 → 輔助移除試算」。
            </p>
          ) : null}
        </LayerShell>

        <FlowArrow />

        <LayerShell stepLabel="③" title="被動與光環（作用在本技能上）">
          <p className="mb-2 rounded border border-amber-900/30 bg-amber-950/15 px-2 py-1.5 text-[10px] leading-relaxed text-amber-100/90">
            {passivesAura.unquantifiedDeltaNotice}
          </p>
          {!passiveHasContent ? (
            <p className="text-[10px] text-slate-500">（目前沒有列出的被動／光環說明）</p>
          ) : null}
          {passivesAura.narrativeLines.length > 0 ? (
            <ul className="mb-2 list-inside list-disc space-y-1 text-[10px] text-slate-400">
              {passivesAura.narrativeLines.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          ) : null}
          {passivesAura.traces.length > 0 ? (
            <p className="text-[10px] text-slate-500">
              另有 {passivesAura.traces.length} 筆被動／光環細節，請在「進階詳情 → 被動／光環 · 詳列」查看。
            </p>
          ) : null}
        </LayerShell>

        <FlowArrow />

        <LayerShell stepLabel="④" title="結果：這串技能的預覽數字">
          {final.unavailableNote ? (
            <p className="mb-2 rounded-md border border-amber-900/35 bg-amber-950/20 px-2 py-1.5 text-[10px] text-amber-100/90">
              {final.unavailableNote}
            </p>
          ) : null}
          {final.metrics.length > 0 ? (
            <dl className="grid gap-2 text-[10px] sm:grid-cols-2">
              {final.metrics.map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between gap-2 border-b border-slate-800/50 pb-1.5"
                >
                  <dt className="text-slate-500">{row.label}</dt>
                  <dd className="font-mono text-right text-slate-200">{row.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-[10px] text-slate-500">（尚無可顯示的結果數字）</p>
          )}
          {final.extraLines.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-0.5 text-[10px] text-slate-500">
              {final.extraLines.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          ) : null}
        </LayerShell>
      </div>
    </section>
  )
}
