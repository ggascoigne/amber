import { postgraphile } from 'postgraphile'

import { getPool, getSchemas } from '../../shared/config'
import { options } from '../../shared/postgraphileOptions'
import { checkJwt, getUserId, isAdmin } from '../_checkJwt'
import { audience, isDev } from '../_constants'
import { withApiHandler } from '../_standardHandler'

// /api/graphql
// auth token: optional
// body: graphql query/mutation

export default withApiHandler([
  checkJwt,
  postgraphile(getPool(`${__dirname}/../../shared/`), getSchemas(), {
    ...options,
    readCache: `${__dirname}/../../shared/postgraphile.cache`,
    pgSettings: (req) => {
      const { user } = req as any
      const settings: Record<string, any> = {}
      if (user && user[audience]) {
        const admin = isAdmin(user)
        const userId = getUserId(user)
        // string values because pgSettings only groks strings
        settings['user.id'] = `${userId}`
        settings['user.admin'] = `${admin}`
        isDev && admin && console.log(`userId(${userId}) is admin`)
      }
      return settings
    },
  }),
])
