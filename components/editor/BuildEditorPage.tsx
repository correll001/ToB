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

function Header() {
  const title = useBuildStore((s) => s.snapshot.meta.title)
  const dirty = useBuildStore((s) => s.dirty)
  const setTitle = useBuildStore((s) => s.setTitle)

  return (
    <header className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-6 py-4">
      <div>
        <div className="text-xs uppercase tracking-widest text-gray-500">Torchlight Infinite Planner MVP</div>
        <div className="mt-1 text-xl font-bold text-white">Build Editor</div>
      </div>

      <div className="flex items-center gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Build Title"
          className="w-72 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
        />
        <div
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            dirty ? 'bg-amber-900/50 text-amber-300' : 'bg-emerald-900/50 text-emerald-300'
          }`}
        >
          {dirty ? 'Unsaved' : 'Saved'}
        </div>
      </div>
    </header>
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

function NotesPanel() {
  const notes = useBuildStore((s) => s.snapshot.notes)
  const setNote = useBuildStore((s) => s.setNote)

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <h2 className="text-lg font-semibold text-white">Notes</h2>
        <p className="mt-1 text-sm text-gray-400">補玩法、練等與王戰備註。</p>
      </div>

      {(['gameplay', 'leveling', 'bossing'] as const).map((key) => (
        <div key={key} className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <label className="mb-2 block text-sm font-medium capitalize text-gray-300">
            {key}
          </label>
          <textarea
            value={notes[key]}
            onChange={(e) => setNote(key, e.target.value)}
            className="min-h-28 w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-sm text-white outline-none focus:border-blue-500"
          />
        </div>
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

  const snapshot = useBuildStore((s) => s.snapshot)
  const importSnapshot = useBuildStore((s) => s.importSnapshot)
  const exportSnapshot = useBuildStore((s) => s.exportSnapshot)

  const activeTab = useEditorUiStore((s) => s.activeTab)
  const setActiveTab = useEditorUiStore((s) => s.setActiveTab)
  const isShareDialogOpen = useEditorUiStore((s) => s.isShareDialogOpen)
  const openShareDialog = useEditorUiStore((s) => s.openShareDialog)
  const closeShareDialog = useEditorUiStore((s) => s.closeShareDialog)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!mounted) return

    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (!code) return

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
    <div className="flex h-screen flex-col bg-gray-950 text-gray-100">
      <Header />

      <main className="flex flex-1 overflow-hidden">
        <aside className="w-[360px] shrink-0 overflow-y-auto border-r border-gray-800 bg-gray-950 p-4">
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
              <div className="text-xs uppercase tracking-widest text-gray-500">Current Build</div>
              <div className="mt-2 text-xl font-bold text-white">
                {snapshot.meta.title || 'Untitled Build'}
              </div>
              <div className="mt-2 text-sm text-gray-400">
                Hero: {snapshot.hero.heroId ?? '未選擇'}
              </div>
              <div className="text-sm text-gray-400">
                Trait: {snapshot.hero.traitId ?? '未選擇'}
              </div>
            </div>

            <HeroTraitCard />
            <BuildSummaryCard />

            <button
              onClick={handleShare}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-500"
            >
              Share / Export
            </button>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="border-b border-gray-800 bg-gray-900 px-4">
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

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'talent' && <TalentTreePanel />}
            {activeTab === 'skills' && <SkillSetupPanel />}
            {activeTab === 'gear' && <GearPlaceholder />}
            {activeTab === 'pactspirit' && <PactspiritPlaceholder />}
            {activeTab === 'notes' && <NotesPanel />}
          </div>
        </section>
      </main>

      {isShareDialogOpen && (
        <ShareDialog shareUrl={shareUrl} onClose={closeShareDialog} />
      )}
    </div>
  )
}
