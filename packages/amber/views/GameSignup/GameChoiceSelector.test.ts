import type { GameChoice } from '@amber/client'
import { describe, expect, test } from 'vitest'

import { isGmForGame, isGmInSlot } from './GameChoiceSelector'

describe('isGmInSlot', () => {
  test('locks first-choice controls only for a slot where the member is a GM', () => {
    const gmSlot = { slotId: 1 } as GameChoice

    expect(isGmInSlot([gmSlot], 1)).toBe(true)
    expect(isGmInSlot([gmSlot], 2)).toBe(false)
    expect(isGmInSlot(undefined, 1)).toBe(false)
  })

  test('locks only the game the member is GMing', () => {
    const gmSlot = { gameId: 101, slotId: 1 } as GameChoice

    expect(isGmForGame([gmSlot], 1, 101)).toBe(true)
    expect(isGmForGame([gmSlot], 1, 102)).toBe(false)
  })
})
