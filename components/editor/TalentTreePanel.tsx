// components/editor/TalentTreePanel.tsx
'use client'

import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useCallback, useMemo, useState } from 'react'
import { useBuildStore } from '@/stores/useBuildStore'
import { useEditorUiStore } from '@/stores/useEditorUiStore'
import type { TalentEditorBoardTab, TalentWallSlotIndex } from '@/types/build'
import type { TalentPanelNode } from '@/types/talentPanel'
import { aggregateTalentWallBonuses } from '@/lib/talent/aggregateTalentWallBonuses'
import { effectLinesToZh, translateTalentEffectLineEnToZh } from '@/lib/talent/talentEffectLineZh'
import {
  lookupCoreTalentAffix,
  namedGrandLayoutForPanel,
  NAMED_GRAND_COLS,
  NAMED_GRAND_TALENT_PICKS,
  NAMED_GRAND_TALENT_SLOT_COUNT,
  normalizeNamedGrandAffixSlots,
} from '@/lib/talent/namedGrandTalentCatalog'
import { nodesForMainGrid, MAIN_GRID_COLS, MAIN_GRID_ROWS } from '@/lib/talent/talentWallLayout'
import {
  GOD_PANELS_SORTED,
  nodesForPanel,
  suggestedTalentNodeId,
  TALENT_PANEL_SEASON,
} from '@/lib/talent/talentPanelClientData'
import { tTalentTreePanel } from '@/lib/i18n/talentTreePanelCatalog'

const tt = tTalentTreePanel()

const BOARD_TAB_ORDER: TalentEditorBoardTab[] = ['godTree', 'classTree', 'extraBoards', 'divinity']

function firstAffixIdInNamedGrandRow(slots: (string | null)[], rowIndex: number): string | null {
  const base = rowIndex * NAMED_GRAND_COLS
  for (let c = 0; c < NAMED_GRAND_COLS; c++) {
    const id = slots[base + c]
    if (typeof id === 'string' && id.trim() !== '') return id.trim()
  }
  return null
}

const TAB_TO_SLOT: Record<TalentEditorBoardTab, TalentWallSlotIndex> = {
  godTree: 0,
  classTree: 1,
  extraBoards: 2,
  divinity: 3,
}

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

