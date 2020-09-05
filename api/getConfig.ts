import { Request, Response } from 'express'

import { DbConfig, config } from '../shared/config'
import { isAdmin, requireJwt } from './_checkJwt'
import { JsonError } from './_JsonError'
import { withApiHandler } from './_standardHandler'

// /api/getConfig
// auth token: required
// body: {}

export default withApiHandler([
  requireJwt,
  async (req: Request, res: Response) => {
    try {
      const { user } = req as any
      const admin = isAdmin(user)
      const database: Partial<DbConfig> = { ...config.database }
      delete database.password
      const result = { ...config, database }
      res.send(admin ? result : {})
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
