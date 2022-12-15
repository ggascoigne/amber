import * as React from 'react'
import type { NextPage } from 'next'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import VirtualDetails from '../views/VirtualDetails'

const Page: NextPage = () => <VirtualDetails />

export default Page

export const getServerSideProps = withPageAuthRequired()
