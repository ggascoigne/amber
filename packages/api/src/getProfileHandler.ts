import fetch from 'isomorphic-fetch'

import { auth0IssuerBaseUrl } from './constants'
import { JsonError } from './JsonError'

export const getProfileHandler = async (authHeader: string) => {
  const options = {
    method: 'GET',
    headers: { authorization: authHeader },
  }

  return fetch(`${auth0IssuerBaseUrl}/userinfo`, options).then(async (r) => {
    const json = await r.json()
    if (r.status !== 200) {
      throw new JsonError(r.status, json.error_description)
    }
    return json
  })
}
