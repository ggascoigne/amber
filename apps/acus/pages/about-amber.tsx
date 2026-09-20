import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'

import AboutAmber from '../views/AboutAmber'

const Page: NextPage = () => <AboutAmber />
export const getServerSideProps = configGetServerSideProps

export default Page
