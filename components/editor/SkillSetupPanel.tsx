// components/editor/SkillSetupPanel.tsx
'use client'

import { useBuildStore } from '@/stores/useBuildStore'
import { mockSkills } from '@/data/mockGameData'

export default function SkillSetupPanel() {
  const skills = useBuildStore((s) => s.snapshot.skills)
  const setSkill = useBuildStore((s) => s.setSkill)
  const clearSkill = useBuildStore((s) => s.clearSkill)

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="rounded-2xl border border-slate-800/55 bg-gradient-to-b from-slate-900/35 to-slate-950/20 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-sm bg-sky-500/85 shadow-[0_0_12px_rgba(56,189,248,0.4)]" aria-hidden />
          <h2 className="text-base font-bold tracking-tight text-slate-100 md:text-lg">Skill Setup</h2>
        </div>
        <p className="mt-1.5 pl-4 text-sm text-slate-500">MVP 先做主技能槽位，支援技能之後再接上。</p>
      </div>

      {skills.map((skillRow) => {
        const selectedSkill = mockSkills.find((s) => s.id === skillRow.skillId)

        return (
          <div
            key={skillRow.slot}
            className="rounded-xl border border-slate-800/70 bg-slate-950/40 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] md:p-5"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-base font-semibold text-slate-100">Skill Slot {skillRow.slot}</div>
                <div className="text-sm text-slate-500">目前：{selectedSkill?.name ?? '未配置'}</div>
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
              <option value="">請選擇技能</option>
              {mockSkills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>

            <div className="mt-3 rounded-lg border border-dashed border-slate-700/65 bg-black/25 p-3 text-sm text-slate-500">
              Support Skills 區塊保留，下一版可直接接 `supports[]`。
            </div>
          </div>
        )
      })}
    </div>
  )
}
