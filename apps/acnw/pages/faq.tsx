import * as React from 'react'

import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import type { NextPage } from 'next'

import Faq from '../views/Faq'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <Faq />

export default Page
