// components/editor/BuildSummaryCard.tsx
'use client'

import React from 'react'
import { useBuildStore } from '@/stores/useBuildStore'

export default function BuildSummaryCard() {
  const heroId = useBuildStore((s) => s.snapshot.hero.heroId)
  const traitId = useBuildStore((s) => s.snapshot.hero.traitId)
  const talentsAllocated = useBuildStore(
    (s) => Object.values(s.snapshot.talents).reduce((sum, arr) => sum + arr.length, 0)
  )
  const skillsEquipped = useBuildStore((s) => s.snapshot.skills.filter((sk) => !!sk.skillId).length)
  const gearEquipped = useBuildStore(
    (s) => Object.values(s.snapshot.gear).filter((g) => g.gearBaseId || g.legendaryItemId).length
  )
  const pactspiritsEquipped = useBuildStore((s) => s.snapshot.pactspirits.filter((p) => !!p.pactspiritId).length)
  const weapon1Equipped = useBuildStore((s) => !!(s.snapshot.gear.weapon1.gearBaseId || s.snapshot.gear.weapon1.legendaryItemId))

  const errors = React.useMemo(() => {
    const next: string[] = []
    if (!heroId) next.push('尚未選擇 Hero')
    if (!traitId) next.push('尚未選擇 Trait')
    if (skillsEquipped === 0) next.push('至少需要配置 1 個主技能')
    if (!weapon1Equipped) next.push('Weapon 1 尚未配置')
    return next
  }, [heroId, traitId, skillsEquipped, weapon1Equipped])

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
      <h2 className="mb-4 text-lg font-semibold text-white">Build Summary</h2>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-gray-800 p-3">
          <div className="text-gray-400">Talents</div>
          <div className="mt-1 text-xl font-bold text-white">{talentsAllocated}</div>
        </div>
        <div className="rounded-lg bg-gray-800 p-3">
          <div className="text-gray-400">Skills</div>
          <div className="mt-1 text-xl font-bold text-white">{skillsEquipped}/5</div>
        </div>
        <div className="rounded-lg bg-gray-800 p-3">
          <div className="text-gray-400">Gear</div>
          <div className="mt-1 text-xl font-bold text-white">{gearEquipped}/10</div>
        </div>
        <div className="rounded-lg bg-gray-800 p-3">
          <div className="text-gray-400">Pact</div>
          <div className="mt-1 text-xl font-bold text-white">{pactspiritsEquipped}/3</div>
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
