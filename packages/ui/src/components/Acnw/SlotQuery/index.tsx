import { GetSlots, GetSlots_slots_nodes } from '__generated__/GetSlots'
import { SLOT_FRAGMENT } from 'client/fragments'
import { GqlQuery } from 'components/Acnw/GqlQuery'
import gql from 'graphql-tag'
import React from 'react'

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

interface ISlotQuery {
  year: number

  children(props: ISlotQueryChild): React.ReactNode
}

interface ISlotQueryChild {
  year: number
  slots?: (GetSlots_slots_nodes | null)[]
}

export const SlotQuery: React.FC<ISlotQuery> = ({ year, children }) => {
  return (
    <GqlQuery<GetSlots> query={QUERY_SLOTS} errorPolicy='all'>
      {data => children && children({ year, slots: data && data.slots ? data.slots.nodes : undefined })}
    </GqlQuery>
  )
}
