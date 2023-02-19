import * as React from 'react'
import type { NextPage } from 'next'
import { Reports, ReportRecord } from 'amber/views/Reports'
import { Perms } from 'amber/components/Auth'

const reports: ReportRecord[] = [
  { name: 'Membership' },
  { name: 'Members Without Game Choices' },
  { name: 'Game' },
  { name: 'GM' },
  { name: 'Games Scheduler' },
  { name: 'Members for Player Scheduler', perm: Perms.PlayerAdmin },
  { name: 'Games for Player Scheduler', perm: Perms.PlayerAdmin },
  { name: 'Game Choices for Player Scheduler', perm: Perms.PlayerAdmin },
  { name: 'Game And Players' },
]

const Page: NextPage = () => <Reports reports={reports} />

export default Page
