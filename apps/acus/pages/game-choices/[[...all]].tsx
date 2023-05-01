import * as React from 'react'

import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import GameChoiceSummary from 'amber/views/GameSignup/GameChoiceSummary'
import type { NextPage } from 'next'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <GameChoiceSummary />

export default Page
