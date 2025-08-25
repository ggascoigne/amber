import { configRouter } from './routers/config'
import { gameAssignmentsRouter } from './routers/gameAssignments'
import { gameChoicesRouter } from './routers/gameChoices'
import { gameRoomsRouter } from './routers/gameRooms'
import { gamesRouter } from './routers/games'
import { hotelRoomDetailsRouter } from './routers/hotelRoomDetails'
import { hotelRoomsRouter } from './routers/hotelRooms'
import { lookupsRouter } from './routers/lookups'
import { membershipsRouter } from './routers/memberships'
import { settingsRouter } from './routers/settings'
import { slotsRouter } from './routers/slots'
import { stripeRouter } from './routers/stripe'
import { transactionRouter } from './routers/transaction'
import { usersRouter } from './routers/users'
import { createTRPCRouter } from './trpc'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  config: configRouter,
  gameAssignments: gameAssignmentsRouter,
  gameChoices: gameChoicesRouter,
  gameRooms: gameRoomsRouter,
  games: gamesRouter,
  hotelRoomDetails: hotelRoomDetailsRouter,
  hotelRooms: hotelRoomsRouter,
  lookups: lookupsRouter,
  memberships: membershipsRouter,
  settings: settingsRouter,
  slots: slotsRouter,
  stripe: stripeRouter,
  transactions: transactionRouter,
  users: usersRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
