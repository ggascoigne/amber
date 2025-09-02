import * as React from 'react'

import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import { auth0 } from '@amber/server/src/auth/auth0'
import type { NextPage } from 'next'

import VirtualDetails from '../views/VirtualDetails'

const Page: NextPage = () => <VirtualDetails />

export default Page

export const getServerSideProps = auth0.withPageAuthRequired({ getServerSideProps: configGetServerSideProps })
