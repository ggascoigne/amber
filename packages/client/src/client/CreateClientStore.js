import { withClientState } from 'apollo-link-state'
import { store as gameFilterStore } from 'client/resolvers/gameFilter'
import assignIn from 'lodash/fp/assignIn'
import flow from 'lodash/fp/flow'
import map from 'lodash/fp/map'
import reduce from 'lodash/fp/reduce'

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
const mergeGet = attributeName =>
  flow(
    // pick a single attribute from each object
    map(attributeName),
    // merge all values into a single object
    reduceWithDefault(assignIn, {})
  )

/**
 * Local Data Stores
 */
const STORES = [gameFilterStore]

/**
 * Map the Mutation handlers and Default Values of our local state to
 * the Apollo cache.
 */
const CreateClientStore = cache => {
  // Merge all defaults
  const defaults = mergeGet('defaults')(STORES)

  // Merge all mutations
  const mutations = mergeGet('mutations')(STORES)

  // Construct the Client State with the given mutations and defaults
  return withClientState({
    cache,
    defaults: defaults,
    resolvers: {
      /*
       * These mutations relate to graphql mutations with the @client decorator
       * by function name.
       */
      Mutation: mutations
    }
  })
}

/**
 * Export
 */

export default CreateClientStore
