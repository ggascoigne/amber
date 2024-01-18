import * as React from 'react'

import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import Stripe from 'amber/views/Stripe/Stripe'
import type { NextPage } from 'next'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <Stripe />

export default Page
