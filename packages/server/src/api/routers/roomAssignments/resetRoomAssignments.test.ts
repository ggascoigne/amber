import { beforeEach, describe, expect, test, vi } from 'vitest'

import { syncLegacyGameRoomIdsForYear } from './legacyRoomSync'
import { resetRoomAssignments } from './resetRoomAssignments'

import type { TransactionClient } from '../../inRlsTransaction'

vi.mock('./legacyRoomSync', () => ({
  syncLegacyGameRoomIdsForYear: vi.fn().mockResolvedValue(undefined),
}))

const syncLegacyGameRoomIdsForYearMock = vi.mocked(syncLegacyGameRoomIdsForYear)

const createResetRoomAssignmentsTx = ({ deletedCount = 3 }: { deletedCount?: number } = {}) => {
  const gameRoomAssignmentDeleteMany = vi.fn().mockResolvedValue({ count: deletedCount })

  const tx = {
    gameRoomAssignment: {
      deleteMany: gameRoomAssignmentDeleteMany,
    },
  } as unknown as TransactionClient

  return {
    tx,
    gameRoomAssignmentDeleteMany,
  }
}

describe('resetRoomAssignments', () => {
  beforeEach(() => {
    syncLegacyGameRoomIdsForYearMock.mockClear()
  })

  test('deletes every room assignment when mode is all', async () => {
    const fixture = createResetRoomAssignmentsTx({ deletedCount: 5 })

    const result = await resetRoomAssignments({
      tx: fixture.tx,
      input: {
        year: 2026,
        mode: 'all',
      },
    })

    expect(fixture.gameRoomAssignmentDeleteMany).toHaveBeenCalledWith({
      where: {
        year: 2026,
        source: undefined,
      },
    })
    expect(syncLegacyGameRoomIdsForYearMock).toHaveBeenCalledWith({
      tx: fixture.tx,
      year: 2026,
    })
    expect(result).toEqual({
      deleted: 5,
    })
  })

  test('deletes only auto room assignments when mode is auto_only', async () => {
    const fixture = createResetRoomAssignmentsTx({ deletedCount: 0 })

    const result = await resetRoomAssignments({
      tx: fixture.tx,
      input: {
        year: 2026,
        mode: 'auto_only',
      },
    })

    expect(fixture.gameRoomAssignmentDeleteMany).toHaveBeenCalledWith({
      where: {
        year: 2026,
        source: 'auto',
      },
    })
    expect(syncLegacyGameRoomIdsForYearMock).toHaveBeenCalledWith({
      tx: fixture.tx,
      year: 2026,
    })
    expect(result).toEqual({
      deleted: 0,
    })
  })
})
