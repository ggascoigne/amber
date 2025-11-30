import type { SessionData } from '@auth0/nextjs-auth0/types'
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiHandler,
  NextApiRequest,
  NextApiResponse,
} from 'next'
import type { NextRequest } from 'next/server'

export type AuthLike = {
  withPageAuthRequired: (
    handlerOrOptions?: any,
  ) => (ctx: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<Record<string, unknown>>>
  withApiAuthRequired: (handler: NextApiHandler) => (req: NextApiRequest, res: NextApiResponse) => Promise<void>
  middleware: (request: Request) => Promise<Response> | Response
  getSession: (req: NextApiRequest | NextRequest) => Promise<SessionData | null>
}
