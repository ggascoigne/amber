import { GameCard } from 'components/Acnw/GameCard'
import React from 'react'

import { GameFieldsFragment, GameGmsFragment, SlotFieldsFragment } from '../../../client'
import { Edges } from '../../../utils/ts-utils'

interface GameListFull {
  year: number
  slot: SlotFieldsFragment
  games: Edges<GameFieldsFragment & GameGmsFragment>
  onEnterGame: any
}

export const GameListFull: React.FC<GameListFull> = ({ year, slot, games, onEnterGame }) => {
  return (
    <React.Fragment key={`slot_${slot.id}`}>
      {games.map(({ node: game }) => {
        return game ? (
          <GameCard
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
