import { describe, expect, test } from 'vitest'

import type { DashboardMembership } from './dashboardShared'
import { buildRoomMemberAssignmentUpdates } from './memberRoomUpdates'

const createMembership = ({
  id,
  fullName,
  attending = true,
}: {
  id: number
  fullName: string | null
  attending?: boolean
}) =>
  ({
    id,
    attending,
    user: {
      fullName,
    },
  }) as DashboardMembership

describe('room member assignment updates', () => {
  test('returns assignments for new members in deduped selection order before removals', () => {
    expect(
      buildRoomMemberAssignmentUpdates({
        roomId: 7,
        memberships: [
          createMembership({ id: 1, fullName: 'Alex Admin' }),
          createMembership({ id: 2, fullName: 'Bailey Builder' }),
          createMembership({ id: 3, fullName: 'Casey Carter' }),
        ],
        memberRoomIdByMemberId: new Map([
          [1, 7],
          [2, 7],
        ]),
        nextMemberIds: [3, 3, 1],
      }),
    ).toEqual([
      {
        memberId: 3,
        roomId: 7,
      },
      {
        memberId: 2,
        roomId: null,
      },
    ])
  })

  test('returns no updates when the attending room assignment set is unchanged', () => {
    expect(
      buildRoomMemberAssignmentUpdates({
        roomId: 4,
        memberships: [
          createMembership({ id: 1, fullName: 'Alex Admin' }),
          createMembership({ id: 2, fullName: 'Bailey Builder' }),
          createMembership({ id: 3, fullName: 'Casey Carter', attending: false }),
        ],
        memberRoomIdByMemberId: new Map([
          [1, 4],
          [2, 4],
          [3, 4],
        ]),
        nextMemberIds: [1, 2],
      }),
    ).toEqual([])
  })

  test('does not emit removals for non-attending members already assigned to the room', () => {
    expect(
      buildRoomMemberAssignmentUpdates({
        roomId: 9,
        memberships: [
          createMembership({ id: 1, fullName: 'Alex Admin' }),
          createMembership({ id: 2, fullName: 'Bailey Builder', attending: false }),
        ],
        memberRoomIdByMemberId: new Map([
          [1, 9],
          [2, 9],
        ]),
        nextMemberIds: [],
      }),
    ).toEqual([
      {
        memberId: 1,
        roomId: null,
      },
    ])
  })
})
