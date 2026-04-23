import { prepareDefaultRoomAssignment } from './assignGameRoom.defaults'
import { getAssignGameRoomTarget } from './assignGameRoom.target'
import { syncLegacyGameRoomId } from './legacyRoomSync'
import type { AssignGameRoomInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

export const assignGameRoom = async ({
  tx,
  input,
  assignedByUserId,
}: {
  tx: TransactionClient
  input: AssignGameRoomInput
  assignedByUserId: number | null
}) => {
  const wantsOverride = input.isOverride ?? false
  const source = input.source ?? 'manual'
  const target = await getAssignGameRoomTarget({ tx, input })

  let displacedGameIds: Array<number> = []
  if (!wantsOverride) {
    const preparation = await prepareDefaultRoomAssignment({
      tx,
      gameId: target.game.id,
      roomId: target.room.id,
      slotId: target.game.slotId,
      year: target.game.year,
    })
    displacedGameIds = preparation.displacedGameIds
  }

  const assignment = await tx.gameRoomAssignment.upsert({
    where: {
      gameId_roomId_slotId_year_isOverride: {
        gameId: target.game.id,
        roomId: target.room.id,
        slotId: target.game.slotId,
        year: target.game.year,
        isOverride: wantsOverride,
      },
    },
    update: {
      source,
      assignmentReason: input.assignmentReason ?? null,
      assignedByUserId,
    },
    create: {
      gameId: target.game.id,
      roomId: target.room.id,
      slotId: target.game.slotId,
      year: target.game.year,
      isOverride: wantsOverride,
      source,
      assignmentReason: input.assignmentReason ?? null,
      assignedByUserId,
    },
  })

  await syncLegacyGameRoomId({
    tx,
    gameId: target.game.id,
    year: target.game.year,
  })

  if (displacedGameIds.length > 0) {
    await displacedGameIds.reduce(async (previousSync, displacedGameId) => {
      await previousSync
      await syncLegacyGameRoomId({
        tx,
        gameId: displacedGameId,
        year: target.game.year,
      })
    }, Promise.resolve())
  }

  return {
    assignment,
  }
}
