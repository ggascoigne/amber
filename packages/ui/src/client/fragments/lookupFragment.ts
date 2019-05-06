import gql from 'graphql-tag'

export const LOOKUP_FRAGMENT = gql`
  fragment lookupFields on Lookup {
    nodeId
    id
    realm
  }
`
