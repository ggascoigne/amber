import { env } from '@amber/environment'
import { TRPCError } from '@trpc/server'

const mapAuth0ErrorCode = (status: number) => {
  if (status === 400) {
    return 'BAD_REQUEST' as const
  }

  if (status === 401 || status === 403) {
    return 'UNAUTHORIZED' as const
  }

  return 'INTERNAL_SERVER_ERROR' as const
}

const parseJsonSafely = async (response: Response) => {
  try {
    return await response.json()
  } catch {
    return null
  }
}

export const requestChangePasswordEmail = async (email: string) => {
  const response = await fetch(`${env.AUTH0_DOMAIN}/dbconnections/change_password`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email,
      client_id: env.MANAGEMENT_CLIENT_ID,
      connection: 'Username-Password-Authentication',
      client_secret: env.MANAGEMENT_CLIENT_SECRET,
    }),
  })

  const text = await response.text()

  if (!response.ok) {
    throw new TRPCError({
      code: mapAuth0ErrorCode(response.status),
      message: text || 'Unable to request password reset',
    })
  }

  return text
}

export const validatePassword = async (email: string, password: string) => {
  const response = await fetch(`${env.AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'password',
      username: email,
      password,
      client_id: env.MANAGEMENT_CLIENT_ID,
      client_secret: env.MANAGEMENT_CLIENT_SECRET,
    }),
  })

  const json = await parseJsonSafely(response)

  if (!response.ok) {
    const errorMessage =
      typeof json === 'object' && json && 'error_description' in json ? String(json.error_description) : undefined

    throw new TRPCError({
      code: mapAuth0ErrorCode(response.status),
      message: errorMessage ?? 'Unable to validate password',
    })
  }

  return json
}
