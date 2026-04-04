import type { ParseStatus } from '@/types/normalized'
import type { CalculationConfidence } from '@/types/skillInstance'

export function skillTabParseStatusLabel(p: ParseStatus | null): string {
  if (p === 'ok') return '資料齊全'
  if (p === 'partial') return '部分缺欄'
  if (p === 'failed') return '讀取異常'
  return '—'
}

export function skillTabConfidenceLabel(c: CalculationConfidence | null): string {
  if (c === 'ready') return '數值就緒'
  if (c === 'partial') return '數值未齊'
  if (c === 'unsupported') return '暫不計算'
  return '—'
}

export function skillTabConfidenceChipClass(c: CalculationConfidence | null): string {
  const base =
    'rounded-md border px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ring-1'
  if (c === 'ready') {
    return `${base} border-emerald-800/50 bg-emerald-950/45 text-emerald-100 ring-emerald-800/30`
  }
  if (c === 'partial') {
    return `${base} border-amber-800/50 bg-amber-950/40 text-amber-100 ring-amber-800/35`
  }
  if (c === 'unsupported') {
    return `${base} border-slate-600/55 bg-slate-900/55 text-slate-400 ring-slate-700/40`
  }
  return `${base} border-slate-700/60 bg-black/30 text-slate-500 ring-slate-800/45`
}
