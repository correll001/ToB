// components/editor/BuildStatsPanel.tsx
'use client'

import React, { useMemo } from 'react'
import { useBuildStore } from '@/stores/useBuildStore'
import { computeBuildPanelStats } from '@/lib/buildComputedStats'
import { selectValidationErrors } from '@/selectors/buildSelectors'

function formatNum(n: number, maxFrac = 2) {
  return new Intl.NumberFormat('zh-TW', {
    maximumFractionDigits: maxFrac,
    minimumFractionDigits: 0,
  }).format(n)
}

export default function BuildStatsPanel() {
  const snapshot = useBuildStore((s) => s.snapshot)
  const dirty = useBuildStore((s) => s.dirty)
  const setTitle = useBuildStore((s) => s.setTitle)
  const setLevel = useBuildStore((s) => s.setLevel)

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

  const stats = useMemo(() => computeBuildPanelStats(snapshot), [snapshot])
  const errors = useMemo(() => selectValidationErrors(snapshot), [snapshot])

  const level = snapshot.meta.level

  return (
    <div className="rounded-2xl border border-gray-800/80 bg-gradient-to-b from-gray-900/95 to-gray-950/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
      <div className="border-b border-gray-800/80 px-4 pb-4 pt-4">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">角色總覽</div>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
              dirty ? 'bg-amber-900/50 text-amber-300' : 'bg-emerald-900/50 text-emerald-300'
            }`}
          >
            {dirty ? '未儲存' : '已同步'}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">流派名稱</label>
            <input
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              placeholder="未命名流派"
              className="w-full rounded-lg border border-gray-700/80 bg-gray-950/60 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">LV</label>
            <input
              type="number"
              min={1}
              max={9999}
              value={level}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10)
                setLevel(Number.isFinite(v) ? v : 1)
              }}
              className="w-full rounded-lg border border-gray-700/80 bg-gray-950/60 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="border-b border-gray-800/80 px-4 py-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">即時數值（開發版）</div>
        <p className="mt-1 text-[10px] leading-relaxed text-gray-600">
          以下為依等級與配置推算的示意數值，非正式遊戲公式。
        </p>
        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
          <div className="rounded-lg border border-gray-800/60 bg-gray-950/40 px-2.5 py-2">
            <dt className="text-[10px] text-gray-500">每秒 DPS</dt>
            <dd className="mt-0.5 font-mono text-gray-100">{formatNum(stats.dpsPerSecond)}</dd>
          </div>
          <div className="rounded-lg border border-gray-800/60 bg-gray-950/40 px-2.5 py-2">
            <dt className="text-[10px] text-gray-500">攻擊速度</dt>
            <dd className="mt-0.5 font-mono text-gray-100">{formatNum(stats.attackSpeed)} /s</dd>
          </div>
          <div className="rounded-lg border border-gray-800/60 bg-gray-950/40 px-2.5 py-2">
            <dt className="text-[10px] text-gray-500">每下傷害</dt>
            <dd className="mt-0.5 font-mono text-gray-100">{formatNum(stats.damagePerHit, 0)}</dd>
          </div>
          <div className="rounded-lg border border-gray-800/60 bg-gray-950/40 px-2.5 py-2">
            <dt className="text-[10px] text-gray-500">力量</dt>
            <dd className="mt-0.5 font-mono text-gray-100">{stats.strength}</dd>
          </div>
          <div className="rounded-lg border border-gray-800/60 bg-gray-950/40 px-2.5 py-2">
            <dt className="text-[10px] text-gray-500">敏捷</dt>
            <dd className="mt-0.5 font-mono text-gray-100">{stats.dexterity}</dd>
          </div>
          <div className="rounded-lg border border-gray-800/60 bg-gray-950/40 px-2.5 py-2">
            <dt className="text-[10px] text-gray-500">智慧</dt>
            <dd className="mt-0.5 font-mono text-gray-100">{stats.intelligence}</dd>
          </div>
          <div className="rounded-lg border border-gray-800/60 bg-gray-950/40 px-2.5 py-2">
            <dt className="text-[10px] text-gray-500">HP</dt>
            <dd className="mt-0.5 font-mono text-gray-100">{stats.hp}</dd>
          </div>
          <div className="rounded-lg border border-gray-800/60 bg-gray-950/40 px-2.5 py-2">
            <dt className="text-[10px] text-gray-500">MP</dt>
            <dd className="mt-0.5 font-mono text-gray-100">{stats.mp}</dd>
          </div>
        </dl>
      </div>

      <div className="px-4 py-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">配置檢查</div>
        {errors.length === 0 ? (
          <p className="mt-2 text-xs text-emerald-400/90">結構完整，可匯出流派碼。</p>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {errors.map((err) => (
              <li key={err} className="rounded-md border border-amber-900/40 bg-amber-950/20 px-2.5 py-1.5 text-xs text-amber-200/90">
                {err}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
