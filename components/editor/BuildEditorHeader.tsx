// components/editor/BuildEditorHeader.tsx
'use client'

export const BUILD_EDITOR_APP_META = {
  productName: '火炬之光流派模擬器',
  author: '—',
  version: '0.1.0',
} as const

export type BuildEditorHeaderProps = {
  lastUpdatedLabel: string
  codeInput: string
  onCodeInputChange: (value: string) => void
  onImport: () => void
  onExport: () => void
  onCopy: () => void
}

export default function BuildEditorHeader({
  lastUpdatedLabel,
  codeInput,
  onCodeInputChange,
  onImport,
  onExport,
  onCopy,
}: BuildEditorHeaderProps) {
  const { productName, author, version } = BUILD_EDITOR_APP_META

  return (
    <header className="relative z-20 shrink-0 border-b border-slate-800/90 bg-[linear-gradient(180deg,#151d2a_0%,#0c1018_55%,#0a0d12_100%)] shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent"
        aria-hidden
      />
      <div className="mx-auto flex max-w-[1920px] flex-col gap-4 px-4 py-3.5 md:px-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <div className="min-w-0 shrink lg:max-w-md xl:max-w-lg">
          <div className="flex items-baseline gap-3">
            <h1 className="bg-gradient-to-r from-slate-50 via-white to-slate-200 bg-clip-text text-xl font-bold tracking-tight text-transparent md:text-2xl">
              {productName}
            </h1>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] leading-snug text-slate-500">
            <span>
              作者 <span className="font-medium text-slate-400">{author}</span>
            </span>
            <span className="text-slate-700" aria-hidden>
              ·
            </span>
            <span>
              版本 <span className="font-mono text-slate-400">{version}</span>
            </span>
            <span className="text-slate-700" aria-hidden>
              ·
            </span>
            <span>
              最後更新 <span className="text-slate-400">{lastUpdatedLabel}</span>
            </span>
            {process.env.NODE_ENV === 'development' ? (
              <>
                <span className="text-slate-700" aria-hidden>
                  ·
                </span>
                <a
                  href="/debug/dataset"
                  className="text-slate-500 underline decoration-slate-600 underline-offset-2 hover:text-sky-400/90"
                >
                  資料集（內部）
                </a>
              </>
            ) : null}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2 lg:min-w-[min(100%,28rem)] xl:max-w-[36rem]">
          <div className="rounded-xl border border-slate-700/70 bg-black/35 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_0_rgba(255,255,255,0.03)] sm:p-3.5">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                流派碼
              </span>
              <span className="hidden text-[10px] text-slate-600 sm:inline">匯入 · 匯出 · 複製</span>
            </div>
            <textarea
              value={codeInput}
              onChange={(e) => onCodeInputChange(e.target.value)}
              placeholder="貼上或產生流派碼（純字串）"
              rows={2}
              className="min-h-[3rem] w-full resize-y rounded-lg border border-slate-700/90 bg-slate-950/80 px-3 py-2 font-mono text-xs leading-relaxed text-slate-200 placeholder:text-slate-600 outline-none ring-0 transition focus:border-sky-500/70 focus:shadow-[0_0_0_1px_rgba(14,165,233,0.25)] sm:min-h-[2.75rem]"
            />
            <div className="mt-2.5 flex flex-wrap items-center gap-2 sm:flex-nowrap sm:justify-end">
              <button
                type="button"
                onClick={onExport}
                className="order-first min-h-[2.25rem] flex-1 rounded-lg bg-gradient-to-b from-sky-600 to-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-[0_2px_12px_rgba(2,132,199,0.35)] ring-1 ring-sky-400/35 hover:from-sky-500 hover:to-sky-600 sm:order-none sm:flex-initial"
              >
                匯出
              </button>
              <span
                className="mx-0.5 hidden h-6 w-px shrink-0 self-center bg-slate-700/80 sm:inline"
                aria-hidden
              />
              <button
                type="button"
                onClick={onImport}
                className="min-h-[2.25rem] rounded-lg border border-slate-600/90 bg-slate-800/70 px-3 py-2 text-sm font-medium text-slate-200 shadow-sm hover:border-slate-500 hover:bg-slate-700/80"
              >
                匯入
              </button>
              <button
                type="button"
                onClick={onCopy}
                className="min-h-[2.25rem] rounded-lg border border-slate-700/80 bg-transparent px-3 py-2 text-sm font-medium text-slate-400 hover:border-slate-500 hover:bg-slate-800/40 hover:text-slate-200"
              >
                複製
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
