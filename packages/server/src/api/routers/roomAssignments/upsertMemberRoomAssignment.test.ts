import type { TRPCError } from '@trpc/server'
import { describe, expect, test, vi } from 'vitest'

import { upsertMemberRoomAssignment } from './upsertMemberRoomAssignment'

import type { TransactionClient } from '../../inRlsTransaction'

const createUpsertMemberRoomAssignmentTx = ({
  membership = { id: 7, year: 2026 },
  deletedCount = 1,
  upsertResult = { memberId: 7, roomId: 12, year: 2026 },
}: {
  membership?: { id: number; year: number } | null
  deletedCount?: number
  upsertResult?: { memberId: number; roomId: number; year: number }
} = {}) => {
  const membershipFindUnique = vi.fn().mockResolvedValue(membership)
  const memberRoomAssignmentDeleteMany = vi.fn().mockResolvedValue({ count: deletedCount })
  const memberRoomAssignmentUpsert = vi.fn().mockResolvedValue(upsertResult)

  const tx = {
    membership: {
      findUnique: membershipFindUnique,
    },
    memberRoomAssignment: {
      deleteMany: memberRoomAssignmentDeleteMany,
      upsert: memberRoomAssignmentUpsert,
    },
  } as unknown as TransactionClient

  return {
    tx,
    membershipFindUnique,
    memberRoomAssignmentDeleteMany,
    memberRoomAssignmentUpsert,
    upsertResult,
  }
}

describe('upsertMemberRoomAssignment', () => {
  test('rejects missing or mismatched membership records', async () => {
    const missingMembership = createUpsertMemberRoomAssignmentTx({
      membership: null,
    })
    const mismatchedYear = createUpsertMemberRoomAssignmentTx({
      membership: { id: 7, year: 2025 },
    })

    await expect(
      upsertMemberRoomAssignment({
        tx: missingMembership.tx,
        input: {
          memberId: 7,
          roomId: 12,
          year: 2026,
        },
      }),
    ).rejects.toMatchObject({
      code: 'BAD_REQUEST',
      message: 'Member/year combination was not valid',
    } satisfies Partial<TRPCError>)

    await expect(
      upsertMemberRoomAssignment({
        tx: mismatchedYear.tx,
        input: {
          memberId: 7,
          roomId: 12,
          year: 2026,
        },
      }),
    ).rejects.toMatchObject({
      code: 'BAD_REQUEST',
      message: 'Member/year combination was not valid',
    } satisfies Partial<TRPCError>)

    expect(missingMembership.memberRoomAssignmentDeleteMany).not.toHaveBeenCalled()
    expect(missingMembership.memberRoomAssignmentUpsert).not.toHaveBeenCalled()
    expect(mismatchedYear.memberRoomAssignmentDeleteMany).not.toHaveBeenCalled()
    expect(mismatchedYear.memberRoomAssignmentUpsert).not.toHaveBeenCalled()
  })

  test('deletes room assignments when the selected room is cleared', async () => {
    const fixture = createUpsertMemberRoomAssignmentTx({
      deletedCount: 3,
    })

    const result = await upsertMemberRoomAssignment({
      tx: fixture.tx,
      input: {
        memberId: 7,
        roomId: null,
        year: 2026,
      },
    })

    expect(fixture.membershipFindUnique).toHaveBeenCalledWith({
      where: {
        id: 7,
      },
      select: {
        id: true,
        year: true,
      },
    })
    expect(fixture.memberRoomAssignmentDeleteMany).toHaveBeenCalledWith({
      where: {
        memberId: 7,
        year: 2026,
      },
    })
    expect(fixture.memberRoomAssignmentUpsert).not.toHaveBeenCalled()
    expect(result).toEqual({
      deleted: 3,
      memberRoomAssignment: null,
    })
  })

  test('upserts the member room assignment when a room is selected', async () => {
    const fixture = createUpsertMemberRoomAssignmentTx()

    const result = await upsertMemberRoomAssignment({
      tx: fixture.tx,
      input: {
        memberId: 7,
        roomId: 12,
        year: 2026,
      },
    })

    expect(fixture.memberRoomAssignmentDeleteMany).not.toHaveBeenCalled()
    expect(fixture.memberRoomAssignmentUpsert).toHaveBeenCalledWith({
      where: {
        memberId_year: {
          memberId: 7,
          year: 2026,
        },
      },
      update: {
        roomId: 12,
      },
      create: {
        memberId: 7,
        year: 2026,
        roomId: 12,
      },
    })
    expect(result).toEqual({
      deleted: 0,
      memberRoomAssignment: fixture.upsertResult,
    })
  })
})
