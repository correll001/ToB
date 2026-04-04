// components/editor/SkillSetupPanel.tsx
'use client'

import React from 'react'
import { useBuildStore } from '@/stores/useBuildStore'
import type { MainSkillSlot, PassiveApplyMode } from '@/types/build'
import type { ParseStatus } from '@/types/normalized'
import type { SkillDefinition, SkillFamily } from '@/types/skillData'
import type { SkillInstance } from '@/types/skillInstance'
import {
  getBundledSkillDatasetMeta,
  getNormalizedSkillRecord,
  getSkillDefinitionById,
  listMainSlotSkillPickerRows,
  listSkillsByFamily,
} from '@/lib/runtime/runtimeSkillLookup'
import { computeSkillInstanceForMainSlot } from '@/lib/formula/collectBuildContributions'
import { useBuildComputedStats } from '@/hooks/useBuildComputedStats'
import { activeCanonicalTagSet } from '@/lib/formula/skills/tagVocabulary'
import { inferSkillCombatRole } from '@/lib/formula/skills/inferDamageRole'
import { nextSupportLinkSlot } from '@/lib/build/supportLinks'

/** PoB-style link group size cap for this editor (matches common 6L). */
const MAX_SKILL_SUPPORT_LINKS = 6

function flipLinkedSlot(slots: MainSkillSlot[], n: MainSkillSlot): MainSkillSlot[] {
  if (slots.includes(n)) return slots.filter((s) => s !== n)
  return [...slots, n].sort((a, b) => a - b)
}

function parseStatusStyles(status: ParseStatus | undefined): { label: string; className: string } {
  switch (status) {
    case 'ok':
      return { label: 'ok', className: 'bg-emerald-950/70 text-emerald-200 ring-emerald-700/50' }
    case 'partial':
      return { label: 'partial', className: 'bg-amber-950/70 text-amber-200 ring-amber-700/45' }
    case 'failed':
      return { label: 'failed', className: 'bg-rose-950/80 text-rose-200 ring-rose-700/50' }
    default:
      return { label: '—', className: 'bg-slate-900/60 text-slate-500 ring-slate-700/50' }
  }
}

function familyBadgeClass(family: SkillFamily): string {
  switch (family) {
    case 'active':
      return 'bg-sky-950/70 text-sky-200 ring-sky-700/45'
    case 'support':
      return 'bg-violet-950/70 text-violet-200 ring-violet-700/45'
    case 'passive':
      return 'bg-teal-950/70 text-teal-200 ring-teal-700/45'
    default:
      return 'bg-slate-900/70 text-slate-300 ring-slate-600/45'
  }
}

/** Tags shown in UI: only from normalized `definition.tags` (no invented labels). */
function effectiveTagsFromRecord(skillId: string | null | undefined): string[] {
  if (!skillId) return []
  const rec = getNormalizedSkillRecord(skillId)
  const raw = rec?.definition.tags ?? []
  return [...new Set(raw)]
}

function canonicalTagsForDebug(skillId: string | null | undefined): string[] {
  if (!skillId) return []
  const rec = getNormalizedSkillRecord(skillId)
  if (!rec) return []
  return [...activeCanonicalTagSet(rec.definition.tags)].sort((a, b) => a.localeCompare(b, 'en'))
}

function passiveMechanicalBadges(def: SkillDefinition | undefined): string[] {
  if (!def) return []
  const badges: string[] = []
  if (def.family !== 'passive') badges.push('非 passive 族')
  const lower = def.tags.map((t) => t.toLowerCase())
  if (lower.some((t) => t === 'aura' || t.includes('aura'))) badges.push('aura')
  if (lower.some((t) => t === 'utility' || t.includes('utility'))) badges.push('utility')
  if (def.family === 'support') badges.push('support-only')
  return badges
}

function supportCompatById(instance: SkillInstance | null): Map<string, SkillInstance['supports'][number]> {
  const m = new Map<string, SkillInstance['supports'][number]>()
  if (!instance) return m
  for (const s of instance.supports) {
    m.set(s.supportRefId, s)
  }
  return m
}

