import { Request, Response } from 'express'
import fetch from 'isomorphic-fetch'

import { requireJwt } from './_checkJwt'
import { authDomain, managementClientId, managementClientSecret } from './_constants'
import { getProfile } from './_getProfile'
import { handleError } from './_handleError'
import { JsonError } from './_JsonError'
import { withApiHandler } from './_standardHandler'

const requestChangePasswordEmail = async (username: string) => {
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email: username,
      client_id: managementClientId,
      connection: 'Username-Password-Authentication',
      client_secret: managementClientSecret,
    }),
  }

  return fetch(`https://${authDomain}/dbconnections/change_password`, options).then(async (r) => {
    const text = await r.text()
    if (r.status !== 200) {
      throw new JsonError(r.status, text)
    }
    return text
  })
}

// /api/resetPassword
// auth token: required
// body: {}
export default withApiHandler([
  requireJwt,
  async (req: Request, res: Response) => {
    try {
      const profile = await getProfile(req.headers.authorization!)
      // note that we are validating the password for the user identified by the access token
      // this ensures that an authenticated user does try and sniff other users passwords
      const result = await requestChangePasswordEmail(profile.email)
      res.send({ message: result })
    } catch (err) {
      handleError(err, res)
    }
  },
])
