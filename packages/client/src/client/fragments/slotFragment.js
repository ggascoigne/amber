import gql from 'graphql-tag'

export const SLOT_FRAGMENT = gql`
  fragment slotFields on Slot {
    id
    slot
    day
    length
    time
  }
`
