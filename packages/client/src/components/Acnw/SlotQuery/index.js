import { GraphQLError } from 'components/Acnw/GraphQLError'
import gql from 'graphql-tag'
import get from 'lodash/get'
import React from 'react'
import { Query } from 'react-apollo'

import { Loader } from '../Loader'

const QUERY_SLOTS = gql`
  {
    slots {
      nodes {
        id
        slot
        day
        length
        time
      }
    }
  }
`
export const SlotQuery = ({ year, children }) => {
  return (
    <Query query={QUERY_SLOTS} errorPolicy='all'>
      {({ loading, error, data }) => {
        if (loading) {
          return <Loader />
        }
        if (error) {
          return <GraphQLError error={error} />
        }
        const slots = get(data, 'slots.nodes')
        return children && children({ year, slots })
      }}
    </Query>
  )
}
