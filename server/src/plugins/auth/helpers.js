import _ from 'lodash'

import roles from './roles'

// get scopes for a user
export function getScopes (roleNames) {
  return _.uniq(_.flatten(roleNames.map(roleName => roles[roleName])))
}
