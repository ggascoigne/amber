import HasPermission from 'components/Auth/HasPermission'
import Loadable from 'components/Loadable/Loadable'
import React from 'react'
import { Redirect } from 'react-router-dom'

const AsyncGraphiQL = Loadable({
  loader: () => import('../components/GraphiQL/GraphiQL')
})

export const GraphiQLPage = () => {
  return (
    <HasPermission permission={'graphiql:load'} denied={() => <Redirect to='/' />}>
      <AsyncGraphiQL />
    </HasPermission>
  )
}
