// components/editor/BuildEditorSidebar.tsx
'use client'

import BuildStatsPanel from '@/components/editor/BuildStatsPanel'

export default function BuildEditorSidebar() {
  return (
    <aside className="flex w-full min-h-0 max-h-[min(46vh,22rem)] shrink-0 flex-col overflow-y-auto border-b border-slate-800/90 bg-[#05070a] shadow-[4px_0_24px_rgba(0,0,0,0.35)] sm:max-h-[min(50vh,26rem)] md:max-h-none md:w-[min(100%,400px)] md:flex-none md:self-stretch md:border-b-0 md:border-r md:border-slate-800/90 md:p-0 md:shadow-[4px_0_32px_rgba(0,0,0,0.4)]">
      <div className="p-3 md:h-full md:overflow-y-auto md:p-4">
        <BuildStatsPanel />
      </div>
    </aside>
  )
}
