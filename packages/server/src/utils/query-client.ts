import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query'

// import transformer from '../utils/trpc-transformer'

export function makeQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Increase default staleTime to match your server-side prefetching
        staleTime: 10 * 60 * 1000, // 10 minutes default
        // Prevent refetching on window focus during hydration
        refetchOnWindowFocus: false,
        // Prevent refetching on reconnect during initial load
        refetchOnReconnect: false,
        // Add retry delay to prevent immediate retries
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      dehydrate: {
        // see comment in packages/amber/components/TRPCReactProvider.tsx about why we disable this

        // serializeData: transformer.serialize,
        // Include all successful queries and preserve their options
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === 'success',
      },
      hydrate: {
        // deserializeData: transformer.deserialize,
      },
    },
  })

  // Set up query defaults for specific query patterns
  queryClient.setQueryDefaults(['trpc', 'settings'], {
    staleTime: 60 * 60 * 1000, // 1 hour for settings
  })

  queryClient.setQueryDefaults(['trpc', 'config'], {
    staleTime: 60 * 60 * 1000, // 1 hour for config
  })

  queryClient.setQueryDefaults(['trpc', 'users'], {
    staleTime: 10 * 60 * 1000, // 10 minutes for user data
  })

  return queryClient
}
