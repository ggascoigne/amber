import * as React from 'react'

import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import type { NextPage } from 'next'

import Hotel from '../views/Hotel'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <Hotel />

export default Page
