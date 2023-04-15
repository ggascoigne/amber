import * as React from 'react'

import { Reports, ReportRecord } from 'amber/views/Reports'
import type { NextPage } from 'next'

const reports: ReportRecord[] = [
  { name: 'Membership' },
  { name: 'Game' },
  { name: 'Discord Game', virtual: true },
  { name: 'GM' },
  { name: 'Game And Players' },
  { name: 'Room Usage', fileLabel: 'room' },
]

const Page: NextPage = () => <Reports reports={reports} />

export default Page
