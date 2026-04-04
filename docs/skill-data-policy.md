# Skill data policy (commercial baseline)

This product ships **frozen or locally imported** normalized skill JSON bundled as `lib/gameData/generated/effective-runtime-bundle.json`. Runtime code **must not** scrape or fetch third-party skill websites.

## Honesty principles (4D-4 / 4D-5)

1. **不解析就不計算** — Numeric combat fields come only from structured normalization (level tables, breakpoints, modifier lists). Free text (`textLines`, HTML remnants) is **hint-only** and does not invent `baseDamage`, mana, or cooldown values.
2. **不確定就不假裝精準** — `CalculationConfidence`: `ready` / `partial` / `unsupported`. Partial or failed parse, missing level rows, or ambiguous roles reduce confidence. UI must surface this (see Build Stats panel and skill breakdown).
3. **不支援就標 unsupported** — Non-damaging roles (`aura-only`, `utility`, `summon-driver`, `support-only`, `unknown`) and `unsupported` confidence **do not** emit fake primary DPS in the inspected-skill path or an aggregate skill contribution block from the adapter.

## Runtime boundaries

- **Allowed**: read bundled JSON, SQLite in **maintenance** scripts (`scripts/`), ETL under `scripts/etl/`.
- **Forbidden in app/components/hooks/stores/selectors/lib/runtime/lib/formula**: `fetch` / `axios` / remote `import()` targeting skill-database hosts (see `npm run audit:no-runtime-remote-skill-fetch`). Archival `sourceUrl` strings inside JSON artifacts are not executed code.

## Clearly unsupported (by design)

- **Proxy damage** for minions, traps, brands, or secondary entities not modeled in the instance pipeline.
- **Guessing** hit damage from description-only strings when no numeric level row or damage modifier exists.
- **Assuming** gem behavior when `parseStatus === 'failed'` for that record.
- **Silently** treating `unknown` combat role as `damaging` for marketing numbers — blocked by role + confidence gates.

## Release checklist

1. Frozen / effective dataset present; `npm run data:verify:local` OK (when SQLite used).
2. Optional: `npm run data:verify:frozen` — DB `frozen_at` + disk manifest (4D-0).
3. `npm run audit:no-external-runtime-fetch` — no `tlidb.com` string in broad product dirs.
4. `npm run audit:no-runtime-remote-skill-fetch` — no remote skill fetches in runtime scope.
5. `npm run check:data-policy` — additional tlidb scan.
6. `npm run verify:skill-data-integrity` — bundle counts, rules, selector null-safety, share round-trip.
7. `npm run verify:skill-regression` — formula regressions (supports, passive link, legacy migrate).
8. `npm run check:skill-engine` — engine smoke.
9. `npm run build`.
10. Manual smoke (once per release): inspected skill UX, non-damaging fallback, aura linked passives — automated cases cover core paths; edge UI still human-checked.
