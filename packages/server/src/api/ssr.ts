import { createServerSideHelpers } from '@trpc/react-query/server'

import { appRouter } from './appRouter'

import { db } from '../db'
import transformer from '../utils/trpc-transformer'

// use for standard ssr calls
export const ssrHelpers = createServerSideHelpers({
  router: appRouter,
  ctx: { db, session: undefined, userId: undefined, isAdmin: false },
  transformer,
})

export const ssrAuthenticatedHelpers = (id: number) =>
  createServerSideHelpers({
    router: appRouter,
    ctx: { db, session: undefined, userId: id, isAdmin: false },
    transformer,
  })

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
