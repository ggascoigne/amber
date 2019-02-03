import { Game } from 'components/Acnw/Game'
import PropTypes from 'prop-types'
import React from 'react'

export const GameListFull = ({ year, slot, games, onEnterGame }) => {
  return (
    <React.Fragment key={`slot_${slot.id}`}>
      {games.map(({ node: game }) => {
        return (
          <Game
            key={`game_${game.id}`}
            year={year}
            slot={slot}
            game={game}
            onEnter={() => onEnterGame(`/pastCons/${year}/${slot.id}/${game.id}`)}
          />
        )
      })}
    </React.Fragment>
  )
}

GameListFull.propTypes = {
  year: PropTypes.number.isRequired,
  slot: PropTypes.object.isRequired,
  games: PropTypes.array.isRequired,
  onEnterGame: PropTypes.func.isRequired
}
