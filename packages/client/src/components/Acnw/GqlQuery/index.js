import React from 'react'
import { Query } from 'react-apollo'

import { GraphQLError } from '../GraphQLError'
import { Loader } from '../Loader'

export const GqlQuery = ({ children, ...props }) => (
  <Query {...props}>
    {({ loading, error, data }) => {
      if (loading) {
        return <Loader />
      }
      if (error) {
        return <GraphQLError error={error} />
      }
      return children && children(data)
    }}
  </Query>
)
