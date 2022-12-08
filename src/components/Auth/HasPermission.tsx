import React, { PropsWithChildren } from 'react'

import { useUser } from '@auth0/nextjs-auth0/client'
import { Children } from '@/utils'
import type { Perms } from './PermissionRules'
import { useAuth } from '@/components/Auth/useAuth'

interface PermissionProps {
  permission: Perms
  data?: any
  denied?: () => React.ReactElement | null
}

const nullOp = (): null => null

export const HasPermission: React.FC<PropsWithChildren<PermissionProps>> = ({
  permission,
  data,
  children = null,
  denied = nullOp,
}) => {
  const { hasPermissions } = useAuth()
  const allowed = hasPermissions(permission, data)
  return allowed ? <>{children}</> : denied()
}

export const IsLoggedIn: React.FC<Children> = ({ children }) => {
  const { user } = useUser()
  return user ? <>{children}</> : null
}

export const IsNotLoggedIn: React.FC<Children> = ({ children }) => {
  const { user } = useUser()
  return !user ? <>{children}</> : null
}
