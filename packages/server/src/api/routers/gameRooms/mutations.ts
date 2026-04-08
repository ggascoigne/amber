import { gameRoomSummarySelect } from './queries'
import type { CreateGameRoomInput, DeleteGameRoomInput, UpdateGameRoomInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

export const updateGameRoomRecord = ({ tx, input }: { tx: TransactionClient; input: UpdateGameRoomInput }) =>
  tx.room
    .update({
      where: { id: input.id },
      data: input.data,
      select: gameRoomSummarySelect,
    })
    .then((room) => ({ room }))

export const createGameRoomRecord = ({ tx, input }: { tx: TransactionClient; input: CreateGameRoomInput }) =>
  tx.room
    .create({
      data: {
        description: input.description,
        size: input.size,
        type: input.type,
        enabled: input.enabled ?? true,
        updated: input.updated ?? false,
        accessibility: input.accessibility ?? 'accessible',
      },
    })
    .then((room) => ({ room }))

export const deleteGameRoomRecord = ({ tx, input }: { tx: TransactionClient; input: DeleteGameRoomInput }) =>
  tx.room.delete({ where: { id: input.id } }).then((deletedRoom) => ({
    deletedRoomId: deletedRoom.id,
  }))
