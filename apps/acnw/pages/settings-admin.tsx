import * as React from 'react'

import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import Settings from 'amber/views/Settings/Settings'
import type { NextPage } from 'next'

const Page: NextPage = () => <Settings />

export const getServerSideProps = configGetServerSideProps

export default Page
