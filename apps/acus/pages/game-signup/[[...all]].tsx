import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import GameSignupPage from '@amber/amber/views/GameSignup/GameSignupPage'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <GameSignupPage />

export default Page
