import React from 'react'
import { useGetSingleLookupValueQuery } from '../../client'
import {
  getAttendance,
  getBathroomType,
  getInterestLevel,
  getPlayerPreference,
  getRoomPref,
  getRoomType,
} from '../../utils'

import { GraphQLError } from '../GraphQLError'
import { Loader } from '../Loader'

interface LookupValueProps {
  realm: string
  code: string
}

export const InternalLookupValue: React.FC<LookupValueProps> = ({ realm, code }) => {
  const { isLoading, error, data } = useGetSingleLookupValueQuery({ realm, code })
  if (error) {
    return <GraphQLError error={error} />
  }
  if (isLoading) {
    return <Loader />
  }
  return <>{data?.lookups?.edges[0]?.node?.lookupValues.nodes[0]?.value}</>
}

export const LookupValue: React.FC<LookupValueProps> = ({ realm, code }) => {
  // note that in several cases we're moving away from using the database lookup values.
  // though there are some that are potentially a bit more fluid and are worth pulling from the database
  switch (realm) {
    case 'gamePlayerPref':
      return <>{getPlayerPreference(code)}</>
    case 'attendance':
      return <>{getAttendance(code)}</>
    case 'bathroomType':
      return <>{getBathroomType(code)}</>
    case 'interest':
      return <>{getInterestLevel(code)}</>
    case 'roomPref':
      return <>{getRoomPref(code)}</>
    case 'roomType':
      return <>{getRoomType(code)}</>
    default:
      return <InternalLookupValue realm={realm} code={code} />
  }
}
