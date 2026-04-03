// components/editor/BuildEditorAdBar.tsx
'use client'

export default function BuildEditorAdBar() {
  return (
    <footer className="shrink-0 border-t border-slate-800/80 bg-[linear-gradient(180deg,#0a0e14_0%,#070a0f_100%)] px-4 py-2.5 shadow-[0_-4px_24px_rgba(0,0,0,0.2)]">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-700/55 bg-slate-950/40 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          <div className="px-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">廣告預留區</div>
            <div className="mt-1 text-xs text-slate-500">版位保留 · 與介面風格一致</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
