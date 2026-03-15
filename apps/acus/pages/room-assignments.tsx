import * as React from 'react'

import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import RoomAssignmentsPage from '@amber/amber/views/RoomAssignments/RoomAssignmentsPage'
import type { NextPage } from 'next'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <RoomAssignmentsPage />

export default Page
