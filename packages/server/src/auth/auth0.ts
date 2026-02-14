import { env } from '@amber/environment'
import { Auth0Client } from '@auth0/nextjs-auth0/server'

import { fakeAuth } from './fakeAuth'
import type { AuthLike } from './types'

import { ssrHelpers } from '../api/ssr'

const toHttpsUrl = (base?: string) =>
  base ? (base.startsWith('http://') || base.startsWith('https://') ? base : `https://${base}`) : undefined

const appBaseUrl = toHttpsUrl(
  // only set in production
  env.APP_BASE_URL ??
    // the branch specific vercel preview url
    env.VERCEL_BRANCH_URL ??
    // the random build specific URL
    env.VERCEL_URL,
)

export const realSessionCookieName = `${env.DB_ENV}-session-v4`

const createAuthClient = (): AuthLike => {
  if (env.USE_FAKE_AUTH === 'true') {
    return fakeAuth
  }
  return new Auth0Client({
    domain: env.AUTH0_DOMAIN,
    clientId: env.AUTH0_CLIENT_ID,
    clientSecret: env.AUTH0_CLIENT_SECRET,
    secret: env.AUTH0_SECRET,
    appBaseUrl,
    session: { cookie: { name: realSessionCookieName } },
    routes: {
      login: '/api/auth/login',
      callback: '/api/auth/callback',
      logout: '/api/auth/logout',
      backChannelLogout: '/api/auth/backchannel-logout',
    },
    beforeSessionSaved: async (session, idToken) => {
      try {
        if (!idToken) return session
        const authorization = await ssrHelpers.auth.getRoles.fetch({ token: idToken })
        if (authorization?.userId && authorization?.roles) {
          return {
            ...session,
            user: { ...session.user, userId: authorization.userId, roles: authorization.roles },
          }
        }
        return session
      } catch {
        return session
      }
    },
  }) as unknown as AuthLike
}

export const auth0 = createAuthClient()
