import { isDev } from '@amber/environment'
import { appRouter } from '@amber/server/src/api/appRouter'
import { createTRPCContext } from '@amber/server/src/api/context'
import { createNextApiHandler } from '@trpc/server/adapters/next'

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError: isDev
    ? ({ path, error }) => {
        console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`)
      }
    : undefined,
})
