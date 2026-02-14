import { env } from '@amber/environment'
import type { SessionData } from '@auth0/nextjs-auth0/types'
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiHandler,
  NextApiRequest,
  NextApiResponse,
} from 'next'
import { NextResponse, type NextRequest } from 'next/server'

import { handleLogin } from './login'
import { handleLogout } from './logout'
import { handleProfile } from './profile'
import { buildSession } from './session'

import type { AuthLike } from '../types'

type AnyPropsResult = GetServerSidePropsResult<Record<string, unknown>>

const isFakeAuth = () => env.USE_FAKE_AUTH === 'true'

const mergeProps = (result: AnyPropsResult, session: SessionData): AnyPropsResult => {
  if ('props' in result) {
    return { ...result, props: { ...result.props, user: session.user } }
  }
  return result
}

const withPageAuthRequired = (optsOrHandler: any = {}) => {
  const handler =
    typeof optsOrHandler === 'function'
      ? optsOrHandler
      : typeof optsOrHandler?.getServerSideProps === 'function'
        ? optsOrHandler.getServerSideProps
        : null

  return async (ctx: GetServerSidePropsContext) => {
    const session = await buildSession(ctx.req as unknown as NextApiRequest)
    if (!session) {
      const returnTo = encodeURIComponent(ctx.resolvedUrl ?? '/')
      return {
        redirect: {
          destination: `/api/auth/login?returnTo=${returnTo}`,
          permanent: false,
        },
      }
    }
    if (!handler) return { props: { user: session.user } }
    const result = await handler(ctx)
    return mergeProps(result as AnyPropsResult, session)
  }
}

const withApiAuthRequired =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const session = await buildSession(req)
    if (!session) {
      res.status(401).json({ error: 'not_authenticated' })
      return
    }
    ;(req as any).session = session
    handler(req, res)
  }

const middleware = async (req?: NextRequest) => {
  if (!req || !isFakeAuth()) return NextResponse.next()
  const { pathname } = req.nextUrl

  if (pathname === '/api/auth/login') {
    return handleLogin(req)
  }

  if (pathname === '/api/auth/logout') {
    return handleLogout(req)
  }

  if (pathname === '/api/auth/profile' || pathname === '/auth/profile') {
    return handleProfile(req)
  }

  return NextResponse.next()
}

const getSession = async (req?: NextApiRequest | NextRequest) => buildSession(req)

export const fakeAuth: AuthLike = {
  withPageAuthRequired,
  withApiAuthRequired,
  middleware: middleware as any,
  getSession,
}
