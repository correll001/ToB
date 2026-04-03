// components/editor/DivinityBoardPanel.tsx
'use client'

import React, { useMemo } from 'react'
import { useBuildStore } from '@/stores/useBuildStore'
import { mockDivinityBoardOptions } from '@/data/mockGameData'

const NOTES_PLACEHOLDER = '簡要補充目前石板／神格相關想法…'
const PLAN_PLACEHOLDER = '例如：優先順序、之後要補的石板方向…'

function useDebouncedEffect(value: string, commit: (v: string) => void, ms: number) {
  React.useEffect(() => {
    const t = window.setTimeout(() => commit(value), ms)
    return () => window.clearTimeout(t)
  }, [value, commit, ms])
}

function pickBoardLabel(id: string) {
  return mockDivinityBoardOptions.find((o) => o.id === id)?.name ?? id
}

export default function DivinityBoardPanel() {
  const notes = useBuildStore((s) => s.snapshot.divinityBoard?.notes ?? '')
  const plan = useBuildStore((s) => s.snapshot.divinityBoard?.plan ?? '')
  const rawSelected = useBuildStore((s) => s.snapshot.divinityBoard?.selectedBoardIds)
  const setDivinityBoardNotes = useBuildStore((s) => s.setDivinityBoardNotes)
  const setDivinityBoardPlan = useBuildStore((s) => s.setDivinityBoardPlan)
  const toggleDivinityBoardSelection = useBuildStore((s) => s.toggleDivinityBoardSelection)

  const selectedIds = useMemo(
    () => (Array.isArray(rawSelected) ? rawSelected : []),
    [rawSelected]
  )

  const [localNotes, setLocalNotes] = React.useState(notes)
  const [localPlan, setLocalPlan] = React.useState(plan)

  React.useEffect(() => {
    setLocalNotes(notes)
  }, [notes])
  React.useEffect(() => {
    setLocalPlan(plan)
  }, [plan])

  const commitNotes = React.useCallback(
    (v: string) => {
      setDivinityBoardNotes(v)
    },
    [setDivinityBoardNotes]
  )
  const commitPlan = React.useCallback(
    (v: string) => {
      setDivinityBoardPlan(v)
    },
    [setDivinityBoardPlan]
  )

  useDebouncedEffect(localNotes, commitNotes, 300)
  useDebouncedEffect(localPlan, commitPlan, 300)

  const flushNotes = () => {
    if (localNotes !== notes) setDivinityBoardNotes(localNotes)
  }
  const flushPlan = () => {
    if (localPlan !== plan) setDivinityBoardPlan(localPlan)
  }

  const selectedSummaryLine = useMemo(() => {
    if (selectedIds.length === 0) return '（無）'
    return selectedIds.map((id) => pickBoardLabel(id)).join('、')
  }, [selectedIds])

  const hasNotesDraft = localNotes.trim().length > 0
  const hasPlanDraft = localPlan.trim().length > 0

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="rounded-2xl border border-slate-800/55 bg-gradient-to-b from-slate-900/35 to-slate-950/20 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-sm bg-violet-500/85 shadow-[0_0_12px_rgba(139,92,246,0.35)]" aria-hidden />
          <h2 className="text-base font-bold tracking-tight text-slate-100 md:text-lg">神格石板補充</h2>
        </div>
        <p className="mt-1.5 pl-4 text-sm text-slate-500">
          結構化備註與示意石板多選；資料寫入 build、可持久化與流派碼匯出。左側開發版數值會隨多選與文字長度（示意）變化，不含真實石板規則。
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800/65 bg-slate-950/35 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-300">補充說明（notes）</h3>
          <span className="text-[11px] tabular-nums text-slate-500">{localNotes.length} 字</span>
        </div>
        <textarea
          value={localNotes}
          onChange={(e) => setLocalNotes(e.target.value)}
          onBlur={flushNotes}
          placeholder={NOTES_PLACEHOLDER}
          className="mt-2 min-h-28 w-full resize-y rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-500/70"
          aria-label="神格石板補充說明"
        />
        <p className="mt-1.5 text-[11px] text-slate-600">變更約 300ms 後寫入 store；離開欄位時立即同步。</p>
      </div>

      <div className="rounded-2xl border border-slate-800/65 bg-slate-950/35 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-300">配置計畫（plan）</h3>
          <span className="text-[11px] tabular-nums text-slate-500">{localPlan.length} 字</span>
        </div>
        <textarea
          value={localPlan}
          onChange={(e) => setLocalPlan(e.target.value)}
          onBlur={flushPlan}
          placeholder={PLAN_PLACEHOLDER}
          className="mt-2 min-h-28 w-full resize-y rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-500/70"
          aria-label="神格石板配置計畫"
        />
        <p className="mt-1.5 text-[11px] text-slate-600">變更約 300ms 後寫入 store；離開欄位時立即同步。</p>
      </div>

      <div className="rounded-2xl border border-slate-800/65 bg-slate-950/35 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
        <h3 className="text-sm font-bold text-slate-300">示意石板（多選）</h3>
        <p className="mt-1 text-xs text-slate-500">
          使用 store <code className="text-slate-400">toggleDivinityBoardSelection</code>；勾選會影響左側開發版數值加權（示意）。
        </p>
        <ul className="mt-3 space-y-2">
          {mockDivinityBoardOptions.map((opt) => {
            const checked = selectedIds.includes(opt.id)
            return (
              <li key={opt.id}>
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 transition ${
                    checked
                      ? 'border-violet-500/55 bg-violet-950/25 shadow-[0_0_0_1px_rgba(139,92,246,0.15)]'
                      : 'border-slate-800/65 bg-black/25 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleDivinityBoardSelection(opt.id)}
                    className="mt-1 shrink-0 rounded border-slate-600"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-slate-200">{opt.name}</span>
                    <span className="mt-0.5 block font-mono text-[11px] text-slate-500">{opt.id}</span>
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="rounded-2xl border border-slate-800/55 bg-gradient-to-b from-slate-900/40 to-slate-950/30 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <h3 className="text-sm font-bold text-slate-300">本頁摘要</h3>
        <p className="mt-1 text-xs text-slate-500">頁內輔助用；左側角色面板另顯示流派級摘要。</p>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex flex-col gap-1 rounded-lg border border-slate-800/60 bg-slate-950/40 px-3 py-2">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">示意石板</div>
            <div className="text-slate-200">
              已選 <span className="tabular-nums font-semibold text-violet-200">{selectedIds.length}</span> 塊
            </div>
            <div className="text-xs leading-relaxed text-slate-400">{selectedSummaryLine}</div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-800/60 bg-slate-950/40 px-3 py-2">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Notes</div>
              <div className="mt-1 font-medium text-slate-200">
                {hasNotesDraft ? '有內容' : '空白'}
              </div>
            </div>
            <div className="rounded-lg border border-slate-800/60 bg-slate-950/40 px-3 py-2">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Plan</div>
              <div className="mt-1 font-medium text-slate-200">
                {hasPlanDraft ? '有內容' : '空白'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
