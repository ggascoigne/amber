import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import Credits from '@amber/amber/views/Credits'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <Credits />

export default Page
