import * as React from 'react'

import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import Settings from 'amber/views/Settings/Settings'
import type { NextPage } from 'next'

export const getServerSideProps = configGetServerSideProps

const Page: NextPage = () => <Settings />

export default Page
