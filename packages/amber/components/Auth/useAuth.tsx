import { useCallback } from 'react'

import { useUser } from '@auth0/nextjs-auth0'
import type { User as Auth0LibUser } from '@auth0/nextjs-auth0/types'

import { checkMany } from './authUtils'
import rules, { Perms } from './PermissionRules'
import { useRoleOverride } from './useRoleOverride'

interface AuthInfo {
  roles?: string[]
  userId?: number
}

export interface Auth0User extends AuthInfo, Auth0LibUser {}

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
  const userContext = useUser() as unknown as UserContext & { invalidate: () => Promise<Auth0LibUser | undefined> }
  const { user } = userContext
  const hasPermissions = useCallback(
    (perm: Perms, d?: any) => !!user && checkMany(rules, user.roles, perm, roleOverride, d),
    [roleOverride, user],
  )
  return {
    ...userContext,
    checkSession: async () => {
      await userContext.invalidate()
    },
    hasPermissions,
  }
}
