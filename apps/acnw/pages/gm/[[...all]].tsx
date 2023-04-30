import * as React from 'react'

import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import GmPage from 'amber/views/GmPage/GmPage'
import type { NextPage } from 'next'

const Page: NextPage = () => <GmPage />

export default Page

export const getServerSideProps = withPageAuthRequired({ getServerSideProps: configGetServerSideProps })
