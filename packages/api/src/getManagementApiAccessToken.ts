import { env } from '@amber/environment'
import fetch from 'isomorphic-fetch'

import { JsonError } from './JsonError'

export const getManagementApiAccessToken = async () => {
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      audience: `${env.AUTH0_DOMAIN}/api/v2/`,
      client_id: env.MANAGEMENT_CLIENT_ID,
      client_secret: env.MANAGEMENT_CLIENT_SECRET,
    }),
  }

  return fetch(`${env.AUTH0_DOMAIN}/oauth/token`, options).then(async (r) => {
    const json = await r.json()
    if (r.status !== 200) {
      throw new JsonError(r.status, json.error_description)
    }
    return json
  })
}
