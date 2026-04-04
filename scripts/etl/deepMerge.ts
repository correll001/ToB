/**
 * MAINTENANCE-ONLY — not a production or `next build` dependency.
 * Minimal RFC7396-style merge for JSON-like trees. `null` removes a key from objects.
 */

export function isPlainObject(x: unknown): x is Record<string, unknown> {
  return x !== null && typeof x === "object" && !Array.isArray(x)
}

export function deepMerge<T extends Record<string, unknown>>(base: T, patch: Partial<T>): T {
  const out = { ...base } as Record<string, unknown>
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) continue
    if (v === null) {
      delete out[k]
      continue
    }
    const cur = out[k]
    if (isPlainObject(cur) && isPlainObject(v)) {
      out[k] = deepMerge(cur as Record<string, unknown>, v as Record<string, unknown>)
    } else {
      out[k] = v
    }
  }
  return out as T
}
