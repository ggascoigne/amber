import type { GetGameChoicesByYearInput, GetGameChoicesInput, ReadGameChoiceInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

export const gameSubmissionFields = {
  id: true,
  memberId: true,
  message: true,
  year: true,
}

export const gameChoiceFields = {
  id: true,
  memberId: true,
  gameId: true,
  rank: true,
  returningPlayer: true,
  slotId: true,
  year: true,
}

const dashboardMembershipSelect = {
  select: {
    id: true,
    user: {
      select: {
        fullName: true,
      },
    },
  },
}

const dashboardGameSubmissionFields = {
  ...gameSubmissionFields,
  membership: dashboardMembershipSelect,
}

const dashboardGameChoiceFields = {
  ...gameChoiceFields,
  membership: dashboardMembershipSelect,
  game: {
    select: {
      id: true,
      name: true,
      slotId: true,
      category: true,
    },
  },
}

export const getGameChoices = async ({ tx, input }: { tx: TransactionClient; input: GetGameChoicesInput }) => {
  const gameSubmissions = await tx.gameSubmission.findMany({
    where: { memberId: input.memberId, year: input.year },
    select: gameSubmissionFields,
  })
  const gameChoices = await tx.gameChoice.findMany({
    where: { memberId: input.memberId, year: input.year },
    select: gameChoiceFields,
  })

  return { gameSubmissions, gameChoices }
}

export const getGameChoicesByYear = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: GetGameChoicesByYearInput
}) => {
  const gameSubmissions = await tx.gameSubmission.findMany({
    where: { year: input.year },
    select: dashboardGameSubmissionFields,
  })
  const gameChoices = await tx.gameChoice.findMany({
    where: { year: input.year },
    select: dashboardGameChoiceFields,
  })

  return { gameSubmissions, gameChoices }
}

export const getGameChoiceById = ({ tx, input }: { tx: TransactionClient; input: ReadGameChoiceInput }) =>
  tx.gameChoice.findUnique({
    where: { id: input.id },
    select: gameChoiceFields,
  })
