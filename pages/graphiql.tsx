import * as React from 'react'
import type { NextPage } from 'next'

import dynamic from 'next/dynamic'

const GraphiQL = dynamic(() => import('@/components/GraphiQL/GraphiQL'), {
  ssr: false,
})

const GraphiQLPage: NextPage = () => <GraphiQL />

export default GraphiQLPage
