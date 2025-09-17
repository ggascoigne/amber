import { env } from '@amber/environment'
import fetch from 'isomorphic-fetch'

import { JsonError } from './JsonError'

export const getProfileHandler = async (authHeader: string) => {
  const options = {
    method: 'GET',
    headers: { authorization: authHeader },
  }

  return fetch(`${env.AUTH0_DOMAIN}/userinfo`, options).then(async (r) => {
    const json = await r.json()
    if (r.status !== 200) {
      throw new JsonError(r.status, json.error_description)
    }
    return json
  })
}
