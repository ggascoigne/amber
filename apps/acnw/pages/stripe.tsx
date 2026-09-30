import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import Stripe from '@amber/amber/views/Stripe/Stripe'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <Stripe />

export default Page
