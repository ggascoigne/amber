import * as React from 'react'

import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import Lookups from 'amber/views/Lookups/Lookups'
import type { NextPage } from 'next'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <Lookups />

export default Page
