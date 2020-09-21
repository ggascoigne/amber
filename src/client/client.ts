import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import { Auth0ContextType } from '../components/Acnw/Auth/Auth0'

const cache = new InMemoryCache({
  // postgraphile uses nodeId for the uuid, and leaves id as the database id.
  dataIdFromObject: (obj: any) => obj?.nodeId,
})

const Client = (authProps: Auth0ContextType) =>
  new ApolloClient({
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

export default Client
