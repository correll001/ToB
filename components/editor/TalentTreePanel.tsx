// components/editor/TalentTreePanel.tsx
'use client'

import { useMemo } from 'react'
import { useBuildStore } from '@/stores/useBuildStore'
import { useEditorUiStore } from '@/stores/useEditorUiStore'
import { mockTalentTrees } from '@/data/mockGameData'
import type { TreeName } from '@/types/build'

const TREE_ORDER: TreeName[] = ['godTree', 'classTree', 'tree3', 'tree4', 'divinity']

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
    <div className="rounded-2xl border border-gray-800/80 bg-gray-900/25 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
      <div className="border-b border-gray-800/70 px-5 pb-4 pt-5">
        <h2 className="text-lg font-semibold text-white">Talent Tree</h2>
        <p className="mt-1 text-sm text-gray-500">
          MVP 先用假節點版驗證資料流，之後可替換為 SVG / Canvas。
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
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
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {tree?.label ?? treeName}
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-5">
        <div className="rounded-xl border border-gray-800/90 bg-gray-950/70 p-4 shadow-inner shadow-black/20">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">節點配置</span>
            <span className="text-xs text-gray-500">已配置 {allocatedNodes.length} 個</span>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
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
                  className={`rounded-xl border p-4 text-left transition ${
                    active
                      ? 'border-blue-500 bg-blue-950/40'
                      : 'border-gray-800 bg-gray-950 hover:border-gray-700'
                  } ${focused ? 'ring-2 ring-blue-500/50' : ''}`}
                >
                  <div className="text-sm font-semibold text-white">{node.name}</div>
                  <div className="mt-1 text-xs text-gray-400">{node.id}</div>
                  <div className="mt-3 text-xs text-gray-300">{active ? '已選取' : '點擊切換'}</div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-4 border-t border-gray-800/70 pt-4">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">選取節點資訊</div>
          <p className="mt-1 text-xs text-gray-600">附屬說明，主操作區為上方節點網格。</p>

          {selectedNode ? (
            <div className="mt-3 grid gap-3 rounded-lg border border-gray-800/50 bg-gray-950/40 px-3 py-3 text-sm sm:grid-cols-2">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-gray-500">名稱</div>
                <div className="mt-0.5 text-gray-200">{selectedNode.name}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-gray-500">ID</div>
                <div className="mt-0.5 font-mono text-xs text-gray-300">{selectedNode.id}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-[11px] uppercase tracking-wide text-gray-500">描述</div>
                <div className="mt-0.5 text-gray-300">{selectedNode.description}</div>
              </div>
              <div className="sm:col-span-2 border-t border-gray-800/50 pt-2 text-xs text-gray-500">
                狀態：{allocatedNodes.includes(selectedNode.id) ? '已配置' : '未配置'}
              </div>
            </div>
          ) : (
            <div className="mt-3 rounded-lg border border-dashed border-gray-800/80 bg-transparent px-3 py-3 text-xs text-gray-600">
              點選上方節點後，此處顯示附屬資訊。
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
