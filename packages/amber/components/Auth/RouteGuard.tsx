import Error from 'next/error'
import { useRouter } from 'next/router'
import { Children } from 'ui'

import { HasPermission } from './HasPermission'

import { RootRoutes } from '../Navigation'

type RouteGuardProps = Children & {
  routes: RootRoutes
}

export const RouteGuard = ({ children, routes }: RouteGuardProps) => {
  const router = useRouter()
  const matching = routes.find((r) => r.path === router.route)
  if (matching?.permission) {
    return (
      <HasPermission permission={matching.permission} denied={() => <Error statusCode={403} title='Unauthorized' />}>
        {children}
      </HasPermission>
    )
  } else {
    return <>{children}</>
  }
}
