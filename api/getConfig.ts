import { Request, Response } from 'express'

import { DbConfig, config } from '../shared/config'
import { checkJwt, isAdmin } from './_checkJwt'
import { handleError } from './_handleError'
import { withApiHandler } from './_standardHandler'

// /api/getConfig
// auth token: required
// body: {}

export default withApiHandler([
  checkJwt,
  async (req: Request, res: Response) => {
    try {
      const { user } = req as any
      const admin = isAdmin(user)
      const database: Partial<DbConfig> = { ...config.userDatabase }
      delete database.password
      const summary = {
        local: !database.host?.includes('aws'),
        databaseName: database.database,
        nodeVersion: process.version,
      }
      res.send(admin ? { ...summary, database } : { ...summary })
    } catch (err) {
      handleError(err, res)
    }
  },
])
