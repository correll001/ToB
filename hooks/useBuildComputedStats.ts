// hooks/useBuildComputedStats.ts
'use client'

import { useMemo } from 'react'
import { useBuildStore } from '@/stores/useBuildStore'
import { selectBuildStatsPanelDerived } from '@/selectors/buildComputedStats'

/** Sidebar stats + validation + summary labels from current store snapshot. */
export function useBuildComputedStats() {
  const snapshot = useBuildStore((s) => s.snapshot)
  return useMemo(() => selectBuildStatsPanelDerived(snapshot), [snapshot])
}
