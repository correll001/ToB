// components/editor/BuildSummaryCard.tsx
'use client'

import { useBuildStore } from '@/stores/useBuildStore'
import {
  selectBuildCompletionStats,
  selectValidationErrors,
} from '@/selectors/buildSelectors'

export default function BuildSummaryCard() {
  const snapshot = useBuildStore((s) => s.snapshot)

  const stats = selectBuildCompletionStats(snapshot)
  const errors = selectValidationErrors(snapshot)

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
      <h2 className="mb-4 text-lg font-semibold text-white">Build Summary</h2>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-gray-800 p-3">
          <div className="text-gray-400">Talents</div>
          <div className="mt-1 text-xl font-bold text-white">{stats.talentsAllocated}</div>
        </div>
        <div className="rounded-lg bg-gray-800 p-3">
          <div className="text-gray-400">Skills</div>
          <div className="mt-1 text-xl font-bold text-white">{stats.skillsEquipped}/5</div>
        </div>
        <div className="rounded-lg bg-gray-800 p-3">
          <div className="text-gray-400">Gear</div>
          <div className="mt-1 text-xl font-bold text-white">{stats.gearEquipped}/10</div>
        </div>
        <div className="rounded-lg bg-gray-800 p-3">
          <div className="text-gray-400">Pact</div>
          <div className="mt-1 text-xl font-bold text-white">{stats.pactspiritsEquipped}/3</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 text-sm font-medium text-gray-300">驗證狀態</div>
        {errors.length === 0 ? (
          <div className="rounded-lg border border-emerald-800 bg-emerald-950/40 p-3 text-sm text-emerald-300">
            目前 Build 結構完整，可以分享。
          </div>
        ) : (
          <ul className="space-y-2">
            {errors.map((error) => (
              <li
                key={error}
                className="rounded-lg border border-amber-800 bg-amber-950/30 p-3 text-sm text-amber-300"
              >
                {error}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
