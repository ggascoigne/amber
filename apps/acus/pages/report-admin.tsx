import * as React from 'react'
import type { NextPage } from 'next'
import { Reports, ReportRecord } from 'amber/views/Reports'
import { Perms } from 'amber/components/Auth'

const reports: ReportRecord[] = [
  { name: 'Membership' },
  { name: 'Game' },
  { name: 'GM' },
  { name: 'Game And Players' },
  { name: 'Games Scheduler' },
  { name: 'Game Choices', perm: Perms.PlayerAdmin },
  { name: 'Members Without Game Choices' },
]

const Page: NextPage = () => <Reports reports={reports} />

export default Page
