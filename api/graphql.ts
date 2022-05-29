import { postgraphile } from 'postgraphile'

import { PoolType, getPool, getSchemas } from '../shared/config'
import { options } from '../shared/postgraphileOptions'
import { checkJwt, getUserId, isAdmin } from './_checkJwt'
import { audience, isDev } from './_constants'
import { withApiHandler } from './_standardHandler'

// FYI export DEBUG="postgraphile:postgres*"to access the postgraphile debugging

// /api/graphql
// auth token: optional
// body: graphql query/mutation

export default withApiHandler([
  checkJwt,
  postgraphile(getPool(PoolType.USER, `${__dirname}/../shared/`), getSchemas(), {
    ...options,
    readCache: `${__dirname}/../shared/postgraphile.cache`,
    pgSettings: (req) => {
      const { auth } = req as any
      const settings: Record<string, any> = {}
      if (auth?.[audience]) {
        const admin = isAdmin(auth)
        const userId = getUserId(auth)
        // string values because pgSettings only groks strings
        settings['user.id'] = `${userId}`
        settings['user.admin'] = `${admin}`
        isDev && console.log(`userId(${userId}) is ${admin ? 'admin' : 'not-admin'}`)
      } else {
        isDev && console.log('not logged in')
      }
      return settings
    },
  }),
])
