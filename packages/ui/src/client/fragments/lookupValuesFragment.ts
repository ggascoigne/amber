import gql from 'graphql-tag'

export const LOOKUP_VALUES_FRAGMENT = gql`
  fragment lookupValuesFields on LookupValue {
    nodeId
    id
    code
    sequencer
    value
  }
`
