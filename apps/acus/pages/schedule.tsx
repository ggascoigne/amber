import * as React from 'react'

import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import SchedulePage from '@amber/amber/views/Schedule/SchedulePage'
import { auth0 } from '@amber/server/src/auth/auth0'
import type { NextPage } from 'next'

const Page: NextPage = () => <SchedulePage />

export default Page

export const getServerSideProps = auth0.withPageAuthRequired({ getServerSideProps: configGetServerSideProps })
