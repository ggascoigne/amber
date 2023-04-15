import { getSession } from '@auth0/nextjs-auth0'
import { config, DbConfig } from 'database/shared/config'
import { NextApiRequest, NextApiResponse } from 'next'

import { authDomain } from './_constants'
import { handleError } from './_handleError'
import { isAdmin } from './_utils'

// /api/getConfig
// auth token: required
// body: {}

const getConfigRoute = async (req: NextApiRequest, res: NextApiResponse) => {
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
