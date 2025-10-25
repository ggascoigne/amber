'use client'
// ^-- to make sure we can mount the Provider from a server component
import type React from 'react'
import { useMemo, useState } from 'react'

import { TRPCProvider } from '@amber/client'
import type { AppRouter } from '@amber/server/src/api/appRouter'
import { getBaseUrl } from '@amber/server/src/utils'
import { makeQueryClient } from '@amber/server/src/utils/query-client'
import transformer from '@amber/server/src/utils/trpc-transformer'
import type { DehydratedState, QueryClient } from '@tanstack/react-query'
import { QueryClientProvider, HydrationBoundary } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink, httpLink, splitLink } from '@trpc/client'
import debug from 'debug'
import SuperJSON from 'superjson'

const log = debug('amber:amber:TRPCReactProvider')

const logQueryCache = (qc: QueryClient, label: string) => {
  const queries = qc.getQueryCache().getAll()
  log(`${label}:`)
  if (queries.length === 0) {
    log('  - Cache is empty!')
  } else {
    queries.forEach((query) => {
      const data = Array.isArray(query.state.data) ? `Array(${query.state.data.length})` : typeof query.state.data
      log(
        `  - ${JSON.stringify(query.queryKey)}: ${query.state.status} (data: ${data}, stale: ${query.isStale()}, dataUpdatedAt: ${new Date(query.state.dataUpdatedAt)})`,
      )
    })
  }
}

let browserQueryClient: QueryClient
function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient()
  }
  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) {
    log('Creating browser query client for TRPCReactProvider')
    browserQueryClient = makeQueryClient()

    setTimeout(() => {
      logQueryCache(browserQueryClient, 'TRPCReactProvider cache state after hydration')
    }, 100)
  }
  return browserQueryClient
}

export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode
    pageProps: any
  }>,
) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient()

  const [trpcClient] = useState(() => {
    const url = `${getBaseUrl()}/api/trpc`
    return createTRPCClient<AppRouter>({
      links: [
        splitLink({
          condition(op) {
            // check for context property `skipBatch`
            return Boolean(op.context.skipBatch)
          },
          // when condition is true, use normal request
          true: httpLink({
            transformer,
            url,
          }),
          // when condition is false, use batching
          false: httpBatchLink({
            transformer,
            url,
          }),
        }),
      ],
    })
  })

  const decodedState = useMemo(() => {
    const serializedState = props.pageProps?.trpcState
    if (!serializedState) {
      return undefined
    }
    // there's a mismatch between the TRPC dehydrate type and SuperJSON types, the hydration state is
    // serialized with superjson, that's good, but it's done at the level of the whole query cache,
    // however the deserialization inside the Hydration component tries to deserialize things at the
    // query level and fails. So we disable the deserialization in the queryClient and explicitly
    // deserialize it here.
    const state = SuperJSON.deserialize(serializedState) as DehydratedState | undefined
    if (state) {
      log('Decoded hydration state:', {
        queriesCount: state.queries?.length ?? 0,
        queries: state.queries?.map((q) => ({
          queryKey: q.queryKey,
          state: q.state.status,
          dataUpdatedAt: new Date(q.state.dataUpdatedAt),
          isStale: Date.now() - q.state.dataUpdatedAt > 30000, // Default staleTime check
          data: Array.isArray(q.state.data) ? `Array(${q.state.data.length})` : typeof q.state.data,
        })),
      })
    }
    return state
  }, [props.pageProps?.trpcState])

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <HydrationBoundary state={decodedState}>{props.children}</HydrationBoundary>
      </TRPCProvider>
    </QueryClientProvider>
  )
}
