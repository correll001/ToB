import type { Metadata } from 'next'
import { getBundledDatasetDiagnostics } from '@/lib/runtime/runtimeDataset'

export const metadata: Metadata = {
  title: 'Dataset traceability',
  robots: { index: false, follow: false },
}

export default function DebugDatasetPage() {
  const p = getBundledDatasetDiagnostics()
  const mismatch = p.runtimeConfigSeason !== p.season

  return (
    <div className="min-h-screen bg-[#0a0d12] px-4 py-8 text-slate-200">
      <div className="mx-auto max-w-2xl rounded-xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl">
        <h1 className="text-lg font-semibold text-slate-100">Bundled dataset (internal)</h1>
        <p className="mt-2 text-sm text-slate-500">
          內部溯源與誠實度標記；非官方授權聲明。執行時只做本地 bundle + 公式，不向技能資料站請求。
        </p>

        {mismatch ? (
          <p className="mt-4 rounded-lg border border-amber-700/50 bg-amber-950/40 px-3 py-2 text-sm text-amber-200">
            警告：<code className="text-amber-100">RUNTIME_GAME_DATA_SEASON</code>（{p.runtimeConfigSeason}）與
            bundle 之 season（{p.season}）不一致；請執行匯入並更新設定。
          </p>
        ) : null}

        <dl className="mt-6 space-y-3 font-mono text-xs text-slate-300">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
            <dt className="text-slate-500">schemaVersion</dt>
            <dd>{p.schemaVersion}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
            <dt className="text-slate-500">datasetVersionId</dt>
            <dd>{p.datasetVersionId}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
            <dt className="text-slate-500">season</dt>
            <dd>{p.season}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
            <dt className="text-slate-500">versionLabel</dt>
            <dd className="break-all text-right sm:max-w-[70%]">{p.versionLabel}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
            <dt className="text-slate-500">imported_at (bundle)</dt>
            <dd className="break-all">{p.importedAt}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
            <dt className="text-slate-500">sourceKind</dt>
            <dd>{p.sourceKind}</dd>
          </div>
          <div className="border-t border-slate-800/50 pt-3 text-[11px] uppercase tracking-wide text-slate-500">
            Provenance (active file meta)
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
            <dt className="text-slate-500">active generatedAt</dt>
            <dd className="break-all">{p.activeGeneratedAt}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
            <dt className="text-slate-500">parserVersion</dt>
            <dd>{p.parserVersion}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
            <dt className="text-slate-500">effectiveLayer (override)</dt>
            <dd>{p.effectiveLayer ?? '—'}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
            <dt className="text-slate-500">active sourceCount / warningsCount</dt>
            <dd>
              {p.activeSourceCount} / {p.activeWarningsCount}
            </dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
            <dt className="text-slate-500">bundled records (all families)</dt>
            <dd>{p.totalSkillRecords}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
            <dt className="text-slate-500">parseStatus tally</dt>
            <dd>
              ok {p.parseTally.ok ?? 0} · partial {p.parseTally.partial ?? 0} · failed {p.parseTally.failed ?? 0}
            </dd>
          </div>
          <p className="col-span-full pt-1 text-[11px] text-slate-600">
            <strong className="text-slate-500">frozenAt</strong> 存於 SQLite{' '}
            <code className="text-slate-500">dataset_versions.frozen_at</code> — 用{' '}
            <code className="text-slate-500">npm run data:verify:frozen</code> 驗證凍結鏈。
          </p>
          <p className="text-[11px] text-slate-600">
            <strong className="text-slate-500">Readiness</strong>（每技能）見左欄「精算」與技能 breakdown；非全站單一分數。
          </p>
          {p.overrideReport ? (
            <>
              <div className="border-t border-slate-800 pt-3 text-slate-400">override report</div>
              <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
                <dt className="text-slate-500">overridesSchemaVersion</dt>
                <dd>{p.overrideReport.overridesSchemaVersion}</dd>
              </div>
              <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
                <dt className="text-slate-500">generatedAt</dt>
                <dd className="break-all">{p.overrideReport.generatedAt}</dd>
              </div>
              <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
                <dt className="text-slate-500">season (report)</dt>
                <dd>{p.overrideReport.season}</dd>
              </div>
            </>
          ) : (
            <div className="border-t border-slate-800 pt-3 text-slate-500">override report: (none in bundle)</div>
          )}
        </dl>

        <p className="mt-8 text-[11px] leading-relaxed text-slate-600">
          SQLite 與 <code className="text-slate-500">data/effective</code> 對齊：<code className="text-slate-500">npm run data:verify:local</code>
          。技能誠實策略：<code className="text-slate-500">docs/skill-data-policy.md</code>。
        </p>
      </div>
    </div>
  )
}
