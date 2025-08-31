import * as React from 'react'

import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import { PaymentSuccess } from '@amber/amber/views/PaymentSuccess'
import type { NextPage } from 'next'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <PaymentSuccess />

export default Page
