import { Children } from 'ui'
import { useRouter } from 'next/router'
import Error from 'next/error'
import { RootRoutes } from '../Navigation'
import { HasPermission } from './HasPermission'

type RouteGuardProps = Children & {
  routes: RootRoutes
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children, routes }) => {
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
