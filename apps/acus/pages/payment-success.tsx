import * as React from 'react'

import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import { PaymentSuccess } from 'amber/views/PaymentSuccess'
import type { NextPage } from 'next'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <PaymentSuccess />

export default Page
