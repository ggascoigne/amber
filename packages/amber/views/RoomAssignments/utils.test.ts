import { describe, expect, test } from 'vitest'

import type {
  DashboardGame,
  DashboardMemberRoomAssignment,
  DashboardRoomAssignment,
  DashboardRoomSlotAvailability,
} from './utils'
import {
  buildDefaultRoomAssignmentByGameId,
  buildMemberRoomIdByMemberId,
  buildRoomMemberCounts,
  buildRoomSlotAvailabilityMap,
  buildSlotIds,
  isRoomAvailableInSlot,
  sortGamesForRoomAssignment,
} from './utils'

const createRoomAssignment = ({ id, gameId, isOverride }: { id: bigint; gameId: number; isOverride: boolean }) =>
  ({ id, gameId, isOverride }) as DashboardRoomAssignment

const createAvailability = ({
  roomId,
  slotId,
  year,
  isAvailable,
}: {
  roomId: number
  slotId: number
  year: number
  isAvailable: boolean
}) => ({ roomId, slotId, year, isAvailable }) as DashboardRoomSlotAvailability

const createMemberRoomAssignment = ({ memberId, roomId }: { memberId: number; roomId: number }) =>
  ({ memberId, roomId }) as DashboardMemberRoomAssignment

const createGame = ({ id, name, slotId }: { id: number; name: string; slotId: number | null }) =>
  ({ id, name, slotId }) as DashboardGame

describe('room assignment utils', () => {
  test('buildSlotIds creates 1-indexed slot list', () => {
    expect(buildSlotIds(5)).toEqual([1, 2, 3, 4, 5])
  })

  test('room slot availability defaults missing entries to available', () => {
    const availabilityByKey = buildRoomSlotAvailabilityMap([
      createAvailability({
        roomId: 2,
        slotId: 3,
        year: 2026,
        isAvailable: false,
      }),
    ])

    expect(
      isRoomAvailableInSlot({
        availabilityByKey,
        roomId: 2,
        slotId: 3,
        year: 2026,
      }),
    ).toBe(false)

    expect(
      isRoomAvailableInSlot({
        availabilityByKey,
        roomId: 2,
        slotId: 4,
        year: 2026,
      }),
    ).toBe(true)
  })

  test('member room mappings and sharing counts are derived by member and room ids', () => {
    const rows = [
      createMemberRoomAssignment({ memberId: 11, roomId: 2 }),
      createMemberRoomAssignment({ memberId: 12, roomId: 2 }),
      createMemberRoomAssignment({ memberId: 13, roomId: 3 }),
    ]

    const memberRoomIdByMemberId = buildMemberRoomIdByMemberId(rows)
    const roomMemberCounts = buildRoomMemberCounts(rows)

    expect(memberRoomIdByMemberId.get(11)).toBe(2)
    expect(memberRoomIdByMemberId.get(13)).toBe(3)
    expect(roomMemberCounts.get(2)).toBe(2)
    expect(roomMemberCounts.get(3)).toBe(1)
  })

  test('default room assignments exclude overrides and keep first non-override assignment', () => {
    const assignmentByGameId = buildDefaultRoomAssignmentByGameId([
      createRoomAssignment({ id: 5n, gameId: 10, isOverride: false }),
      createRoomAssignment({ id: 7n, gameId: 10, isOverride: true }),
      createRoomAssignment({ id: 3n, gameId: 10, isOverride: false }),
      createRoomAssignment({ id: 9n, gameId: 12, isOverride: true }),
      createRoomAssignment({ id: 8n, gameId: 12, isOverride: false }),
    ])

    expect(assignmentByGameId.get(10)?.id).toBe(3n)
    expect(assignmentByGameId.get(12)?.id).toBe(8n)
  })

  test('games are sorted by slot then name with null slots last', () => {
    const sortedGames = sortGamesForRoomAssignment([
      createGame({ id: 2, name: 'Bravo', slotId: 3 }),
      createGame({ id: 1, name: 'Alpha', slotId: 3 }),
      createGame({ id: 4, name: 'Delta', slotId: null }),
      createGame({ id: 3, name: 'Charlie', slotId: 1 }),
    ])

    expect(sortedGames.map((game) => game.id)).toEqual([3, 1, 2, 4])
  })
})
