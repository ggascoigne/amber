import * as React from 'react'

import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import type { NextPage } from 'next'

import AntiHarassmentPolicy from '../views/AntiHarassmentPolicy'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <AntiHarassmentPolicy />

export default Page
