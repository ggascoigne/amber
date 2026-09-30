import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import GameRooms from '@amber/amber/views/GameRooms/GameRooms'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <GameRooms />

export default Page
