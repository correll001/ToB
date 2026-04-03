// components/editor/TalentTreePanel.tsx
'use client'

import { useMemo } from 'react'
import { useBuildStore } from '@/stores/useBuildStore'
import { useEditorUiStore } from '@/stores/useEditorUiStore'
import { mockTalentTrees } from '@/data/mockGameData'
import type { TreeName } from '@/types/build'

const TREE_ORDER: TreeName[] = ['godTree', 'classTree', 'tree3', 'tree4', 'divinity']

function PanelHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="border-b border-slate-800/70 pb-4">
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 shrink-0 rounded-sm bg-sky-500/85 shadow-[0_0_12px_rgba(56,189,248,0.4)]"
          aria-hidden
        />
        <h2 className="text-base font-bold tracking-tight text-slate-100 md:text-lg">{title}</h2>
      </div>
      <p className="mt-1.5 pl-4 text-sm text-slate-500">{subtitle}</p>
    </div>
  )
}

export default function TalentTreePanel() {
  const talents = useBuildStore((s) => s.snapshot.talents)
  const toggleTalentNode = useBuildStore((s) => s.toggleTalentNode)

  const selectedTree = useEditorUiStore((s) => s.selectedTree)
  const selectedNodeId = useEditorUiStore((s) => s.selectedNodeId)
  const setSelectedTree = useEditorUiStore((s) => s.setSelectedTree)
  const setSelectedNodeId = useEditorUiStore((s) => s.setSelectedNodeId)

  const currentTree = useMemo(
    () => mockTalentTrees.find((tree) => tree.treeName === selectedTree),
    [selectedTree]
  )

  const allocatedNodes = talents[selectedTree] ?? []
  const selectedNode = currentTree?.nodes.find((node) => node.id === selectedNodeId) ?? null

  return (
    <div className="flex flex-col gap-0 rounded-2xl border border-slate-800/45 bg-gradient-to-b from-slate-900/25 to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="px-5 pb-4 pt-5">
        <PanelHeading
          title="Talent Tree"
          subtitle="MVP 先用假節點版驗證資料流，之後可替換為 SVG / Canvas。"
        />

        <div className="mt-4 flex flex-wrap gap-1.5">
          {TREE_ORDER.map((treeName) => {
            const tree = mockTalentTrees.find((t) => t.treeName === treeName)
            const active = selectedTree === treeName

            return (
              <button
                key={treeName}
                type="button"
                onClick={() => {
                  setSelectedTree(treeName)
                  setSelectedNodeId(null)
                }}
                className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? 'border-sky-500/50 bg-sky-950/50 text-white shadow-[0_0_12px_rgba(56,189,248,0.15)] ring-1 ring-sky-500/25'
                    : 'border-slate-700/70 bg-slate-900/30 text-slate-400 hover:border-slate-600 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                {tree?.label ?? treeName}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4 px-5 pb-5 lg:flex-row lg:items-start lg:gap-5">
        <div className="min-w-0 flex-1">
          <div className="rounded-xl bg-[linear-gradient(180deg,rgba(2,6,12,0.65)_0%,rgba(6,10,16,0.5)_100%)] p-1 ring-1 ring-slate-700/55 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
            <div className="rounded-[10px] border border-slate-800/80 bg-black/35 p-4 shadow-inner">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-800/60 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400/80">主舞台 · 節點配置</span>
                <span className="text-xs text-slate-500">已配置 {allocatedNodes.length} 個</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-3">
                {currentTree?.nodes.map((node) => {
                  const active = allocatedNodes.includes(node.id)
                  const focused = selectedNodeId === node.id

                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => {
                        setSelectedNodeId(node.id)
                        toggleTalentNode(selectedTree, node.id)
                      }}
                      className={`rounded-xl border p-3.5 text-left transition md:p-4 ${
                        active
                          ? 'border-sky-500/60 bg-sky-950/35 shadow-[0_0_0_1px_rgba(56,189,248,0.12)]'
                          : 'border-slate-800/90 bg-slate-950/50 hover:border-slate-600'
                      } ${focused ? 'ring-2 ring-sky-400/45' : ''}`}
                    >
                      <div className="text-sm font-semibold text-slate-100">{node.name}</div>
                      <div className="mt-1 font-mono text-[11px] text-slate-500">{node.id}</div>
                      <div className="mt-2.5 text-[11px] font-medium text-slate-400">
                        {active ? '已選取' : '點擊切換'}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 rounded-xl border border-dashed border-slate-700/55 bg-slate-950/35 p-4 lg:w-[min(100%,280px)] lg:border-solid lg:border-slate-800/60 lg:bg-slate-950/25">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">附屬資訊</div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600">選取節點後顯示詳細；主操作以上方網格為準。</p>

          {selectedNode ? (
            <div className="mt-3 space-y-2.5 rounded-lg border border-slate-800/60 bg-black/30 px-3 py-3 text-sm shadow-inner">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">名稱</div>
                <div className="mt-0.5 text-slate-200">{selectedNode.name}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">ID</div>
                <div className="mt-0.5 font-mono text-xs text-slate-300">{selectedNode.id}</div>
              </div>
              <div className="border-t border-slate-800/50 pt-2">
                <div className="text-[10px] uppercase tracking-wider text-slate-500">描述</div>
                <div className="mt-0.5 text-xs leading-relaxed text-slate-400">{selectedNode.description}</div>
              </div>
              <div className="border-t border-slate-800/50 pt-2 text-[11px] text-slate-500">
                狀態：{allocatedNodes.includes(selectedNode.id) ? '已配置' : '未配置'}
              </div>
            </div>
          ) : (
            <div className="mt-3 rounded-lg border border-slate-800/40 bg-transparent px-3 py-4 text-center text-[11px] text-slate-600">
              點選主舞台節點後，此處顯示附屬說明。
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
