import * as React from 'react'

import { getRoles, useAuth0 } from './Auth0'
import rules, { Perms, Rules } from './PermissionRules'

const check = (rules: Rules, role: string | null, action: Perms, data?: any) => {
  if (!role) {
    return false
  }
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

type PermissionProps = {
  permission: Perms
  data?: any
  denied?: () => React.ReactElement | null
}

const nullOp = (): null => null

export const HasPermission: React.FC<PermissionProps> = ({ permission, data, children = null, denied = nullOp }) => {
  const { user } = useAuth0()
  return <>{!!user && check(rules, getRoles(user), permission, data) ? children : denied()}</>
}
