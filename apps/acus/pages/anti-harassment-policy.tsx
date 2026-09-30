import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'

import AntiHarassmentPolicy from '../views/AntiHarassmentPolicy'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <AntiHarassmentPolicy />

export default Page
