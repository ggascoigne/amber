import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'

import CovidPolicy from '../views/CovidPolicy'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <CovidPolicy />

export default Page
