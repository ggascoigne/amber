import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import Lookups from '@amber/amber/views/Lookups/Lookups'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <Lookups />

export default Page
