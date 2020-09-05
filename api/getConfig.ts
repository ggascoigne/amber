import { Request, Response } from 'express'

import { DbConfig, config } from '../shared/config'
import { checkJwt, isAdmin } from './_checkJwt'
import { JsonError } from './_JsonError'
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
      const database: Partial<DbConfig> = { ...config.database }
      delete database.password
      const summary = {
        local: !database.host?.includes('aws'),
        databaseName: database.database,
      }
      res.send(admin ? { ...summary, database } : { ...summary })
    } catch (err) {
      if (err instanceof JsonError) {
        res.status(err.status).send({
          status: err.status,
          error: err.message,
        })
      } else {
        res.status(err.status || 500).send({
          error: err.message,
        })
      }
    }
  },
])
