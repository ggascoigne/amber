import { configRouter } from './routers/config'
import { hotelRoomDetailsRouter } from './routers/hotelRoomDetails'
import { hotelRoomsRouter } from './routers/hotelRooms'
import { lookupsRouter } from './routers/lookups'
import { membershipsRouter } from './routers/memberships'
import { settingsRouter } from './routers/settings'
import { slotsRouter } from './routers/slots'
import { usersRouter } from './routers/users'
import { createTRPCRouter } from './trpc'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  config: configRouter,
  settings: settingsRouter,
  lookups: lookupsRouter,
  slots: slotsRouter,
  memberships: membershipsRouter,
  hotelRooms: hotelRoomsRouter,
  hotelRoomDetails: hotelRoomDetailsRouter,
  users: usersRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
