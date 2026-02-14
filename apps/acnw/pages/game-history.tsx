import * as React from 'react'

import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import GameBookPage from '@amber/amber/views/GameBook/GameBookPage'
import type { NextPage } from 'next'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <GameBookPage />

export default Page
