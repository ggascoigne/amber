import React from 'react'

import { GameQuery, GameQueryChild } from '../GameQuery'
import { GameSelectionQuery } from '../GameSelectionQuery'
import { SlotSelector } from '../SlotSelector'
import { SlotDecorator, SlotDecoratorParams } from '../types'

interface GameListNavigatorProps {
  small?: boolean
  name?: string
  children: (props: GameQueryChild) => React.ReactNode
  selectQuery?: boolean
  decorator?: (props: SlotDecorator) => React.ReactNode
  decoratorParams?: SlotDecoratorParams
}

export const GameListNavigator = ({
  small = false,
  children,
  name,
  selectQuery = false,
  decorator,
  decoratorParams,
}: GameListNavigatorProps) => {
  const QueryComponent = selectQuery ? GameSelectionQuery : GameQuery
  return (
    <SlotSelector small={small} name={name} decorator={decorator} decoratorParams={decoratorParams}>
      {({ slot, year }) => (
        <QueryComponent year={year} slot={slot}>
          {/* eslint-disable-next-line @typescript-eslint/no-shadow */}
          {({ year, slot, games }) => children({ year, slot, games })}
        </QueryComponent>
      )}
    </SlotSelector>
  )
}
