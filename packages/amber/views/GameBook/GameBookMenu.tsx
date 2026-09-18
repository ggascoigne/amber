import React from 'react'

import { GameMasterSlotDecorator, useGameMasterChoiceIds } from './GameBookSlotDecorator'

import { GameMenu } from '../../components/GameList'
import { useConfiguration } from '../../utils/configContext'
import { useGameUrl } from '../../utils/useGameUrl'

export const GameBookMenu = () => {
  const { year } = useGameUrl()
  const configuration = useConfiguration()
  const { gameIds: gmGameIds, slotIds: gmSlotIds } = useGameMasterChoiceIds()

  if (year === configuration.year) {
    return (
      <GameMenu
        to='/'
        text='Main Menu'
        title={`Games for ${year}`}
        slugPrefix='game-book'
        navDecorator={GameMasterSlotDecorator}
        navDecoratorParams={{ gmSlotIds }}
        isItemTitleEmphasized={({ game }) => gmGameIds.has(game.id)}
      />
    )
  }
  return (
    <GameMenu
      to='/game-history'
      text='Past Cons'
      title={`Games for ${year}`}
      slugPrefix='game-book'
      navDecorator={GameMasterSlotDecorator}
      navDecoratorParams={{ gmSlotIds }}
      isItemTitleEmphasized={({ game }) => gmGameIds.has(game.id)}
    />
  )
}
