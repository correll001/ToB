// components/editor/BuildEditorWorkspace.tsx
'use client'

import { useEditorUiStore } from '@/stores/useEditorUiStore'
import { EDITOR_TAB_PANELS, EDITOR_TAB_ROWS } from '@/components/editor/editorTabRegistry'

export default function BuildEditorWorkspace() {
  const activeTab = useEditorUiStore((s) => s.activeTab)
  const setActiveTab = useEditorUiStore((s) => s.setActiveTab)

  const Panel = EDITOR_TAB_PANELS[activeTab]

  return (
    <section className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#080c12] before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_85%_45%_at_50%_-10%,rgba(56,189,248,0.07),transparent_55%)] before:ring-1 before:ring-inset before:ring-slate-800/40">
      <div className="relative z-10 shrink-0 border-b border-slate-800/90 bg-[linear-gradient(180deg,#121822_0%,#0c1018_100%)] shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
        <div className="flex items-end gap-1 overflow-x-auto px-3 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-4">
          <span className="mr-1 hidden shrink-0 self-center pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 md:inline">
            模組
          </span>
          {EDITOR_TAB_ROWS.map(({ id, label }) => {
            const on = activeTab === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`relative shrink-0 rounded-t-lg border px-3.5 py-2.5 text-sm font-semibold transition md:px-4 md:py-2.5 ${
                  on
                    ? 'z-[1] border-slate-600/70 border-b-transparent bg-[#0a0e14] text-white shadow-[0_-2px_16px_rgba(56,189,248,0.12),inset_0_1px_0_rgba(255,255,255,0.06)]'
                    : 'border-transparent bg-transparent text-slate-500 hover:bg-white/[0.04] hover:text-slate-300'
                }`}
              >
                {on && (
                  <span
                    className="pointer-events-none absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-sky-500/0 via-sky-400/90 to-sky-500/0 md:inset-x-4"
                    aria-hidden
                  />
                )}
                {label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1400px] px-4 py-4 md:px-6 md:py-5">
          <div className="rounded-2xl border border-slate-800/55 bg-[#090d14]/92 p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.4)_inset,0_16px_48px_rgba(0,0,0,0.25)] md:p-6">
            <Panel key={activeTab} />
          </div>
        </div>
      </div>
    </section>
  )
}
