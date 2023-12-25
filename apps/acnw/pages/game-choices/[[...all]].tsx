import * as React from 'react'

import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import GameChoiceSummary from 'amber/views/GameSignup/GameChoiceSummary'
import type { NextPage } from 'next'

const Page: NextPage = () => <GameChoiceSummary />

export default Page

export const getServerSideProps = withPageAuthRequired({ getServerSideProps: configGetServerSideProps })
