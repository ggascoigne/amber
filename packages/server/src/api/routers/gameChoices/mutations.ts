import { gameChoiceFields, gameSubmissionFields } from './queries'
import type {
  CreateGameChoiceInput,
  CreateGameChoicesInput,
  CreateGameSubmissionInput,
  UpdateGameChoiceInput,
  UpdateGameSubmissionInput,
  UpsertGameChoiceBySlotInput,
} from './schemas'

import { Prisma } from '../../../generated/prisma/client'
import type { TransactionClient } from '../../inRlsTransaction'

type GameChoicesAdminClient = {
  $executeRaw: (query: Prisma.Sql) => Promise<number>
}

const buildUpsertGameChoiceData = (input: UpsertGameChoiceBySlotInput) => ({
  gameId: input.gameId,
  memberId: input.memberId,
  rank: input.rank,
  returningPlayer: input.returningPlayer,
  slotId: input.slotId,
  year: input.year,
})

const buildCreateGameChoicesQuery = (input: CreateGameChoicesInput) =>
  Prisma.sql`SELECT * FROM create_bare_slot_choices (${input.memberId}::int, ${input.year}::int, ${input.noSlots}::int)`

export const createBareSlotChoices = ({ db, input }: { db: GameChoicesAdminClient; input: CreateGameChoicesInput }) =>
  db.$executeRaw(buildCreateGameChoicesQuery(input))

export const createGameSubmissionRecord = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: CreateGameSubmissionInput
}) => {
  const gameSubmission = await tx.gameSubmission.create({
    data: input,
    select: gameSubmissionFields,
  })

  return { gameSubmission }
}

export const updateGameSubmissionRecord = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: UpdateGameSubmissionInput
}) => {
  const gameSubmission = await tx.gameSubmission.update({
    where: { id: input.id },
    data: input.data,
    select: gameSubmissionFields,
  })

  return { gameSubmission }
}

export const createGameChoiceRecord = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: CreateGameChoiceInput
}) => {
  const gameChoice = await tx.gameChoice.create({
    data: input,
    select: gameChoiceFields,
  })

  return { gameChoice }
}

export const updateGameChoiceRecord = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: UpdateGameChoiceInput
}) => {
  const gameChoice = await tx.gameChoice.update({
    where: { id: input.id },
    data: input.data,
    select: gameChoiceFields,
  })

  return { gameChoice }
}

export const upsertGameChoiceBySlotRecord = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: UpsertGameChoiceBySlotInput
}) => {
  const existing = await tx.gameChoice.findFirst({
    where: {
      memberId: input.memberId,
      year: input.year,
      slotId: input.slotId,
      rank: input.rank,
    },
  })

  const data = buildUpsertGameChoiceData(input)

  const gameChoice = existing
    ? await tx.gameChoice.update({
        where: { id: existing.id },
        data,
        select: gameChoiceFields,
      })
    : await tx.gameChoice.create({
        data,
        select: gameChoiceFields,
      })

  return { gameChoice }
}
