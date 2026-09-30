import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import GameBookGamesPage from '@amber/amber/views/GameBook/GameBookGamesPage'

export const getServerSideProps = configGetServerSideProps

const Page: NextPage = () => <GameBookGamesPage />

export default Page
