import * as React from 'react'

import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import SchedulePage from '@amber/amber/views/Schedule/SchedulePage'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import type { NextPage } from 'next'

const Page: NextPage = () => <SchedulePage />

export default Page

export const getServerSideProps = withPageAuthRequired({ getServerSideProps: configGetServerSideProps })
