import { getUserRoles } from '@amber/server/src/auth/apiAuthUtils'
import * as jose from 'jose'
import type { NextApiRequest, NextApiResponse } from 'next'

export async function rolesHandler(req: NextApiRequest, res: NextApiResponse) {
  console.log('in rolesHandler')
  try {
    if (req.method !== 'POST') return res.status(405).end('method not allowed')
    const auth = (req.headers['x-authorization-token'] as string) ?? ''
    const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : ''
    if (!token) {
      console.log('headers', JSON.stringify(req.headers))
      console.log('rolesHandler: missing token')
      return res.status(401).end('missing token')
    }

    const issuerBase = process.env.AUTH0_DOMAIN
    const audience = process.env.AUTH0_CLIENT_ID
    if (!issuerBase || !audience) {
      console.log('rolesHandler: server misconfigured')
      return res.status(500).end('server misconfigured')
    }
    const normalizedBase = issuerBase.replace(/\/$/, '')
    const issuer = `${normalizedBase}/`
    const jwksUrl = `${normalizedBase}/.well-known/jwks.json`
    const jwks = jose.createRemoteJWKSet(new URL(jwksUrl))
    const { payload } = await jose.jwtVerify(token, jwks, { issuer, audience })

    const email = payload.email as string | undefined
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const email_verified = (payload.email_verified as boolean | undefined) ?? false
    const sub = payload.sub as string | undefined
    const exp = (payload.exp as number | undefined) ?? Math.floor(Date.now() / 1000) + 300

    if (!email) return res.status(400).end('no email in token')

    const session: any = {
      user: { email, email_verified, sub },
      tokenSet: { expiresAt: exp, accessToken: '' },
      internal: { sid: (payload as any).sid, createdAt: Math.floor(Date.now() / 1000) },
    }

    const authorization = await getUserRoles(session)
    if (!authorization) return res.status(204).end()
    return res.status(200).json(authorization)
    // xeslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    console.log('rolesHandler caught error: ', _error)
    return res.status(401).end('invalid token')
  }
}
