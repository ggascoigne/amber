import { GetGames_games_edges } from '__generated__/GetGames'
import { GetSlots_slots_nodes } from '__generated__/GetSlots'
import { Game } from 'components/Acnw/Game'
import React from 'react'

interface GameListFull {
  year: number
  slot: GetSlots_slots_nodes
  games: GetGames_games_edges[]
  onEnterGame: any
}

export const GameListFull: React.FC<GameListFull> = ({ year, slot, games, onEnterGame }) => {
  return (
    <React.Fragment key={`slot_${slot.id}`}>
      {games.map(({ node: game }) => {
        return game ? (
          <Game
            key={`game_${game.id}`}
            year={year}
            slot={slot}
            game={game}
            onEnter={() => onEnterGame(`/pastCons/${year}/${slot.id}/${game.id}`)}
          />
        ) : null
      })}
    </React.Fragment>
  )
}
