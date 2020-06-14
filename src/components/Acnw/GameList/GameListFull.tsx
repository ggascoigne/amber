import { GameCard } from 'components/Acnw/GameCard'
import React from 'react'

import type { GameArray, SlotFieldsFragment } from '../../../client'

interface GameListFull {
  year: number
  slot: SlotFieldsFragment
  games: GameArray
  onEnterGame: any
}

export const GameListFull: React.FC<GameListFull> = ({ year, slot, games, onEnterGame }) => (
  <React.Fragment key={`slot_${slot.id}`}>
    {games.map(({ node: game }) =>
      game ? (
        <GameCard
          key={`game_${game.id}`}
          year={year}
          slot={slot}
          game={game}
          onEnter={() => onEnterGame(`/pastCons/${year}/${slot.id}/${game.id}`)}
        />
      ) : null
    )}
  </React.Fragment>
)
