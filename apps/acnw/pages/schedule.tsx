import * as React from 'react'
import type { NextPage } from 'next'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import SchedulePage from 'amber/views/Schedule/SchedulePage'

const Page: NextPage = () => <SchedulePage />

export default Page

export const getServerSideProps = withPageAuthRequired()
