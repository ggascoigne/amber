import gql from 'graphql-tag'

export const SLOT_FRAGMENT = gql`
  fragment slotFields on Slot {
    nodeId
    id
    slot
    day
    length
    time
  }
`
