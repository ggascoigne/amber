import { Request, Response } from 'express'
import fetch from 'isomorphic-fetch'

import { requireJwt } from './_checkJwt'
import { authDomain, managementClientId, managementClientSecret } from './_constants'
import { getProfile } from './_getProfile'
import { JsonError } from './_JsonError'
import { withApiHandler } from './_standardHandler'

const oauthToken = `https://${authDomain}/oauth/token`

const validatePassword = async (username: string, password: string) => {
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'password',
      username,
      password,
      client_id: managementClientId,
      client_secret: managementClientSecret,
    }),
  }

  return fetch(oauthToken, options).then(async (r) => {
    const json = await r.json()
    if (r.status !== 200) {
      throw new JsonError(r.status, json.error_description)
    }
    return json
  })
}

// /api/validatePassword
// auth token: required
// body: { password: string }

export default withApiHandler([
  requireJwt,
  async (req: Request, res: Response) => {
    try {
      const { password } = req.body
      const profile = await getProfile(req.headers.authorization!)
      // note that we are validating the password for the user identified by the access token
      // this ensures that an authenticated user does try and sniff other users passwords
      const result = await validatePassword(profile.email, password)
      res.send(result)
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