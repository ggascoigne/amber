import * as React from 'react'

import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import HotelRoomTypes from 'amber/views/HotelRoomTypes/HotelRoomTypes'
import type { NextPage } from 'next'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <HotelRoomTypes />

export default Page
