import * as React from 'react'

import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import type { NextPage } from 'next'

import MembershipSummary from '../../views/Memberships/MembershipSummary'

const Page: NextPage = () => <MembershipSummary />

export default Page

export const getServerSideProps = withPageAuthRequired({ getServerSideProps: configGetServerSideProps })
