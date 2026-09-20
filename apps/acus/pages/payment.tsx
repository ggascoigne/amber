import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import { Payment } from '@amber/amber/views/Payment'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <Payment />

export default Page
