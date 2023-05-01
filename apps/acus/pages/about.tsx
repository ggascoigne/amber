import * as React from 'react'

import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import type { NextPage } from 'next'

import AboutAmberconUs from '../views/AboutAmberconUs'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <AboutAmberconUs />

export default Page
