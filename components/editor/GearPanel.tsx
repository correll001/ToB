// components/editor/GearPanel.tsx
'use client'

import { useMemo } from 'react'
import { useBuildStore } from '@/stores/useBuildStore'
import { mockGearBases, mockLegendaryItems } from '@/data/mockGameData'
import type { GearSlot } from '@/types/build'
import GearSlotEditor from '@/components/editor/gear/GearSlotEditor'
import { GEAR_ORDER, SLOT_LABEL } from '@/components/editor/gear/constants'
import { selectFilledGearCount } from '@/selectors/buildSelectors'

export default function GearPanel() {
  const snapshot = useBuildStore((s) => s.snapshot)
  const setGearBase = useBuildStore((s) => s.setGearBase)
  const setLegendaryItem = useBuildStore((s) => s.setLegendaryItem)
  const clearGearSlot = useBuildStore((s) => s.clearGearSlot)

  const equippedN = useMemo(() => selectFilledGearCount(snapshot), [snapshot])

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
        <div className="flex flex-wrap items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-sm bg-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.35)]" aria-hidden />
          <h2 className="text-base font-bold tracking-tight text-slate-100 md:text-lg">裝備</h2>
          <span className="ml-auto rounded-md border border-slate-700/70 bg-slate-950/50 px-2.5 py-1 text-[11px] font-medium text-slate-400">
            已配置 <span className="tabular-nums text-slate-200">{equippedN}</span> / 10 欄
          </span>
        </div>
        <p className="mt-1.5 pl-4 text-sm text-slate-500">
          每欄可選 Gear base 或 Legendary（互斥由 store 處理）；資料會寫入 snapshot，左側開發版數值會随裝備件數變化，並可持久化／流派碼匯出。
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-1 lg:grid-cols-2">
        {GEAR_ORDER.map((slot) => {
          const row = snapshot.gear[slot]
          const baseName = mockGearBases.find((b) => b.id === row.gearBaseId)?.name
          const legName = mockLegendaryItems.find((l) => l.id === row.legendaryItemId)?.name
          const bases = basesBySlot.get(slot) ?? []
          const legs = legsBySlot.get(slot) ?? []

          return (
            <GearSlotEditor
              key={slot}
              slot={slot}
              label={SLOT_LABEL[slot]}
              row={row}
              bases={bases}
              legendaries={legs}
              baseDisplayName={baseName}
              legendaryDisplayName={legName}
              onSetBase={(id) => setGearBase(slot, id)}
              onSetLegendary={(id) => setLegendaryItem(slot, id)}
              onClear={() => clearGearSlot(slot)}
            />
          )
        })}
      </div>
    </div>
  )
}
