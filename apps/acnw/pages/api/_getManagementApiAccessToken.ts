import fetch from 'isomorphic-fetch'

import { auth0IssuerBaseUrl, managementClientId, managementClientSecret } from './_constants'
import { JsonError } from './_JsonError'

export const getManagementApiAccessToken = async () => {
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      audience: `${auth0IssuerBaseUrl}/api/v2/`,
      client_id: managementClientId,
      client_secret: managementClientSecret,
    }),
  }

  return fetch(`${auth0IssuerBaseUrl}/oauth/token`, options).then(async (r) => {
    const json = await r.json()
    if (r.status !== 200) {
      throw new JsonError(r.status, json.error_description)
    }
    return json
  })
}
