import React from 'react'

import { Loader } from 'ui'

import { useGraphQL, GetSingleLookupValueDocument } from '../../client-graphql'
import {
  getAttendance,
  getBathroomType,
  getInterestLevel,
  getPlayerPreference,
  getRoomPref,
  getRoomType,
  useConfiguration,
} from '../../utils'
import { TransportError } from '../TransportError'

interface LookupValueProps {
  realm: string
  code: string
}

export const InternalLookupValue: React.FC<LookupValueProps> = ({ realm, code }) => {
  const { isLoading, error, data } = useGraphQL(GetSingleLookupValueDocument, { realm, code })
  if (error) {
    return <TransportError error={error} />
  }
  if (isLoading) {
    return <Loader />
  }
  return <>{data?.lookups?.edges[0]?.node?.lookupValues.nodes[0]?.value}</>
}

export const LookupValue: React.FC<LookupValueProps> = ({ realm, code }) => {
  const configuration = useConfiguration()

  // note that in several cases we're moving away from using the database lookup values.
  // though there are some that are potentially a bit more fluid and are worth pulling from the database
  switch (realm) {
    case 'gamePlayerPref':
      return <>{getPlayerPreference(code)}</>
    case 'attendance':
      return <>{getAttendance(configuration, code)}</>
    case 'bathroomType':
      return <>{getBathroomType(code)}</>
    case 'interest':
      return <>{getInterestLevel(configuration, code)}</>
    case 'roomPref':
      return <>{getRoomPref(code)}</>
    case 'roomType':
      return <>{getRoomType(code)}</>
    default:
      return <InternalLookupValue realm={realm} code={code} />
  }
}
