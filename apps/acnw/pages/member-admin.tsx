import * as React from 'react'

import type { NextPage } from 'next'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'

import { Memberships } from '../views/Memberships/Memberships'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <Memberships />

export default Page
