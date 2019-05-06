import { GetLookupValue, GetLookupValueVariables } from '__generated__/GetLookupValue'
import { LOOKUP_FRAGMENT, LOOKUP_VALUES_FRAGMENT } from 'client/fragments'
import { GqlQuery } from 'components/Acnw/GqlQuery'
import gql from 'graphql-tag'
import React from 'react'

const QUERY_LOOKUP_VALUES = gql`
  query GetLookupValue($realm: String!, $code: String!) {
    lookups(condition: { realm: $realm }) {
      edges {
        node {
          ...lookupFields
          lookupValues(condition: { code: $code }) {
            nodes {
              ...lookupValuesFields
            }
          }
        }
      }
    }
  }
  ${LOOKUP_FRAGMENT}
  ${LOOKUP_VALUES_FRAGMENT}
`

export const LookupValue: React.FC<GetLookupValueVariables> = ({ realm, code }) => {
  return (
    <GqlQuery<GetLookupValue, GetLookupValueVariables>
      query={QUERY_LOOKUP_VALUES}
      variables={{ realm, code }}
      errorPolicy='all'
    >
      {data => data.lookups.edges[0].node.lookupValues.nodes[0].value}
    </GqlQuery>
  )
}
