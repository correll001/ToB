import type { BuildSnapshot, MainSkillSlot, SkillSetup } from '@/types/build'

/** Shallow clone snapshot with one main skill row replaced (deep-copy `supports`). */
export function cloneSnapshotWithSkillRow(
  snapshot: BuildSnapshot,
  slot: MainSkillSlot,
  skillRow: SkillSetup,
): BuildSnapshot {
  return {
    ...snapshot,
    skills: snapshot.skills.map((r) =>
      r.slot === slot
        ? {
            ...skillRow,
            supports: skillRow.supports.map((s) => ({ ...s })),
          }
        : r,
    ),
  }
}
