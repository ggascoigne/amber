import { GetLookupValueVariables } from '__generated__/GetLookupValue'
import { useLookupValueQuery } from 'client'
import React from 'react'

import { GraphQLError } from '../GraphQLError'
import { Loader } from '../Loader'

export const LookupValue: React.FC<GetLookupValueVariables> = ({ realm, code }) => {
  const { loading, error, data } = useLookupValueQuery({ realm, code })
  if (loading) {
    return <Loader />
  }
  if (error) {
    return <GraphQLError error={error} />
  }
  return <>{data && data?.lookups?.edges[0]?.node?.lookupValues?.nodes[0]?.value}</>
}
