// components/editor/HeroTraitCard.tsx
'use client'

import { useMemo } from 'react'
import { useBuildStore } from '@/stores/useBuildStore'
import { mockHeroes, mockTraits } from '@/data/mockGameData'

type HeroTraitCardProps = {
  /** 嵌入較大面板時使用：不畫外框、標題較小、色調與主面板一致 */
  embedded?: boolean
}

export default function HeroTraitCard({ embedded = false }: HeroTraitCardProps) {
  const heroId = useBuildStore((s) => s.snapshot.hero.heroId)
  const traitId = useBuildStore((s) => s.snapshot.hero.traitId)
  const setHero = useBuildStore((s) => s.setHero)
  const setTrait = useBuildStore((s) => s.setTrait)

  const filteredTraits = useMemo(() => {
    if (!heroId) return []
    return mockTraits.filter((trait) => trait.heroId === heroId)
  }, [heroId])

  const selectedTrait = filteredTraits.find((trait) => trait.id === traitId)

  const shell = embedded ? 'space-y-5' : 'space-y-4 rounded-xl border border-slate-800/80 bg-slate-900/50 p-4'
  const sectionTitle = embedded
    ? 'text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500'
    : 'mb-3 text-lg font-semibold text-white'
  const labelCls = 'mb-1.5 block text-sm font-medium text-slate-400'
  const selectCls =
    'w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-500/70 disabled:cursor-not-allowed disabled:opacity-50'
  const cardBase =
    'rounded-xl border px-3 py-3 text-left text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50'
  const cardOff = 'border-slate-700/70 bg-slate-950/40 text-slate-300 hover:border-slate-600 hover:bg-slate-900/50'
  const cardOn = 'border-sky-500/60 bg-sky-950/35 text-white shadow-[0_0_12px_rgba(56,189,248,0.12)]'

  return (
    <div className={shell}>
      <div>
        <h3 className={sectionTitle}>{embedded ? 'Hero · Trait' : 'Hero / Trait'}</h3>
        {!embedded && <p className="mt-1 text-sm text-slate-500">選擇英雄；變更英雄會清空 Trait 等相依欄位（由 store 處理）。</p>}
      </div>

      <div>
        <span className={labelCls}>Hero · 卡片選擇</span>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {mockHeroes.map((hero) => {
            const on = heroId === hero.id
            return (
              <button
                key={hero.id}
                type="button"
                onClick={() => setHero(hero.id)}
                className={`${cardBase} ${on ? cardOn : cardOff}`}
              >
                {hero.name}
              </button>
            )
          })}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <label className="text-xs text-slate-500">
            或以下拉選單選擇
            <select
              value={heroId ?? ''}
              onChange={(e) => setHero(e.target.value || null)}
              className={`${selectCls} mt-1 max-w-xs`}
            >
              <option value="">請選擇 Hero</option>
              {mockHeroes.map((hero) => (
                <option key={hero.id} value={hero.id}>
                  {hero.name}
                </option>
              ))}
            </select>
          </label>
          {heroId ? (
            <button
              type="button"
              onClick={() => setHero(null)}
              className="text-xs font-medium text-slate-500 underline decoration-slate-600 underline-offset-2 hover:text-slate-300"
            >
              清除 Hero
            </button>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="hero-talent-trait-select" className={labelCls}>
          Trait
        </label>
        {!heroId ? (
          <p className="rounded-lg border border-amber-900/40 bg-amber-950/20 px-3 py-2 text-sm text-amber-200/90">
            請先選擇 Hero，再選擇 Trait。
          </p>
        ) : null}
        <select
          id="hero-talent-trait-select"
          value={traitId ?? ''}
          onChange={(e) => setTrait(e.target.value || null)}
          disabled={!heroId}
          className={`${selectCls} mt-2`}
        >
          <option value="">請選擇 Trait</option>
          {filteredTraits.map((trait) => (
            <option key={trait.id} value={trait.id}>
              {trait.name}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-lg border border-slate-800/70 bg-black/25 p-3 text-sm">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Trait 說明</div>
        <div className="leading-relaxed text-slate-200">
          {selectedTrait?.description ?? (heroId ? '請選擇 Trait' : '—')}
        </div>
      </div>
    </div>
  )
}
