// components/editor/DivinityBoardPanel.tsx
'use client'

import React from 'react'
import { useBuildStore } from '@/stores/useBuildStore'
import { mockDivinityBoardOptions } from '@/data/mockGameData'

function useDebouncedEffect(value: string, commit: (v: string) => void, ms: number) {
  React.useEffect(() => {
    const t = window.setTimeout(() => commit(value), ms)
    return () => window.clearTimeout(t)
  }, [value, commit, ms])
}

export default function DivinityBoardPanel() {
  const notes = useBuildStore((s) => s.snapshot.divinityBoard.notes)
  const plan = useBuildStore((s) => s.snapshot.divinityBoard.plan)
  const selected = useBuildStore((s) => s.snapshot.divinityBoard.selectedBoardIds)
  const setDivinityBoardNotes = useBuildStore((s) => s.setDivinityBoardNotes)
  const setDivinityBoardPlan = useBuildStore((s) => s.setDivinityBoardPlan)
  const toggleDivinityBoardSelection = useBuildStore((s) => s.toggleDivinityBoardSelection)

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

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="rounded-2xl border border-slate-800/55 bg-gradient-to-b from-slate-900/35 to-slate-950/20 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-sm bg-violet-500/85 shadow-[0_0_12px_rgba(139,92,246,0.35)]" aria-hidden />
          <h2 className="text-base font-bold tracking-tight text-slate-100 md:text-lg">神格石板補充</h2>
        </div>
        <p className="mt-1.5 pl-4 text-sm text-slate-500">
          結構化備註與示意石板多選；資料寫入 build、可持久化與流派碼匯出，不含真實石板規則。
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800/65 bg-slate-950/35 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
        <h3 className="text-sm font-bold text-slate-300">補充說明（notes）</h3>
        <textarea
          value={localNotes}
          onChange={(e) => setLocalNotes(e.target.value)}
          onBlur={flushNotes}
          placeholder="簡要補充目前石板／神格相關想法…"
          className="mt-2 min-h-24 w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-500/70"
        />
      </div>

      <div className="rounded-2xl border border-slate-800/65 bg-slate-950/35 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
        <h3 className="text-sm font-bold text-slate-300">配置計畫（plan）</h3>
        <textarea
          value={localPlan}
          onChange={(e) => setLocalPlan(e.target.value)}
          onBlur={flushPlan}
          placeholder="例如：優先順序、之後要補的石板方向…"
          className="mt-2 min-h-24 w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-500/70"
        />
      </div>

      <div className="rounded-2xl border border-slate-800/65 bg-slate-950/35 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
        <h3 className="text-sm font-bold text-slate-300">示意石板（多選）</h3>
        <p className="mt-1 text-xs text-slate-500">勾選會影響左側開發版數值加權（示意）。</p>
        <ul className="mt-3 space-y-2">
          {mockDivinityBoardOptions.map((opt) => {
            const checked = selected.includes(opt.id)
            return (
              <li key={opt.id}>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-800/65 bg-black/25 px-3 py-2 hover:border-slate-700 hover:bg-slate-900/50">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleDivinityBoardSelection(opt.id)}
                    className="rounded border-slate-600"
                  />
                  <span className="text-sm text-slate-200">{opt.name}</span>
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
