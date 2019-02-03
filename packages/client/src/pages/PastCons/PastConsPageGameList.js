import { GameList } from 'components/Acnw/GameList/GameList'
import { GameListFull } from 'components/Acnw/GameList/GameListFull'
import React from 'react'

export const PastConsPageGameList = ({ year, slotIdStr, onEnterGame }) => (
  <GameList year={year} slotIdStr={slotIdStr}>
    {({ year, slot, games }) => <GameListFull year={year} slot={slot} games={games} onEnterGame={onEnterGame} />}
  </GameList>
)
