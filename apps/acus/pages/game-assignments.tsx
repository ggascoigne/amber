import * as React from 'react'

import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import GameAssignmentsPage from '@amber/amber/views/GameAssignments/GameAssignmentsPage'
import type { NextPage } from 'next'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <GameAssignmentsPage />

export default Page
