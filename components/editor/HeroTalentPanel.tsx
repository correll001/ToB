'use client'

import { useMemo, type ReactNode } from 'react'
import { useBuildStore } from '@/stores/useBuildStore'
import { mockRelics, mockSpecialties } from '@/data/mockGameData'
import HeroTraitCard from '@/components/editor/HeroTraitCard'
import BuildSummaryCard from '@/components/editor/BuildSummaryCard'

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

export default function HeroTalentPanel() {
  const heroId = useBuildStore((s) => s.snapshot.hero.heroId)
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

  return (
    <div className="space-y-4 md:space-y-5">
      <BlockChrome>
        <BlockTitle>英雄與流派基礎</BlockTitle>
        <p className="mb-4 pl-4 text-sm text-slate-500">選擇英雄與 Trait；等級與流派碼匯出／持久化一致。</p>
        <div>
          <HeroTraitCard />
        </div>

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
            <p className="mt-1 text-xs text-slate-600">與左側角色面板 LV 同步。</p>
          </div>
        </div>
      </BlockChrome>

      <BlockChrome variant="dashed">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-500/90">遺物（Relic）— 擴充預留</div>
        <p className="mt-1 text-sm text-slate-500">MVP mock 選項，非遊戲內真實遺物表。</p>
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
        <div className="mt-2 rounded-lg border border-slate-800/70 bg-black/25 p-3 text-xs text-slate-400">
          {selectedRelic ? `已選：${selectedRelic.name}` : '選擇英雄後可指定 mock 遺物。'}
        </div>
      </BlockChrome>

      <BlockChrome variant="dashed">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-500/90">英雄特性（Specialty）— 擴充預留</div>
        <p className="mt-1 text-sm text-slate-500">MVP mock 特性，未來可銜接英雄專精等大型系統。</p>
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
        <div className="mt-2 rounded-lg border border-slate-800/70 bg-black/25 p-3 text-xs text-slate-400">
          {selectedSpecialty ? `已選：${selectedSpecialty.name}` : '選擇英雄後可指定 mock 特性。'}
        </div>
      </BlockChrome>

      <BuildSummaryCard />
    </div>
  )
}
