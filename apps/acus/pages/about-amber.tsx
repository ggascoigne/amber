import * as React from 'react'

import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import type { NextPage } from 'next'

import AboutAmber from '../views/AboutAmber'

const Page: NextPage = () => <AboutAmber />
export const getServerSideProps = configGetServerSideProps

export default Page
