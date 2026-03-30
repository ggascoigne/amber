import * as React from 'react'

import { Perms } from '@amber/amber/components/Auth'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import type { ReportRecord } from '@amber/amber/views/Reports'
import { Reports } from '@amber/amber/views/Reports'
import type { NextPage } from 'next'

const reports: ReportRecord[] = [
  { name: 'Membership', reportId: 'membershipReport' },
  { name: 'Members Without Game Choices', reportId: 'membersWithoutGameChoicesReport' },
  { name: 'Game', reportId: 'gameReport' },
  { name: 'GM', reportId: 'gmReport' },
  { name: 'Games Scheduler', reportId: 'gamesSchedulerReport' },
  { name: 'Members for Player Scheduler', perm: Perms.PlayerAdmin, reportId: 'membersForPlayerSchedulerReport' },
  { name: 'Games for Player Scheduler', perm: Perms.PlayerAdmin, reportId: 'gamesForPlayerSchedulerReport' },
  {
    name: 'Game Choices for Player Scheduler',
    perm: Perms.PlayerAdmin,
    reportId: 'gameChoicesForPlayerSchedulerReport',
  },
  { name: 'Game And Players', reportId: 'gameAndPlayersReport' },
  { name: 'Rooms By Room', reportId: 'roomsByRoomReport' },
  { name: 'Rooms By Game', reportId: 'roomsByGameReport' },
  { name: 'Game Assignments', reportId: 'gameAssignmentsReport' },
  { name: 'Voucher', reportId: 'voucherReport' },
]

export const getServerSideProps = configGetServerSideProps

const Page: NextPage = () => <Reports reports={reports} />

export default Page
