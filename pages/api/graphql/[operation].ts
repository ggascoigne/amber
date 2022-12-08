/* eslint-disable @typescript-eslint/no-shadow */
import { postgraphile } from 'postgraphile'

import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from '@auth0/nextjs-auth0'
import { getPool, getSchemas, PoolType } from '@/shared/config'
import { options } from '@/shared/postgraphileOptions'
import { isDev } from '@/pages/api/_constants'
import { getUserId, isAdmin } from '@/pages/api/_utils'
import { ensureShared } from '../_referencesShared'

// note that the route here is /api/graphql/[:operation] because I like to append the query
// operation name to the path to make debugging the queries easier in Chrome dev tools.

// FYI export DEBUG="postgraphile:postgres*"to access the postgraphile debugging

// /api/graphql
// auth token: optional
// body: graphql query/mutation

const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: any) =>
  new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })

// GraphQL route that handles queries
export const graphqlRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.url?.startsWith('/api/graphql')) req.url = '/api/graphql'

  ensureShared()

  await runMiddleware(
    req,
    res,
    postgraphile(getPool(PoolType.USER, `${process.cwd()}/shared/`), getSchemas(), {
      ...options,
      readCache: `${process.cwd()}/shared/postgraphile.cache`,
      pgSettings: async (request) => {
        const { user } = (await getSession(request, res)) ?? { user: null }
        const settings: Record<string, any> = {}
        if (user) {
          const admin = isAdmin(user)
          const userId = getUserId(user)
          // string values because pgSettings only groks strings
          settings['user.id'] = `${userId}`
          settings['user.admin'] = `${admin}`
          isDev && console.log(`userId(${userId}) is ${admin ? 'admin' : 'not-admin'}`)
        } else {
          isDev && console.log('not logged in')
        }
        return settings
      },
    })
  )
  res.end()
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default graphqlRoute
