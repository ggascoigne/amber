import { NextApiRequest, NextApiResponse } from 'next'

import { getSession } from '@auth0/nextjs-auth0'
import { config, DbConfig } from '@/shared/config'
import { handleError } from './_handleError'
import { authDomain } from './_constants'
import { isAdmin } from './_utils'
import { ensureShared } from './_referencesShared'

// /api/getConfig
// auth token: required
// body: {}

const getConfigRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  ensureShared()
  try {
    const { user } = (await getSession(req, res)) ?? { user: null }
    const admin = isAdmin(user)
    const database: Partial<DbConfig> = { ...config.userDatabase }
    delete database.password
    const summary = {
      local: !database.host?.includes('aws'),
      databaseName: database.database,
      nodeVersion: process.version,
      authDomain,
    }
    res.send(admin ? { ...summary, database } : { ...summary })
  } catch (err) {
    handleError(err, res)
  }
}

export default getConfigRoute
