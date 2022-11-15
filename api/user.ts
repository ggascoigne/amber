import { VercelRequest, VercelResponse } from '@vercel/node'

import { requireJwt } from './_checkJwt'
import { getManagementApiAccessToken } from './_getManagementApiAccessToken'
import { handleError } from './_handleError'
import { withApiHandler } from './_standardHandler'

// /api/user
// auth token: required
// body: {}

export default withApiHandler([
  requireJwt,
  async (req: VercelRequest, res: VercelResponse) => {
    try {
      /* const { access_token } = */ await getManagementApiAccessToken()
      res.send({ message: 'nothing to see here' })
    } catch (err: any) {
      handleError(err, res)
    }
  },
])
