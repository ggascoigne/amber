import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import RoomAssignmentsPage from '@amber/amber/views/RoomAssignments/RoomAssignmentsPage'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <RoomAssignmentsPage />

export default Page
