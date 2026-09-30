import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'

import Accommodations from '../views/Accommodations'

export const getServerSideProps = configGetServerSideProps

const Page: NextPage = () => <Accommodations />

export default Page
