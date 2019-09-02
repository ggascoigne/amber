import { GetSlots } from '__generated__/GetSlots'
import { useQuery } from '@apollo/react-hooks'
import { SLOT_FRAGMENT } from 'client'
import gql from 'graphql-tag'

const QUERY_SLOTS = gql`
  query GetSlots {
    slots {
      nodes {
        ...slotFields
      }
    }
  }
  ${SLOT_FRAGMENT}
`

export const useSlotQuery = () => useQuery<GetSlots>(QUERY_SLOTS)
