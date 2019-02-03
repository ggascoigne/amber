import gql from 'graphql-tag'
import get from 'lodash/get'
import React from 'react'
import { Query } from 'react-apollo'

import { GraphQLError } from '../GraphQLError'
import { Loader } from '../Loader'

const QUERY_LOOKUP = gql`
  query($realm: String!, $code: String!) {
    lookups(condition: { realm: $realm }) {
      edges {
        node {
          realm
          lookupValues(condition: { code: $code }) {
            nodes {
              id
              code
              sequencer
              value
            }
          }
        }
      }
    }
  }
`

export const Lookup = ({ realm, code }) => {
  return (
    <Query query={QUERY_LOOKUP} variables={{ realm, code }} errorPolicy='all'>
      {({ loading, error, data }) => {
        if (loading) {
          return <Loader />
        }
        if (error) {
          return <GraphQLError error={error} />
        }
        return get(data, 'lookups.edges[0].node.lookupValues.nodes[0].value')
      }}
    </Query>
  )
}
