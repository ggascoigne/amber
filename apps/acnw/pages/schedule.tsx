import * as React from 'react'

import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import SchedulePage from 'amber/views/Schedule/SchedulePage'
import type { NextPage } from 'next'

const Page: NextPage = () => <SchedulePage />

export default Page

export const getServerSideProps = withPageAuthRequired({ getServerSideProps: configGetServerSideProps })
