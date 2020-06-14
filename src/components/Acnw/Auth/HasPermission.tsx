import * as React from 'react'

import { useAuth } from './Auth0'
import type { Perms } from './PermissionRules'

type PermissionProps = {
  permission: Perms
  data?: any
  denied?: () => React.ReactElement | null
}

const nullOp = (): null => null

export const HasPermission: React.FC<PermissionProps> = ({ permission, data, children = null, denied = nullOp }) => {
  const { hasPermissions } = useAuth()
  const allowed = hasPermissions(permission, data)
  return allowed ? <>{children}</> : denied()
}
