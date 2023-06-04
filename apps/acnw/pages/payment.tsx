import * as React from 'react'

import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import { Payment } from 'amber/views/Payment'
import type { NextPage } from 'next'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <Payment />

export default Page
