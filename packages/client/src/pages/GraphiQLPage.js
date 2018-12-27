import HasPermission from 'components/Auth/HasPermission'
import Loader from 'components/Loader/Loader'
import React, { Suspense } from 'react'
import { Redirect } from 'react-router-dom'

const GraphiQL = React.lazy(() => import('components/GraphiQL/GraphiQL'))

const GraphiQLPage = () => {
  const loader = <Loader />
  return (
    <HasPermission permission={'graphiql:load'} denied={() => <Redirect to='/' />}>
      <Suspense fallback={loader}>
        <GraphiQL />
      </Suspense>
    </HasPermission>
  )
}

export default GraphiQLPage
