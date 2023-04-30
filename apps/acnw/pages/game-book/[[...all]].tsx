import * as React from 'react'

import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import GameBookGamesPage from 'amber/views/GameBook/GameBookGamesPage'
import type { NextPage } from 'next'

export const getServerSideProps = configGetServerSideProps

const Page: NextPage = () => <GameBookGamesPage />

export default Page
