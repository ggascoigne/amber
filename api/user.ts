import { Request, Response } from 'express'

import { requireJwt } from './_checkJwt'
import { getManagementApiAccessToken } from './_getManagementApiAccessToken'
import { JsonError } from './_JsonError'
import { withApiHandler } from './_standardHandler'

// /api/user
// auth token: required
// body: {}

export default withApiHandler([
  requireJwt,
  async (req: Request, res: Response) => {
    try {
      /*const { access_token } =*/ await getManagementApiAccessToken()
      res.send({ message: 'nothing to see here' })
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
