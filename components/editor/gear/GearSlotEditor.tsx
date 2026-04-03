'use client'

import type { GearSelection, GearSlot } from '@/types/build'

type GearOption = { id: string; name: string }

export type GearSlotEditorProps = {
  slot: GearSlot
  label: string
  row: GearSelection
  bases: GearOption[]
  legendaries: GearOption[]
  baseDisplayName: string | undefined
  legendaryDisplayName: string | undefined
  onSetBase: (gearBaseId: string | null) => void
  onSetLegendary: (legendaryItemId: string | null) => void
  onClear: () => void
}

export default function GearSlotEditor({
  slot,
  label,
  row,
  bases,
  legendaries,
  baseDisplayName,
  legendaryDisplayName,
  onSetBase,
  onSetLegendary,
  onClear,
}: GearSlotEditorProps) {
  const hasBase = !!row.gearBaseId
  const hasLeg = !!row.legendaryItemId
  const configured = hasBase || hasLeg
  const modCount = row.customMods?.length ?? 0

  const statusBadge =
    !configured ? (
      <span className="inline-flex items-center rounded-md border border-slate-700/80 bg-slate-950/60 px-2 py-0.5 text-[11px] font-medium text-slate-500">
        未配置
      </span>
    ) : hasBase ? (
      <span className="inline-flex max-w-full items-center rounded-md border border-sky-800/60 bg-sky-950/35 px-2 py-0.5 text-[11px] font-medium text-sky-200/95" title={row.gearBaseId ?? ''}>
        Base · {baseDisplayName ?? row.gearBaseId ?? '—'}
      </span>
    ) : (
      <span
        className="inline-flex max-w-full items-center rounded-md border border-violet-800/55 bg-violet-950/30 px-2 py-0.5 text-[11px] font-medium text-violet-200/95"
        title={row.legendaryItemId ?? ''}
      >
        傳奇 · {legendaryDisplayName ?? row.legendaryItemId ?? '—'}
      </span>
    )

  const selectCls =
    'w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-500/70'

  return (
    <div
      className="rounded-xl border border-slate-800/70 bg-slate-950/40 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
      data-gear-slot={slot}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/50 pb-3">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-slate-100">{label}</div>
          <div className="mt-2 flex flex-wrap items-center gap-2">{statusBadge}</div>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="shrink-0 rounded-lg border border-slate-600/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800/60"
        >
          清空欄位
        </button>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Gear base</label>
          <select value={row.gearBaseId ?? ''} onChange={(e) => onSetBase(e.target.value || null)} className={selectCls}>
            <option value="">（無）</option>
            {bases.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Legendary</label>
          <select
            value={row.legendaryItemId ?? ''}
            onChange={(e) => onSetLegendary(e.target.value || null)}
            className={selectCls}
          >
            <option value="">（無）</option>
            {legendaries.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-3 text-[11px] text-slate-600">
        自訂詞綴（customMods）：目前 <span className="tabular-nums text-slate-500">{modCount}</span> 筆 · 預留欄位，後續版本再支援編輯
      </p>
    </div>
  )
}
