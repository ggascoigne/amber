import type { SessionData } from '@auth0/nextjs-auth0/types'
import { createServerSideHelpers } from '@trpc/react-query/server'

import { appRouter } from './appRouter'

import { db } from '../db'
import transformer from '../utils/trpc-transformer'

export const ssrAuthenticatedHelpers = (idOrSession: number | SessionData | undefined) => {
  const session = typeof idOrSession == 'number' ? undefined : idOrSession
  const userId = typeof idOrSession == 'number' ? idOrSession : parseInt(session?.user?.userId, 10) || undefined
  // Note that even if the user is an admin, if there's no session then isAdmin will be false
  // this is not necessarily an issue since that is a bit of a rare case
  const isAdmin = session?.user?.roles?.includes('ROLE_ADMIN') ?? false
  return createServerSideHelpers({
    router: appRouter,
    ctx: { db, session, userId, isAdmin },
    transformer,
  })
}

// use for standard ssr calls
export const ssrHelpers = ssrAuthenticatedHelpers(undefined)

// Create an authenticated caller for a specific user
// use for any case where you need auth or mutations
export const authenticatedCaller = (userId: string | number) => {
  // console.log(`authenticatedCaller for userId ${userId}`)
  const id = typeof userId === 'string' ? parseInt(userId, 10) : userId
  return appRouter.createCaller({
    db,
    session: null,
    userId: id,
    isAdmin: false,
  })
}
