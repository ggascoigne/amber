import * as React from 'react'

import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import type { NextPage } from 'next'

import Accommodations from '../views/Accommodations'

export const getServerSideProps = configGetServerSideProps

const Page: NextPage = () => <Accommodations />

export default Page
