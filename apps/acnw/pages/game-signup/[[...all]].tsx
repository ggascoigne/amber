import * as React from 'react'

import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import GameSignupPage from 'amber/views/GameSignup/GameSignupPage'
import type { NextPage } from 'next'

const Page: NextPage = () => <GameSignupPage />

export default Page

export const getServerSideProps = withPageAuthRequired({ getServerSideProps: configGetServerSideProps })
