// import { find } from 'lodash'
import * as React from 'react'

import { AuthConsumer } from './authContext'
import rules from './PermissionRules'

const check = (rules, role, action, data) => {
  const permissions = rules[role]
  if (!permissions) {
    // role is not present in the rules
    return false
  }

  const staticPermissions = permissions.static

  if (staticPermissions && staticPermissions.includes(action)) {
    // static rule not provided for action
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
export const checkMany = (rules, roles, action, data) => {
  return !!find(roles, role => check(rules, role, action, data))
}
*/

const nullOp = () => null

const HasPermission = ({ permission, data, children = null, denied = nullOp }) => {
  return (
    <AuthConsumer>
      {({ user: { role } }) => {
        return check(rules, role, permission, data) ? children : denied()
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
