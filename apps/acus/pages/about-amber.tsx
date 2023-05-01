import * as React from 'react'

import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import type { NextPage } from 'next'

import AboutAmber from '../views/AboutAmber'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <AboutAmber />

export default Page
