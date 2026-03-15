import * as React from 'react'

import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import ScheduleRoomAssignmentsPage from '@amber/amber/views/Schedule/ScheduleRoomAssignmentsPage'
import type { NextPage } from 'next'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <ScheduleRoomAssignmentsPage />

export default Page
