'use client'

import { useMemo, type ReactNode } from 'react'
import { useBuildStore } from '@/stores/useBuildStore'
import { mockHeroes, mockRelics, mockSpecialties, mockTraits } from '@/data/mockGameData'
import HeroTraitCard from '@/components/editor/HeroTraitCard'

function BlockChrome({
  children,
  variant = 'solid',
}: {
  children: ReactNode
  variant?: 'solid' | 'dashed'
}) {
  const shell =
    variant === 'dashed'
      ? 'border-dashed border-slate-700/65 bg-slate-950/30'
      : 'border-slate-800/55 bg-gradient-to-b from-slate-900/35 to-slate-950/20'
  return (
    <div className={`rounded-2xl border p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] ${shell}`}>{children}</div>
  )
}

function BlockTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-1 flex items-center gap-2">
      <span className="h-2 w-2 shrink-0 rounded-sm bg-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.35)]" aria-hidden />
      <h2 className="text-base font-bold tracking-tight text-slate-100">{children}</h2>
    </div>
  )
}

function dash(v: string | null | undefined) {
  if (v == null) return '—'
  const t = v.trim()
  if (t === '') return '—'
  return t
}

export default function HeroTalentPanel() {
  const heroId = useBuildStore((s) => s.snapshot.hero.heroId)
  const traitId = useBuildStore((s) => s.snapshot.hero.traitId)
  const relicId = useBuildStore((s) => s.snapshot.hero.relicId)
  const specialtyId = useBuildStore((s) => s.snapshot.hero.specialtyId)
  const level = useBuildStore((s) => s.snapshot.meta.level)
  const setLevel = useBuildStore((s) => s.setLevel)
  const setRelic = useBuildStore((s) => s.setRelic)
  const setSpecialty = useBuildStore((s) => s.setSpecialty)

  const relics = useMemo(() => {
    if (!heroId) return []
    return mockRelics.filter((r) => r.heroId === heroId)
  }, [heroId])

  const specialties = useMemo(() => {
    if (!heroId) return []
    return mockSpecialties.filter((s) => s.heroId === heroId)
  }, [heroId])

  const selectedRelic = relics.find((r) => r.id === relicId)
  const selectedSpecialty = specialties.find((s) => s.id === specialtyId)

  const heroName = mockHeroes.find((h) => h.id === heroId)?.name
  const traitName = mockTraits.find((t) => t.id === traitId)?.name

  return (
    <div className="space-y-4 md:space-y-5">
      <BlockChrome>
        <BlockTitle>英雄與流派基礎</BlockTitle>
        <p className="mb-4 pl-4 text-sm text-slate-500">
          在此完成 Hero、Trait、等級設定；變更 Hero 會由 store 重置 Trait／遺物／特性與天賦／技能槽。
        </p>
        <HeroTraitCard embedded />

        <div className="mt-5 grid gap-4 border-t border-slate-800/70 pt-5 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-slate-400">等級（LV）</label>
            <input
              type="number"
              min={1}
              max={9999}
              value={level}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10)
                setLevel(Number.isFinite(v) ? v : 1)
              }}
              className="w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-500/70"
            />
            <p className="mt-1 text-xs text-slate-600">與左側角色面板 LV 同步；會一併持久化與匯出流派碼。</p>
          </div>
        </div>
      </BlockChrome>

      <BlockChrome variant="dashed">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-500/90">遺物（Relic）</div>
        <p className="mt-1 text-sm text-slate-500">MVP mock 選項，選擇後經 <code className="text-slate-400">setRelic</code> 寫入 store。</p>
        <select
          value={relicId ?? ''}
          onChange={(e) => setRelic(e.target.value || null)}
          disabled={!heroId}
          className="mt-3 w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-500/70 disabled:opacity-50"
        >
          <option value="">未選擇遺物</option>
          {relics.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        {!heroId ? <p className="mt-2 text-xs text-amber-200/80">請先選擇 Hero。</p> : null}
      </BlockChrome>

      <BlockChrome variant="dashed">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-500/90">英雄特性（Specialty）</div>
        <p className="mt-1 text-sm text-slate-500">MVP mock 特性，選擇後經 <code className="text-slate-400">setSpecialty</code> 寫入 store。</p>
        <select
          value={specialtyId ?? ''}
          onChange={(e) => setSpecialty(e.target.value || null)}
          disabled={!heroId}
          className="mt-3 w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-500/70 disabled:opacity-50"
        >
          <option value="">未選擇特性</option>
          {specialties.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        {!heroId ? (
          <p className="mt-2 text-xs text-amber-200/80">請先選擇 Hero。</p>
        ) : null}
      </BlockChrome>

      <BlockChrome>
        <BlockTitle>當前設定摘要</BlockTitle>
        <p className="mb-3 pl-4 text-sm text-slate-500">以下為本頁四項選擇的顯示用整理（未選顯示 —）。</p>
        <dl className="grid gap-2 sm:grid-cols-2">
          {(
            [
              ['Hero', dash(heroName)] as const,
              ['Trait', dash(traitName)] as const,
              ['Relic', dash(selectedRelic?.name)] as const,
              ['Specialty', dash(selectedSpecialty?.name)] as const,
            ] as const
          ).map(([k, v]) => (
            <div
              key={k}
              className="flex items-baseline justify-between gap-3 rounded-lg border border-slate-800/60 bg-slate-950/40 px-3 py-2.5"
            >
              <dt className="text-xs font-medium text-slate-500">{k}</dt>
              <dd className="text-right text-sm font-semibold text-slate-100">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-slate-600">匯出／匯入流派碼與 localStorage 持久化皆包含以上 ID 欄位。</p>
      </BlockChrome>
    </div>
  )
}
