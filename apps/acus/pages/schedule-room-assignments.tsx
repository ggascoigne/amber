import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import ScheduleRoomAssignmentsPage from '@amber/amber/views/Schedule/ScheduleRoomAssignmentsPage'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <ScheduleRoomAssignmentsPage />

export default Page
