import * as React from 'react'

import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import GameChoiceSummary from '@amber/amber/views/GameSignup/GameChoiceSummary'
import type { NextPage } from 'next'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <GameChoiceSummary />

export default Page
