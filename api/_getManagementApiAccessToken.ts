import fetch from 'isomorphic-fetch'

import { authDomain, managementClientId, managementClientSecret } from './_constants'
import { JsonError } from './_JsonError'

export const getManagementApiAccessToken = async () => {
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      audience: `https://${authDomain}/api/v2/`,
      client_id: managementClientId,
      client_secret: managementClientSecret,
    }),
  }

  return fetch(`https://${authDomain}/oauth/token`, options).then(async (r) => {
    const json = await r.json()
    if (r.status !== 200) {
      throw new JsonError(r.status, json.error_description)
    }
    return json
  })
}
