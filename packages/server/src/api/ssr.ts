import { createServerSideHelpers } from '@trpc/react-query/server'

import { appRouter } from './appRouter'

import { db } from '../db'
import transformer from '../utils/trpc-transformer'

export const ssrHelpers = createServerSideHelpers({
  router: appRouter,
  ctx: { db, session: undefined, userId: undefined, isAdmin: false },
  transformer,
})
