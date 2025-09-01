import * as React from 'react'

import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import type { NextPage } from 'next'

import AboutAmberconNw from '../views/AboutAmberconNw'

export const getServerSideProps = configGetServerSideProps

const Page: NextPage = () => <AboutAmberconNw />

export default Page
