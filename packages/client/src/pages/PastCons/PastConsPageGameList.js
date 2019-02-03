import { GameList, GameListFull } from 'components/Acnw/GameList'
import React from 'react'

export const PastConsPageGameList = ({ year, slotIdStr, onEnterGame }) => (
  <GameList year={year} slotIdStr={slotIdStr}>
    {({ year, slot, games }) => <GameListFull year={year} slot={slot} games={games} onEnterGame={onEnterGame} />}
  </GameList>
)
