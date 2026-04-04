/**
 * Single switch for which bundled effective dataset the app uses at runtime.
 * Update season here after ETL → normalize → apply-overrides → commit new `data/effective/{season}`.
 */
export const RUNTIME_GAME_DATA_SEASON = 'ss12' as const

export type RuntimeGameDataSeason = typeof RUNTIME_GAME_DATA_SEASON
