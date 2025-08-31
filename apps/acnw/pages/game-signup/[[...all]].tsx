import * as React from 'react'

import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import GameSignupPage from '@amber/amber/views/GameSignup/GameSignupPage'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import type { NextPage } from 'next'

const Page: NextPage = () => <GameSignupPage />

export default Page

export const getServerSideProps = withPageAuthRequired({ getServerSideProps: configGetServerSideProps })
