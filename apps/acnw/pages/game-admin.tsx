import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import Games from '@amber/amber/views/Games/Games'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <Games />

export default Page
