import { GetLookups, GetLookups_lookups } from '__generated__/GetLookups'
import { GqlQuery } from 'components/Acnw/GqlQuery'
import gql from 'graphql-tag'
import React from 'react'

const QUERY_LOOKUP = gql`
  query GetLookups {
    lookups {
      edges {
        node {
          nodeId
          id
          realm
          lookupValues {
            nodes {
              nodeId
              id
              sequencer
              value
            }
          }
        }
      }
    }
  }
`
interface ILookupsQuery {
  children(props: ILookupsQueryChild): React.ReactNode
}

interface ILookupsQueryChild {
  lookups?: GetLookups_lookups
}

export const LookupsQuery: React.FC<ILookupsQuery> = ({ children }) => {
  return (
    <GqlQuery<GetLookups> query={QUERY_LOOKUP} errorPolicy='all'>
      {data => children && children({ lookups: data && data.lookups ? data.lookups : undefined })}
    </GqlQuery>
  )
}
