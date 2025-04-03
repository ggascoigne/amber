import { getSession, Session } from '@auth0/nextjs-auth0'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'

import { db } from '../db'

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */

type CreateContextOptions = { session?: Session | null }

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
export const createInnerTRPCContext = async ({ session }: CreateContextOptions = {}) => {
  const { user } = session ?? {}
  const userId = user?.userId
  const isAdmin = user?.roles?.includes('ROLE_ADMIN')

  return {
    db,
    session,
    userId,
    isAdmin,
  }
}

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts
  const session = await getSession(req, res)
  return createInnerTRPCContext({ session })
}

export type Context = Awaited<ReturnType<typeof createInnerTRPCContext>>
