import * as React from 'react'

import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import Users from 'amber/views/Users/Users'
import type { NextPage } from 'next'

export const getServerSideProps = configGetServerSideProps

const Page: NextPage = () => <Users />

export default Page
