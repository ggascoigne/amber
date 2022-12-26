import * as React from 'react'
import type { NextPage } from 'next'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import MembershipSummary from 'amber/views/Memberships/MembershipSummary'

const Page: NextPage = () => <MembershipSummary />

export default Page

export const getServerSideProps = withPageAuthRequired()
