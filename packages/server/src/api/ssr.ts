import { createServerSideHelpers } from '@trpc/react-query/server'
import superjson from 'superjson'

import { appRouter } from './appRouter'

import { db } from '../db'

export const ssrHelpers = createServerSideHelpers({
  router: appRouter,
  ctx: { db, session: undefined, userId: undefined, isAdmin: false },
  transformer: superjson,
})
