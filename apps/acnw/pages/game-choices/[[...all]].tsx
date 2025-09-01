import * as React from 'react'

import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import GameChoiceSummary from '@amber/amber/views/GameSignup/GameChoiceSummary'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import type { NextPage } from 'next'

const Page: NextPage = () => <GameChoiceSummary />

export default Page

export const getServerSideProps = withPageAuthRequired({ getServerSideProps: configGetServerSideProps })
