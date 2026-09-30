import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import Transactions from '@amber/amber/views/Transactions/Transactions'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <Transactions />

export default Page
