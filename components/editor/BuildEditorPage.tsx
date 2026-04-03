// components/editor/BuildEditorPage.tsx
'use client'

import React from 'react'
import { useBuildStore } from '@/stores/useBuildStore'
import { useEditorUiStore } from '@/stores/useEditorUiStore'
import { decodeBuildFromShareCode, encodeBuildToShareCode } from '@/lib/shareCodec'
import type { EditorTab } from '@/types/build'
import HeroTraitCard from '@/components/editor/HeroTraitCard'
import BuildSummaryCard from '@/components/editor/BuildSummaryCard'
import BuildStatsPanel from '@/components/editor/BuildStatsPanel'
import SkillSetupPanel from '@/components/editor/SkillSetupPanel'
import TalentTreePanel from '@/components/editor/TalentTreePanel'

const TAB_CONFIG: { id: EditorTab; label: string }[] = [
  { id: 'heroTalent', label: '英雄天賦' },
  { id: 'talents', label: '天賦' },
  { id: 'skills', label: '技能' },
  { id: 'gear', label: '裝備' },
  { id: 'divinityBoard', label: '神格石板補充' },
]

const APP_PRODUCT_NAME = '火炬之光流派模擬器'
const APP_AUTHOR_NAME = '—'
const APP_VERSION = '0.1.0'

