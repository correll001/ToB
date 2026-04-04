'use client'

import type { SkillSetupPlayerSkillSummary } from '@/types/skillSetupPlayerView'
import type { ParseStatus } from '@/types/normalized'
import { SKILL_SETUP_SECTION_SKILL_SUMMARY } from '@/components/editor/skill-setup/skillSetupCopy'

type Props = {
  summary: SkillSetupPlayerSkillSummary
  /** Shown as one short line when data is incomplete (details live in Advanced). */
  parseStatus: ParseStatus | null
}

export function SkillSummaryCard({ summary, parseStatus }: Props) {
  const tagShow = summary.corePresentationTags.slice(0, 8)

  return (
    <section className="rounded-xl border border-cyan-950/50 bg-gradient-to-b from-cyan-950/15 to-slate-950/40 p-4 ring-1 ring-cyan-900/20">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-wide text-cyan-200/90">
            1 · {SKILL_SETUP_SECTION_SKILL_SUMMARY}
          </h3>
          <p className="mt-1 text-lg font-semibold leading-snug text-slate-100">
            {summary.skillName ?? '—'}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500">
            {summary.family ?? '—'} · Lv {summary.gemLevel ?? '—'}
            {summary.damageRoleLabelZh ? ` · ${summary.damageRoleLabelZh}` : ''}
          </p>
        </div>
      </div>

      {tagShow.length > 0 ? (
        <div className="mb-3 flex flex-wrap gap-1">
          {tagShow.map((t) => (
            <span
              key={t}
              className="rounded-md border border-cyan-900/40 bg-cyan-950/30 px-1.5 py-0.5 text-[10px] text-cyan-100/90"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}

      <dl className="grid gap-2 text-[11px] sm:grid-cols-2">
        <div className="flex justify-between gap-2 border-b border-slate-800/50 pb-1.5">
          <dt className="text-slate-500">魔力消耗</dt>
          <dd className="font-mono text-slate-200">{summary.manaCost ?? '—'}</dd>
        </div>
        <div className="flex justify-between gap-2 border-b border-slate-800/50 pb-1.5">
          <dt className="text-slate-500">冷卻（秒）</dt>
          <dd className="font-mono text-slate-200">{summary.cooldownSec ?? '—'}</dd>
        </div>
        <div className="flex justify-between gap-2 border-b border-slate-800/50 pb-1.5">
          <dt className="text-slate-500">
            {summary.castTimeLabelHint === 'cast_or_attack_timing' ? '施放／攻擊時間（秒）' : '施放時間（秒）'}
          </dt>
          <dd className="font-mono text-slate-200">{summary.castTimeSec ?? '—'}</dd>
        </div>
        <div className="flex justify-between gap-2 border-b border-slate-800/50 pb-1.5">
          <dt className="text-slate-500">技能傷害（表上）</dt>
          <dd className="text-right text-slate-200">{summary.baseDamageSummary ?? '—'}</dd>
        </div>
        <div className="flex justify-between gap-2 border-b border-slate-800/50 pb-1.5">
          <dt className="text-slate-500">攻速（含預覽）</dt>
          <dd className="font-mono text-slate-200">
            {summary.derivedAttackSpeedPreview != null ? summary.derivedAttackSpeedPreview : '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-b border-slate-800/50 pb-1.5">
          <dt className="text-slate-500">投射物數</dt>
          <dd className="font-mono text-slate-200">{summary.projectileCount ?? '—'}</dd>
        </div>
      </dl>

      {summary.baseDamageIsRangeMidpoint ? (
        <p className="mt-2 text-[10px] text-amber-200/80">傷害為區間時使用表中點估算。</p>
      ) : null}

      {parseStatus === 'partial' ? (
        <p className="mt-2 text-[10px] text-amber-200/85">部分資料欄位未齊，細節請見「進階詳情」。</p>
      ) : null}
    </section>
  )
}
