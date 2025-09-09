'use client'
// ^-- to make sure we can mount the Provider from a server component
import { useState } from 'react'

import { TRPCProvider } from '@amber/client'
import type { AppRouter } from '@amber/server/src/api/appRouter'
import { getBaseUrl } from '@amber/server/src/utils'
import { makeQueryClient } from '@amber/server/src/utils/query-client'
import transformer from '@amber/server/src/utils/trpc-transformer'
import type { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink, httpLink, splitLink } from '@trpc/client'

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
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}

export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode
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
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  )
}
