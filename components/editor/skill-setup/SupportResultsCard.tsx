'use client'

import type { SkillSetupSupportResults } from '@/types/skillSetupPlayerView'
import type { ReactNode } from 'react'
import { SKILL_SETUP_SECTION_SUPPORT_RESULTS } from '@/components/editor/skill-setup/skillSetupCopy'

type Props = {
  results: SkillSetupSupportResults
  /** Link editor + per-row explanations (existing wiring). */
  children?: ReactNode
}

export function SupportResultsCard({ results, children }: Props) {
  const appliedRows = results.rows.filter((r) => r.applied && !r.editorDisabled)
  const otherRows = results.rows.filter((r) => !r.applied || r.editorDisabled)

  return (
    <section className="rounded-xl border border-violet-950/45 bg-gradient-to-b from-violet-950/12 to-slate-950/40 p-4 ring-1 ring-violet-900/20">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-[11px] font-bold uppercase tracking-wide text-violet-200/90">
          2 · {SKILL_SETUP_SECTION_SUPPORT_RESULTS}
        </h3>
        <span className="text-[10px] tabular-nums text-slate-400">
          生效 {results.appliedCount} · 未生效 {results.skippedCount}
        </span>
      </div>

      {children ? <div className="mb-4 border-b border-slate-800/60 pb-4">{children}</div> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-emerald-200/80">已套用</h4>
          {appliedRows.length === 0 ? (
            <p className="text-[11px] text-slate-500">（無）</p>
          ) : (
            <ul className="space-y-2">
              {appliedRows.map((r) => (
                <li
                  key={`${r.linkSlot}-${r.supportId}`}
                  className="rounded-lg border border-slate-800/70 bg-black/20 px-2.5 py-2"
                >
                  <div className="text-[11px] font-medium text-slate-200">
                    連結 {r.linkSlot} · {r.supportName}
                  </div>
                  <ul className="mt-1 list-inside list-disc space-y-0.5 text-[10px] text-slate-400">
                    {r.impactSummaryLines.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                  {!r.hasStructuredQuantifiedSummary ? (
                    <p className="mt-1 text-[9px] text-violet-300/80">暫無精簡數字摘要</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-amber-200/80">未生效／已關閉</h4>
          {otherRows.length === 0 ? (
            <p className="text-[11px] text-slate-500">（無）</p>
          ) : (
            <ul className="space-y-2">
              {otherRows.map((r) => (
                <li
                  key={`${r.linkSlot}-${r.supportId}`}
                  className="rounded-lg border border-slate-800/70 bg-black/20 px-2.5 py-2"
                >
                  <div className="text-[11px] font-medium text-slate-200">
                    連結 {r.linkSlot} · {r.supportName}
                  </div>
                  <p className="mt-1 text-[10px] text-amber-100/85">{r.skipPlainLanguage}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
