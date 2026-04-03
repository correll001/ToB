// components/editor/SkillSetupPanel.tsx
'use client'

import { useBuildStore } from '@/stores/useBuildStore'
import { mockSkills } from '@/data/mockGameData'

export default function SkillSetupPanel() {
  const skills = useBuildStore((s) => s.snapshot.skills)
  const setSkill = useBuildStore((s) => s.setSkill)
  const clearSkill = useBuildStore((s) => s.clearSkill)

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <h2 className="text-lg font-semibold text-white">Skill Setup</h2>
        <p className="mt-1 text-sm text-gray-400">
          MVP 先做主技能槽位，支援技能之後再接上。
        </p>
      </div>

      {skills.map((skillRow) => {
        const selectedSkill = mockSkills.find((s) => s.id === skillRow.skillId)

        return (
          <div
            key={skillRow.slot}
            className="rounded-xl border border-gray-800 bg-gray-900 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-base font-semibold text-white">
                  Skill Slot {skillRow.slot}
                </div>
                <div className="text-sm text-gray-400">
                  目前：{selectedSkill?.name ?? '未配置'}
                </div>
              </div>

              <button
                onClick={() => clearSkill(skillRow.slot)}
                className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-800"
              >
                清空
              </button>
            </div>

            <select
              value={skillRow.skillId ?? ''}
              onChange={(e) => setSkill(skillRow.slot, e.target.value || null)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
            >
              <option value="">請選擇技能</option>
              {mockSkills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>

            <div className="mt-3 rounded-lg border border-dashed border-gray-700 bg-gray-950 p-3 text-sm text-gray-400">
              Support Skills 區塊保留，下一版可直接接 `supports[]`。
            </div>
          </div>
        )
      })}
    </div>
  )
}
