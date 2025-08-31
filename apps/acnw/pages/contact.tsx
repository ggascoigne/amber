import * as React from 'react'

import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import type { NextPage } from 'next'

import Contact from '../views/Contact'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <Contact />

export default Page
