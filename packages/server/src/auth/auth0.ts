import { Auth0Client } from '@auth0/nextjs-auth0/server'

const toHttpsUrl = (base?: string) =>
  base ? (base.startsWith('http://') || base.startsWith('https://') ? base : `https://${base}`) : undefined

const appBaseUrl = toHttpsUrl(
  // only set in production
  process.env.AUTH0_BASE_URL ??
    // the preferred AUTH0 value - eventually replacing AUTH0_BASE_URL
    process.env.APP_BASE_URL ??
    // the branch specific vercel preview url
    process.env.VERCEL_BRANCH_URL ??
    // the random build specific URL
    process.env.VERCEL_URL,
)

export const auth0 = new Auth0Client({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  secret: process.env.AUTH0_SECRET,
  appBaseUrl,
  session: { cookie: { name: 'appSession-v4' } },
  routes: {
    login: '/api/auth/login',
    callback: '/api/auth/callback',
    logout: '/api/auth/logout',
    backChannelLogout: '/api/auth/backchannel-logout',
  },
  beforeSessionSaved: async (session, idToken) => {
    try {
      if (!idToken) return session
      const url = new URL('/api/auth/roles', appBaseUrl ?? 'http://localhost')
      const res = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-authorization-token': `Bearer ${idToken}`,
        },
      })
      if (!res.ok) return session
      const json = (await res.json()) as { userId?: number; roles?: string[] }
      if (json?.userId && json?.roles) {
        return { ...session, user: { ...session.user, userId: json.userId, roles: json.roles } }
      }
      return session
    } catch {
      return session
    }
  },
})