function AppHeader({
  lastUpdatedLabel,
  codeInput,
  onCodeInputChange,
  onImport,
  onExport,
  onCopy,
}: {
  lastUpdatedLabel: string
  codeInput: string
  onCodeInputChange: (value: string) => void
  onImport: () => void
  onExport: () => void
  onCopy: () => void
}) {
  return (
    <header className="shrink-0 border-b border-gray-800/90 bg-gray-900/95 shadow-sm shadow-black/20">
      <div className="mx-auto flex max-w-[1920px] flex-wrap items-start justify-between gap-6 px-4 py-3.5 md:px-6">
        <div className="min-w-0 flex flex-col gap-1.5">
          <div className="truncate text-base font-semibold tracking-tight text-white">{APP_PRODUCT_NAME}</div>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs text-gray-400">
            <span>
              作者 <span className="text-gray-300">{APP_AUTHOR_NAME}</span>
            </span>
            <span>
              版本 <span className="font-mono text-gray-300">{APP_VERSION}</span>
            </span>
            <span>
              最後更新 <span className="text-gray-300">{lastUpdatedLabel}</span>
            </span>
          </div>
        </div>

        <div className="flex w-full min-w-0 flex-col gap-2 md:max-w-2xl md:items-end">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">流派碼</div>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-end sm:justify-end">
            <textarea
              value={codeInput}
              onChange={(e) => onCodeInputChange(e.target.value)}
              placeholder="貼上或產生流派碼（純字串）"
              rows={2}
              className="min-h-[3rem] w-full resize-y rounded-lg border border-gray-700/80 bg-gray-950/70 px-3 py-2 font-mono text-xs leading-relaxed text-gray-200 placeholder:text-gray-600 outline-none focus:border-blue-500 sm:min-w-[min(100%,20rem)]"
            />
            <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
              <button
                type="button"
                onClick={onImport}
                className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm font-medium text-gray-100 hover:bg-gray-700"
              >
                匯入
              </button>
              <button
                type="button"
                onClick={onExport}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
              >
                匯出
              </button>
              <button
                type="button"
                onClick={onCopy}
                className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm font-medium text-gray-100 hover:bg-gray-700"
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

function AdPlaceholderBar() {
  return (
    <footer className="shrink-0 border-t border-gray-800 bg-gray-900/90 px-4 py-3 text-center">
      <div className="mx-auto max-w-6xl rounded-lg border border-dashed border-gray-700 bg-gray-950/60 py-6 text-xs text-gray-500">
        廣告位預留
      </div>
    </footer>
  )
}

function GearPlaceholder() {
  return (
    <div className="rounded-2xl border border-gray-800/80 bg-gray-900/30 p-6">
      <h2 className="text-lg font-semibold text-white">裝備</h2>
      <p className="mt-2 text-sm text-gray-500">
        此分頁預留裝備編輯器；命名與結構已對齊目標設計，功能將於後續版本接上。
      </p>
    </div>
  )
}

function DivinityBoardPlaceholder() {
  return (
    <div className="rounded-2xl border border-gray-800/80 bg-gray-900/30 p-6">
      <h2 className="text-lg font-semibold text-white">神格石板補充</h2>
      <p className="mt-2 text-sm text-gray-500">
        此分頁預留神格／石板相關補強設定，不預先實作遊戲內真實系統。
      </p>
    </div>
  )
}

function HeroTalentWorkspace() {
  return (
    <div className="space-y-5">
      <HeroTraitCard />
      <BuildSummaryCard />
    </div>
  )
}

export default function BuildEditorPage() {
  const [mounted, setMounted] = React.useState(false)
  const [codeInput, setCodeInput] = React.useState('')
  const didImportShareCodeRef = React.useRef(false)

  const lastSavedAt = useBuildStore((s) => s.lastSavedAt)
  const importSnapshot = useBuildStore((s) => s.importSnapshot)
  const exportSnapshot = useBuildStore((s) => s.exportSnapshot)

  const activeTab = useEditorUiStore((s) => s.activeTab)
  const setActiveTab = useEditorUiStore((s) => s.setActiveTab)

  const lastUpdatedLabel = React.useMemo(() => {
    if (lastSavedAt == null) return '—'
    try {
      return new Date(lastSavedAt).toLocaleString()
    } catch {
      return '—'
    }
  }, [lastSavedAt])

  const handleImport = React.useCallback(() => {
    const raw = codeInput.trim()
    if (!raw) {
      alert('請先貼上流派碼。')
      return
    }
    try {
      const parsed = decodeBuildFromShareCode(raw)
      importSnapshot(parsed)
    } catch (e) {
      console.error(e)
      alert('匯入失敗：請確認為有效的流派碼字串。')
    }
  }, [codeInput, importSnapshot])

  const handleExport = React.useCallback(() => {
    try {
      const code = encodeBuildToShareCode(exportSnapshot())
      setCodeInput(code)
    } catch (e) {
      console.error(e)
      alert('匯出失敗。')
    }
  }, [exportSnapshot])

  const handleCopy = React.useCallback(async () => {
    const raw = codeInput.trim()
    if (!raw) {
      alert('請先匯出或貼上流派碼。')
      return
    }
    try {
      await navigator.clipboard.writeText(raw)
    } catch {
      alert('無法複製到剪貼簿。')
    }
  }, [codeInput])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!mounted) return
    if (didImportShareCodeRef.current) return

    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (!code) return

    didImportShareCodeRef.current = true
    try {
      const parsed = decodeBuildFromShareCode(code)
      importSnapshot(parsed)
      setCodeInput(code)
    } catch (error) {
      console.error(error)
      alert('從網址匯入分享碼失敗，請確認網址內容。')
    }
  }, [mounted, importSnapshot])

  if (!mounted) return null

  return (
    <div className="flex h-screen min-h-0 flex-col bg-gray-950 text-gray-100">
      <AppHeader
        lastUpdatedLabel={lastUpdatedLabel}
        codeInput={codeInput}
        onCodeInputChange={setCodeInput}
        onImport={handleImport}
        onExport={handleExport}
        onCopy={handleCopy}
      />

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        <aside className="flex w-full shrink-0 flex-col overflow-y-auto border-b border-gray-800/90 bg-[#080a0c] p-3 md:w-[min(100%,400px)] md:border-b-0 md:border-r md:border-gray-800/90 md:p-4">
          <BuildStatsPanel />
        </aside>

        <section className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#0c1016] before:pointer-events-none before:absolute before:inset-0 before:ring-1 before:ring-inset before:ring-gray-800/35">
          <div className="relative z-10 shrink-0 border-b border-gray-800/90 bg-gray-900/90 px-4">
            <div className="flex flex-wrap gap-2 py-3">
              {TAB_CONFIG.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    activeTab === id
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative z-10 min-h-0 flex-1 overflow-y-auto p-5 md:p-6">
            {activeTab === 'heroTalent' && <HeroTalentWorkspace />}
            {activeTab === 'talents' && <TalentTreePanel />}
            {activeTab === 'skills' && <SkillSetupPanel />}
            {activeTab === 'gear' && <GearPlaceholder />}
            {activeTab === 'divinityBoard' && <DivinityBoardPlaceholder />}
          </div>
        </section>
      </main>

      <AdPlaceholderBar />
    </div>
  )
}
