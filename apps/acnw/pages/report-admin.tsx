import * as React from 'react'

import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import type { ReportRecord } from '@amber/amber/views/Reports'
import { Reports } from '@amber/amber/views/Reports'
import type { NextPage } from 'next'

const reports: ReportRecord[] = [
  { name: 'Membership' },
  { name: 'Game' },
  { name: 'Discord Game', virtual: true },
  { name: 'GM' },
  { name: 'Game And Players' },
  { name: 'Room Usage', fileLabel: 'room' },
]

export const getServerSideProps = configGetServerSideProps

const Page: NextPage = () => <Reports reports={reports} />

export default Page
