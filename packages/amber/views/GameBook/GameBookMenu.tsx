import React from 'react'

import { GameMenu } from '../../components/GameList'
import { useConfiguration, useGameUrl } from '../../utils'

export const GameBookMenu: React.FC = () => {
  const { year } = useGameUrl()
  const configuration = useConfiguration()

  if (year === configuration.year) {
    return <GameMenu to='/' text='Main Menu' title={`Games for ${year}`} slugPrefix='game-book' />
  }
  return <GameMenu to='/game-history' text='Past Cons' title={`Games for ${year}`} slugPrefix='game-book' />
}
