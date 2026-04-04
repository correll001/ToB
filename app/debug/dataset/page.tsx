import type { Metadata } from 'next'
import { getDatasetProvenance } from '@/lib/runtime/runtimeDataset'

export const metadata: Metadata = {
  title: 'Dataset traceability',
  robots: { index: false, follow: false },
}

export default function DebugDatasetPage() {
  const p = getDatasetProvenance()
  const mismatch = p.runtimeConfigSeason !== p.season

  return (
    <div className="min-h-screen bg-[#0a0d12] px-4 py-8 text-slate-200">
      <div className="mx-auto max-w-2xl rounded-xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl">
        <h1 className="text-lg font-semibold text-slate-100">Bundled dataset (internal)</h1>
        <p className="mt-2 text-sm text-slate-500">
          僅供內部溯源；非官方資料授權聲明。執行時資料來自已提交之本地 JSON bundle，不向外部網站請求。
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
            <dt className="text-slate-500">imported_at</dt>
            <dd className="break-all">{p.importedAt}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
            <dt className="text-slate-500">sourceKind</dt>
            <dd>{p.sourceKind}</dd>
          </div>
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
          若需驗證 SQLite 與 <code className="text-slate-500">data/effective</code> 一致，於建置環境執行{' '}
          <code className="text-slate-500">npm run data:verify:local</code>。
        </p>
      </div>
    </div>
  )
}
