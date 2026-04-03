// components/editor/GearPanel.tsx
'use client'

import { useMemo } from 'react'
import { useBuildStore } from '@/stores/useBuildStore'
import { mockGearBases, mockLegendaryItems } from '@/data/mockGameData'
import type { GearSlot } from '@/types/build'

const GEAR_ORDER: GearSlot[] = [
  'helmet',
  'chest',
  'gloves',
  'boots',
  'necklace',
  'belt',
  'ring1',
  'ring2',
  'weapon1',
  'weapon2',
]

const SLOT_LABEL: Record<GearSlot, string> = {
  helmet: '頭盔',
  chest: '胸甲',
  gloves: '手套',
  boots: '鞋子',
  necklace: '項鍊',
  belt: '腰帶',
  ring1: '戒指 1',
  ring2: '戒指 2',
  weapon1: '武器 1',
  weapon2: '武器 2',
}

export default function GearPanel() {
  const snapshot = useBuildStore((s) => s.snapshot)
  const setGearBase = useBuildStore((s) => s.setGearBase)
  const setLegendaryItem = useBuildStore((s) => s.setLegendaryItem)
  const clearGearSlot = useBuildStore((s) => s.clearGearSlot)

  const basesBySlot = useMemo(() => {
    const m = new Map<GearSlot, typeof mockGearBases>()
    for (const slot of GEAR_ORDER) {
      m.set(
        slot,
        mockGearBases.filter((b) => b.slot === slot)
      )
    }
    return m
  }, [])

  const legsBySlot = useMemo(() => {
    const m = new Map<GearSlot, typeof mockLegendaryItems>()
    for (const slot of GEAR_ORDER) {
      m.set(
        slot,
        mockLegendaryItems.filter((l) => l.slot === slot)
      )
    }
    return m
  }, [])

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="rounded-2xl border border-slate-800/55 bg-gradient-to-b from-slate-900/35 to-slate-950/20 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-sm bg-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.35)]" aria-hidden />
          <h2 className="text-base font-bold tracking-tight text-slate-100 md:text-lg">裝備</h2>
        </div>
        <p className="mt-1.5 pl-4 text-sm text-slate-500">
          每欄可選 base 或 legendary（互斥）；皆為開發用 mock，非官方裝備表。
        </p>
      </div>

      <div className="grid gap-3">
        {GEAR_ORDER.map((slot) => {
          const row = snapshot.gear[slot]
          const baseName = mockGearBases.find((b) => b.id === row.gearBaseId)?.name
          const legName = mockLegendaryItems.find((l) => l.id === row.legendaryItemId)?.name
          const bases = basesBySlot.get(slot) ?? []
          const legs = legsBySlot.get(slot) ?? []

          let status = '未配置'
          if (row.gearBaseId) status = `Base：${baseName ?? row.gearBaseId}`
          else if (row.legendaryItemId) status = `傳奇：${legName ?? row.legendaryItemId}`

          return (
            <div
              key={slot}
              className="rounded-xl border border-slate-800/70 bg-slate-950/40 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-slate-100">{SLOT_LABEL[slot]}</div>
                  <div className="mt-0.5 text-xs text-slate-500">{status}</div>
                </div>
                <button
                  type="button"
                  onClick={() => clearGearSlot(slot)}
                  className="shrink-0 rounded-lg border border-slate-600/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800/60"
                >
                  清空欄位
                </button>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Gear base</label>
                  <select
                    value={row.gearBaseId ?? ''}
                    onChange={(e) => setGearBase(slot, e.target.value || null)}
                    className="w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-500/70"
                  >
                    <option value="">（無）</option>
                    {bases.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Legendary</label>
                  <select
                    value={row.legendaryItemId ?? ''}
                    onChange={(e) => setLegendaryItem(slot, e.target.value || null)}
                    className="w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-500/70"
                  >
                    <option value="">（無）</option>
                    {legs.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
