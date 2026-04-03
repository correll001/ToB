// components/editor/BuildEditorPage.tsx
'use client'

import React, { useMemo } from 'react'
import { useBuildStore } from '@/stores/useBuildStore'
import BuildEditorHeader from '@/components/editor/BuildEditorHeader'
import BuildEditorSidebar from '@/components/editor/BuildEditorSidebar'
import BuildEditorWorkspace from '@/components/editor/BuildEditorWorkspace'
import BuildEditorAdBar from '@/components/editor/BuildEditorAdBar'
import { useEditorShareCodeFlow } from '@/hooks/useEditorShareCodeFlow'

export default function BuildEditorPage() {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const lastSavedAt = useBuildStore((s) => s.lastSavedAt)
  const lastUpdatedLabel = useMemo(() => {
    if (lastSavedAt == null) return '—'
    try {
      return new Date(lastSavedAt).toLocaleString()
    } catch {
      return '—'
    }
  }, [lastSavedAt])

  const { codeInput, setCodeInput, handleImport, handleExport, handleCopy } = useEditorShareCodeFlow({
    hydrationDone: mounted,
  })

  if (!mounted) return null

  return (
    <div className="flex h-screen min-h-0 flex-col bg-[#05070b] text-slate-100 antialiased">
      <BuildEditorHeader
        lastUpdatedLabel={lastUpdatedLabel}
        codeInput={codeInput}
        onCodeInputChange={setCodeInput}
        onImport={handleImport}
        onExport={handleExport}
        onCopy={handleCopy}
      />

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        <BuildEditorSidebar />
        <BuildEditorWorkspace />
      </main>

      <BuildEditorAdBar />
    </div>
  )
}
