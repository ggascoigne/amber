import { env, isTest } from '@amber/environment'
import type { SessionData } from '@auth0/nextjs-auth0/types'
import { TRPCError } from '@trpc/server'
import * as jose from 'jose'
import { z } from 'zod'

import { getUserRoles } from '../../auth/apiAuthUtils'
import { createTRPCRouter, publicProcedure } from '../trpc'

const normalizeIssuerBase = (issuerBase: string) => issuerBase.replace(/\/$/, '')

const verifyIdToken = async (rawToken: string) => {
  console.log('Verifying ID token', rawToken)
  const token = rawToken.startsWith('Bearer ') ? rawToken.slice('Bearer '.length) : rawToken
  if (!token) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Missing token' })
  }

  const issuerBase = env.AUTH0_DOMAIN
  const audience = env.AUTH0_CLIENT_ID
  if (!issuerBase || !audience) {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Auth0 misconfigured' })
  }

  const normalizedBase = normalizeIssuerBase(issuerBase)
  const issuer = `${normalizedBase}/`
  const jwksUrl = `${normalizedBase}/.well-known/jwks.json`
  const jwks = jose.createRemoteJWKSet(new URL(jwksUrl))
  const { payload } = await jose.jwtVerify(token, jwks, { issuer, audience })
  return payload
}

const buildSessionFromPayload = (payload: jose.JWTPayload): SessionData => {
  const email = payload.email as string | undefined
  const emailVerified = (payload.email_verified as boolean | undefined) ?? false
  const sub = payload.sub as string | undefined
  const expiresAt = (payload.exp as number | undefined) ?? Math.floor(Date.now() / 1000) + 300

  if (!email || !sub) {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Invalid token payload' })
  }

  const session: SessionData = {
    user: { email, email_verified: emailVerified, sub },
    tokenSet: { expiresAt, accessToken: '' },
    internal: {
      sid: (payload as any)?.sid ?? '',
      createdAt: Math.floor(Date.now() / 1000),
    },
  }
  return session
}

export const authRouter = createTRPCRouter({
  getTestEnvRoles: publicProcedure.query(async () => {
    if (!isTest) {
      return {}
    }
    return {
      dummy: 'dummy',
    }
  }),
  getRoles: publicProcedure.input(z.object({ token: z.string().min(1) })).query(async ({ input }) => {
    try {
      const payload = await verifyIdToken(input.token)
      const session = buildSessionFromPayload(payload)
      const authorization = await getUserRoles(session)
      return authorization ?? null
    } catch (error) {
      console.error('auth.getRoles error', error)
      return null
    }
  }),
})
