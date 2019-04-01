import React, { Component } from 'react'
import { OperationVariables, Query, QueryProps, QueryResult } from 'react-apollo'
import { Merge } from 'utils/ts-utils'

import { GraphQLError } from '../GraphQLError'
import { Loader } from '../Loader'

export class GqlQuery<TData = any, TVariables = OperationVariables> extends Component<
  Merge<QueryProps<TData, TVariables>, { children(data: TData | undefined): React.ReactNode }>
> {
  render() {
    const { query, children, ...props } = this.props
    return (
      // @ts-ignore
      <Query<TData, TVariables> query={query} {...props}>
        {(result: QueryResult<TData, TVariables>) => {
          const { loading, error, data } = result
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
  }
}
