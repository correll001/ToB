// hooks/useBuildComputedStats.ts
'use client'

import { useMemo } from 'react'
import { useBuildStore } from '@/stores/useBuildStore'
import { selectBuildStatsPanelDerived } from '@/selectors/buildComputedStats'

/**
 * 左欄 BuildStatsPanel 唯一資料源：`selectBuildStatsPanelDerived`（含 inspected 單技能 instance / damage view）。
 */
export function useBuildComputedStats() {
  const snapshot = useBuildStore((s) => s.snapshot)
  const inspectedMainSkillSlot = snapshot.meta.inspectedMainSkillSlot
  return useMemo(
    () => selectBuildStatsPanelDerived(snapshot, inspectedMainSkillSlot),
    [snapshot, inspectedMainSkillSlot],
  )
}
