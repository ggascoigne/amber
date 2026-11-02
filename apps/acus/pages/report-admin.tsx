import * as React from 'react'

import type { PdfReportRecord, ReportRecord } from '@amber/amber/views/Reports'
import type { NextPage } from 'next'
import { Perms } from '@amber/amber/components/Auth'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import { Reports } from '@amber/amber/views/Reports'

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

const pdfReports: Array<PdfReportRecord> = [
  { fileLabel: 'badge-backs', name: 'Badge Backs', pdfReportId: 'badgeBacks' },
  { fileLabel: 'games-by-slot', name: 'Games By Slot', pdfReportId: 'gamesBySlot' },
  { fileLabel: 'game-room-use', name: 'Game Room Use', pdfReportId: 'gameRoomUse' },
  { fileLabel: 'pack-insert', name: 'Pack Insert', pdfReportId: 'packInsert' },
  { fileLabel: 'players-by-slot', name: 'Players By Slot', pdfReportId: 'playersBySlot' },
  { fileLabel: 'rooms-and-chairs', name: 'Rooms And Chairs', pdfReportId: 'roomsAndChairs' },
  { fileLabel: 'schedule-by-player', name: 'Schedule By Player', pdfReportId: 'scheduleByPlayer' },
  { fileLabel: 'where-is-eleanor', name: 'Where Is Eleanor?', pdfReportId: 'whereIsEleanor' },
  { name: 'Member Labels', pdfReportId: 'memberLabels' },
]

export const getServerSideProps = configGetServerSideProps

const Page: NextPage = () => <Reports pdfReports={pdfReports} reports={reports} />

export default Page
