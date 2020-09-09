import { useGetSingleLookupValueQuery } from 'client'
import React from 'react'

import { GraphQLError } from '../GraphQLError'
import { Loader } from '../Loader'

type LookupValue = { realm: string; code: string }

export const LookupValue: React.FC<LookupValue> = ({ realm, code }) => {
  const { loading, error, data } = useGetSingleLookupValueQuery({ variables: { realm, code } })
  if (error) {
    return <GraphQLError error={error} />
  }
  if (loading) {
    return <Loader />
  }
  return <>{data && data?.lookups?.edges[0]?.node?.lookupValues?.nodes[0]?.value}</>
}
