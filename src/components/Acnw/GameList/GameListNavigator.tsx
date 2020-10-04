import { GameQuery, GameQueryChild } from 'components/Acnw/GameQuery'
import { SlotSelector } from 'components/Acnw/SlotSelector'
import React from 'react'

interface GameListNavigator {
  small?: boolean
  name?: string
  children: (props: GameQueryChild) => React.ReactNode
}

export const GameListNavigator: React.FC<GameListNavigator> = ({ small = false, children, name }) => (
  <SlotSelector small={small} name={name}>
    {({ slot, year }) => (
      <GameQuery year={year} slot={slot}>
        {({ year, slot, games }) => children({ year, slot, games })}
      </GameQuery>
    )}
  </SlotSelector>
)
