import { ApolloClient, FieldPolicy, InMemoryCache, Reference, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { CachePersistor } from 'apollo3-cache-persist'
import { Auth0ContextType } from 'components/Acnw/Auth/Auth0'
import { useEffect } from 'react'
import { useLocalStorage } from 'utils'

type KeyArgs = FieldPolicy<any>['keyArgs']

const arrayMerge = (existing: any, incoming: any, args: any) => {
  const merged = existing ? existing.slice(0) : []
  const start = args ? args.offset : merged.length
  const end = start + incoming.length
  for (let i = start; i < end; ++i) {
    merged[i] = incoming[i - start]
  }
  return merged
}

export function offsetLimitNodePagination<T = Reference>(keyArgs: KeyArgs = false): FieldPolicy<T[]> {
  return {
    keyArgs,
    merge(existing: any, incoming: any, { args }: any) {
      return Object.assign({}, incoming, {
        nodes: arrayMerge(existing?.nodes, incoming?.nodes, args),
      })
    },
  }
}

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        users: offsetLimitNodePagination(['filter']),
      },
    },
  },
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
    }).concat(createHttpLink({ uri: ({ operationName }) => `/api/graphql/${operationName}` })),
    cache,
  })
}

export default Client
