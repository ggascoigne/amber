import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { persistCache } from 'apollo3-cache-persist'
import { useEffect } from 'react'

import { Auth0ContextType } from '../components/Acnw/Auth/Auth0'

const cache = new InMemoryCache({
  // postgraphile uses nodeId for the uuid, and leaves id as the database id.
  dataIdFromObject: (obj: any) => obj?.nodeId,
})

const Client = (authProps: Auth0ContextType) => {
  useEffect(() => {
    const cacheSetup = async () => {
      // await before instantiating ApolloClient, else queries might run before the cache is persisted
      await persistCache({
        cache,
        // @ts-ignore
        storage: window.localStorage,
      })
    }
    cacheSetup().then()
  }, [])

  return new ApolloClient({
    queryDeduplication: true, // this might be the default for all the good it does :(
    defaultOptions: {
      query: {
        fetchPolicy: 'cache-first',
      },
    },
    link: setContext(async (_, { headers }) => {
      const { getTokenSilently, isAuthenticated } = authProps
      if (isAuthenticated) {
        const token = getTokenSilently && (await getTokenSilently())
        return {
          headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      }
      return headers
    }).concat(
      createHttpLink({
        uri: '/api/graphql',
      })
    ),
    cache,
  })
}

export default Client
