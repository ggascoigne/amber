import { TRPCError } from '@trpc/server'

import type { UpsertMemberRoomAssignmentInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

export const upsertMemberRoomAssignment = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: UpsertMemberRoomAssignmentInput
}) => {
  const membership = await tx.membership.findUnique({
    where: {
      id: input.memberId,
    },
    select: {
      id: true,
      year: true,
    },
  })

  if (!membership || membership.year !== input.year) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Member/year combination was not valid' })
  }

  if (input.roomId === null) {
    const deletedMemberRoomAssignments = await tx.memberRoomAssignment.deleteMany({
      where: {
        memberId: input.memberId,
        year: input.year,
      },
    })

    return {
      deleted: deletedMemberRoomAssignments.count,
      memberRoomAssignment: null,
    }
  }

  const memberRoomAssignment = await tx.memberRoomAssignment.upsert({
    where: {
      memberId_year: {
        memberId: input.memberId,
        year: input.year,
      },
    },
    update: {
      roomId: input.roomId,
    },
    create: {
      memberId: input.memberId,
      year: input.year,
      roomId: input.roomId,
    },
  })

  return {
    deleted: 0,
    memberRoomAssignment,
  }
}
