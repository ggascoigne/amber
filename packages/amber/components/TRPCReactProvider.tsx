'use client'
// ^-- to make sure we can mount the Provider from a server component
import { useCallback, useState } from 'react'

import { TRPCProvider } from '@amber/client'
import type { AppRouter } from '@amber/server/src/api/appRouter'
import { getBaseUrl } from '@amber/server/src/utils'
import { makeQueryClient } from '@amber/server/src/utils/query-client'
import type { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import superjson from 'superjson'

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
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    }),
  )
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  )
}

export const useInvalidateQueries = (queries: string[]) => {
  const queryClient = useQueryClient()
  return useCallback(
    () =>
      Promise.allSettled(queries.map((q) => queryClient.invalidateQueries({ queryKey: [q] }), { refetchType: 'all' })),
    [queries, queryClient],
  )
}
