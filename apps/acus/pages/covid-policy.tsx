import * as React from 'react'

import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import type { NextPage } from 'next'

import CovidPolicy from '../views/CovidPolicy'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <CovidPolicy />

export default Page
