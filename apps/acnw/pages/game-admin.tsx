import * as React from 'react'

import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import Games from 'amber/views/Games/Games'
import type { NextPage } from 'next'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <Games />

export default Page
