import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { gameFilterStore, urlSourceStore, yearFilterStore } from 'client/resolvers'

import { Auth0ContextType } from '../components/Acnw/Auth/Auth0'

// this pattern is based upon https://hackernoon.com/setting-up-apollo-link-state-for-multiple-stores-4cf54fdb1e00

/**
 * At a given attribute this will merge all objects
 * in a list of objects found at that attribute.
 *
 * Example
 * const objectList = [
 *   {defaults: {x: true}},
 *   {defaults: {y: "foo"}},
 *   {defaults: {z: 123}}
 * ]
 *
 * // returns {x: true, y: "foo", z: 123}
 * mergeGet("defaults")(objectList)
 */
export const mergeGet = (attributeName: string) => (input: any[]) =>
  input.reduce((prev, curr) => ({ ...prev, ...curr[attributeName] }), {})

const STORES = [gameFilterStore, urlSourceStore, yearFilterStore]

const cache = new InMemoryCache({
  // postgraphile uses nodeId for the uuid, and leaves id as the database id.
  dataIdFromObject: (obj: any) => obj.nodeId || null,
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
    // @ts-ignore
    resolvers: {
      Mutation: mergeGet('mutations')(STORES),
    },
  })

STORES.forEach((val) => {
  cache.writeQuery({
    query: val.query,
    data: val.defaults,
  })
})

export default Client
