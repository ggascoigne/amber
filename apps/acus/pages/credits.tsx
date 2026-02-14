import * as React from 'react'

import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import Credits from '@amber/amber/views/Credits'
import type { NextPage } from 'next'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <Credits />

export default Page
