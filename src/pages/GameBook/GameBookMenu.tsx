import { GameMenu } from 'components/Acnw'
import React from 'react'
import { configuration, useGameUrl } from 'utils'

export const GameBookMenu: React.FC = () => {
  const { year } = useGameUrl()

  if (year === configuration.year) {
    return <GameMenu to='/' text='Main Menu' title={`Games for ${year}`} slugPrefix='game-book' />
  } else {
    return <GameMenu to='/game-history' text='Past Cons' title={`Games for ${year}`} slugPrefix='game-book' />
  }
}
