import type { MainSkillSlot, SupportLink } from '@/types/build'

export function compactSupportLinkSlots(links: SupportLink[]): SupportLink[] {
  const withId = links.filter((l) => l.supportSkillId)
  const sorted = [...withId].sort((a, b) => a.linkSlot - b.linkSlot || a.supportSkillId.localeCompare(b.supportSkillId))
  return sorted.map((l, i) => ({ ...l, linkSlot: i + 1 }))
}

export function nextSupportLinkSlot(links: SupportLink[]): number {
  if (links.length === 0) return 1
  return Math.max(...links.map((l) => l.linkSlot)) + 1
}

export function isMainSkillSlot(n: number): n is MainSkillSlot {
  return n === 1 || n === 2 || n === 3 || n === 4 || n === 5
}
