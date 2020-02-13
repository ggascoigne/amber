import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'
import { gameFilterStore, urlSourceStore } from 'client/resolvers'
import assignIn from 'lodash/fp/assignIn'
import flow from 'lodash/fp/flow'
import map from 'lodash/fp/map'
import reduce from 'lodash/fp/reduce'

// @ts-ignore
const reduceWithDefault = reduce.convert({ cap: false })

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
const mergeGet = (attributeName: any) =>
  flow(
    // pick a single attribute from each object
    map(attributeName),
    // merge all values into a single object
    reduceWithDefault(assignIn, {})
  )

const STORES = [gameFilterStore, urlSourceStore]

const cache = new InMemoryCache({
  // postgraphile uses nodeId for the uuid, and leaves id as the database id.
  dataIdFromObject: (obj: any) => obj.nodeId || null
})

// Initialize the Apollo Client
const Client = new ApolloClient({
  link: new HttpLink(),
  cache,
  // @ts-ignore
  resolvers: {
    Mutation: mergeGet('mutations')(STORES)
  }
})
cache.writeData({ data: mergeGet('defaults')(STORES) })

export default Client
