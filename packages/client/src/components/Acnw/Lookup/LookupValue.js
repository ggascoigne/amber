import { GqlQuery } from 'components/Acnw/GqlQuery'
import gql from 'graphql-tag'
import get from 'lodash/get'
import * as PropTypes from 'prop-types'
import React from 'react'

const QUERY_LOOKUP = gql`
  query($realm: String!, $code: String!) {
    lookups(condition: { realm: $realm }) {
      edges {
        node {
          realm
          lookupValues(condition: { code: $code }) {
            nodes {
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

export const LookupValue = ({ realm, code }) => {
  return (
    <GqlQuery query={QUERY_LOOKUP} variables={{ realm, code }} errorPolicy='all'>
      {data => get(data, 'lookups.edges[0].node.lookupValues.nodes[0].value')}
    </GqlQuery>
  )
}

LookupValue.propTypes = {
  realm: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired
}
