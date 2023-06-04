import * as React from 'react'

import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import Transactions from 'amber/views/Transactions/Transactions'
import type { NextPage } from 'next'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <Transactions />

export default Page
