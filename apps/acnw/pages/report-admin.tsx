import * as React from 'react'

import type { PdfReportRecord, ReportRecord } from '@amber/amber/views/Reports'
import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import { Reports } from '@amber/amber/views/Reports'

const reports: ReportRecord[] = [
  { name: 'Membership', reportId: 'membershipReport' },
  { name: 'Game', reportId: 'gameReport' },
  { name: 'Discord Game', reportId: 'discordGameReport', virtual: true },
  { name: 'GM', reportId: 'gmReport' },
  { name: 'Game And Players', reportId: 'gameAndPlayersReport' },
  { fileLabel: 'room', name: 'Room Usage', reportId: 'roomReport' },
  { name: 'Donor', reportId: 'donorReport' },
  { fileLabel: 'memberPayments', name: 'Member Payment Details', reportId: 'memberPaymentDetailsReport' },
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
