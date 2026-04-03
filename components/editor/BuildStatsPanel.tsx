// components/editor/BuildStatsPanel.tsx
'use client'

import React from 'react'
import { useBuildStore } from '@/stores/useBuildStore'
import { useBuildComputedStats } from '@/hooks/useBuildComputedStats'

function formatNum(n: number, maxFrac = 2) {
  return new Intl.NumberFormat('zh-TW', {
    maximumFractionDigits: maxFrac,
    minimumFractionDigits: 0,
  }).format(n)
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span
        className="h-px w-4 shrink-0 rounded-full bg-sky-500/70 shadow-[0_0_10px_rgba(56,189,248,0.35)]"
        aria-hidden
      />
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{children}</span>
    </div>
  )
}

export default function BuildStatsPanel() {
  const dirty = useBuildStore((s) => s.dirty)
  const setTitle = useBuildStore((s) => s.setTitle)
  const setLevel = useBuildStore((s) => s.setLevel)
  const snapshot = useBuildStore((s) => s.snapshot)

  const derived = useBuildComputedStats()
  const { combat, validationErrors, summary } = derived

  const [localTitle, setLocalTitle] = React.useState(snapshot.meta.title)
  React.useEffect(() => {
    setLocalTitle(snapshot.meta.title)
  }, [snapshot.meta.title])

  React.useEffect(() => {
    const t = window.setTimeout(() => {
      if (localTitle !== snapshot.meta.title) setTitle(localTitle)
    }, 300)
    return () => window.clearTimeout(t)
  }, [localTitle, snapshot.meta.title, setTitle])

  const level = snapshot.meta.level

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/55 bg-gradient-to-b from-[#111820] via-[#0b0f14] to-[#080b0f] shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"
        aria-hidden
      />

      <div className="border-b border-slate-800/80 px-4 pb-4 pt-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
            角色面板
          </div>
          <span
            className={`rounded-md px-2 py-0.5 text-[10px] font-semibold tabular-nums ring-1 ${
              dirty
                ? 'bg-amber-950/60 text-amber-200 ring-amber-800/50'
                : 'bg-emerald-950/50 text-emerald-200 ring-emerald-800/40'
            }`}
          >
            {dirty ? '未儲存' : '已同步'}
          </span>
        </div>

        <div className="mt-3.5">
          <div className="relative rounded-xl border border-slate-700/50 bg-[linear-gradient(145deg,rgba(15,23,42,0.65)_0%,rgba(3,7,12,0.85)_100%)] p-3.5 shadow-inner">
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-0 flex-1">
                <label htmlFor="build-title" className="sr-only">
                  流派名稱
                </label>
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  流派名稱
                </span>
                <input
                  id="build-title"
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  placeholder="未命名流派"
                  className="w-full border-0 bg-transparent py-0.5 text-lg font-bold leading-tight text-white placeholder:text-slate-600 focus:outline-none focus:ring-0 md:text-xl"
                />
              </div>
              <div className="flex shrink-0 items-stretch rounded-lg border border-amber-900/45 bg-amber-950/20 shadow-[inset_0_1px_0_rgba(251,191,36,0.08)]">
                <div className="flex items-center px-2.5 py-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-500/95">LV</span>
                </div>
                <div className="w-px self-stretch bg-amber-900/35" aria-hidden />
                <input
                  type="number"
                  min={1}
                  max={9999}
                  aria-label="等級"
                  value={level}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10)
                    setLevel(Number.isFinite(v) ? v : 1)
                  }}
                  className="w-[4.25rem] border-0 bg-transparent px-2 py-2 text-center text-base font-bold tabular-nums text-amber-100 outline-none focus:ring-0"
                />
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-lg border border-slate-800/70 bg-black/25 px-3 py-2.5">
            <SectionLabel>配置摘要</SectionLabel>
            <ul className="mt-1 space-y-1.5 text-[11px] leading-relaxed text-slate-400">
              <li className="flex justify-between gap-2 border-b border-slate-800/40 pb-1.5">
                <span className="text-slate-500">Hero</span>
                <span className="truncate text-right font-medium text-slate-200">{summary.heroLabel}</span>
              </li>
              <li className="flex justify-between gap-2 border-b border-slate-800/40 pb-1.5">
                <span className="text-slate-500">Trait</span>
                <span className="truncate text-right font-medium text-slate-200">{summary.traitLabel}</span>
              </li>
              <li className="flex justify-between gap-2 border-b border-slate-800/40 pb-1.5">
                <span className="text-slate-500">遺物</span>
                <span className="truncate text-right font-medium text-slate-200">{summary.relicLabel}</span>
              </li>
              <li className="flex justify-between gap-2 border-b border-slate-800/40 pb-1.5">
                <span className="text-slate-500">特性</span>
                <span className="truncate text-right font-medium text-slate-200">{summary.specialtyLabel}</span>
              </li>
              <li className="flex justify-between gap-2 border-b border-slate-800/40 pb-1.5">
                <span className="text-slate-500">裝備</span>
                <span className="truncate text-right font-medium text-slate-200">{summary.gearEquippedLine}</span>
              </li>
              <li className="flex justify-between gap-2 border-b border-slate-800/40 pb-1.5">
                <span className="text-slate-500">神格石板</span>
                <span className="max-w-[12rem] truncate text-right text-slate-300">{summary.divinitySummaryLine}</span>
              </li>
              <li className="flex justify-between gap-2 pt-0.5 text-slate-500">
                <span>神格補充</span>
                <span className="max-w-[12rem] truncate text-right">{summary.divinityTextLine}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-800/80 px-4 py-4">
        <SectionLabel>戰鬥讀取（開發版）</SectionLabel>
        <p className="mb-3 text-[10px] leading-relaxed text-slate-600">
          以下為依等級與配置推算的示意數值，非正式遊戲公式。
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-sky-900/40 bg-[linear-gradient(180deg,rgba(8,47,73,0.35)_0%,rgba(3,7,18,0.65)_100%)] px-3 py-3 shadow-[inset_0_1px_0_rgba(56,189,248,0.08)]">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-sky-400/80">每秒 DPS</div>
            <div className="mt-1.5 font-mono text-xl font-bold tabular-nums leading-none tracking-tight text-sky-100">
              {formatNum(combat.dps)}
            </div>
          </div>
          <div className="rounded-xl border border-sky-900/40 bg-[linear-gradient(180deg,rgba(8,47,73,0.35)_0%,rgba(3,7,18,0.65)_100%)] px-3 py-3 shadow-[inset_0_1px_0_rgba(56,189,248,0.08)]">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-sky-400/80">攻擊速度</div>
            <div className="mt-1.5 font-mono text-xl font-bold tabular-nums leading-none tracking-tight text-sky-100">
              {formatNum(combat.attackSpeed)} <span className="text-sm font-semibold text-sky-300/70">/s</span>
            </div>
          </div>
          <div className="rounded-xl border border-sky-900/40 bg-[linear-gradient(180deg,rgba(8,47,73,0.35)_0%,rgba(3,7,18,0.65)_100%)] px-3 py-3 shadow-[inset_0_1px_0_rgba(56,189,248,0.08)] sm:col-span-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-sky-400/80">每下傷害</div>
            <div className="mt-1.5 font-mono text-xl font-bold tabular-nums leading-none tracking-tight text-sky-100">
              {formatNum(combat.hitDamage, 0)}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">屬性與資源</div>
          <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {(
              [
                ['力量', combat.strength],
                ['敏捷', combat.dexterity],
                ['智慧', combat.intelligence],
                ['HP', combat.hp],
                ['MP', combat.mp],
              ] as const
            ).map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg border border-slate-800/80 bg-slate-950/45 px-2.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
              >
                <dt className="text-[10px] text-slate-500">{label}</dt>
                <dd className="mt-0.5 font-mono text-sm font-medium tabular-nums text-slate-200">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="px-4 py-4">
        <SectionLabel>配置檢查</SectionLabel>
        {validationErrors.length === 0 ? (
          <p className="mt-2 rounded-lg border border-emerald-900/35 bg-emerald-950/15 px-3 py-2 text-xs text-emerald-300/95">
            結構完整，可匯出流派碼。
          </p>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {validationErrors.map((err) => (
              <li
                key={err}
                className="rounded-lg border border-amber-900/45 bg-amber-950/25 px-2.5 py-1.5 text-xs text-amber-200/90"
              >
                {err}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
