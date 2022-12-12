import * as React from 'react'
import type { NextPage } from 'next'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import GmPage from 'ui/views/GmPage/GmPage'

const Page: NextPage = () => <GmPage />

export default Page

export const getServerSideProps = withPageAuthRequired()
