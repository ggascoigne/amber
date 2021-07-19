// this started off based on https://auth0.com/blog/role-based-access-control-rbac-and-react-apps/
// changes are all my fault

import find from 'lodash/find'

import type { Perms, Roles, Rules } from './PermissionRules'

// note that incoming roles are defined as strings rather than Roles as they come from an external source
// and so aren't constrained to the Roles enumeration

const check = (rules: Rules, role: string | null, action: Perms, roleOverride: Roles | undefined, data?: any) => {
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const roleToTest = (data?.ignoreOverride ? role : roleOverride) || role

  if (!roleToTest) {
    return false
  }
  const permissions = rules[roleToTest] as any
  if (!permissions) {
    // role is not present in the rules
    return false
  }

  if (permissions.static?.includes(action)) {
    return true
  }

  if (permissions.dynamic) {
    const permissionCondition = permissions.dynamic[action] || permissions.dynamic['*']
    if (!permissionCondition) {
      // dynamic rule not provided for action
      return false
    }

    return permissionCondition(data)
  }
  return false
}

export const checkMany = (
  rules: Rules,
  roles: string[] | undefined,
  action: Perms,
  roleOverride: Roles | undefined,
  data?: any
) => !!find(roles, (role) => check(rules, role, action, roleOverride, data))
