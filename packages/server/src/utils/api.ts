/**
 * This is the client-side entrypoint for your tRPC API. It is used to create the `api` object which
 * contains the Next.js App-wrapper, as well as your type-safe React Query hooks.
 *
 * We also create a few inference helpers for input and output types.
 */
// import { QueryClient } from '@tanstack/react-query'
import { env } from '@amber/environment'
import { httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import { type inferReactQueryProcedureOptions } from '@trpc/react-query'
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'

import { type AppRouter } from '../api/appRouter'
import transformer from '../utils/trpc-transformer'

// import { env, isDev } from '@amber/environment'

// TODO: work out how to be env from @amber/environment to load correctly in the browser
export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '' // browser should use relative url
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}` // SSR should use vercel url
  return `http://localhost:${env.NEXT_PUBLIC_PORT ?? 3000}` // dev SSR should use localhost
}

// export const queryClient = new QueryClient()

/** A set of type-safe react-query hooks for your tRPC API. */
export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      /**
       * Links used to determine request flow from client to server.
       *
       * @see https://trpc.io/docs/links
       */
      links: [
        loggerLink({
          enabled: (opts) => opts.direction === 'down' && opts.result instanceof Error,
        }),
        httpBatchLink({
          /**
           * Transformer used for data de-serialization from the server.
           *
           * @see https://trpc.io/docs/data-transformers
           */
          transformer,
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    }
  },
  /**
   * Whether tRPC should await queries when server rendering pages.
   *
   * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
   */
  ssr: false,
  transformer,
})

export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>
