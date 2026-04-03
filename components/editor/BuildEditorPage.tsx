// components/editor/BuildEditorPage.tsx
'use client'

import React from 'react'
import { useBuildStore } from '@/stores/useBuildStore'
import { useEditorUiStore } from '@/stores/useEditorUiStore'
import { encodeBuildToShareCode, decodeBuildFromShareCode } from '@/lib/shareCodec'
import type { EditorTab } from '@/types/build'
import HeroTraitCard from '@/components/editor/HeroTraitCard'
import BuildSummaryCard from '@/components/editor/BuildSummaryCard'
import SkillSetupPanel from '@/components/editor/SkillSetupPanel'
import TalentTreePanel from '@/components/editor/TalentTreePanel'

const EDITOR_TABS: EditorTab[] = ['talent', 'skills', 'gear', 'pactspirit', 'notes']

/** App metadata (layout only; not game data). */
const APP_PRODUCT_NAME = 'Torchlight Infinite Planner'
const APP_AUTHOR_NAME = '—'
const APP_VERSION = '0.1.0'

function useDebouncedCommit<T>(
  localValue: T,
  committedValue: T,
  commit: (value: T) => void,
  waitMs: number
) {
  React.useEffect(() => {
    if (Object.is(localValue, committedValue)) return
    const t = window.setTimeout(() => commit(localValue), waitMs)
    return () => window.clearTimeout(t)
  }, [localValue, committedValue, commit, waitMs])
}

