// components/editor/BuildStatsPanel.tsx
'use client'

import React from 'react'
import { useBuildStore } from '@/stores/useBuildStore'
import { useBuildComputedStats } from '@/hooks/useBuildComputedStats'
import type { MainSkillSlot } from '@/types/build'
import type { CalculationConfidence, InspectedSkillPresentationMode } from '@/types/skillInstance'
import type { SkillCombatRole } from '@/types/skillDamageRole'
import { getSkillDefinitionById } from '@/lib/runtime/runtimeSkillLookup'

function formatNum(n: number, maxFrac = 2) {
  return new Intl.NumberFormat('zh-TW', {
    maximumFractionDigits: maxFrac,
    minimumFractionDigits: 0,
  }).format(n)
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-2 border-b border-slate-800/30 py-0.5 last:border-0">
      <span className="shrink-0 text-slate-600">{k}</span>
      <span className="truncate text-right text-slate-400">{v}</span>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span
        className="h-px w-4 shrink-0 rounded-full bg-sky-500/70 shadow-[0_0_10px_rgba(56,189,248,0.35)]"
        aria-hidden
      />
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{children}</span>
    </div>
  )
}

function damageRoleLabel(role: SkillCombatRole): string {
  const map: Record<SkillCombatRole, string> = {
    damaging: '直接輸出（結構化傷害證據）',
    'support-only': '輔助石',
    'aura-only': '光環／範圍（無結構化命中傷害）',
    utility: '功能／詛咒／位移等',
    'summon-driver': '召喚／圖騰驅動',
    unknown: '未分類（資料不足）',
  }
  return map[role] ?? role
}

function confidenceLabel(c: CalculationConfidence): string {
  const map = { ready: '就緒', partial: '部分', unsupported: '不支援精算' } as const
  return map[c] ?? c
}

function inspectedPresentationLabel(m: InspectedSkillPresentationMode): string {
  const map: Record<InspectedSkillPresentationMode, string> = {
    damaging_ready: '輸出檢視 · 就緒（權威）',
    damaging_partial: '輸出檢視 · 部分／估算',
    role_support_only: '輔助石（無主 DPS 卡）',
    role_aura_only: '光環／範圍（無主 DPS 卡）',
    role_utility: '功能／詛咒／位移（無主 DPS 卡）',
    role_unknown: '未分類（無主 DPS 卡）',
    role_summon_driver: '召喚／圖騰驅動（無主 DPS 卡）',
    dps_blocked_instance_unsupported: '阻擋：instance 不支援精算',
    dps_blocked_effective_unsupported: '阻擋：合併層不支援精算',
    none_no_slot: '未選檢視槽',
    none_invalid_slot: '檢視槽無效',
    none_empty_slot: '檢視槽空白',
    none_disabled: '檢視槽已停用',
    none_unsupported_main_family: '主欄位不支援（如輔助作主料）',
  }
  return map[m] ?? m
}

