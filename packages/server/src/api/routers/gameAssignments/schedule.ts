import type { GetGameAssignmentScheduleInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

const scheduleGameAssignmentInclude = {
  game: {
    include: {
      room: {
        select: {
          description: true,
        },
      },
      gameAssignment: {
        where: { gm: { gte: 0 } },
        select: {
          gameId: true,
          gm: true,
          memberId: true,
          year: true,
          membership: {
            select: {
              user: {
                select: {
                  email: true,
                  fullName: true,
                },
              },
            },
          },
        },
      },
    },
  },
}

export const getGameAssignmentSchedule = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: GetGameAssignmentScheduleInput
}) =>
  tx.gameAssignment.findMany({
    where: {
      memberId: input.memberId,
      gm: { gte: 0 },
    },
    include: scheduleGameAssignmentInclude,
  })
