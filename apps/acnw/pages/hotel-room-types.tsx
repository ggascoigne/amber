import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import HotelRoomTypes from '@amber/amber/views/HotelRoomTypes/HotelRoomTypes'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <HotelRoomTypes />

export default Page
