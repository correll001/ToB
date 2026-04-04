// components/editor/SkillSetupPanel.tsx
'use client'

import { useBuildStore } from '@/stores/useBuildStore'
import {
  getBundledSkillDatasetMeta,
  getNormalizedSkillRecord,
  listMainSlotSkillPickerRows,
  listSkillsByFamily,
} from '@/lib/runtime/runtimeSkillLookup'

export default function SkillSetupPanel() {
  const skills = useBuildStore((s) => s.snapshot.skills)
  const passives = useBuildStore((s) => s.snapshot.passives)
  const setSkill = useBuildStore((s) => s.setSkill)
  const setSkillSupports = useBuildStore((s) => s.setSkillSupports)
  const clearSkill = useBuildStore((s) => s.clearSkill)
  const setPassiveSkill = useBuildStore((s) => s.setPassiveSkill)
  const clearPassive = useBuildStore((s) => s.clearPassive)

  const actives = listMainSlotSkillPickerRows()
  const supports = listSkillsByFamily('support')
  const meta = getBundledSkillDatasetMeta()

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="rounded-2xl border border-slate-800/55 bg-gradient-to-b from-slate-900/35 to-slate-950/20 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 shrink-0 rounded-sm bg-sky-500/85 shadow-[0_0_12px_rgba(56,189,248,0.4)]"
            aria-hidden
          />
          <h2 className="text-base font-bold tracking-tight text-slate-100 md:text-lg">Skill Setup</h2>
        </div>
        <p className="mt-1.5 pl-4 text-xs text-slate-500">
          技能清單來自內嵌 <span className="text-slate-400">effective-runtime-bundle</span>（ss12 · v
          {meta.datasetVersionId} · {meta.versionLabel.slice(0, 12)}…）
          {meta.effectiveLayer ? ` · ${meta.effectiveLayer}` : ''}。更新請執行{' '}
          <code className="text-slate-400">npm run data:import:effective</code>。
        </p>
      </div>

      {skills.map((skillRow) => {
        const selected = actives.find((s) => s.id === skillRow.skillId)
        const norm = getNormalizedSkillRecord(skillRow.skillId)

        return (
          <div
            key={skillRow.slot}
            className="rounded-xl border border-slate-800/70 bg-slate-950/40 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] md:p-5"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-base font-semibold text-slate-100">Skill Slot {skillRow.slot}</div>
                <div className="text-sm text-slate-500">
                  目前：{selected?.name ?? '未配置'}
                  {norm && norm.parseStatus !== 'ok' ? (
                    <span className="ml-2 rounded bg-amber-900/50 px-1 py-0.5 text-[10px] text-amber-200">
                      {norm.parseStatus}
                    </span>
                  ) : null}
                </div>
                {norm?.warnings?.length ? (
                  <div className="mt-1 max-h-16 overflow-y-auto text-[10px] text-amber-200/85">
                    {norm.warnings.join(' · ')}
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => clearSkill(skillRow.slot)}
                className="rounded-lg border border-slate-600/80 px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-slate-800/60"
              >
                清空
              </button>
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

            <div className="mt-4">
              <div className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                輔助技能（多選）
              </div>
              <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-slate-800/80 bg-black/20 p-2">
                {supports.map((sup) => {
                  const checked = skillRow.supports?.includes(sup.id) ?? false
                  return (
                    <label
                      key={sup.id}
                      className="flex cursor-pointer items-center gap-2 rounded px-1 py-0.5 text-sm text-slate-300 hover:bg-slate-800/40"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-slate-600 bg-slate-900"
                        checked={checked}
                        disabled={!skillRow.skillId}
                        onChange={() => {
                          const cur = skillRow.supports ?? []
                          const next = checked ? cur.filter((id) => id !== sup.id) : [...cur, sup.id]
                          setSkillSupports(skillRow.slot, next)
                        }}
                      />
                      <span>{sup.name}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}

      <div className="rounded-2xl border border-slate-800/55 bg-gradient-to-b from-slate-900/35 to-slate-950/20 p-5">
        <div className="mb-3 text-base font-semibold text-slate-100">被動 / 光環（注入主技能实例）</div>
        <p className="mb-3 text-xs text-slate-500">
          選取之被動技能的 <code className="text-slate-400">modifiers</code> 會併入每個主技能槽的計算（v1 全槽共享同一組被動）。
        </p>
        <div className="space-y-3">
          {passives.map((p) => {
            const passiveList = listSkillsByFamily('passive')
            const sel = passiveList.find((x) => x.id === p.skillId)
            return (
              <div key={p.slot} className="flex flex-wrap items-end gap-2">
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
                <button
                  type="button"
                  onClick={() => clearPassive(p.slot)}
                  className="rounded-lg border border-slate-600/80 px-2 py-1.5 text-xs text-slate-400 hover:bg-slate-800/60"
                >
                  清空
                </button>
                {sel ? (
                  <span className="text-xs text-slate-500">已選：{sel.name}</span>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