export default function SkillSetupPanel() {
  const snapshot = useBuildStore((s) => s.snapshot)
  const skills = snapshot.skills
  const passives = snapshot.passives
  const setSkill = useBuildStore((s) => s.setSkill)
  const setSkillLevel = useBuildStore((s) => s.setSkillLevel)
  const setSupportLink = useBuildStore((s) => s.setSupportLink)
  const setSupportLevel = useBuildStore((s) => s.setSupportLevel)
  const toggleSupportEnabled = useBuildStore((s) => s.toggleSupportEnabled)
  const clearSkillSupports = useBuildStore((s) => s.clearSkillSupports)
  const clearSkill = useBuildStore((s) => s.clearSkill)
  const setMainSkillEnabled = useBuildStore((s) => s.setMainSkillEnabled)
  const setPassiveSkill = useBuildStore((s) => s.setPassiveSkill)
  const setPassiveApplyMode = useBuildStore((s) => s.setPassiveApplyMode)
  const setPassiveLinkedSlots = useBuildStore((s) => s.setPassiveLinkedSlots)
  const setPassiveSkillLevel = useBuildStore((s) => s.setPassiveSkillLevel)
  const togglePassiveEnabled = useBuildStore((s) => s.togglePassiveEnabled)
  const clearPassive = useBuildStore((s) => s.clearPassive)
  const setInspectedMainSkill = useBuildStore((s) => s.setInspectedMainSkill)
  const inspectedMainSkillSlot = snapshot.meta.inspectedMainSkillSlot
  const { inspectedTargetSlot, inspectedPresentationMode, inspectedSkillDamageView } = useBuildComputedStats()

  const [debugMode, setDebugMode] = React.useState(false)

  const actives = listMainSlotSkillPickerRows()
  const supports = listSkillsByFamily('support')
  const meta = getBundledSkillDatasetMeta()

  const inspectedRow = inspectedMainSkillSlot != null ? skills[inspectedMainSkillSlot - 1] : undefined
  const inspectedName =
    inspectedRow?.skillId && getSkillDefinitionById(inspectedRow.skillId)?.name
      ? String(getSkillDefinitionById(inspectedRow.skillId)?.name)
      : inspectedRow?.skillId
        ? inspectedRow.skillId
        : '（空槽）'

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="rounded-2xl border border-slate-800/55 bg-gradient-to-b from-slate-900/35 to-slate-950/20 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-sm bg-sky-500/85 shadow-[0_0_12px_rgba(56,189,248,0.4)]"
              aria-hidden
            />
            <h2 className="text-base font-bold tracking-tight text-slate-100 md:text-lg">Skill Setup（技能組）</h2>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-[10px] uppercase tracking-wider text-slate-500">
            <input
              type="checkbox"
              className="rounded border-slate-600 bg-slate-900"
              checked={debugMode}
              onChange={(e) => setDebugMode(e.target.checked)}
            />
            Debug（canonical tags / raw requirements）
          </label>
        </div>
        <p className="mt-1.5 pl-4 text-xs text-slate-500">
          資料來自內嵌 <span className="text-slate-400">effective-runtime-bundle</span>（ss12 · v
          {meta.datasetVersionId} · {meta.versionLabel.slice(0, 12)}…）
          {meta.effectiveLayer ? ` · ${meta.effectiveLayer}` : ''}。主／輔／被動 gem 等級獨立於角色 Lv。
        </p>

        <div className="mt-3 rounded-lg border border-slate-800/80 bg-black/25 px-3 py-2.5 pl-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">目前檢視（inspected）</div>
          <div className="mt-1 text-sm text-slate-200">
            {inspectedMainSkillSlot != null ? (
              <>
                <span className="font-mono text-violet-300">Slot {inspectedMainSkillSlot}</span>
                <span className="text-slate-500"> · </span>
                <span>{inspectedName}</span>
              </>
            ) : (
              <span className="text-slate-500">未選取 — 可在主技能卡片按「檢查此技能」或下方編號</span>
            )}
          </div>
          <div className="mt-1.5 text-[10px] leading-relaxed text-slate-500">
            {inspectedTargetSlot != null ? (
              <>
                面板模式 <span className="font-mono text-slate-400">{inspectedPresentationMode}</span>
                {inspectedSkillDamageView.mode === 'damaging' ? null : (
                  <span className="text-slate-600"> · 左欄不會當成主 DPS 輸出卡（與此一致）</span>
                )}
              </>
            ) : (
              <span className="text-slate-600">左欄檢查技能區以「未選槽」狀態顯示。</span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-600">快速切槽</span>
            <button
              type="button"
              onClick={() => setInspectedMainSkill(null)}
              className="rounded-lg px-2 py-1 text-[10px] text-slate-500 underline decoration-slate-700 hover:text-slate-300"
            >
              清除
            </button>
            {([1, 2, 3, 4, 5] as const).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setInspectedMainSkill(n)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold tabular-nums ring-1 transition ${
                  inspectedMainSkillSlot === n
                    ? 'bg-violet-950/70 text-violet-200 ring-violet-600/50'
                    : 'bg-slate-900/60 text-slate-400 ring-slate-700/60 hover:text-slate-200'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {skills.map((skillRow) => {
        const selected = actives.find((s) => s.id === skillRow.skillId)
        const norm = getNormalizedSkillRecord(skillRow.skillId)
        const def = skillRow.skillId ? getSkillDefinitionById(skillRow.skillId) : undefined
        const parseStatus = norm?.parseStatus
        const ps = parseStatusStyles(parseStatus)
        const tagChips = effectiveTagsFromRecord(skillRow.skillId)
        const canonTags = debugMode ? canonicalTagsForDebug(skillRow.skillId) : []
        const dmgRole = def
          ? inferSkillCombatRole(def, skillRow.skillLevel, { parseStatus: norm?.parseStatus })
          : null

        const preview =
          skillRow.skillId && skillRow.enabled !== false
            ? computeSkillInstanceForMainSlot(skillRow, snapshot)
            : null
        const compat = supportCompatById(preview)
        const sortedLinks = [...skillRow.supports].sort((a, b) => a.linkSlot - b.linkSlot)

        const isInspected = inspectedMainSkillSlot === skillRow.slot

        return (
          <div
            key={skillRow.slot}
            className={`rounded-xl border bg-slate-950/40 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] md:p-5 ${
              isInspected
                ? 'border-violet-600/50 ring-1 ring-violet-500/25'
                : 'border-slate-800/70'
            }`}
          >
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] text-slate-600">#{skillRow.slot}</span>
                  {def ? (
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${familyBadgeClass(def.family)}`}
                    >
                      {def.family}
                    </span>
                  ) : null}
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${ps.className}`}
                  >
                    parse {ps.label}
                  </span>
                  {isInspected ? (
                    <span className="rounded-md bg-violet-950/80 px-1.5 py-0.5 text-[10px] font-bold text-violet-200 ring-1 ring-violet-600/45">
                      檢視中
                    </span>
                  ) : null}
                </div>
                <div>
                  <div className="text-lg font-semibold leading-snug text-slate-100">
                    {selected?.name ?? def?.name ?? '未配置主技能'}
                  </div>
                  {skillRow.skillId ? (
                    <div className="mt-0.5 font-mono text-[10px] text-slate-600">{skillRow.skillId}</div>
                  ) : null}
                </div>
                {norm?.warnings?.length ? (
                  <div className="rounded-md border border-amber-900/40 bg-amber-950/20 px-2 py-1.5 text-[10px] leading-relaxed text-amber-200/90">
                    <span className="font-semibold text-amber-400/95">Warnings </span>
                    {norm.warnings.join(' · ')}
                  </div>
                ) : null}
                {parseStatus === 'failed' ? (
                  <div className="rounded-md border border-rose-900/45 bg-rose-950/25 px-2 py-1.5 text-[10px] leading-relaxed text-rose-200/90">
                    此技能 normalized 狀態為 <strong>failed</strong>
                    ：下列等級列、相容性與貢獻僅反映目前 bundle 解析結果，<strong>不應</strong>假設與遊戲內完全一致。
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700/80 bg-black/20 px-2.5 py-1.5 text-[11px] text-slate-400">
                  <input
                    type="checkbox"
                    className="rounded border-slate-600 bg-slate-900"
                    checked={skillRow.enabled !== false}
                    disabled={!skillRow.skillId}
                    onChange={(e) => setMainSkillEnabled(skillRow.slot, e.target.checked)}
                  />
                  啟用組合
                </label>
                <button
                  type="button"
                  disabled={!skillRow.skillId}
                  onClick={() => setInspectedMainSkill(skillRow.slot)}
                  className="rounded-lg border border-violet-700/50 bg-violet-950/40 px-3 py-1.5 text-xs font-medium text-violet-200 hover:bg-violet-950/65 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  檢查此技能
                </button>
                <button
                  type="button"
                  onClick={() => clearSkill(skillRow.slot)}
                  className="rounded-lg border border-slate-600/80 px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-slate-800/60"
                >
                  清空
                </button>
              </div>
            </div>

            <select
              value={skillRow.skillId ?? ''}
              onChange={(e) => setSkill(skillRow.slot, e.target.value || null)}
              className="w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-500/70"
            >
              <option value="">請選擇主動技能</option>
              {actives.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-400">
                主技能 Lv（gem）
                <input
                  type="number"
                  min={1}
                  max={99}
                  disabled={!skillRow.skillId}
                  value={skillRow.skillLevel}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10)
                    setSkillLevel(skillRow.slot, Number.isFinite(v) ? v : 1)
                  }}
                  className="w-16 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-center font-mono text-sm text-slate-100 disabled:opacity-40"
                />
              </label>
              {dmgRole ? (
                <span className="text-[11px] text-slate-500">
                  公式角色: <span className="font-mono text-slate-400">{dmgRole}</span>
                </span>
              ) : null}
            </div>

            {skillRow.enabled === false ? (
              <p className="mt-3 text-[11px] text-slate-500">此槽已停用：不參與聚合／預覽／左欄 breakdown。</p>
            ) : null}

            {tagChips.length > 0 ? (
              <div className="mt-3">
                <div className="mb-1 text-[10px] font-medium uppercase tracking-wide text-slate-600">
                  Tags（effective）
                </div>
                <div className="flex max-h-28 flex-wrap gap-1 overflow-y-auto">
                  {tagChips.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-slate-700/80 bg-black/30 px-1.5 py-0.5 text-[10px] text-slate-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : skillRow.skillId ? (
              <p className="mt-3 text-[10px] text-slate-600">此技能在 normalized 中無 tags 列表。</p>
            ) : null}

            {debugMode && canonTags.length > 0 ? (
              <div className="mt-2">
                <div className="mb-1 text-[10px] font-medium uppercase tracking-wide text-slate-600">
                  Canonical（debug · tagVocabulary）
                </div>
                <div className="flex max-h-20 flex-wrap gap-1 overflow-y-auto">
                  {canonTags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-indigo-900/50 bg-indigo-950/30 px-1.5 py-0.5 text-[9px] text-indigo-200/85"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-4 border-t border-slate-800/70 pt-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  連結輔助（Link 1–{MAX_SKILL_SUPPORT_LINKS}）
                </span>
                {skillRow.skillId ? (
                  <button
                    type="button"
                    className="text-[10px] text-slate-500 underline decoration-slate-700 hover:text-slate-300"
                    onClick={() => clearSkillSupports(skillRow.slot)}
                  >
                    清除全部連結
                  </button>
                ) : null}
              </div>

              <div className="space-y-2 rounded-lg border border-slate-800/80 bg-black/20 p-2">
                {sortedLinks.map((link, idx) => {
                  const att = compat.get(link.supportSkillId)
                  const supDef = getSkillDefinitionById(link.supportSkillId)
                  return (
                    <div
                      key={`${link.linkSlot}-${link.supportSkillId}`}
                      className="flex flex-col gap-2 rounded-md border border-slate-800/60 bg-slate-950/40 p-2 sm:flex-row sm:flex-wrap sm:items-center"
                    >
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="font-mono text-slate-600">Link {idx + 1}</span>
                        <span className="text-slate-700">·</span>
                        <span className="truncate">{supDef?.name ?? link.supportSkillId}</span>
                      </div>
                      <select
                        value={link.supportSkillId}
                        disabled={!skillRow.skillId}
                        onChange={(e) => {
                          const v = e.target.value
                          setSupportLink(skillRow.slot, link.linkSlot, v || null)
                        }}
                        className="min-w-[10rem] flex-1 rounded-lg border border-slate-700/80 bg-slate-900/90 px-2 py-1.5 text-xs text-white disabled:opacity-40"
                      >
                        <option value="">（移除此連結）</option>
                        {supports.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      <label className="flex items-center gap-1 text-[11px] text-slate-500">
                        Lv
                        <input
                          type="number"
                          min={1}
                          max={99}
                          disabled={!skillRow.skillId}
                          value={link.level}
                          onChange={(e) => {
                            const v = parseInt(e.target.value, 10)
                            setSupportLevel(skillRow.slot, link.linkSlot, Number.isFinite(v) ? v : 1)
                          }}
                          className="w-14 rounded border border-slate-700 bg-slate-950 px-1 py-0.5 text-center font-mono text-xs text-slate-200 disabled:opacity-40"
                        />
                      </label>
                      <label className="flex cursor-pointer items-center gap-1 text-[11px] text-slate-500">
                        <input
                          type="checkbox"
                          className="rounded border-slate-600 bg-slate-900"
                          checked={link.enabled}
                          disabled={!skillRow.skillId}
                          onChange={() => toggleSupportEnabled(skillRow.slot, link.linkSlot)}
                        />
                        啟用
                      </label>
                      <div className="min-w-0 flex-1 text-[10px] leading-snug sm:basis-full">
                        {!skillRow.skillId ? (
                          <span className="text-slate-600">先選擇主技能</span>
                        ) : link.enabled === false ? (
                          <span className="text-slate-600">已停用 · 未送入引擎的相容評估</span>
                        ) : att ? (
                          <span className={att.applied ? 'text-emerald-300/90' : 'text-amber-200/85'}>
                            {att.applied ? '✓ applied' : '✗ skipped'}
                            {!att.applied && att.skipReason ? ` · ${att.skipReason}` : ''}
                            {att.warnings?.length ? ` · ${att.warnings.join('; ')}` : ''}
                          </span>
                        ) : (
                          <span className="text-slate-600">（無相容資料：可能非 support 或已被過濾）</span>
                        )}
                        {debugMode && att?.rawRequirementLines?.length ? (
                          <div className="mt-1 max-h-16 overflow-y-auto font-mono text-[9px] text-slate-500">
                            raw: {att.rawRequirementLines.join(' | ')}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )
                })}

                {skillRow.skillId && sortedLinks.length < MAX_SKILL_SUPPORT_LINKS ? (
                  <div className="flex flex-wrap items-center gap-2 rounded-md border border-dashed border-slate-700/80 bg-slate-950/25 px-2 py-2">
                    <span className="text-[10px] text-slate-600">新增連結</span>
                    <select
                      defaultValue=""
                      disabled={!skillRow.skillId}
                      onChange={(e) => {
                        const id = e.target.value
                        if (!id) return
                        const slot = nextSupportLinkSlot(skillRow.supports)
                        if (slot > MAX_SKILL_SUPPORT_LINKS) return
                        setSupportLink(skillRow.slot, slot, id)
                        e.target.selectedIndex = 0
                      }}
                      className="min-w-[12rem] rounded-lg border border-slate-700/80 bg-slate-900/90 px-2 py-1.5 text-xs text-white"
                    >
                      <option value="">選擇輔助 gem…</option>
                      {supports.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                {skillRow.skillId && sortedLinks.length >= MAX_SKILL_SUPPORT_LINKS ? (
                  <p className="text-[10px] text-slate-600">已達此編輯器連結上限（{MAX_SKILL_SUPPORT_LINKS}）。</p>
                ) : null}
              </div>
            </div>
          </div>
        )
      })}

      <div className="rounded-2xl border border-slate-800/55 bg-gradient-to-b from-slate-900/35 to-slate-950/20 p-5">
        <div className="mb-3 text-base font-semibold text-slate-100">被動 / 光環（global 或 linked）</div>
        <p className="mb-3 text-xs text-slate-500">
          僅 <strong className="text-slate-400">passive 族</strong> 會注入主技能实例；標籤來自 normalized effective tags。
        </p>
        <div className="space-y-3">
          {passives.map((p) => {
            const passiveList = listSkillsByFamily('passive')
            const pdef = p.skillId ? getSkillDefinitionById(p.skillId) : undefined
            const pNorm = getNormalizedSkillRecord(p.skillId)
            const pTags = effectiveTagsFromRecord(p.skillId)
            const pCanon = debugMode ? canonicalTagsForDebug(p.skillId) : []
            const mechBadges = passiveMechanicalBadges(pdef)
            const ps = parseStatusStyles(pNorm?.parseStatus)

            return (
              <div key={p.slot} className="rounded-lg border border-slate-800/50 bg-black/15 p-3">
                <div className="flex flex-wrap items-end gap-2">
                  <div className="min-w-[8rem] text-xs text-slate-500">Passive {p.slot}</div>
                  <select
                    value={p.skillId ?? ''}
                    onChange={(e) => setPassiveSkill(p.slot, e.target.value || null)}
                    className="min-w-[12rem] flex-1 rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-500/70"
                  >
                    <option value="">（無）</option>
                    {passiveList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <label className="flex cursor-pointer items-center gap-2 text-[11px] text-slate-500">
                    <input
                      type="checkbox"
                      className="rounded border-slate-600 bg-slate-900"
                      checked={p.enabled !== false}
                      disabled={!p.skillId}
                      onChange={() => togglePassiveEnabled(p.slot)}
                    />
                    啟用
                  </label>
                  <button
                    type="button"
                    onClick={() => clearPassive(p.slot)}
                    className="rounded-lg border border-slate-600/80 px-2 py-1.5 text-xs text-slate-400 hover:bg-slate-800/60"
                  >
                    清空
                  </button>
                </div>

                {p.skillId ? (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-slate-200">{pdef?.name ?? p.skillId}</span>
                    {pdef ? (
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${familyBadgeClass(pdef.family)}`}
                      >
                        {pdef.family}
                      </span>
                    ) : null}
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${ps.className}`}
                    >
                      parse {ps.label}
                    </span>
                    {mechBadges.map((b) => (
                      <span
                        key={b}
                        className="rounded-md bg-amber-950/50 px-1.5 py-0.5 text-[10px] text-amber-200/90 ring-1 ring-amber-800/40"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                ) : null}

                {pNorm?.warnings?.length ? (
                  <div className="mt-2 text-[10px] text-amber-200/85">{pNorm.warnings.join(' · ')}</div>
                ) : null}

                {pTags.length > 0 ? (
                  <div className="mt-2">
                    <div className="mb-1 text-[9px] font-medium uppercase tracking-wide text-slate-600">Tags</div>
                    <div className="flex flex-wrap gap-1">
                      {pTags.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-slate-700/80 bg-black/30 px-1.5 py-0.5 text-[10px] text-slate-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {debugMode && pCanon.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {pCanon.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-indigo-900/50 bg-indigo-950/30 px-1.5 py-0.5 text-[9px] text-indigo-200/85"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <label className="text-xs text-slate-500">
                    套用模式
                    <select
                      value={p.applyMode}
                      onChange={(e) =>
                        setPassiveApplyMode(p.slot, e.target.value as PassiveApplyMode)
                      }
                      className="ml-2 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-200"
                    >
                      <option value="global">全域（所有主技能）</option>
                      <option value="linked">僅連結槽位</option>
                    </select>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-500">
                    等級
                    <input
                      type="number"
                      min={1}
                      max={99}
                      disabled={!p.skillId}
                      value={p.skillLevel}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10)
                        setPassiveSkillLevel(p.slot, Number.isFinite(v) ? v : 1)
                      }}
                      className="w-14 rounded border border-slate-700 bg-slate-950 px-1 py-0.5 text-center font-mono text-xs text-slate-200 disabled:opacity-40"
                    />
                  </label>
                </div>
                {p.applyMode === 'linked' ? (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-slate-600">連結主槽</span>
                    {([1, 2, 3, 4, 5] as const).map((n) => (
                      <label key={n} className="flex cursor-pointer items-center gap-1 text-[11px] text-slate-400">
                        <input
                          type="checkbox"
                          className="rounded border-slate-600 bg-slate-900"
                          checked={p.linkedMainSkillSlots.includes(n)}
                          disabled={!p.skillId}
                          onChange={() =>
                            setPassiveLinkedSlots(p.slot, flipLinkedSlot(p.linkedMainSkillSlots, n))
                          }
                        />
                        {n}
                      </label>
                    ))}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
