import * as React from 'react'

import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import GameSignupPage from 'amber/views/GameSignup/GameSignupPage'
import type { NextPage } from 'next'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <GameSignupPage />

export default Page
