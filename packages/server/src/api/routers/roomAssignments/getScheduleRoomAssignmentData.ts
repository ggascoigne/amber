import { getScheduleRoomAssignmentGame } from './getScheduleRoomAssignmentGame'
import type { GetScheduleRoomAssignmentDataInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

const scheduleRoomSelect = {
  id: true,
  description: true,
  size: true,
  type: true,
  enabled: true,
  updated: true,
  accessibility: true,
}

export type ConventionCode = 'acus' | 'acnw'

export const getScheduleRoomAssignmentData = async ({
  tx,
  input,
  conventionCode,
}: {
  tx: TransactionClient
  input: GetScheduleRoomAssignmentDataInput
  conventionCode: ConventionCode
}) => {
  const game = await getScheduleRoomAssignmentGame({ tx, input })

  const [rooms, slotAssignments, slotAvailability] = await Promise.all([
    tx.room.findMany({
      select: scheduleRoomSelect,
      orderBy: [{ description: 'asc' }],
    }),
    tx.gameRoomAssignment.findMany({
      where: {
        year: input.year,
        slotId: game.slotId,
        isOverride: false,
      },
      select: {
        id: true,
        gameId: true,
        roomId: true,
        slotId: true,
        year: true,
      },
    }),
    tx.roomSlotAvailability.findMany({
      where: {
        year: input.year,
        slotId: game.slotId,
      },
      select: {
        roomId: true,
        slotId: true,
        isAvailable: true,
      },
    }),
  ])

  const assignedRoomByRoomId = new Map(slotAssignments.map((assignment) => [assignment.roomId, assignment]))
  const availabilityByRoomId = new Map(slotAvailability.map((availability) => [availability.roomId, availability]))
  const currentAssignment = slotAssignments.find((assignment) => assignment.gameId === input.gameId) ?? null

  return {
    convention: conventionCode,
    game,
    currentAssignment,
    rooms: rooms.map((room) => ({
      ...room,
      occupiedByGameId: assignedRoomByRoomId.get(room.id)?.gameId ?? null,
      isAvailable: availabilityByRoomId.get(room.id)?.isAvailable ?? true,
    })),
  }
}
