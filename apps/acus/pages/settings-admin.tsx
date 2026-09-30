import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import Settings from '@amber/amber/views/Settings/Settings'

const Page: NextPage = () => <Settings />

export const getServerSideProps = configGetServerSideProps

export default Page
