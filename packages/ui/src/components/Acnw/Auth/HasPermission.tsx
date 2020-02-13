// import { find } from 'lodash'
import * as React from 'react'

import { AuthConsumer } from './authContext'
import rules, { Perms, Rules } from './PermissionRules'

const check = (rules: Rules, role: string | null, action: Perms, data?: any) => {
  if (!role) return false
  const permissions = rules[role] as any
  if (!permissions) {
    // role is not present in the rules
    return false
  }

  const staticPermissions = permissions.static

  if (staticPermissions && staticPermissions.includes(action)) {
    return true
  }

  const dynamicPermissions = permissions.dynamic

  if (dynamicPermissions) {
    const permissionCondition = dynamicPermissions[action] || dynamicPermissions['*']
    if (!permissionCondition) {
      // dynamic rule not provided for action
      return false
    }

    return permissionCondition(data)
  }
  return false
}

/*
export const checkMany = (
  rules: Rules,
  roles: string[],
  action: Perms,
  data?: any
) => {
  return !!find(roles, role => check(rules, role, action, data))
}
*/

type PermissionProps = {
  permission: Perms
  data?: any
  denied?: () => React.ReactNode
}

const nullOp = (): null => null

type Auth = {
  user?: {
    role?: string
  }
}

const HasPermission: React.FC<PermissionProps> = ({ permission, data, children = null, denied = nullOp }) => (
  <AuthConsumer>
    {({ user }: Auth) => (!!user && check(rules, user.role ? user.role : null, permission, data) ? children : denied())}
  </AuthConsumer>
)

/*
export const hasPermission = (auth, permission, data) => {
  const { roles } = getAuthProps(auth)
  return checkMany(rules, roles, permission, data)
}
*/

export default HasPermission
