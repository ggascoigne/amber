import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import Users from '@amber/amber/views/Users/Users'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <Users />

export default Page
