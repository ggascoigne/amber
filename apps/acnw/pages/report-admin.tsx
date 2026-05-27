import * as React from 'react'

import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import type { PdfReportRecord, ReportRecord } from '@amber/amber/views/Reports'
import { Reports } from '@amber/amber/views/Reports'
import type { NextPage } from 'next'

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

const pdfReports: Array<PdfReportRecord> = [{ name: 'Member Labels', pdfReportId: 'memberLabels' }]

export const getServerSideProps = configGetServerSideProps

const Page: NextPage = () => <Reports pdfReports={pdfReports} reports={reports} />

export default Page
