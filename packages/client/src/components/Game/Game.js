import React from 'react'
import get from 'lodash/get'

const Game = ({ game }) => {
  const id = get(game, 'id')
  const slotId = get(game, 'slotId', 0)
  const name = get(game, 'name', 'missing name')
  return slotId ? (
    <div key={`game_${id}`}>
      {slotId}: {name}
    </div>
  ) : null
}

export default Game
