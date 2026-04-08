import { describe, expect, test } from 'vitest'

import { getGamesBySlotInput, updateGameInput } from './schemas'

describe('game schemas', () => {
  test('preserves the shared slot query payload used by signup and slot reads', () => {
    const result = getGamesBySlotInput.parse({
      year: 2026,
      slotId: 4,
    })

    expect(result).toEqual({
      year: 2026,
      slotId: 4,
    })
  })

  test('preserves optional update fields inside the nested game data payload', () => {
    const result = updateGameInput.parse({
      id: 17,
      data: {
        name: 'Updated Game Name',
        slotId: null,
      },
    })

    expect(result).toEqual({
      id: 17,
      data: {
        name: 'Updated Game Name',
        slotId: null,
      },
    })
  })
})
