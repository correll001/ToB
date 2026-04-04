'use client'

import type { SkillTabDebugFoldout } from '@/types/skillTabExplanation'
import { formatSupportSkipReasonZh } from '@/lib/format/supportLinkExplanationFormat'
import { skillTabParseStatusLabel } from '@/components/editor/skill-setup/skillSetupChips'

export function debugFoldoutEmptyMessage(d: SkillTabDebugFoldout): string | null {
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

/** Nested debug sections (typically inside Advanced Details). */
export function SkillTabDebugFoldoutPanel({ d }: { d: SkillTabDebugFoldout }) {
  const emptyNote = debugFoldoutEmptyMessage(d)

  return (
    <details className="mt-3 rounded-lg border border-slate-800/80 bg-slate-950/35 ring-1 ring-slate-800/50">
      <summary className="cursor-pointer px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        <span className="inline-flex items-center gap-2">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-sm bg-slate-500 shadow-[0_0_8px_rgba(148,163,184,0.35)]"
            aria-hidden
          />
          引擎診斷與缺資料細節
          <span className="text-[10px] font-normal normal-case tracking-normal text-slate-600">
            （可再展開）
          </span>
        </span>
      </summary>
      <div className="space-y-4 border-t border-slate-800/70 px-3 pb-3 pt-2 text-[11px] leading-relaxed text-slate-300">
        {emptyNote ? <p className="text-slate-500">{emptyNote}</p> : null}

        <section>
          <h4 className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            1 · 標籤索引（canonical / tagVocabulary）
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
            <p className="text-slate-600">（無 — 無技能 ID 或資料紀錄）</p>
          )}
        </section>

        <section>
          <h4 className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            2 · 原始需求條件（raw lines · 主技能與連結）
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
                  <li
                    key={`${blk.linkSlot}-${blk.supportId}`}
                    className="rounded-md border border-slate-800/60 bg-black/20 p-2"
                  >
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
              <p className="text-[10px] text-slate-600">連結輔助：無原始需求列可顯示。</p>
            )}
          </div>
        </section>

        <section>
          <h4 className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            3 · 引擎警告（engineWarnings）
          </h4>
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
            4 · 紀錄與解析狀態（recordWarnings · parseStatus）
          </h4>
          <p className="mb-1 text-slate-400">
            <span className="text-slate-600">解析狀態：</span>
            {d.parseStatus != null ? skillTabParseStatusLabel(d.parseStatus) : '—'}
          </p>
          {d.recordWarnings.length > 0 ? (
            <ul className="list-inside list-disc space-y-0.5 text-slate-400">
              {d.recordWarnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-600">紀錄警告：（無）</p>
          )}
          {d.instanceWarnings.length > 0 ? (
            <div className="mt-2">
              <div className="mb-0.5 text-[10px] text-slate-600">實例警告（instance · 技能層）</div>
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
            5 · 等級列細節（level row / partial）
          </h4>
          {d.levelRowDetailLines.length > 0 ? (
            <ul className="max-h-48 list-inside list-disc space-y-0.5 overflow-y-auto font-mono text-[10px] text-slate-400">
              {d.levelRowDetailLines.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-600">（無等級列細節列）</p>
          )}
        </section>

        <section>
          <h4 className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            6 · 略過的連結輔助（引擎視角）
          </h4>
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
            <p className="text-slate-600">（無略過的連結，或尚未建立計算實例）</p>
          )}
        </section>

        <section>
          <h4 className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">7 · 缺資料提示（本技能）</h4>
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
              情境說明（無計算實例 instance）
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
              計算追蹤摘要（instance trace）
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
