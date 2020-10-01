import { GameListFull, GameListNavigator } from 'components/Acnw/GameList'
import React from 'react'

interface IGameBookPageGameList {
  year: number
  slotIdStr: string
  onEnterGame: any
}
export const GameBookPageGameList: React.FC<IGameBookPageGameList> = ({ year, slotIdStr, onEnterGame }) => (
  <GameListNavigator year={year} slotIdStr={slotIdStr}>
    {({ year, slot, games }) => <GameListFull year={year} slot={slot} games={games!} onEnterGame={onEnterGame} />}
  </GameListNavigator>
)
