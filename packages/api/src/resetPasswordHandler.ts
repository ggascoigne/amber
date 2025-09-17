import { env } from '@amber/environment'
import { auth0 } from '@amber/server/src/auth/auth0'
import fetch from 'isomorphic-fetch'
import { NextApiRequest, NextApiResponse } from 'next'

import { getProfileHandler } from './getProfileHandler'
import { handleError } from './handleError'
import { JsonError } from './JsonError'

const requestChangePasswordEmail = async (username: string) => {
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email: username,
      client_id: env.MANAGEMENT_CLIENT_ID,
      connection: 'Username-Password-Authentication',
      client_secret: env.MANAGEMENT_CLIENT_SECRET,
    }),
  }

  return fetch(`${env.AUTH0_DOMAIN}/dbconnections/change_password`, options).then(async (r) => {
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
export const resetPasswordHandler = auth0.withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const profile = await getProfileHandler(req.headers.authorization!)
    // note that we are validating the password for the user identified by the access token
    // this ensures that an authenticated user does try and sniff other users passwords
    const result = await requestChangePasswordEmail(profile.email)
    res.send({ message: result })
  } catch (err) {
    handleError(err, res)
  }
})
