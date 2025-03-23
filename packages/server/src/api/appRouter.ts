import { configRouter } from './routers/config'
import { settingsRouter } from './routers/settings'
import { createTRPCRouter } from './trpc'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  config: configRouter,
  settings: settingsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
