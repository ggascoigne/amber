import React, { PropsWithChildren } from 'react'

import { Children } from 'ui'

import type { Perms } from './PermissionRules'
import { Auth0User, useAuth } from './useAuth'

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

enum LoginStates {
  NOT_LOGGED_IN = 'notLoggedIn',
  UNVERIFIED = 'unverified',
  INCOMPLETE = 'incomplete',
  LOGGED_IN = 'loggedIn',
}

const getLoginState = (user?: Auth0User): LoginStates => {
  if (!user) {
    return LoginStates.NOT_LOGGED_IN
  }
  if (!user?.email_verified) {
    return LoginStates.UNVERIFIED
  }
  if (!user?.userId) {
    return LoginStates.INCOMPLETE
  }
  return LoginStates.LOGGED_IN
}

export const IsNotLoggedIn: React.FC<Children> = ({ children }) => {
  const { user } = useAuth()
  return getLoginState(user) === LoginStates.NOT_LOGGED_IN ? <>{children}</> : null
}

export const IsUnverified: React.FC<Children> = ({ children }) => {
  const { user } = useAuth()
  return getLoginState(user) === LoginStates.UNVERIFIED ? <>{children}</> : null
}

export const IsVerifiedIncomplete: React.FC<Children> = ({ children }) => {
  const { user } = useAuth()
  return getLoginState(user) === LoginStates.INCOMPLETE ? <>{children}</> : null
}

export const IsLoggedIn: React.FC<Children> = ({ children }) => {
  const { user } = useAuth()
  return getLoginState(user) === LoginStates.LOGGED_IN ? <>{children}</> : null
}
