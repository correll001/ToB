// components/editor/HeroTraitCard.tsx
'use client'

import { useMemo } from 'react'
import { useBuildStore } from '@/stores/useBuildStore'
import { mockHeroes, mockTraits } from '@/data/mockGameData'

export default function HeroTraitCard() {
  const heroId = useBuildStore((s) => s.snapshot.hero.heroId)
  const traitId = useBuildStore((s) => s.snapshot.hero.traitId)
  const setHero = useBuildStore((s) => s.setHero)
  const setTrait = useBuildStore((s) => s.setTrait)

  const filteredTraits = useMemo(() => {
    if (!heroId) return []
    return mockTraits.filter((trait) => trait.heroId === heroId)
  }, [heroId])

  const selectedTrait = filteredTraits.find((trait) => trait.id === traitId)

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
      <h2 className="mb-4 text-lg font-semibold text-white">Hero / Trait</h2>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-gray-400">Hero</label>
          <select
            value={heroId ?? ''}
            onChange={(e) => setHero(e.target.value || null)}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
          >
            <option value="">請選擇 Hero</option>
            {mockHeroes.map((hero) => (
              <option key={hero.id} value={hero.id}>
                {hero.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-400">Trait</label>
          <select
            value={traitId ?? ''}
            onChange={(e) => setTrait(e.target.value || null)}
            disabled={!heroId}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">請選擇 Trait</option>
            {filteredTraits.map((trait) => (
              <option key={trait.id} value={trait.id}>
                {trait.name}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-lg border border-gray-800 bg-gray-950 p-3 text-sm">
          <div className="mb-1 text-gray-400">Trait 說明</div>
          <div className="text-gray-200">
            {selectedTrait?.description ?? '選擇 Trait 後會在這裡顯示描述'}
          </div>
        </div>
      </div>
    </div>
  )
}
