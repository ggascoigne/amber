import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import GameChoiceSummary from '@amber/amber/views/GameSignup/GameChoiceSummary'
import { auth0 } from '@amber/server/src/auth/auth0'

const Page: NextPage = () => <GameChoiceSummary />

export default Page

export const getServerSideProps = auth0.withPageAuthRequired({
  getServerSideProps: configGetServerSideProps,
})
