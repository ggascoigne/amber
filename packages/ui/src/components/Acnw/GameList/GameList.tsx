import { GameQuery, GameQueryChild } from 'components/Acnw/GameQuery'
import { SlotSelector } from 'components/Acnw/SlotSelector'
import React from 'react'

import { SlotFieldsFragment, useGetSlotsQuery } from '../../../client'
import { GraphQLError } from '../GraphQLError'
import { Loader } from '../Loader'

interface GameList {
  small?: boolean
  year: number
  slotIdStr: string

  children(props: GameQueryChild): React.ReactNode
}

export const GameList: React.FC<GameList> = ({ small = false, year, slotIdStr, children }) => {
  const { loading, error, data } = useGetSlotsQuery()

  if (loading) {
    return <Loader />
  }
  if (error) {
    return <GraphQLError error={error} />
  }

  return (
    <SlotSelector small={small} year={year} slots={data?.slots?.nodes} selectedSlotId={parseInt(slotIdStr)}>
      {(slot: SlotFieldsFragment) => (
        <GameQuery year={year} slot={slot}>
          {({ year, slot, games }) => children({ year, slot, games })}
        </GameQuery>
      )}
    </SlotSelector>
  )
}