function BuildTitleField() {
  const title = useBuildStore((s) => s.snapshot.meta.title)
  const dirty = useBuildStore((s) => s.dirty)
  const setTitle = useBuildStore((s) => s.setTitle)

  const [localTitle, setLocalTitle] = React.useState(title)
  React.useEffect(() => {
    setLocalTitle(title)
  }, [title])
  useDebouncedCommit(localTitle, title, setTitle, 300)

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">Build Title</label>
        <input
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          placeholder="Build Title"
          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
        />
      </div>
      <div
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
          dirty ? 'bg-amber-900/50 text-amber-300' : 'bg-emerald-900/50 text-emerald-300'
        }`}
      >
        {dirty ? 'Unsaved' : 'Saved'}
      </div>
    </div>
  )
}

function AppHeader({
  lastUpdatedLabel,
  onExport,
}: {
  lastUpdatedLabel: string
  onExport: () => void
}) {
  const [streamCodeInput, setStreamCodeInput] = React.useState('')

  return (
    <header className="shrink-0 border-b border-gray-800 bg-gray-900">
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="min-w-0 flex flex-col gap-1 text-sm">
          <div className="truncate text-base font-semibold text-white">{APP_PRODUCT_NAME}</div>
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

        <div className="flex w-full min-w-0 flex-wrap items-center justify-end gap-2 md:w-auto md:max-w-[min(100%,42rem)]">
          <input
            type="text"
            value={streamCodeInput}
            onChange={(e) => setStreamCodeInput(e.target.value)}
            placeholder="流派碼（預留）"
            className="min-w-[10rem] flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500 outline-none focus:border-blue-500 md:max-w-xs"
          />
          <button
            type="button"
            className="shrink-0 rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700"
          >
            匯入
          </button>
          <button
            type="button"
            onClick={onExport}
            className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            匯出
          </button>
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

function ShareDialog({
  shareUrl,
  onClose,
}: {
  shareUrl: string
  onClose: () => void
}) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      alert('複製失敗，請手動複製。')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Share / Export</h2>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800"
          >
            關閉
          </button>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
          <div className="mb-2 text-sm text-gray-400">可分享網址</div>
          <textarea
            readOnly
            value={shareUrl}
            className="h-28 w-full rounded-lg border border-gray-800 bg-gray-900 p-3 text-sm text-gray-200 outline-none"
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            {copied ? '已複製' : '複製網址'}
          </button>
        </div>
      </div>
    </div>
  )
}

function NoteTextarea({ section }: { section: 'gameplay' | 'leveling' | 'bossing' }) {
  const note = useBuildStore((s) => s.snapshot.notes[section])
  const setNote = useBuildStore((s) => s.setNote)

  const [localNote, setLocalNote] = React.useState(note)
  React.useEffect(() => {
    setLocalNote(note)
  }, [note])
  useDebouncedCommit(
    localNote,
    note,
    (v) => setNote(section, v),
    300
  )

  const flushToStore = () => {
    if (localNote !== note) setNote(section, localNote)
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
      <label className="mb-2 block text-sm font-medium capitalize text-gray-300">{section}</label>
      <textarea
        value={localNote}
        onChange={(e) => setLocalNote(e.target.value)}
        onBlur={flushToStore}
        className="min-h-28 w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-sm text-white outline-none focus:border-blue-500"
      />
    </div>
  )
}

function NotesPanel() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <h2 className="text-lg font-semibold text-white">Notes</h2>
        <p className="mt-1 text-sm text-gray-400">補玩法、練等與王戰備註。</p>
      </div>

      {(['gameplay', 'leveling', 'bossing'] as const).map((key) => (
        <NoteTextarea key={key} section={key} />
      ))}
    </div>
  )
}

function GearPlaceholder() {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
      <h2 className="text-lg font-semibold text-white">Gear</h2>
      <p className="mt-2 text-sm text-gray-400">
        這個版本先保留 Gear 頁籤位置，下一步可直接接 GearPanel。
      </p>
    </div>
  )
}

function PactspiritPlaceholder() {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
      <h2 className="text-lg font-semibold text-white">Pactspirit</h2>
      <p className="mt-2 text-sm text-gray-400">
        這個版本先保留 Pactspirit 頁籤位置，下一步可直接接 PactspiritPanel。
      </p>
    </div>
  )
}

export default function BuildEditorPage() {
  const [mounted, setMounted] = React.useState(false)
  const [shareUrl, setShareUrl] = React.useState('')
  const didImportShareCodeRef = React.useRef(false)

  const sidebarHeroId = useBuildStore((s) => s.snapshot.hero.heroId)
  const sidebarTraitId = useBuildStore((s) => s.snapshot.hero.traitId)
  const lastSavedAt = useBuildStore((s) => s.lastSavedAt)
  const importSnapshot = useBuildStore((s) => s.importSnapshot)
  const exportSnapshot = useBuildStore((s) => s.exportSnapshot)

  const activeTab = useEditorUiStore((s) => s.activeTab)
  const setActiveTab = useEditorUiStore((s) => s.setActiveTab)
  const isShareDialogOpen = useEditorUiStore((s) => s.isShareDialogOpen)
  const openShareDialog = useEditorUiStore((s) => s.openShareDialog)
  const closeShareDialog = useEditorUiStore((s) => s.closeShareDialog)

  const lastUpdatedLabel = React.useMemo(() => {
    if (lastSavedAt == null) return '—'
    try {
      return new Date(lastSavedAt).toLocaleString()
    } catch {
      return '—'
    }
  }, [lastSavedAt])

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
    } catch (error) {
      console.error(error)
      alert('匯入分享碼失敗，請確認網址內容。')
    }
  }, [mounted, importSnapshot])

  const handleShare = () => {
    const currentBuild = exportSnapshot()
    const code = encodeBuildToShareCode(currentBuild)
    const url = `${window.location.origin}${window.location.pathname}?code=${code}`
    setShareUrl(url)
    openShareDialog()
  }

  if (!mounted) return null

  return (
    <div className="flex h-screen min-h-0 flex-col bg-gray-950 text-gray-100">
      <AppHeader lastUpdatedLabel={lastUpdatedLabel} onExport={handleShare} />

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        <aside className="flex w-full shrink-0 flex-col overflow-y-auto border-b border-gray-800 bg-gray-950 p-4 md:w-[min(100%,360px)] md:border-b-0 md:border-r">
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
              <div className="text-xs uppercase tracking-widest text-gray-500">Current Build</div>
              <div className="mt-3">
                <BuildTitleField />
              </div>
              <div className="mt-4 text-sm text-gray-400">Hero: {sidebarHeroId ?? '未選擇'}</div>
              <div className="text-sm text-gray-400">Trait: {sidebarTraitId ?? '未選擇'}</div>
            </div>

            <HeroTraitCard />
            <BuildSummaryCard />
          </div>
        </aside>

        <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-gray-950">
          <div className="shrink-0 border-b border-gray-800 bg-gray-900 px-4">
            <div className="flex flex-wrap gap-2 py-3">
              {EDITOR_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-6">
            {activeTab === 'talent' && <TalentTreePanel />}
            {activeTab === 'skills' && <SkillSetupPanel />}
            {activeTab === 'gear' && <GearPlaceholder />}
            {activeTab === 'pactspirit' && <PactspiritPlaceholder />}
            {activeTab === 'notes' && <NotesPanel />}
          </div>
        </section>
      </main>

      <AdPlaceholderBar />

      {isShareDialogOpen && (
        <ShareDialog shareUrl={shareUrl} onClose={closeShareDialog} />
      )}
    </div>
  )
}
