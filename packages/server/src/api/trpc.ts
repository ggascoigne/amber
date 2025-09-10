/* eslint-disable prefer-destructuring */

/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { initTRPC, TRPCError } from '@trpc/server'
import Debug from 'debug'
import { ZodError } from 'zod'

import type { Context } from './context'

import transformer from '../utils/trpc-transformer'

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<Context>().create({
  transformer,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const logTrpc = Debug('amber:trpc')
const logTrpcReq = logTrpc.extend('req')
const logTrpcRes = logTrpc.extend('res')
// const logTrpcWarn = logTrpc.extend('warn')
const logTrpcErr = logTrpc.extend('error')
// Route errors to stderr, but keep debug formatting and always show
logTrpcErr.log = console.error.bind(console)
logTrpcErr.enabled = true

const timingMiddleware = t.middleware(async ({ next, path, type }) => {
  const start = Date.now()

  // artificial delay in dev
  if ((t as any)._config?.isDev) {
    const waitMs = Math.floor(Math.random() * 400) + 100
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, waitMs))
  }

  logTrpcReq('%s %s start', type, path)

  try {
    const result = await next()
    const dur = Date.now() - start
    logTrpcRes('%s %s (%d ms)', type, path, dur)
    return result
  } catch (err) {
    const dur = Date.now() - start
    logTrpcErr('%s %s failed (%d ms): %s', type, path, dur, (err as Error).message)
    throw err
  }
})

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(timingMiddleware)

export const protectedProcedure = t.procedure.use(timingMiddleware).use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    if (ctx.userId) {
      return next({ ctx })
    } else {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})
