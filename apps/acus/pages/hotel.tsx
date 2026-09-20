import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'

import Hotel from '../views/Hotel'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <Hotel />

export default Page
