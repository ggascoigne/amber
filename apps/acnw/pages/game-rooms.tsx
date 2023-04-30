import * as React from 'react'

import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import GameRooms from 'amber/views/GameRooms/GameRooms'
import type { NextPage } from 'next'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <GameRooms />

export default Page
