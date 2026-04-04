# Skill data policy (commercial baseline)

This product ships **frozen or locally imported** normalized skill JSON bundled as `lib/gameData/generated/effective-runtime-bundle.json`. **Product runtime** (`app/`, client-available `lib/`, hooks, stores, formulas used in the browser) **only reads that local bundle** (and static code). It **must not** scrape or fetch third-party skill websites at runtime.

## Runtime vs maintenance (4F-9 governance)

| Phase | Network | What is allowed |
|--------|---------|-----------------|
| **First ingest / refresh** (maintainers only) | Yes, in a controlled environment | ETL under `scripts/etl/` may fetch index/pages and write `data/raw` / normalized trees. This is **not** part of the shipped product runtime. |
| **Stable operations / shipped app** | No skill-site dependency | Only **local** artifacts: `data/effective/{season}`, optional SQLite + `data/frozen/{season}`, and the **bundled** `effective-runtime-bundle.json`. No runtime `fetch` to skill DB hosts (enforced by `npm run audit:no-runtime-remote-skill-fetch`). |

**Policy statement:** We can truthfully claim the **runtime does not depend on third-party live sites** for skill data. Updates are **versioned, local datasets** applied through the maintenance SOP below—not tribal knowledge or live pages.

## Provenance / traceability

The following fields identify **which** dataset the user is running. They are recoverable **without** opening the live web.

| Field | Bundle (`effective-runtime-bundle.json`) | SQLite / frozen manifest |
|--------|------------------------------------------|---------------------------|
| `season` | `datasetVersion.season` | `dataset_versions.season` |
| `versionLabel` | `datasetVersion.versionLabel` | `dataset_versions.version_label` |
| `importedAt` | `datasetVersion.importedAt` | `dataset_versions.imported_at` |
| `sourceKind` | `datasetVersion.sourceKind` (e.g. `effective-json`) | `dataset_versions.source_kind` |
| Override report | `overrideReport` (full report object) | `provenance_json.override` (schema + timestamps); full report also in effective payload when present |

**Extended audit trail** (freeze manifest + `provenance_json`): `sourceUrls`, `fetchedAtHints`, `frozenAt`, `recordCounts`, parser/manifest metadata — see `lib/data/datasetProvenance.ts`.

**Introspection:** Maintenance: `npm run data:list-dataset-versions`, `npm run data:verify:frozen`, `npm run data:verify:local`. Internal UI: `/debug/dataset` (bundle diagnostics via `getBundledDatasetDiagnostics()`).

## Official dataset update SOP (summary)

1. **Edit sources** — overrides in `data/overrides/{season}/`; optional full ETL (`npm run etl:skills`, normalize, etc.) **off the critical path** of the running app.
2. **Effective snapshot** — ensure `data/effective/{season}/` has the intended JSON set (`active-skills`, `support-skills`, `passive-skills`, rules, optional `override-report.json`, `manifest.json`).
3. **Freeze + DB version** — `npm run data:freeze:from-effective -- --season=<season>` (writes SQLite row, `provenance_json`, `data/frozen/...` manifest; optionally activate).
4. **Verify chain** — `npm run data:verify:frozen -- --season=<season>`, `npm run data:verify:local` (bundle row vs active DB), `npm run data:verify:dataset-governance` (switch API sanity when ≥2 versions exist).
5. **Emit runtime bundle** — per team flow from `data:import:effective` / export so `effective-runtime-bundle.json` matches the **active** dataset row.
6. **Release gate** — `npm run release:check` (includes governance verify + `verify:4f` stack).

**Rollback:** Keep at least two `dataset_versions` rows per season when possible. `npm run data:list-dataset-versions -- --season=<s>` lists labels; `npm run data:import:effective -- --set-active --season=<s> --version-label=<label>` re-points the active row, then re-export the bundle per SOP step 5.

## Honesty principles (4D-4 / 4D-5)

1. **不解析就不計算** — Numeric combat fields come only from structured normalization (level tables, breakpoints, modifier lists). Free text (`textLines`, HTML remnants) is **hint-only** and does not invent `baseDamage`, mana, or cooldown values.
2. **不確定就不假裝精準** — `CalculationConfidence`: `ready` / `partial` / `unsupported`. Partial or failed parse, missing level rows, or ambiguous roles reduce confidence. UI must surface this (see Build Stats panel and skill breakdown).
3. **不支援就標 unsupported** — Non-damaging roles (`aura-only`, `utility`, `summon-driver`, `support-only`, `unknown`) and `unsupported` confidence **do not** emit fake primary DPS in the inspected-skill path or an aggregate skill contribution block from the adapter.

## Runtime boundaries

- **Allowed**: read bundled JSON; SQLite in **maintenance** scripts (`scripts/`), ETL under `scripts/etl/`.
- **Forbidden in app/components/hooks/stores/selectors/lib/runtime/lib/formula**: `fetch` / `axios` / remote `import()` targeting skill-database hosts (see `npm run audit:no-runtime-remote-skill-fetch`). Archival `sourceUrl` strings inside JSON artifacts are not executed code.

## Clearly unsupported (by design)

- **Proxy damage** for minions, traps, brands, or secondary entities not modeled in the instance pipeline.
- **Guessing** hit damage from description-only strings when no numeric level row or damage modifier exists.
- **Assuming** gem behavior when `parseStatus === 'failed'` for that record.
- **Silently** treating `unknown` combat role as `damaging` for marketing numbers — blocked by role + confidence gates.

## Release checklist

See **`docs/4f-release-checklist.md`** for the full 4F gate. Quick reference:

1. Frozen / effective dataset present; `npm run data:verify:local` OK (when SQLite used).
2. `npm run data:verify:dataset-governance` OK (switch/rollback API; skips if only one version).
3. `npm run data:verify:frozen` — when using freeze workflow: DB `frozen_at` + disk manifest alignment.
4. `npm run audit:no-external-runtime-fetch` — no `tlidb.com` string in broad product dirs.
5. `npm run audit:no-runtime-remote-skill-fetch` — no remote skill fetches in runtime scope.
6. `npm run check:data-policy` — additional tlidb scan.
7. `npm run verify:skill-data-integrity` — bundle counts, rules, selector null-safety, share round-trip.
8. `npm run verify:skill-regression` — formula regressions (supports, passive link, legacy migrate).
9. `npm run check:skill-engine` — engine smoke.
10. `npm run build`.
11. Manual smoke (once per release): inspected skill UX, non-damaging fallback, aura linked passives — automated cases cover core paths; edge UI still human-checked.
