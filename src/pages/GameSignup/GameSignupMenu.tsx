import { GameMenu } from 'components/Acnw/GameList'
import React from 'react'
import { useGameUrl } from 'utils'

export const GameSignupMenu: React.FC = () => {
  const { year } = useGameUrl()
  return <GameMenu to='/' text='Main Menu' title={`Game Signup ${year}`} slugPrefix='game-signup' selectQuery />
}
