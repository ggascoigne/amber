import type { GetAssignmentDashboardDataInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

const dashboardGameSelect = {
  id: true,
  name: true,
  slotId: true,
  category: true,
  playerMin: true,
  playerMax: true,
  playerPreference: true,
  message: true,
  returningPlayers: true,
  year: true,
}

const dashboardAssignmentSelect = {
  memberId: true,
  gameId: true,
  gm: true,
  year: true,
  membership: {
    select: {
      id: true,
      user: {
        select: {
          fullName: true,
        },
      },
    },
  },
  game: {
    select: {
      id: true,
      name: true,
      slotId: true,
      category: true,
    },
  },
}

const dashboardChoiceSelect = {
  id: true,
  memberId: true,
  gameId: true,
  rank: true,
  slotId: true,
  year: true,
  returningPlayer: true,
  membership: {
    select: {
      id: true,
      user: {
        select: {
          fullName: true,
        },
      },
    },
  },
  game: {
    select: {
      id: true,
      name: true,
      slotId: true,
      category: true,
    },
  },
}

const dashboardSubmissionSelect = {
  id: true,
  memberId: true,
  year: true,
  message: true,
  membership: {
    select: {
      id: true,
      user: {
        select: {
          fullName: true,
        },
      },
    },
  },
}

const dashboardMembershipSelect = {
  id: true,
  userId: true,
  year: true,
  attending: true,
  user: {
    select: {
      fullName: true,
    },
  },
}

const membershipNameOrderBy = [
  {
    user: {
      lastName: 'asc' as const,
    },
  },
  {
    user: {
      firstName: 'asc' as const,
    },
  },
]

export const getGameAssignmentDashboardData = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: GetAssignmentDashboardDataInput
}) => {
  const [games, assignments, choices, submissions, memberships] = await Promise.all([
    tx.game.findMany({
      where: { year: input.year },
      select: dashboardGameSelect,
      orderBy: [{ slotId: 'asc' }, { name: 'asc' }],
    }),
    tx.gameAssignment.findMany({
      where: { year: input.year },
      select: dashboardAssignmentSelect,
    }),
    tx.gameChoice.findMany({
      where: { year: input.year },
      select: dashboardChoiceSelect,
    }),
    tx.gameSubmission.findMany({
      where: { year: input.year },
      select: dashboardSubmissionSelect,
    }),
    tx.membership.findMany({
      where: { year: input.year },
      select: dashboardMembershipSelect,
      orderBy: membershipNameOrderBy,
    }),
  ])

  return {
    games,
    assignments,
    choices,
    submissions,
    memberships,
  }
}
