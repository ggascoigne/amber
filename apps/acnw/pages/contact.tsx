import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'

import Contact from '../views/Contact'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <Contact />

export default Page
