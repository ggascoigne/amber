import { TRPCError } from '@trpc/server'

import { checkGamePermissionGate } from './permissions'
import type { CreateGameInput, DeleteGameInput, UpdateGameInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

type GameMutationPermission = {
  errorMessage: string
  flagCode: 'flag.allow_game_editing' | 'flag.allow_game_submission'
}

type GameMutationOptions<Input> = {
  input: Input
  tx: TransactionClient
  userId: number | undefined
  userRoles: Array<string>
}

const assertGameMutationAllowed = async ({
  permission,
  tx,
  userId,
  userRoles,
}: {
  permission: GameMutationPermission
  tx: TransactionClient
  userId: number | undefined
  userRoles: Array<string>
}) => {
  const allowed = await checkGamePermissionGate({
    flagCode: permission.flagCode,
    tx,
    userId,
    userRoles,
  })

  if (!allowed) {
    throw new TRPCError({ code: 'FORBIDDEN', message: permission.errorMessage })
  }
}

export const createGameRecord = async ({ input, tx, userId, userRoles }: GameMutationOptions<CreateGameInput>) => {
  await assertGameMutationAllowed({
    permission: {
      flagCode: 'flag.allow_game_submission',
      errorMessage: 'Game submission is not currently allowed',
    },
    tx,
    userId,
    userRoles,
  })

  const game = await tx.game.create({
    data: input,
  })

  return { game }
}

export const updateGameRecord = async ({ input, tx, userId, userRoles }: GameMutationOptions<UpdateGameInput>) => {
  await assertGameMutationAllowed({
    permission: {
      flagCode: 'flag.allow_game_editing',
      errorMessage: 'Game editing is not currently allowed',
    },
    tx,
    userId,
    userRoles,
  })

  const game = await tx.game.update({
    where: { id: input.id },
    data: {
      ...input.data,
      slotId: input.data.slotId === undefined ? null : input.data.slotId,
    },
  })

  return { game }
}

export const deleteGameRecord = async ({ input, tx, userId, userRoles }: GameMutationOptions<DeleteGameInput>) => {
  await assertGameMutationAllowed({
    permission: {
      flagCode: 'flag.allow_game_editing',
      errorMessage: 'Game editing is not currently allowed',
    },
    tx,
    userId,
    userRoles,
  })

  const deletedGame = await tx.game.delete({
    where: { id: input.id },
  })

  return {
    deletedGameId: deletedGame.id,
  }
}
