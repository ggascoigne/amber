import { GameQuery, GameQueryChild } from 'components/Acnw/GameQuery'
import { SlotSelector } from 'components/Acnw/SlotSelector'
import React from 'react'

import { GameSelectionQuery } from '../GameSelectionQuery'
import { SlotDecorator, SlotDecoratorParams } from '../types'

interface GameListNavigator {
  small?: boolean
  name?: string
  children: (props: GameQueryChild) => React.ReactNode
  selectQuery?: boolean
  decorator?: (props: SlotDecorator) => React.ReactNode
  decoratorParams?: SlotDecoratorParams
}

export const GameListNavigator: React.FC<GameListNavigator> = ({
  small = false,
  children,
  name,
  selectQuery = false,
  decorator,
  decoratorParams,
}) => {
  const QueryComponent = selectQuery ? GameSelectionQuery : GameQuery
  return (
    <SlotSelector small={small} name={name} decorator={decorator} decoratorParams={decoratorParams}>
      {({ slot, year }) => (
        <QueryComponent year={year} slot={slot}>
          {({ year, slot, games }) => children({ year, slot, games })}
        </QueryComponent>
      )}
    </SlotSelector>
  )
}
