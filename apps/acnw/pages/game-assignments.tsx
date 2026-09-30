import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import GameAssignmentsPage from '@amber/amber/views/GameAssignments/GameAssignmentsPage'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <GameAssignmentsPage />

export default Page
