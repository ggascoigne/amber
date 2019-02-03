import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from 'apollo-boost'

import CreateClientStore from './CreateClientStore'

// Set up Cache
const cache = new InMemoryCache()

// Set up Local State
const stateLink = CreateClientStore(cache)

// Initialize the Apollo Client
const Client = new ApolloClient({
  link: ApolloLink.from([stateLink, new HttpLink()]),
  cache: cache
})

export default Client
