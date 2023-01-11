import * as React from 'react'
import type { NextPage } from 'next'
import { Reports, ReportRecord } from 'amber/views/Reports'

const reports: ReportRecord[] = [
  { name: 'Membership' },
  { name: 'Game' },
  { name: 'GM' },
  { name: 'Game And Players' },
  { name: 'Games Scheduler' },
]

const Page: NextPage = () => <Reports reports={reports} />

export default Page
