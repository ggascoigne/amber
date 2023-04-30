import * as React from 'react'

import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'

export const getServerSideProps = configGetServerSideProps
const GraphiQL = dynamic(() => import('ui/components/GraphiQL/GraphiQL'), {
  ssr: false,
})

const GraphiQLPage: NextPage = () => <GraphiQL />

export default GraphiQLPage
