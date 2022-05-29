import { VercelRequest, VercelResponse } from '@vercel/node'

import { DbConfig, config } from '../shared/config'
import { checkJwt, isAdmin } from './_checkJwt'
import { handleError } from './_handleError'
import { withApiHandler } from './_standardHandler'

// /api/getConfig
// auth token: required
// body: {}

export default withApiHandler([
  checkJwt,
  async (req: VercelRequest, res: VercelResponse) => {
    try {
      const { auth } = req as any
      const admin = isAdmin(auth)
      const database: Partial<DbConfig> = { ...config.userDatabase }
      delete database.password
      const summary = {
        local: !database.host?.includes('aws'),
        databaseName: database.database,
        nodeVersion: process.version,
      }
      res.send(admin ? { ...summary, database } : { ...summary })
    } catch (err: any) {
      handleError(err, res)
    }
  },
])
