import { UserProfile, useUser } from '@auth0/nextjs-auth0/client'
import { useCallback } from 'react'
import { useRoleOverride } from './useRoleOverride'
import rules, { Perms } from './PermissionRules'
import { checkMany } from './authUtils'

interface AuthInfo {
  roles?: string[]
  userId?: number
}

export interface Auth0User extends AuthInfo, UserProfile {}

export type UserContext = {
  user?: Auth0User
  error?: Error
  isLoading: boolean
  checkSession: () => Promise<void>
}

export type UseAuth = UserContext & {
  hasPermissions: (perm: Perms, d?: any) => boolean
}

export const useAuth = (): UseAuth => {
  const [roleOverride] = useRoleOverride()
  const userContext = useUser() as UserContext
  const { user } = userContext
  const hasPermissions = useCallback(
    (perm: Perms, d?: any) => !!user && checkMany(rules, user.roles, perm, roleOverride, d),
    [roleOverride, user]
  )
  return {
    ...userContext,
    hasPermissions,
  }
}
