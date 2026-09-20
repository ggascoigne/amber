import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import GameChoiceSummary from '@amber/amber/views/GameSignup/GameChoiceSummary'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <GameChoiceSummary />

export default Page
