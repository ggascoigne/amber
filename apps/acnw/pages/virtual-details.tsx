import * as React from 'react'

import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import type { NextPage } from 'next'

import VirtualDetails from '../views/VirtualDetails'

const Page: NextPage = () => <VirtualDetails />

export default Page

export const getServerSideProps = withPageAuthRequired({ getServerSideProps: configGetServerSideProps })
