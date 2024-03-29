import * as React from 'react'

import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import HotelRoomDetails from 'amber/views/HotelRoomDetails/HotelRoomDetails'
import type { NextPage } from 'next'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <HotelRoomDetails />

export default Page
