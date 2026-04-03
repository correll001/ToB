import type { GearSlot } from '@/types/build'

export const GEAR_ORDER: GearSlot[] = [
  'helmet',
  'chest',
  'gloves',
  'boots',
  'necklace',
  'belt',
  'ring1',
  'ring2',
  'weapon1',
  'weapon2',
]

export const SLOT_LABEL: Record<GearSlot, string> = {
  helmet: '頭盔',
  chest: '胸甲',
  gloves: '手套',
  boots: '鞋子',
  necklace: '項鍊',
  belt: '腰帶',
  ring1: '戒指 1',
  ring2: '戒指 2',
  weapon1: '武器 1',
  weapon2: '武器 2',
}
