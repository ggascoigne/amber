import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { CachePersistor } from 'apollo3-cache-persist'
import { useEffect } from 'react'

import { Auth0ContextType } from '../components/Acnw/Auth/Auth0'
import { useLocalStorage } from '../utils'

const cache = new InMemoryCache({
  // postgraphile uses nodeId for the uuid, and leaves id as the database id.
  // dataIdFromObject: (obj: any) => obj?.nodeId,
})

const SCHEMA_VERSION = 1
const SCHEMA_VERSION_KEY = 'apollo-schema-version'

const Client = (authProps: Auth0ContextType) => {
  const [schemaVersion, setSchemaVersion] = useLocalStorage<number>(SCHEMA_VERSION_KEY, 0)

  useEffect(() => {
    const cacheSetup = async () => {
      // await before instantiating ApolloClient, else queries might run before the cache is persisted
      const persistor = new CachePersistor({
        cache,
        storage: window.localStorage,
      })

      if (schemaVersion === SCHEMA_VERSION) {
        await persistor.restore()
      } else {
        await persistor.purge()
        await setSchemaVersion(SCHEMA_VERSION)
      }
    }
    cacheSetup().then()
  }, [schemaVersion, setSchemaVersion])

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
