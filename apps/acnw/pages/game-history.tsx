import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import GameBookPage from '@amber/amber/views/GameBook/GameBookPage'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <GameBookPage />

export default Page