export default function BuildStatsPanel() {
  const dirty = useBuildStore((s) => s.dirty)
  const setTitle = useBuildStore((s) => s.setTitle)
  const setLevel = useBuildStore((s) => s.setLevel)
  const snapshot = useBuildStore((s) => s.snapshot)
  const inspectedMainSkillSlot = snapshot.meta.inspectedMainSkillSlot
  const setInspectedMainSkill = useBuildStore((s) => s.setInspectedMainSkill)

  const derived = useBuildComputedStats()
  const {
    combat,
    breakdown,
    skillInstanceBreakdowns,
    inspectedTargetSlot,
    inspectedPresentationMode,
    inspectedViewSequenceKey,
    inspectedSkillBreakdown,
    inspectedSkillPrimaryInstance,
    inspectedSkillDamageView,
    inspectedSkillDebugView,
    validationErrors,
    summary,
  } = derived

  const [localTitle, setLocalTitle] = React.useState(snapshot.meta.title)
  React.useEffect(() => {
    setLocalTitle(snapshot.meta.title)
  }, [snapshot.meta.title])

  React.useEffect(() => {
    const t = window.setTimeout(() => {
      if (localTitle !== snapshot.meta.title) setTitle(localTitle)
    }, 300)
    return () => window.clearTimeout(t)
  }, [localTitle, snapshot.meta.title, setTitle])

  const level = snapshot.meta.level
  const dv = inspectedSkillDamageView
  /** Never fall back to a previous slot’s breakdown when the current frame is `none`. */
  const inspectedConfidence: CalculationConfidence | null =
    dv.mode === 'damaging' || dv.mode === 'dpsBlocked'
      ? dv.effectiveCalculationConfidence
      : dv.mode === 'nonDamaging'
        ? dv.calculationConfidence
        : null

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/55 bg-gradient-to-b from-[#111820] via-[#0b0f14] to-[#080b0f] shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"
        aria-hidden
      />

      <div className="border-b border-slate-800/80 px-4 pb-4 pt-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
            角色面板 · PoB 檢查模式
          </div>
          <span
            className={`rounded-md px-2 py-0.5 text-[10px] font-semibold tabular-nums ring-1 ${
              dirty
                ? 'bg-amber-950/60 text-amber-200 ring-amber-800/50'
                : 'bg-emerald-950/50 text-emerald-200 ring-emerald-800/40'
            }`}
          >
            {dirty ? '未儲存' : '已同步'}
          </span>
        </div>

        <div className="mt-3.5">
          <div className="relative rounded-xl border border-slate-700/50 bg-[linear-gradient(145deg,rgba(15,23,42,0.65)_0%,rgba(3,7,12,0.85)_100%)] p-3.5 shadow-inner">
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-0 flex-1">
                <label htmlFor="build-title" className="sr-only">
                  流派名稱
                </label>
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  流派名稱
                </span>
                <input
                  id="build-title"
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  placeholder="未命名流派"
                  className="w-full border-0 bg-transparent py-0.5 text-lg font-bold leading-tight text-white placeholder:text-slate-600 focus:outline-none focus:ring-0 md:text-xl"
                />
              </div>
              <div className="flex shrink-0 items-stretch rounded-lg border border-amber-900/45 bg-amber-950/20 shadow-[inset_0_1px_0_rgba(251,191,36,0.08)]">
                <div className="flex items-center px-2.5 py-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-500/95">LV</span>
                </div>
                <div className="w-px self-stretch bg-amber-900/35" aria-hidden />
                <input
                  type="number"
                  min={1}
                  max={9999}
                  aria-label="等級"
                  value={level}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10)
                    setLevel(Number.isFinite(v) ? v : 1)
                  }}
                  className="w-[4.25rem] border-0 bg-transparent px-2 py-2 text-center text-base font-bold tabular-nums text-amber-100 outline-none focus:ring-0"
                />
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-lg border border-slate-800/70 bg-black/25 px-3 py-2.5">
            <SectionLabel>Build Summary（角色公共）</SectionLabel>
            <ul className="mt-1 space-y-1.5 text-[11px] leading-relaxed text-slate-400">
              <li className="flex justify-between gap-2 border-b border-slate-800/40 pb-1.5">
                <span className="text-slate-500">Hero</span>
                <span className="truncate text-right font-medium text-slate-200">{summary.heroLabel}</span>
              </li>
              <li className="flex justify-between gap-2 border-b border-slate-800/40 pb-1.5">
                <span className="text-slate-500">Trait</span>
                <span className="truncate text-right font-medium text-slate-200">{summary.traitLabel}</span>
              </li>
              <li className="flex justify-between gap-2 border-b border-slate-800/40 pb-1.5">
                <span className="text-slate-500">遺物</span>
                <span className="truncate text-right font-medium text-slate-200">{summary.relicLabel}</span>
              </li>
              <li className="flex justify-between gap-2 border-b border-slate-800/40 pb-1.5">
                <span className="text-slate-500">特性</span>
                <span className="truncate text-right font-medium text-slate-200">{summary.specialtyLabel}</span>
              </li>
              <li className="flex justify-between gap-2 border-b border-slate-800/40 pb-1.5">
                <span className="text-slate-500">裝備</span>
                <span className="truncate text-right font-medium text-slate-200">{summary.gearEquippedLine}</span>
              </li>
              <li className="flex justify-between gap-2 border-b border-slate-800/40 pb-1.5">
                <span className="text-slate-500">神格石板</span>
                <span className="max-w-[12rem] truncate text-right text-slate-300">{summary.divinitySummaryLine}</span>
              </li>
              <li className="flex justify-between gap-2 pt-0.5 text-slate-500">
                <span>神格補充</span>
                <span className="max-w-[12rem] truncate text-right">{summary.divinityTextLine}</span>
              </li>
            </ul>

            <div className="mt-3 border-t border-slate-800/60 pt-3">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">屬性與資源（全流派聚合）</div>
              <dl className="grid grid-cols-2 gap-2">
                {(
                  [
                    ['力量', combat.strength],
                    ['敏捷', combat.dexterity],
                    ['智慧', combat.intelligence],
                    ['HP', combat.hp],
                    ['MP', combat.mp],
                  ] as const
                ).map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-slate-800/80 bg-slate-950/45 px-2.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                  >
                    <dt className="text-[10px] text-slate-500">{label}</dt>
                    <dd className="mt-0.5 font-mono text-sm font-medium tabular-nums text-slate-200">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-800/80 px-4 py-4">
        <SectionLabel>檢查技能（主視角）</SectionLabel>
        <p className="mb-3 text-[10px] leading-relaxed text-slate-600">
          下列<strong className="text-slate-400">傷害大數字</strong>僅在「可視為直接輸出」的技能上顯示；光環／詛咒／位移等改為機制說明，不把多顆主技能混成一條 DPS。
        </p>

        <div className="mb-3 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setInspectedMainSkill(null)}
            className="rounded-md px-2 py-1 text-[10px] text-slate-500 ring-1 ring-slate-800 hover:text-slate-300"
          >
            清除
          </button>
          {snapshot.skills.map((row) => {
            const def = row.skillId ? getSkillDefinitionById(row.skillId) : undefined
            const label = row.skillId ? (def?.name ?? row.skillId).slice(0, 14) : '空'
            const isOn = inspectedMainSkillSlot === row.slot
            return (
              <button
                key={row.slot}
                type="button"
                onClick={() => setInspectedMainSkill(row.slot)}
                className={`max-w-[9.5rem] truncate rounded-md px-2 py-1 text-left text-[10px] font-semibold ring-1 transition ${
                  isOn
                    ? 'bg-violet-950/75 text-violet-100 ring-violet-600/50'
                    : 'bg-black/35 text-slate-500 ring-slate-800 hover:text-slate-300'
                }`}
                title={def?.name ?? row.skillId ?? '空槽'}
              >
                <span className="font-mono text-slate-600">{row.slot}</span> {label}
                {row.enabled === false ? <span className="text-slate-600"> · off</span> : null}
              </button>
            )
          })}
        </div>

        <div className="mb-2 rounded-md border border-slate-800/60 bg-black/20 px-2.5 py-1.5 font-mono text-[9px] text-slate-600">
          <span className="text-slate-500">Inspected 解析</span> · {inspectedSkillDebugView.resolution}
          {inspectedTargetSlot != null ? ` · meta 槽 ${inspectedTargetSlot}` : ' · meta 槽 ∅'}
          {inspectedSkillDebugView.resolvedSlot != null
            ? ` · core 槽 ${inspectedSkillDebugView.resolvedSlot}`
            : ''}
          <span className="text-slate-500"> · </span>
          <span className="text-slate-400">{inspectedPresentationMode}</span>
          <span className="text-slate-600">
            {' '}
            · 貢獻列 scoped {inspectedSkillDebugView.inspectedFilteredContributionCount} / build{' '}
            {inspectedSkillDebugView.buildWideContributionCount}
          </span>
        </div>

        {inspectedSkillPrimaryInstance && inspectedSkillBreakdown ? (
          <div className="mb-3 rounded-lg border border-slate-800/70 bg-slate-950/40 px-3 py-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] text-violet-400/90">Slot {inspectedSkillBreakdown.mainSlot}</span>
              <span className="rounded-md bg-slate-900/80 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300 ring-1 ring-slate-700/70">
                {inspectedSkillPrimaryInstance.activeDefinition.family}
              </span>
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase ring-1 ${
                  inspectedSkillBreakdown.parseStatus === 'ok'
                    ? 'bg-emerald-950/60 text-emerald-200 ring-emerald-800/40'
                    : inspectedSkillBreakdown.parseStatus === 'partial'
                      ? 'bg-amber-950/60 text-amber-200 ring-amber-800/40'
                      : 'bg-rose-950/70 text-rose-200 ring-rose-800/45'
                }`}
              >
                parse {inspectedSkillBreakdown.parseStatus ?? '—'}
              </span>
              <span className="text-[10px] text-slate-500">
                {damageRoleLabel(inspectedSkillBreakdown.damageRole)}{' '}
                <span className="font-mono text-slate-600">({inspectedSkillBreakdown.damageRole})</span>
              </span>
              {inspectedConfidence != null ? (
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase ring-1 ${
                    inspectedConfidence === 'ready'
                      ? 'bg-cyan-950/55 text-cyan-200 ring-cyan-800/40'
                      : inspectedConfidence === 'partial'
                        ? 'bg-amber-950/50 text-amber-200 ring-amber-800/35'
                        : 'bg-slate-900/70 text-slate-400 ring-slate-700/50'
                  }`}
                >
                  {confidenceLabel(inspectedConfidence)}
                </span>
              ) : null}
              <span
                className="rounded-md bg-slate-900/75 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-400 ring-1 ring-slate-700/60"
                title="4F-7 產品分流"
              >
                {inspectedPresentationLabel(inspectedPresentationMode)}
              </span>
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-100">{inspectedSkillBreakdown.activeName}</div>
            <div className="mt-0.5 font-mono text-[10px] text-slate-600">{inspectedSkillBreakdown.activeId}</div>
            <div className="mt-1 text-[10px] text-slate-500">
              gem Lv<span className="font-mono text-slate-400">{inspectedSkillBreakdown.level}</span>
              {inspectedSkillBreakdown.structuralDamageEvidence ? (
                <span className="ml-2 text-emerald-500/80">· 具結構化傷害欄位／modifier</span>
              ) : (
                <span className="ml-2 text-slate-600">· 無結構化傷害證據</span>
              )}
            </div>
            {inspectedSkillPrimaryInstance.activeDefinition.tags.length ? (
              <div className="mt-2 flex max-h-16 flex-wrap gap-1 overflow-y-auto">
                {inspectedSkillPrimaryInstance.activeDefinition.tags.slice(0, 20).map((t) => (
                  <span
                    key={t}
                    className="rounded border border-slate-800/80 bg-black/25 px-1 py-0.5 text-[9px] text-slate-500"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
            {inspectedSkillBreakdown.recordWarnings?.length ? (
              <div className="mt-2 rounded border border-amber-900/35 bg-amber-950/15 px-2 py-1 text-[10px] text-amber-200/90">
                <span className="font-semibold text-amber-400/95">Record warnings · </span>
                {inspectedSkillBreakdown.recordWarnings.join(' · ')}
              </div>
            ) : null}
            {inspectedSkillPrimaryInstance.warnings.length ? (
              <div className="mt-2 text-[10px] text-amber-200/80">
                <span className="font-semibold text-slate-500">Instance · </span>
                {inspectedSkillPrimaryInstance.warnings.join(' · ')}
              </div>
            ) : null}
            {inspectedSkillBreakdown.parseStatus === 'failed' ? (
              <div className="mt-2 rounded border border-rose-900/40 bg-rose-950/20 px-2 py-1.5 text-[10px] text-rose-200/90">
                解析狀態為 failed：勿假設貢獻／DPS 已與遊戲完全一致。
              </div>
            ) : null}
          </div>
        ) : dv.mode === 'none' ? (
          <div className="mb-3 rounded-lg border border-slate-800/70 bg-black/20 px-3 py-2 text-[11px] text-slate-500">
            <p className="font-semibold text-slate-400">
              {inspectedPresentationLabel(inspectedPresentationMode)}
            </p>
            <p className="mt-1 leading-relaxed">
              {dv.reason === 'no_slot'
                ? '請選擇要檢查的主技能槽（上方快速切換或技能頁）。'
                : dv.reason === 'invalid_slot'
                  ? 'inspected 槽位無效（必須為 1–5）。'
                  : dv.reason === 'disabled'
                    ? inspectedTargetSlot != null
                      ? `槽 ${inspectedTargetSlot} 主技能組已停用。`
                      : '此槽主技能組已停用。'
                    : dv.reason === 'unsupported_main_family'
                      ? inspectedTargetSlot != null
                        ? `槽 ${inspectedTargetSlot}：非主技能家族（例如輔助石放在主連結），無法作為檢查主技能。`
                        : '此槽非主技能家族（例如輔助石放在主連結），無法作為檢查主技能。'
                      : dv.reason === 'empty_slot'
                        ? inspectedTargetSlot != null
                          ? `槽 ${inspectedTargetSlot} 尚未配置技能。`
                          : '此槽無有效主技能或未選技能。'
                        : '此槽無有效主技能或未選技能。'}
            </p>
            <p className="mt-2 text-[10px] text-slate-600">
              此狀態不顯示單技能 DPS；切換檢視槽時主卡會清空，不沿用上一技能數字。
            </p>
          </div>
        ) : null}

        <div key={inspectedViewSequenceKey}>
        {dv.mode === 'damaging' ? (
          <>
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
              {inspectedPresentationMode === 'damaging_ready'
                ? '此技能輸出（Build + 僅此槽技能貢獻 · 就緒）'
                : '此技能輸出（部分／估算 · 非完整權威）'}
            </div>
            {inspectedSkillPrimaryInstance ? (
              <p className="mb-2 text-[10px] text-slate-500">
                技能實例信心 <span className="font-mono">{confidenceLabel(inspectedSkillPrimaryInstance.calculationConfidence)}</span>
                {' · '}
                合併有效 <span className="font-mono">{confidenceLabel(dv.effectiveCalculationConfidence)}</span>
                {inspectedPresentationMode === 'damaging_partial' ? (
                  <span className="text-amber-200/80"> · 請一併閱讀下方 derive fallback</span>
                ) : null}
              </p>
            ) : null}
            {dv.damagingPresentation === 'estimate' ? (
              <div className="mb-2 rounded-md border border-amber-800/45 bg-amber-950/25 px-2.5 py-2 text-[10px] leading-relaxed text-amber-100/90">
                <span className="font-semibold text-amber-200/95">缺失／警告 · </span>
                effective {confidenceLabel(dv.effectiveCalculationConfidence)}：等級列、derive fallback、或解析可能使數字與實機有落差。請同見下方 fallback 與技能 breakdown。
              </div>
            ) : null}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="rounded-xl border border-violet-900/40 bg-[linear-gradient(180deg,rgba(76,29,149,0.25)_0%,rgba(3,7,18,0.65)_100%)] px-3 py-3 shadow-[inset_0_1px_0_rgba(167,139,250,0.08)]">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-violet-300/85">檢查 DPS</div>
                <div className="mt-1.5 font-mono text-xl font-bold tabular-nums leading-none tracking-tight text-violet-100">
                  {formatNum(dv.combat.dps)}
                </div>
              </div>
              <div className="rounded-xl border border-violet-900/40 bg-[linear-gradient(180deg,rgba(76,29,149,0.25)_0%,rgba(3,7,18,0.65)_100%)] px-3 py-3 shadow-[inset_0_1px_0_rgba(167,139,250,0.08)]">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-violet-300/85">攻速</div>
                <div className="mt-1.5 font-mono text-xl font-bold tabular-nums leading-none tracking-tight text-violet-100">
                  {formatNum(dv.combat.attackSpeed)} <span className="text-sm font-semibold text-violet-300/70">/s</span>
                </div>
              </div>
              <div className="rounded-xl border border-violet-900/40 bg-[linear-gradient(180deg,rgba(76,29,149,0.25)_0%,rgba(3,7,18,0.65)_100%)] px-3 py-3 shadow-[inset_0_1px_0_rgba(167,139,250,0.08)]">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-violet-300/85">每下命中</div>
                <div className="mt-1.5 font-mono text-xl font-bold tabular-nums leading-none tracking-tight text-violet-100">
                  {formatNum(dv.combat.hitDamage, 0)}
                </div>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-slate-500 sm:grid-cols-3">
              <Row k="Mana（等級列）" v={dv.manaCost != null ? String(dv.manaCost) : '—'} />
              <Row k="Cooldown s" v={dv.cooldownSec != null ? String(dv.cooldownSec) : '—'} />
              <Row k="Cast time s" v={dv.castTimeSec != null ? String(dv.castTimeSec) : '—'} />
            </div>
            <p className="mt-2 text-[10px] text-slate-600">
              支援：已套用 <span className="font-mono text-slate-400">{dv.supportApplied}</span> · 略過{' '}
              <span className="font-mono text-slate-400">{dv.supportSkipped}</span>
            </p>
            <p className="mt-2 rounded-md border border-slate-800/50 bg-black/20 px-2 py-1.5 text-[9px] leading-relaxed text-slate-500">
              <span className="font-semibold text-slate-400">衍生戰鬥（4E-4）</span> · 規則池{' '}
              <span className="font-mono text-slate-400">{dv.skillBreakdown.derivedRulesPrimarySource}</span> · 層級信心{' '}
              <span className="font-mono text-slate-400">{confidenceLabel(dv.skillBreakdown.derivedCombatConfidence)}</span>
              <span className="block mt-0.5 text-slate-600">
                命中基礎 · {dv.skillBreakdown.hitDamageBaseNote}
              </span>
              {dv.skillBreakdown.derivedCombatFallbacks.length ? (
                <span className="mt-1 block font-mono text-[8px] text-amber-200/75">
                  fallback ·{' '}
                  {dv.skillBreakdown.derivedCombatFallbacks
                    .slice(0, 8)
                    .map((f) => `${f.key}:${f.reason}`)
                    .join(' · ')}
                  {dv.skillBreakdown.derivedCombatFallbacks.length > 8
                    ? ` · +${dv.skillBreakdown.derivedCombatFallbacks.length - 8}`
                    : ''}
                </span>
              ) : null}
            </p>
          </>
        ) : dv.mode === 'dpsBlocked' ? (
          <div className="rounded-lg border border-rose-900/40 bg-rose-950/15 px-3 py-2.5">
            <div className="text-[11px] font-semibold text-rose-200/95">
              {inspectedPresentationLabel(inspectedPresentationMode)}{' '}
              <span className="font-mono text-[10px] font-normal text-slate-500">
                · {damageRoleLabel(dv.role)} ({dv.blockReason})
              </span>
            </div>
            <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
              role <span className="font-mono text-slate-400">{dv.role}</span> · tags{' '}
              <span className="font-mono text-slate-500">
                {dv.tags.slice(0, 6).join('、') || '—'}
              </span>
              <span className="block mt-0.5">
                family <span className="font-mono text-slate-400">{dv.family}</span> · instance{' '}
                {confidenceLabel(dv.calculationConfidence)} · effective{' '}
                {confidenceLabel(dv.effectiveCalculationConfidence)}
              </span>
            </p>
            <ul className="mt-2 list-inside list-disc space-y-0.5 text-[10px] text-slate-400">
              {dv.whyNoDpsLines.map((line, i) => (
                <li key={`dps-block-why-${i}-${line.slice(0, 48)}`}>{line}</li>
              ))}
            </ul>
            {dv.missingDataHints.length ? (
              <div className="mt-2 rounded border border-slate-800/60 bg-black/20 px-2 py-1.5">
                <div className="text-[9px] font-bold uppercase text-slate-500">資料缺口提示</div>
                <ul className="mt-1 list-inside list-disc text-[9px] text-slate-500">
                  {dv.missingDataHints.map((h, i) => (
                    <li key={`dps-block-hint-${i}-${h.slice(0, 48)}`}>{h}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {dv.supportsSkippedDetail.length ? (
              <div className="mt-2">
                <div className="text-[9px] font-bold uppercase text-slate-600">略過的輔助</div>
                <ul className="mt-1 space-y-0.5 text-[9px] text-slate-500">
                  {dv.supportsSkippedDetail.map((s) => (
                    <li key={s.id}>
                      <span className="font-mono text-slate-600">{s.name}</span>
                      {s.skipReason ? <span className="text-slate-600"> — {s.skipReason}</span> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {dv.supportsAppliedDetail.length ? (
              <div className="mt-2 text-[9px] text-slate-600">
                已套用輔助 ·{' '}
                {dv.supportsAppliedDetail.map((s) => s.name).join('、') || '—'}
              </div>
            ) : null}
            {dv.tags.length ? (
              <div className="mt-2 flex flex-wrap gap-1">
                {dv.tags.slice(0, 16).map((t) => (
                  <span
                    key={t}
                    className="rounded border border-slate-800/80 bg-black/25 px-1 py-0.5 text-[8px] text-slate-500"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
            {dv.otherMainSkills.length ? (
              <div className="mt-2">
                <div className="text-[9px] font-bold uppercase text-slate-600">其他主技能槽</div>
                <ul className="mt-1 space-y-0.5 text-[10px] text-slate-400">
                  {dv.otherMainSkills.map((o) => (
                    <li key={o.slot}>
                      <span className="font-mono text-slate-600">{o.slot}</span> {o.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {dv.passiveAuraLines.length ? (
              <div className="mt-2">
                <div className="text-[9px] font-bold uppercase text-slate-600">被動／光環 · 全域 vs 連結槽</div>
                <ul className="mt-1 list-inside list-disc text-[10px] text-slate-500">
                  {dv.passiveAuraLines.map((line, i) => (
                    <li key={`dpsblk-passive-${i}-${line.slice(0, 32)}`}>{line}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {dv.modifierLines.length ? (
              <div className="mt-2 max-h-20 overflow-y-auto font-mono text-[8px] text-slate-500">
                {dv.modifierLines.slice(0, 8).map((l) => (
                  <div key={l}>{l}</div>
                ))}
              </div>
            ) : null}
            <p className="mt-2 text-[10px] text-slate-600">
              支援計數：套用 {dv.supportApplied} · 略過 {dv.supportSkipped}
            </p>
          </div>
        ) : dv.mode === 'nonDamaging' ? (
          <div className="rounded-lg border border-amber-900/35 bg-amber-950/10 px-3 py-2.5">
            <div className="text-[11px] font-semibold text-amber-200/95">
              {inspectedPresentationLabel(inspectedPresentationMode)}
            </div>
            <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
              role <span className="font-mono text-slate-400">{dv.role}</span> · family{' '}
              <span className="font-mono text-slate-400">{dv.family}</span> · calculationConfidence{' '}
              {confidenceLabel(dv.calculationConfidence)}
            </p>
            <ul className="mt-2 list-inside list-disc space-y-0.5 text-[10px] text-slate-400">
              {dv.whyNoDpsLines.map((line, i) => (
                <li key={`non-dmg-why-${i}-${line.slice(0, 48)}`}>{line}</li>
              ))}
            </ul>
            {dv.tags.length ? (
              <div className="mt-2 flex flex-wrap gap-1">
                {dv.tags.slice(0, 16).map((t) => (
                  <span
                    key={t}
                    className="rounded border border-slate-800/80 bg-black/25 px-1 py-0.5 text-[8px] text-slate-500"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
            {dv.missingDataHints.length ? (
              <div className="mt-2 rounded border border-slate-800/60 bg-black/20 px-2 py-1.5">
                <div className="text-[9px] font-bold uppercase text-slate-500">資料缺口提示</div>
                <ul className="mt-1 list-inside list-disc text-[9px] text-slate-500">
                  {dv.missingDataHints.map((h, i) => (
                    <li key={`non-dmg-hint-${i}-${h.slice(0, 48)}`}>{h}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {dv.otherMainSkills.length ? (
              <div className="mt-2">
                <div className="text-[9px] font-bold uppercase text-slate-600">可能互動的主技能槽</div>
                <ul className="mt-1 space-y-0.5 text-[10px] text-slate-400">
                  {dv.otherMainSkills.map((o) => (
                    <li key={o.slot}>
                      <span className="font-mono text-slate-600">{o.slot}</span> {o.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {dv.passiveAuraLines.length ? (
              <div className="mt-2">
                <div className="text-[9px] font-bold uppercase text-slate-600">被動／光環如何影響此槽</div>
                <ul className="mt-1 list-inside list-disc text-[10px] text-slate-500">
                  {dv.passiveAuraLines.map((line, i) => (
                    <li key={`${i}-${line.slice(0, 24)}`}>{line}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {dv.modifierLines.length ? (
              <div className="mt-2">
                <div className="text-[9px] font-bold uppercase text-slate-600">技能定義 modifiers（節錄）</div>
                <div className="mt-1 max-h-24 overflow-y-auto font-mono text-[9px] leading-relaxed text-slate-500">
                  {dv.modifierLines.map((l) => (
                    <div key={l}>{l}</div>
                  ))}
                </div>
              </div>
            ) : null}
            {dv.requirementLines.length ? (
              <div className="mt-2">
                <div className="text-[9px] font-bold uppercase text-slate-600">需求／概述節錄</div>
                <div className="mt-1 max-h-20 overflow-y-auto text-[9px] text-slate-500">
                  {dv.requirementLines.map((l, i) => (
                    <div key={`${i}-${l.slice(0, 40)}`}>{l}</div>
                  ))}
                </div>
              </div>
            ) : null}
            {dv.supportsSkippedDetail.length ? (
              <div className="mt-2">
                <div className="text-[9px] font-bold uppercase text-slate-600">略過的輔助</div>
                <ul className="mt-1 space-y-0.5 text-[9px] text-slate-500">
                  {dv.supportsSkippedDetail.map((s) => (
                    <li key={s.id}>
                      <span className="font-mono text-slate-600">{s.name}</span>
                      {s.skipReason ? <span className="text-slate-600"> — {s.skipReason}</span> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <p className="mt-2 text-[10px] text-slate-600">
              支援狀態：套用 {dv.supportApplied} · 略過 {dv.supportSkipped}
              {dv.supportsAppliedDetail.length ? (
                <span className="block mt-0.5 text-slate-600">
                  已套用：{dv.supportsAppliedDetail.map((s) => s.name).join('、')}
                </span>
              ) : null}
            </p>
          </div>
        ) : null}
        </div>

        {inspectedSkillBreakdown ? (
          <div className="mt-4 rounded-lg border border-slate-800/70 bg-black/20 px-3 py-2.5">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">技能 breakdown</div>
            <Row
              k="等級列來源"
              v={`${inspectedSkillBreakdown.levelRow.source} · modifiers ${inspectedSkillBreakdown.levelRow.modifierCount} · partial=${inspectedSkillBreakdown.levelRow.partial}`}
            />
            <Row
              k="Post-20 ×"
              v={`${formatNum(inspectedSkillBreakdown.post20.multiplier, 4)} (21–30 ${inspectedSkillBreakdown.post20.tier21to30PerLevelMorePct}% / 31+ ${inspectedSkillBreakdown.post20.tier31PlusPerLevelMorePct}%)${inspectedSkillBreakdown.post20.disabledByMechanic ? ' · disabled' : ''}`}
            />
            <Row k="Passive 注入（modifier 筆數）" v={String(inspectedSkillBreakdown.passiveModifierCount)} />
            <details className="mt-2 rounded-md border border-slate-800/60 bg-black/15 px-2 py-1.5">
              <summary className="cursor-pointer text-[9px] font-semibold uppercase text-slate-500">
                Trace（可稽核 · 無臆測數值）
              </summary>
              <div className="mt-2 space-y-2 text-[9px] text-slate-500">
                <div>
                  <div className="font-semibold text-slate-600">支援套用</div>
                  <div className="font-mono">
                    {inspectedSkillBreakdown.trace.supportsAcceptedIds.length
                      ? inspectedSkillBreakdown.trace.supportsAcceptedIds.join(', ')
                      : '—'}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-slate-600">支援拒絕</div>
                  <ul className="list-inside list-disc font-mono">
                    {inspectedSkillBreakdown.trace.supportsRejected.map((r) => (
                      <li key={r.id}>
                        {r.id}
                        {r.reason ? ` · ${r.reason}` : ''}
                      </li>
                    ))}
                    {inspectedSkillBreakdown.trace.supportsRejected.length === 0 ? <li>—</li> : null}
                  </ul>
                </div>
                <div>
                  <div className="font-semibold text-slate-600">被動注入（stat）</div>
                  <ul className="max-h-20 list-inside list-disc overflow-y-auto font-mono">
                    {inspectedSkillBreakdown.trace.passiveInjects.map((p, i) => (
                      <li key={`${p.refId}-${i}`}>
                        {p.refId}: {p.operation} {p.stat}
                      </li>
                    ))}
                    {inspectedSkillBreakdown.trace.passiveInjects.length === 0 ? <li>—</li> : null}
                  </ul>
                </div>
                <Row
                  k="Post-20 規則"
                  v={
                    inspectedSkillBreakdown.trace.post20Applied
                      ? `已套用${inspectedSkillBreakdown.trace.post20RefId ? ` · ${inspectedSkillBreakdown.trace.post20RefId}` : ''}`
                      : '未套用'
                  }
                />
              </div>
            </details>
            <div className="mt-2 text-[9px] font-semibold uppercase text-slate-600">支援 applied / skipped</div>
            <ul className="mt-1 max-h-28 space-y-0.5 overflow-y-auto text-[9px] text-slate-500">
              {inspectedSkillBreakdown.supports.map((u) => (
                <li key={u.id}>
                  {u.applied ? '✓' : '✗'} {u.name} Lv{u.gemLevel}
                  {!u.applied && u.skipReason ? ` — ${u.skipReason}` : ''}
                </li>
              ))}
            </ul>
            <div className="mt-2 text-[9px] font-semibold uppercase text-slate-600">引擎 warnings</div>
            <div className="max-h-20 overflow-y-auto font-mono text-[9px] text-amber-200/85">
              {inspectedSkillBreakdown.engineWarnings.length
                ? inspectedSkillBreakdown.engineWarnings.join(' · ')
                : '—'}
            </div>
          </div>
        ) : null}

        <details className="mt-4 rounded-lg border border-sky-900/35 bg-sky-950/10 px-3 py-2">
          <summary className="cursor-pointer select-none text-[11px] font-medium text-sky-300/85">
            全流派聚合戰鬥（次要 · 含所有啟用技能）
          </summary>
          <p className="mt-2 text-[10px] text-slate-600">
            此區為舊版「整_build」視角，疊加所有技能貢獻；規劃單一技能時請以上方紫色<strong className="text-violet-400/90">檢查 DPS</strong>為主。
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <div>
              <div className="text-[9px] uppercase text-slate-600">聚合 DPS</div>
              <div className="font-mono text-sm text-slate-300">{formatNum(combat.dps)}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase text-slate-600">聚合 攻速</div>
              <div className="font-mono text-sm text-slate-300">{formatNum(combat.attackSpeed)}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase text-slate-600">聚合 每下</div>
              <div className="font-mono text-sm text-slate-300">{formatNum(combat.hitDamage, 0)}</div>
            </div>
          </div>
        </details>

        {skillInstanceBreakdowns.length > 1 ? (
          <details className="mt-2 rounded-lg border border-slate-800/60 bg-slate-950/25 px-3 py-2">
            <summary className="cursor-pointer select-none text-[10px] font-medium text-slate-500">
              其他主技能槽（快速總覽）
            </summary>
            <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto text-[10px] text-slate-500">
              {skillInstanceBreakdowns.map((s) => (
                <li key={s.mainSlot}>
                  <button
                    type="button"
                    className={`text-left ${inspectedMainSkillSlot === s.mainSlot ? 'text-violet-300' : 'hover:text-slate-400'}`}
                    onClick={() => setInspectedMainSkill(s.mainSlot as MainSkillSlot)}
                  >
                    <span className="font-mono">{s.mainSlot}</span> {s.activeName} · {damageRoleLabel(s.damageRole)}
                  </button>
                </li>
              ))}
            </ul>
          </details>
        ) : null}

        <details className="mt-2 rounded-lg border border-slate-800/60 bg-slate-950/30 px-3 py-2">
          <summary className="cursor-pointer select-none text-[11px] font-medium text-slate-500">
            公式拆解（聚合 · debug）
          </summary>
          <div className="mt-2 max-h-48 space-y-0.5 overflow-y-auto font-mono text-[10px] leading-relaxed text-slate-500">
            <Row k="參與筆數" v={String(breakdown.contributionCount)} />
            <Row k="LV" v={String(breakdown.level)} />
            <Row k="屬性 力/敏/智（合計）" v={`${breakdown.strTotal} / ${breakdown.dexTotal} / ${breakdown.intTotal}`} />
            <Row k="傷害（inc 前）" v={formatNum(breakdown.damageBeforePct, 1)} />
            <Row
              k="泛用傷害 %（僅「傷害」標籤）"
              v={`${formatNum(breakdown.damagePctGeneric, 1)}%`}
            />
            <Row k="法術傷害 %" v={`${formatNum(breakdown.spellDamagePct, 1)}%`} />
            <Row k="攻擊傷害 %" v={`${formatNum(breakdown.attackDamagePct, 1)}%`} />
            <Row k="近戰傷害 %" v={`${formatNum(breakdown.meleeDamagePct, 1)}%`} />
            <Row k="投射物傷害 %" v={`${formatNum(breakdown.projectileDamagePct, 1)}%`} />
            <Row k="元素傷害 %（火／冰／閃總稱桶）" v={`${formatNum(breakdown.elementalDamagePct, 1)}%`} />
            <Row
              k="物／腐／元／持續（加總，含元素總稱）"
              v={`${formatNum(breakdown.damagePctTypedPhysicalElemental, 1)}%`}
            />
            <Row k="召喚物相關（加總）" v={`${formatNum(breakdown.damagePctMinion, 1)}%`} />
            <Row k="引導技能傷害 %（聚合）" v={`${formatNum(breakdown.channeledDamagePct, 1)}%`} />
            <Row
              k="引導傷害已併入有效遞增"
              v={breakdown.channeledDamageIncludedInEffective ? '是' : '否'}
            />
            <Row k="有效遞增 %（本技能路徑）" v={`${formatNum(breakdown.damagePctTotal, 1)}%`} />
            <Row k="More 乘數" v={formatNum(breakdown.moreDamageMult, 3)} />
            <Row k="攻速基礎 / 加成% / 最終" v={`${formatNum(breakdown.baseAttackSpeed, 2)} / ${formatNum(breakdown.attackSpeedPctTotal, 1)}% / ${formatNum(breakdown.attackSpeedFinal, 2)}`} />
            <Row k="derive 規則來源" v={breakdown.derivedRulesPrimarySource} />
            <Row k="derive 層級信心" v={confidenceLabel(breakdown.derivedCombatConfidence)} />
            <Row k="命中基礎註記" v={breakdown.hitDamageBaseNote} />
            <Row
              k="derive fallbacks"
              v={
                breakdown.derivedCombatFallbacks.length
                  ? `${breakdown.derivedCombatFallbacks.length} 筆（見各條 key:reason）`
                  : '—'
              }
            />
          </div>
        </details>
      </div>

      <div className="px-4 py-4">
        <SectionLabel>配置檢查</SectionLabel>
        {validationErrors.length === 0 ? (
          <p className="mt-2 rounded-lg border border-emerald-900/35 bg-emerald-950/15 px-3 py-2 text-xs text-emerald-300/95">
            結構完整，可匯出流派碼。
          </p>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {validationErrors.map((err) => (
              <li
                key={err}
                className="rounded-lg border border-amber-900/45 bg-amber-950/25 px-2.5 py-1.5 text-xs text-amber-200/90"
              >
                {err}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
