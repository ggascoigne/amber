import { getScheduleRoomAssignmentGame } from './getScheduleRoomAssignmentGame'
import type { GetScheduleRoomAssignmentDataInput } from './schemas'

import { Prisma } from '../../../generated/prisma/client'
import type { TransactionClient } from '../../inRlsTransaction'

export type ConventionCode = 'acus' | 'acnw'

type ScheduleRoomRow = {
  id: number
  description: string
  size: number
  type: string
  enabled: boolean
  updated: boolean
  accessibility: string
  occupiedByGameId: number | null
  isAvailable: boolean
  assignmentId: bigint | string | null
  assignmentSlotId: number | null
  assignmentYear: number | null
}

const toBigInt = (value: bigint | string) => (typeof value === 'bigint' ? value : BigInt(value))

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

  const rooms = await tx.$queryRaw<Array<ScheduleRoomRow>>(Prisma.sql`
    SELECT
      r.id,
      r.description,
      r.size,
      r.type,
      r.enabled,
      r.updated,
      r.accessibility,
      gra.id AS "assignmentId",
      gra.game_id AS "occupiedByGameId",
      gra.slot_id AS "assignmentSlotId",
      gra.year AS "assignmentYear",
      COALESCE(rsa.is_available, true) AS "isAvailable"
    FROM room r
    LEFT JOIN LATERAL (
      SELECT
        game_room_assignment.id,
        game_room_assignment.game_id,
        game_room_assignment.slot_id,
        game_room_assignment.year
      FROM game_room_assignment
      WHERE
        game_room_assignment.room_id = r.id
        AND game_room_assignment.year = ${input.year}
        AND game_room_assignment.slot_id = ${game.slotId}
        AND game_room_assignment.is_override = false
      ORDER BY game_room_assignment.id ASC
      LIMIT 1
    ) gra
      ON TRUE
    LEFT JOIN room_slot_availability rsa
      ON rsa.room_id = r.id
      AND rsa.year = ${input.year}
      AND rsa.slot_id = ${game.slotId}
    ORDER BY r.description ASC
  `)

  const currentAssignmentRow = rooms.find(
    (room) => room.occupiedByGameId === input.gameId && room.assignmentId !== null,
  )
  const currentAssignmentId = currentAssignmentRow?.assignmentId
  const currentAssignment =
    currentAssignmentId !== null &&
    currentAssignmentId !== undefined &&
    currentAssignmentRow &&
    currentAssignmentRow.assignmentSlotId !== null &&
    currentAssignmentRow.assignmentYear !== null
      ? {
          id: toBigInt(currentAssignmentId),
          gameId: input.gameId,
          roomId: currentAssignmentRow.id,
          slotId: currentAssignmentRow.assignmentSlotId,
          year: currentAssignmentRow.assignmentYear,
        }
      : null

  return {
    convention: conventionCode,
    game,
    currentAssignment,
    rooms: rooms.map((room) => ({
      id: room.id,
      description: room.description,
      size: room.size,
      type: room.type,
      enabled: room.enabled,
      updated: room.updated,
      accessibility: room.accessibility,
      occupiedByGameId: room.occupiedByGameId,
      isAvailable: room.isAvailable,
    })),
  }
}
