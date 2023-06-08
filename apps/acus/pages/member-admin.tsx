import * as React from 'react'

import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import type { NextPage } from 'next'

import { Memberships } from '../views/Memberships/Memberships'

export const getServerSideProps = configGetServerSideProps
const Page: NextPage = () => <Memberships />

export default Page
