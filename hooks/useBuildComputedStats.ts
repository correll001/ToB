// hooks/useBuildComputedStats.ts
'use client'

import { useMemo } from 'react'
import { useBuildStore } from '@/stores/useBuildStore'
import { selectBuildStatsPanelDerived } from '@/selectors/buildComputedStats'

/**
 * 左欄 BuildStatsPanel 唯一資料源：對應 `selectBuildStatsPanelDerived(snapshot)`，
 * 避免在其它元件重複自算 summary / combat。
 */
export function useBuildComputedStats() {
  const snapshot = useBuildStore((s) => s.snapshot)
  return useMemo(() => selectBuildStatsPanelDerived(snapshot), [snapshot])
}
