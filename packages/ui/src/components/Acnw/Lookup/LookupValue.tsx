import { GetLookupValue, GetLookupValueVariables } from '__generated__/GetLookupValue'
import { GqlQuery } from 'components/Acnw/GqlQuery'
import gql from 'graphql-tag'
import React from 'react'

const QUERY_LOOKUP = gql`
  query GetLookupValue($realm: String!, $code: String!) {
    lookups(condition: { realm: $realm }) {
      edges {
        node {
          nodeId
          realm
          lookupValues(condition: { code: $code }) {
            nodes {
              nodeId
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

export const LookupValue: React.FC<GetLookupValueVariables> = ({ realm, code }) => {
  return (
    <GqlQuery<GetLookupValue, GetLookupValueVariables>
      query={QUERY_LOOKUP}
      variables={{ realm, code }}
      errorPolicy='all'
    >
      {data => data.lookups.edges[0].node.lookupValues.nodes[0].value}
    </GqlQuery>
  )
}
