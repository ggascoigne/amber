import { GetSlots_slots_nodes } from '__generated__/GetSlots'
import { useSlotQuery } from 'client'
import { GameQuery, GameQueryChild } from 'components/Acnw/GameQuery'
import { SlotSelector } from 'components/Acnw/SlotSelector'
import React from 'react'

import { GraphQLError } from '../GraphQLError'
import { Loader } from '../Loader'

interface GameList {
  small?: boolean
  year: number
  slotIdStr: string

  children(props: GameQueryChild): React.ReactNode
}

export const GameList: React.FC<GameList> = ({ small = false, year, slotIdStr, children }) => {
  const { loading, error, data } = useSlotQuery()

  if (loading) {
    return <Loader />
  }
  if (error) {
    return <GraphQLError error={error} />
  }

  return (
    <SlotSelector small={small} year={year} slots={data!.slots!.nodes} selectedSlotId={parseInt(slotIdStr)}>
      {(slot: GetSlots_slots_nodes) => (
        <GameQuery year={year} slot={slot}>
          {({ year, slot, games }) => children({ year, slot, games })}
        </GameQuery>
      )}
    </SlotSelector>
  )
}
