import { auth0 } from '@amber/server/src/auth/auth0'
import fetch from 'isomorphic-fetch'
import { NextApiRequest, NextApiResponse } from 'next'

import { authDomain, managementClientId, managementClientSecret } from './constants'
import { getProfileHandler } from './getProfileHandler'
import { handleError } from './handleError'
import { JsonError } from './JsonError'

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

export const validatePasswordHandler = auth0.withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!req.body) throw new JsonError(400, 'missing body: expecting password')
    const { password } = req.body
    if (!password) throw new JsonError(400, 'missing password')
    const profile = await getProfileHandler(req.headers.authorization!)
    // note that we are validating the password for the user identified by the access token
    // this ensures that an authenticated user does try and sniff other users passwords
    const result = await validatePassword(profile.email, password)
    res.send(result)
  } catch (err) {
    handleError(err, res)
  }
})
