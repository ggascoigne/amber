import { useGetSingleLookupValueQuery } from 'client'
import React from 'react'
import { getPlayerPreference } from 'utils/lookupValues'

import { GraphQLError } from '../GraphQLError'
import { Loader } from '../Loader'

type LookupValue = { realm: string; code: string }

export const LookupValue: React.FC<LookupValue> = ({ realm, code }) => {
  // note that in several cases we're moving away from using the database lookup values.
  // though there are some that are potentially a bit more fluid and are worth pulling from the database
  switch (realm) {
    case 'gamePlayerPref':
      return <>{getPlayerPreference(code)}</>
    default:
      return <InternalLookupValue realm={realm} code={code} />
  }
}

export const InternalLookupValue: React.FC<LookupValue> = ({ realm, code }) => {
  const { loading, error, data } = useGetSingleLookupValueQuery({ variables: { realm, code } })
  if (error) {
    return <GraphQLError error={error} />
  }
  if (loading) {
    return <Loader />
  }
  return <>{data && data?.lookups?.edges[0]?.node?.lookupValues?.nodes[0]?.value}</>
}
