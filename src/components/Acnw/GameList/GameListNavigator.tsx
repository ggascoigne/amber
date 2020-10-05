import { GameQuery, GameQueryChild } from 'components/Acnw/GameQuery'
import { SlotSelector } from 'components/Acnw/SlotSelector'
import React from 'react'

import { GameSelectionQuery } from '../GameSelectionQuery'

interface GameListNavigator {
  small?: boolean
  name?: string
  children: (props: GameQueryChild) => React.ReactNode
  selectQuery?: boolean
}

export const GameListNavigator: React.FC<GameListNavigator> = ({
  small = false,
  children,
  name,
  selectQuery = false,
}) => {
  const QueryComponent = selectQuery ? GameSelectionQuery : GameQuery
  return (
    <SlotSelector small={small} name={name}>
      {({ slot, year }) => (
        <QueryComponent year={year} slot={slot}>
          {({ year, slot, games }) => children({ year, slot, games })}
        </QueryComponent>
      )}
    </SlotSelector>
  )
}
