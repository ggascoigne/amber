import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import GmPage from '@amber/amber/views/GmPage/GmPage'
import { auth0 } from '@amber/server/src/auth/auth0'

const Page: NextPage = () => <GmPage />

export default Page

export const getServerSideProps = auth0.withPageAuthRequired({
  getServerSideProps: configGetServerSideProps,
})
