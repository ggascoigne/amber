import { describe, expect, test } from 'vitest'

import type { DashboardMembership, DashboardRoom } from './dashboardShared'
import { buildMemberRoomRows, buildRoomMemberRows } from './memberRoomRows'

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

const createRoom = ({ id, description, enabled = true }: { id: number; description: string; enabled?: boolean }) =>
  ({
    id,
    description,
    enabled,
    type: 'Guest Room',
  }) as DashboardRoom

describe('member room row helpers', () => {
  test('member room rows show sorted roommate labels and unassigned state for attending members', () => {
    const rows = buildMemberRoomRows({
      memberships: [
        createMembership({ id: 1, fullName: 'Casey Carter' }),
        createMembership({ id: 2, fullName: 'Alex Admin' }),
        createMembership({ id: 3, fullName: 'Bailey Builder' }),
        createMembership({ id: 4, fullName: 'Dana Dev', attending: false }),
      ],
      memberRoomIdByMemberId: new Map([
        [1, 7],
        [2, 7],
      ]),
    })

    expect(rows).toEqual([
      {
        id: 1,
        memberId: 1,
        memberName: 'Casey Carter',
        assignedRoomId: 7,
        sharingLabel: 'Alex Admin',
      },
      {
        id: 2,
        memberId: 2,
        memberName: 'Alex Admin',
        assignedRoomId: 7,
        sharingLabel: 'Casey Carter',
      },
      {
        id: 3,
        memberId: 3,
        memberName: 'Bailey Builder',
        assignedRoomId: null,
        sharingLabel: 'Unassigned',
      },
    ])
  })

  test('room member rows include only attending assigned members with names sorted by room', () => {
    const rows = buildRoomMemberRows({
      rooms: [
        createRoom({ id: 4, description: 'Summit Suite' }),
        createRoom({ id: 7, description: 'Cascade Ballroom', enabled: false }),
      ],
      memberships: [
        createMembership({ id: 1, fullName: 'Casey Carter' }),
        createMembership({ id: 2, fullName: 'Alex Admin' }),
        createMembership({ id: 3, fullName: null }),
        createMembership({ id: 4, fullName: 'Dana Dev', attending: false }),
      ],
      memberRoomIdByMemberId: new Map([
        [1, 7],
        [2, 7],
        [3, 7],
        [4, 4],
      ]),
    })

    expect(rows).toEqual([
      {
        id: 4,
        roomId: 4,
        roomDescription: 'Summit Suite',
        roomType: 'Guest Room',
        enabled: true,
        assignedMemberIds: [],
        assignedMemberNames: [],
      },
      {
        id: 7,
        roomId: 7,
        roomDescription: 'Cascade Ballroom',
        roomType: 'Guest Room',
        enabled: false,
        assignedMemberIds: [2, 1],
        assignedMemberNames: ['Alex Admin', 'Casey Carter'],
      },
    ])
  })
})
