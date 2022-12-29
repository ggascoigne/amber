import React from 'react'
import { useConfiguration, useGameUrl } from '../../utils'

import { GameMenu } from '../../components/GameList'

export const GameBookMenu: React.FC = () => {
  const { year } = useGameUrl()
  const configuration = useConfiguration()

  if (year === configuration.year) {
    return <GameMenu to='/' text='Main Menu' title={`Games for ${year}`} slugPrefix='game-book' />
  }
  return <GameMenu to='/game-history' text='Past Cons' title={`Games for ${year}`} slugPrefix='game-book' />
}
