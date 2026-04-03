// lib/normalizeBuildSnapshot.ts
import type { BuildSnapshot } from '@/types/build'

const DEFAULT_LEVEL = 1

function clampLevel(n: unknown): number {
  if (typeof n !== 'number' || !Number.isFinite(n)) return DEFAULT_LEVEL
  const i = Math.floor(n)
  if (i < 1) return DEFAULT_LEVEL
  if (i > 9999) return 9999
  return i
}

/** Ensures new fields (e.g. meta.level) exist after import or legacy persist. */
export function normalizeBuildSnapshot(snapshot: BuildSnapshot): BuildSnapshot {
  const rawLevel = (snapshot.meta as { level?: number }).level
  return {
    ...snapshot,
    meta: {
      ...snapshot.meta,
      level: clampLevel(rawLevel),
    },
  }
}