function HoverTooltip({
  title,
  lines,
  children,
}: {
  title: string
  lines: string[]
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const onMove = useCallback((e: React.MouseEvent) => {
    setPos({ x: e.clientX + 14, y: e.clientY + 14 })
  }, [])

  return (
    <>
      <span
        className="contents"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onMouseMove={onMove}
      >
        {children}
      </span>
      {open && typeof document !== 'undefined'
        ? createPortal(
            <div
              role="tooltip"
              className="pointer-events-none fixed z-[9999] max-w-[min(20rem,calc(100vw-1.5rem))] rounded-lg border border-slate-600/90 bg-slate-950/98 px-3 py-2 text-left text-xs text-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-sm"
              style={{ left: pos.x, top: pos.y }}
            >
              <div className="font-semibold leading-snug text-sky-200">{title}</div>
              {lines.length > 0 ? (
                <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-[11px] leading-relaxed text-slate-300">
                  {lines.map((l, i) => (
                    <li key={i}>{l}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1.5 text-[11px] text-slate-500">{tt.tooltipNoEffects}</p>
              )}
            </div>,
            document.body,
          )
        : null}
    </>
  )
}

function talentNodeTooltipTitleZh(node: TalentPanelNode): string {
  if (node.nodeType === 'keystone') {
    const head = node.effectLines?.[0]
    return head
      ? tt.keystoneTitleWithEffect(translateTalentEffectLineEnToZh(head))
      : tt.keystoneTitleFallback
  }
  return tt.nodeType[node.nodeType]
}

function talentNodeTooltipLinesZh(node: TalentPanelNode, rank: number, maxRank: number): string[] {
  const zhFromData = effectLinesToZh(node.effectLines)
  const extra: string[] = [tt.tooltipRank(rank, maxRank)]
  if (node.affixPending) {
    extra.push(tt.tooltipAffixPending)
  }
  if (zhFromData.length === 0 && node.notes.length > 0) {
    extra.push(tt.tooltipReference(node.notes[0]!))
  }
  return [...zhFromData, ...extra]
}

function TalentWallNodeDetail({
  panelId,
  node,
  rank,
  onStepRank,
}: {
  panelId: string
  node: TalentPanelNode
  rank: number
  onStepRank: (delta: -1 | 1) => void
}) {
  const season = TALENT_PANEL_SEASON
  const nodeId = suggestedTalentNodeId(panelId, node.slotIndex, season)
  const r = rank
  const zhLines = effectLinesToZh(node.effectLines)

  return (
    <div className="mt-3 space-y-2.5 rounded-lg border border-slate-800/60 bg-black/30 px-3 py-3 text-sm shadow-inner">
      <div>
        <div className="text-[10px] uppercase tracking-wider text-slate-500">{tt.detailNodeType}</div>
        <div className="mt-0.5 text-slate-200">
          {tt.nodeType[node.nodeType]}
          {node.nodeType === 'keystone' && node.effectLines?.[0] ? (
            <span className="mt-1 block text-xs font-medium text-amber-200/90">
              {translateTalentEffectLineEnToZh(node.effectLines[0])}
            </span>
          ) : null}
          <span className="mt-1 block text-[11px] text-slate-500">{tt.detailMaxPoints(node.maxRank)}</span>
        </div>
      </div>
      {zhLines.length > 0 ? (
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500">{tt.detailEffectsZh}</div>
          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[11px] leading-relaxed text-slate-300">
            {zhLines.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <div>
        <div className="text-[10px] uppercase tracking-wider text-slate-500">{tt.detailGridCoords}</div>
        <div className="mt-0.5 font-mono text-xs text-slate-300">
          {tt.detailGridCoordsLine(node.x, node.y, node.slotIndex)}
        </div>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wider text-slate-500">{tt.detailNodeIdLabel}</div>
        <div className="mt-0.5 break-all font-mono text-[10px] leading-snug text-slate-300">{nodeId}</div>
      </div>
      {node.affixPending ? (
        <div className="rounded border border-amber-900/40 bg-amber-950/20 px-2 py-1.5 text-[11px] text-amber-200/90">
          {tt.affixPendingBody}
        </div>
      ) : null}
      {node.requiresNodeIds.length > 0 ? (
        <div className="border-t border-slate-800/50 pt-2">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">{tt.prereqRequires}</div>
          <ul className="mt-1 space-y-0.5 font-mono text-[10px] text-slate-400">
            {node.requiresNodeIds.map((id) => (
              <li key={id} className="break-all">
                {id}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {node.edgesTo.length > 0 ? (
        <div className="border-t border-slate-800/50 pt-2">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">{tt.edgesTo}</div>
          <ul className="mt-1 space-y-0.5 font-mono text-[10px] text-slate-400">
            {node.edgesTo.map((id) => (
              <li key={id} className="break-all">
                {id}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {node.notes.length > 0 ? (
        <div className="border-t border-slate-800/50 pt-2">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">{tt.notesLabel}</div>
          <div className="mt-1 font-mono text-[10px] leading-relaxed text-slate-500">{node.notes.join(' · ')}</div>
        </div>
      ) : null}
      <div className="border-t border-slate-800/50 pt-2">
        <div className="text-[10px] uppercase tracking-wider text-slate-500">{tt.rankLabel}</div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onStepRank(-1)}
            disabled={r <= 0}
            className="rounded-md border border-slate-600 bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-slate-200 disabled:opacity-35"
          >
            −
          </button>
          <span className="min-w-[3rem] text-center font-mono text-sm tabular-nums text-sky-200">
            {r} / {node.maxRank}
          </span>
          <button
            type="button"
            onClick={() => onStepRank(1)}
            disabled={r >= node.maxRank}
            className="rounded-md border border-slate-600 bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-slate-200 disabled:opacity-35"
          >
            +
          </button>
        </div>
        <p className="mt-2 text-[10px] text-slate-600">{tt.rankClickHint(node.maxRank)}</p>
      </div>
    </div>
  )
}

function TalentWallSlotCanvas({
  panelId,
  rankByNodeId,
  namedGrandAffixSlots,
  pointsOnSlot,
  onNamedGrandRowPick,
  selectedNodeId,
  onCellClick,
}: {
  panelId: string
  rankByNodeId: Record<string, number>
  namedGrandAffixSlots: (string | null)[]
  pointsOnSlot: number
  onNamedGrandRowPick: (
    rowIndex: 0 | 1,
    pick: { affixId: string; columnIndex: number } | null,
  ) => void
  selectedNodeId: string | null
  onCellClick: (nodeId: string, maxRank: number) => void
}) {
  const season = TALENT_PANEL_SEASON
  const panelNodes = useMemo(() => nodesForPanel(panelId), [panelId])
  const mainNodes = useMemo(() => nodesForMainGrid(panelNodes), [panelNodes])

  const bySlotMain = useMemo(() => {
    const m = new Map<number, TalentPanelNode>()
    for (const n of mainNodes) {
      m.set(n.slotIndex, n)
    }
    return m
  }, [mainNodes])

  const mainGrid = (
      <div className="space-y-1">
        {Array.from({ length: MAIN_GRID_ROWS }, (_, y) => (
          <div key={y} className="grid gap-1" style={{ gridTemplateColumns: `repeat(${MAIN_GRID_COLS}, minmax(0,1fr))` }}>
            {Array.from({ length: MAIN_GRID_COLS }, (_, x) => {
              const slot = y * MAIN_GRID_COLS + x
              const node = bySlotMain.get(slot)
              const nodeId = suggestedTalentNodeId(panelId, slot, season)

              if (!node) {
                return (
                  <div
                    key={slot}
                    className="aspect-square min-h-[2.25rem] rounded-md border border-dashed border-slate-800/35 bg-slate-950/15"
                    aria-label={tt.emptyCellAria(x, y)}
                  />
                )
              }

              const rank = rankByNodeId[nodeId] ?? 0
              const active = rank > 0
              const focused = selectedNodeId === nodeId

              return (
                <HoverTooltip
                  key={slot}
                  title={talentNodeTooltipTitleZh(node)}
                  lines={talentNodeTooltipLinesZh(node, rank, node.maxRank)}
                >
                  <button
                    type="button"
                    onClick={() => onCellClick(nodeId, node.maxRank)}
                    className={`flex aspect-square min-h-[2.25rem] w-full flex-col items-center justify-center rounded-md border px-0.5 py-1 text-center transition ${
                      active
                        ? 'border-sky-500/55 bg-sky-950/40 shadow-[0_0_0_1px_rgba(56,189,248,0.12)]'
                        : 'border-slate-700/80 bg-slate-950/55 hover:border-slate-500'
                    } ${focused ? 'ring-2 ring-sky-400/50' : ''}`}
                  >
                    {node.nodeType === 'keystone' && node.displayLabel ? (
                      <span className="flex min-h-0 w-full flex-col items-center gap-0.5">
                        <span className="line-clamp-2 text-[7.5px] font-semibold leading-tight text-amber-200/95">
                          {translateTalentEffectLineEnToZh(node.displayLabel)}
                        </span>
                        {(node.effectLines?.length ?? 0) > 1 ? (
                          <span className="text-[6.5px] font-medium leading-none text-amber-400/85">
                            {tt.keystoneExtraEffectCount(node.effectLines!.length - 1)}
                          </span>
                        ) : null}
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold leading-tight text-sky-300/90">
                        {tt.nodeType[node.nodeType]}
                      </span>
                    )}
                    <span className="mt-0.5 text-[8px] font-mono leading-none text-slate-500">
                      {x},{y}
                    </span>
                    <span className="mt-0.5 text-[9px] font-semibold tabular-nums text-slate-200">
                      {rank}/{node.maxRank}
                    </span>
                  </button>
                </HoverTooltip>
              )
            })}
          </div>
        ))}
      </div>
    )

  const grandSlots = [...namedGrandAffixSlots]
  while (grandSlots.length < NAMED_GRAND_TALENT_SLOT_COUNT) grandSlots.push(null)

  const grandLayout = useMemo(() => namedGrandLayoutForPanel(panelId), [panelId])

  const legendGrid = (
    <div className="flex w-full min-w-0 flex-col lg:w-[min(100%,19rem)] xl:w-[20rem]">
      <div className="mb-1 text-[9px] font-bold uppercase tracking-wider text-amber-400/95">
        {tt.namedGrandTitle}
      </div>
      <div className="flex flex-col gap-2.5">
        {grandLayout.rows.map((rowSpec, rowIdx) => {
          const tierUnlocked = grandLayout.mode !== 'perPanel' || pointsOnSlot >= rowSpec.minPoints
          const legacyList = grandLayout.legacyOptions ?? NAMED_GRAND_TALENT_PICKS
          const rowPicksOrdered =
            grandLayout.mode === 'perPanel'
              ? rowSpec.cells
                  .map((cell, colIdx) => (cell ? { pick: cell, colIdx } : null))
                  .filter((x): x is { pick: NonNullable<(typeof rowSpec.cells)[number]>; colIdx: number } => x != null)
              : legacyList.map((pick) => ({ pick, colIdx: 0 as const }))

          const selectedId = firstAffixIdInNamedGrandRow(grandSlots, rowIdx)
          const selectedAffix = selectedId ? lookupCoreTalentAffix(selectedId) : undefined
          const tipLines =
            selectedAffix?.descriptionLines?.filter(Boolean) ??
            (selectedAffix?.rawText ? [selectedAffix.rawText.slice(0, 280)] : [tt.tooltipNotSelected])
          const hasOptions = rowPicksOrdered.length > 0
          const selectDisabled = !tierUnlocked || (grandLayout.mode === 'perPanel' && !hasOptions)

          return (
            <HoverTooltip
              key={`grand-row-${rowIdx}`}
              title={
                selectedAffix
                  ? selectedAffix.displayName
                  : rowIdx === 0
                    ? tt.namedGrandTier1Tooltip
                    : tt.namedGrandTier2Tooltip
              }
              lines={
                !tierUnlocked && grandLayout.mode === 'perPanel'
                  ? [tt.namedGrandNeedPoints(rowSpec.minPoints, pointsOnSlot), ...tipLines]
                  : tipLines
              }
            >
              <div className="flex flex-col gap-1 rounded-lg border border-amber-900/40 bg-amber-950/15 px-2 py-2">
                <div className="text-[8px] font-semibold leading-tight text-amber-200/85">
                  {rowIdx === 0 ? tt.namedGrandRowPrimary : tt.namedGrandRowSecondary}
                  {grandLayout.mode === 'perPanel' ? (
                    <>
                      <span className="text-slate-500">{tt.namedGrandPerPanelPoints(rowSpec.minPoints)}</span>
                      <span className="ml-1 font-normal text-slate-500">{tt.namedGrandPickOne}</span>
                    </>
                  ) : (
                    <span className="ml-1 font-normal text-slate-500">{tt.namedGrandPickOne}</span>
                  )}
                </div>
                <select
                  value={selectedId ?? ''}
                  disabled={selectDisabled}
                  onChange={(e) => {
                    const v = e.target.value.trim()
                    if (!v) {
                      onNamedGrandRowPick(rowIdx as 0 | 1, null)
                      return
                    }
                    if (grandLayout.mode === 'perPanel') {
                      const hit = rowPicksOrdered.find((x) => x.pick.affixId === v)
                      if (hit) {
                        onNamedGrandRowPick(rowIdx as 0 | 1, {
                          affixId: v,
                          columnIndex: hit.colIdx,
                        })
                      }
                      return
                    }
                    onNamedGrandRowPick(rowIdx as 0 | 1, { affixId: v, columnIndex: 0 })
                  }}
                  className="w-full min-w-0 cursor-pointer rounded-md border border-amber-900/55 bg-slate-950/90 py-1.5 pl-2 pr-6 text-[10px] font-medium leading-snug text-amber-100 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <option value="">
                    {grandLayout.mode === 'perPanel' && !hasOptions ? tt.selectNoAffixThisTier : tt.selectNone}
                  </option>
                  {rowPicksOrdered.map(({ pick }) => (
                    <option key={pick.affixId} value={pick.affixId}>
                      {pick.displayName}
                    </option>
                  ))}
                  {selectedId && !rowPicksOrdered.some((x) => x.pick.affixId === selectedId) ? (
                    <option value={selectedId}>{selectedAffix?.displayName ?? selectedId}</option>
                  ) : null}
                </select>
              </div>
            </HoverTooltip>
          )
        })}
      </div>
      <p className="mt-1.5 text-[9px] leading-snug text-slate-600">
        {grandLayout.mode === 'perPanel' ? tt.namedGrandHelpPerPanel : tt.namedGrandHelpLegacy}
      </p>
    </div>
  )

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1">{mainGrid}</div>
      {legendGrid}
    </div>
  )
}

export default function TalentTreePanel() {
  const snapshot = useBuildStore((s) => s.snapshot)
  const setTalentWallPanel = useBuildStore((s) => s.setTalentWallPanel)
  const cycleTalentWallNodeRank = useBuildStore((s) => s.cycleTalentWallNodeRank)
  const setTalentWallNodeRank = useBuildStore((s) => s.setTalentWallNodeRank)
  const setNamedGrandAffixRowPick = useBuildStore((s) => s.setNamedGrandAffixRowPick)

  const boardTab = useEditorUiStore((s) => s.talentBoardTab)
  const selectedNodeId = useEditorUiStore((s) => s.selectedNodeId)
  const setTalentBoardTab = useEditorUiStore((s) => s.setTalentBoardTab)
  const setSelectedNodeId = useEditorUiStore((s) => s.setSelectedNodeId)

  const slotIndex = TAB_TO_SLOT[boardTab]
  const board = snapshot.talentWallBoards[slotIndex]
  const panelId = board?.panelId ?? 'god_God_of_Might'
  const rankByNodeId = board?.ranks ?? {}
  const namedGrandAffixSlots = useMemo(
    () => normalizeNamedGrandAffixSlots(board?.namedGrandAffixSlots ?? []),
    [board?.namedGrandAffixSlots],
  )

  const panelNodes = useMemo(() => nodesForPanel(panelId), [panelId])
  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null
    return panelNodes.find((n) => suggestedTalentNodeId(panelId, n.slotIndex, TALENT_PANEL_SEASON) === selectedNodeId)
  }, [panelNodes, panelId, selectedNodeId])

  const pointsOnSlot = useMemo(() => {
    let s = 0
    for (const v of Object.values(rankByNodeId)) {
      const n = Math.floor(Number(v))
      if (Number.isFinite(n) && n > 0) s += n
    }
    return s
  }, [rankByNodeId])

  const bonusRollup = useMemo(() => aggregateTalentWallBonuses(snapshot), [snapshot])

  const { baseGodPanels, professionPanels } = useMemo(() => {
    const base = GOD_PANELS_SORTED.filter((p) => p.talentWallGroup === 'base_god')
    const pro = GOD_PANELS_SORTED.filter((p) => p.talentWallGroup === 'profession')
    if (base.length > 0 || pro.length > 0) {
      return { baseGodPanels: base, professionPanels: pro }
    }
    return {
      baseGodPanels: GOD_PANELS_SORTED.slice(0, 6),
      professionPanels: GOD_PANELS_SORTED.slice(6),
    }
  }, [])

  const handleCellClick = (nodeId: string, maxRank: number) => {
    setSelectedNodeId(nodeId)
    cycleTalentWallNodeRank(slotIndex, nodeId, maxRank)
  }

  const currentPanelName = GOD_PANELS_SORTED.find((p) => p.panelId === panelId)?.displayName ?? panelId

  return (
    <div className="flex flex-col gap-0 rounded-2xl border border-slate-800/45 bg-gradient-to-b from-slate-900/25 to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="px-5 pb-4 pt-5">
        <PanelHeading title={tt.pageTitle} subtitle={tt.pageSubtitle} />

        <div className="mt-4 flex flex-wrap gap-1.5">
          {BOARD_TAB_ORDER.map((id) => {
            const active = boardTab === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setTalentBoardTab(id)
                  setSelectedNodeId(null)
                }}
                className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? 'border-sky-500/50 bg-sky-950/50 text-white shadow-[0_0_12px_rgba(56,189,248,0.15)] ring-1 ring-sky-500/25'
                    : 'border-slate-700/70 bg-slate-900/30 text-slate-400 hover:border-slate-600 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                {tt.boardTabs[id]}
              </button>
            )
          })}
        </div>

        <div className="mt-3 space-y-2 border-t border-slate-800/40 pt-3">
          <div className="text-[11px] text-slate-500">
            {tt.currentWall}
            <span className="font-semibold text-slate-300">{currentPanelName}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {tt.sixGodsSection}
            </span>
            {baseGodPanels.map((p) => {
              const on = panelId === p.panelId
              return (
                <button
                  key={p.panelId}
                  type="button"
                  onClick={() => {
                    setTalentWallPanel(slotIndex, p.panelId)
                    setSelectedNodeId(null)
                  }}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                    on
                      ? 'border-violet-500/45 bg-violet-950/35 text-violet-100'
                      : 'border-slate-700/70 bg-slate-900/25 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                  }`}
                >
                  {p.displayName}
                </button>
              )
            })}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {tt.professionWallsSection}
            </span>
            {professionPanels.map((p) => {
              const on = panelId === p.panelId
              return (
                <button
                  key={p.panelId}
                  type="button"
                  onClick={() => {
                    setTalentWallPanel(slotIndex, p.panelId)
                    setSelectedNodeId(null)
                  }}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                    on
                      ? 'border-violet-500/45 bg-violet-950/35 text-violet-100'
                      : 'border-slate-700/70 bg-slate-900/25 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                  }`}
                >
                  {p.displayName}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-5 pb-5 lg:flex-row lg:items-start lg:gap-5">
        <div className="min-w-0 flex-1">
          <div className="rounded-xl bg-[linear-gradient(180deg,rgba(2,6,12,0.65)_0%,rgba(6,10,16,0.5)_100%)] p-1 ring-1 ring-slate-700/55 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
            <div className="rounded-[10px] border border-slate-800/80 bg-black/35 p-4 shadow-inner">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-800/60 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400/80">
                  {tt.mainStageCaption}
                </span>
                <span className="text-xs text-slate-500">{tt.pointsInvestedThisBoard(pointsOnSlot)}</span>
              </div>
              <TalentWallSlotCanvas
                panelId={panelId}
                rankByNodeId={rankByNodeId}
                namedGrandAffixSlots={namedGrandAffixSlots}
                pointsOnSlot={pointsOnSlot}
                onNamedGrandRowPick={(rowIndex, pick) =>
                  setNamedGrandAffixRowPick(slotIndex, rowIndex, pick)
                }
                selectedNodeId={selectedNodeId}
                onCellClick={handleCellClick}
              />
            </div>
          </div>
        </div>

        <div className="shrink-0 rounded-xl border border-dashed border-slate-700/55 bg-slate-950/35 p-4 lg:w-[min(100%,300px)] lg:border-solid lg:border-slate-800/60 lg:bg-slate-950/25">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{tt.sidePanelTitle}</div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600">{tt.sidePanelBlurb}</p>

          {selectedNode ? (
            <TalentWallNodeDetail
              panelId={panelId}
              node={selectedNode}
              rank={rankByNodeId[suggestedTalentNodeId(panelId, selectedNode.slotIndex, TALENT_PANEL_SEASON)] ?? 0}
              onStepRank={(delta) => {
                const nid = suggestedTalentNodeId(panelId, selectedNode.slotIndex, TALENT_PANEL_SEASON)
                const cur = rankByNodeId[nid] ?? 0
                setTalentWallNodeRank(slotIndex, nid, cur + delta, selectedNode.maxRank)
              }}
            />
          ) : (
            <div className="mt-3 rounded-lg border border-slate-800/40 bg-transparent px-3 py-4 text-center text-[11px] text-slate-600">
              {tt.nodeDetailPlaceholder}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-800/60 bg-slate-950/20 px-5 py-4">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{tt.rollupBucketsTitle}</div>
        <ul className="mt-1.5 max-h-[min(32vh,16rem)] space-y-1 overflow-y-auto text-[11px] leading-relaxed text-emerald-200/95">
          {bonusRollup.bucketLinesZh.length === 0 ? (
            <li className="text-slate-600">{tt.rollupBucketsEmpty}</li>
          ) : (
            bonusRollup.bucketLinesZh.map((line, i) => (
              <li key={i} className="border-b border-slate-800/35 pb-1">
                {line}
              </li>
            ))
          )}
        </ul>

        <div className="mt-4 border-t border-slate-800/55 pt-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/85">{tt.rollupTitle}</div>
          <p className="mt-1 text-xs text-slate-500">
            {tt.rollupIntroBeforePoints}
            <span className="font-semibold text-slate-200">{bonusRollup.totalTalentPoints}</span>
            {tt.rollupIntroAfterPoints}
          </p>
          {bonusRollup.effectLineManifestZh.length > 0 ? (
            <>
              {bonusRollup.effectLineManifestZh.some((r) => r.conditional) ? (
                <>
                  <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-amber-400/90">
                    {tt.rollupManifestConditionalTitle}
                  </div>
                  <p className="mt-1 text-[10px] leading-relaxed text-slate-600">
                    {tt.rollupManifestConditionalBlurb}
                  </p>
                  <ul className="mt-1.5 max-h-[min(28vh,14rem)] space-y-1 overflow-y-auto text-[11px] leading-relaxed text-amber-100/90">
                    {bonusRollup.effectLineManifestZh
                      .filter((r) => r.conditional)
                      .map((r, i) => (
                        <li key={`c-${i}`} className="flex gap-2 border-b border-slate-800/40 pb-1.5">
                          <span className="shrink-0 tabular-nums text-amber-500/80">×{r.stackedWeight}</span>
                          <span>{r.lineZh}</span>
                        </li>
                      ))}
                  </ul>
                </>
              ) : null}
              {bonusRollup.effectLineManifestZh.some((r) => !r.conditional) ? (
                <>
                  <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-sky-500/90">
                    {tt.rollupManifestTitle}
                  </div>
                  <p className="mt-1 text-[10px] leading-relaxed text-slate-600">{tt.rollupManifestBlurb}</p>
                  <ul className="mt-1.5 max-h-[min(36vh,18rem)] space-y-1 overflow-y-auto text-[11px] leading-relaxed text-slate-200/95">
                    {bonusRollup.effectLineManifestZh
                      .filter((r) => !r.conditional)
                      .map((r, i) => (
                        <li key={`u-${i}`} className="flex gap-2 border-b border-slate-800/40 pb-1.5">
                          <span className="shrink-0 tabular-nums text-slate-500">×{r.stackedWeight}</span>
                          <span>{r.lineZh}</span>
                        </li>
                      ))}
                  </ul>
                </>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
