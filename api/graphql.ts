import { postgraphile } from 'postgraphile'

import { getPool, getSchemas } from '../shared/config'
import { options } from '../shared/postgraphileOptions'
import { checkJwt } from './_checkJwt'
import { audience, isDev } from './_constants'
import { withApiHandler } from './_standardHandler'

// /api/graphql
// auth token: optional
// body: graphql query/mutation

export default withApiHandler([
  checkJwt,
  postgraphile(getPool(`${__dirname}/../shared/`), getSchemas(), {
    ...options,
    readCache: `${__dirname}/../shared/postgraphile.cache`,
    pgSettings: (req) => {
      const { user } = req as any
      // console.log(`user = ${JSON.stringify(user, null, 2)}`)
      const settings: Record<string, any> = {}
      if (user && user[audience]) {
        // string values because pgSettings only groks strings
        settings['user.id'] = `${user[audience].userId}`
        settings['user.admin'] = `${user[audience].roles.indexOf('ROLE_ADMIN') !== -1}`
      }
      isDev && console.log(`settings = ${JSON.stringify(settings, null, 2)}`)
      return settings
    },
  }),
])
