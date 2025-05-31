import { dbEnv } from '@amber/environment'
import { getSession } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import { postgraphile } from 'postgraphile'

import { getSchemas } from './config'
import { acnwReadCache, acusReadCache, options } from './postgraphileOptions'

export const getUserId = (user: any) => user?.userId

export const isAdmin = (user: any) => {
  const roles = user?.roles
  return roles && roles.indexOf('ROLE_ADMIN') !== -1
}

export const isDev = process.env.NODE_ENV !== 'production'

export const getPostgraphileHandler = (pool: any, req: NextApiRequest, res: NextApiResponse) =>
  postgraphile(pool, getSchemas(), {
    ...options,
    readCache: dbEnv === 'acnw' ? acnwReadCache : acusReadCache,
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
