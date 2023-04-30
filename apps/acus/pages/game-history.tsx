import * as React from 'react'

import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import GameBookPage from 'amber/views/GameBook/GameBookPage'
import type { NextPage } from 'next'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <GameBookPage />

export default Page
