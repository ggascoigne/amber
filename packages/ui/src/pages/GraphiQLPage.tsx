import { HasPermission } from 'components/Acnw/Auth'
import { Loader } from 'components/Acnw/Loader'
import React, { Suspense } from 'react'
import { Redirect } from 'react-router-dom'

import { Perms } from '../components/Acnw/Auth/PermissionRules'

const GraphiQL = React.lazy(() => import('components/Acnw/GraphiQL/GraphiQL'))

export const GraphiQLPage = () => {
  const loader = <Loader />
  return (
    <HasPermission permission={Perms.GraphiqlLoad} denied={() => <Redirect to='/' />}>
      <Suspense fallback={loader}>
        <GraphiQL />
      </Suspense>
    </HasPermission>
  )
}
