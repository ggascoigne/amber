import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import HotelRoomDetails from '@amber/amber/views/HotelRoomDetails/HotelRoomDetails'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <HotelRoomDetails />

export default Page
