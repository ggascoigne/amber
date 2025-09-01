import * as React from 'react'

import { Perms } from '@amber/amber/components/Auth'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import { Reports, ReportRecord } from '@amber/amber/views/Reports'
import type { NextPage } from 'next'

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

export const getServerSideProps = configGetServerSideProps

const Page: NextPage = () => <Reports reports={reports} />

export default Page
