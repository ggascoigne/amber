// import { find } from 'lodash'
import * as React from 'react'

import { AuthConsumer } from './authContext'
import rules, { Perms, Rules } from './PermissionRules'

const check = (rules: Rules, role: string, action: Perms, data?: any) => {
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

interface IPermissionProps {
  permission: Perms
  data?: any
  denied?: () => React.ReactNode
}

const nullOp = (): null => null

interface IAuth {
  user: {
    role?: string
  }
}

const HasPermission: React.FC<IPermissionProps> = ({ permission, data, children = null, denied = nullOp }) => {
  return (
    <AuthConsumer>
      {({ user }: IAuth) => {
        return check(rules, user && user.role ? user.role : undefined, permission, data) ? children : denied()
      }}
    </AuthConsumer>
  )
}

/*
export const hasPermission = (auth, permission, data) => {
  const { roles } = getAuthProps(auth)
  return checkMany(rules, roles, permission, data)
}
*/

export default HasPermission
