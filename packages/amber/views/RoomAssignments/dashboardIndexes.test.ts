import { describe, expect, test } from 'vitest'

import {
  buildAssignedMemberNamesByRoomId,
  buildMemberRoomIdByMemberId,
  buildRoomMemberCounts,
  buildSlotIds,
} from './dashboardIndexes'
import type { DashboardMemberRoomAssignment, DashboardMembership } from './dashboardShared'

const createMembership = ({ id, fullName }: { id: number; fullName: string | null }) =>
  ({
    id,
    user: {
      fullName,
    },
  }) as DashboardMembership

const createMemberRoomAssignment = ({ memberId, roomId }: { memberId: number; roomId: number }) =>
  ({ memberId, roomId }) as DashboardMemberRoomAssignment

describe('dashboard index helpers', () => {
  test('buildSlotIds creates a 1-indexed slot list', () => {
    expect(buildSlotIds(5)).toEqual([1, 2, 3, 4, 5])
  })

  test('member room mappings and room member counts are derived by member and room ids', () => {
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

  test('assigned member names are sorted and ignore blank or unassigned members', () => {
    const assignedMemberNamesByRoomId = buildAssignedMemberNamesByRoomId(
      [
        createMembership({ id: 1, fullName: 'Casey Carter' }),
        createMembership({ id: 2, fullName: 'Alex Admin' }),
        createMembership({ id: 3, fullName: null }),
        createMembership({ id: 4, fullName: 'Dana Dev' }),
      ],
      new Map([
        [1, 7],
        [2, 7],
        [3, 7],
      ]),
    )

    expect(assignedMemberNamesByRoomId).toEqual(new Map([[7, ['Alex Admin', 'Casey Carter']]]))
  })
})
