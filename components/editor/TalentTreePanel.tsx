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
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <h2 className="text-lg font-semibold text-white">Talent Tree</h2>
        <p className="mt-1 text-sm text-gray-400">
          MVP 先用假節點版驗證資料流，之後可替換為 SVG / Canvas。
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {TREE_ORDER.map((treeName) => {
            const tree = mockTalentTrees.find((t) => t.treeName === treeName)
            const active = selectedTree === treeName

            return (
              <button
                key={treeName}
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

      <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <div className="mb-4 text-sm text-gray-400">已配置節點：{allocatedNodes.length}</div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {currentTree?.nodes.map((node) => {
            const active = allocatedNodes.includes(node.id)
            const focused = selectedNodeId === node.id

            return (
              <button
                key={node.id}
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

      <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <h3 className="mb-3 text-base font-semibold text-white">Node Details</h3>

        {selectedNode ? (
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-400">名稱</div>
              <div className="text-white">{selectedNode.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">ID</div>
              <div className="text-white">{selectedNode.id}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">描述</div>
              <div className="text-white">{selectedNode.description}</div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-950 p-3 text-sm text-gray-300">
              狀態：{allocatedNodes.includes(selectedNode.id) ? '已配置' : '未配置'}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-400">點選上方節點後，這裡會顯示詳細資訊。</div>
        )}
      </div>
    </div>
  )
}
