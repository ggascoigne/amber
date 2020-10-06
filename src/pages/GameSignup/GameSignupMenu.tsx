import { GraphQLError, Loader } from 'components/Acnw'
import { GameMenu } from 'components/Acnw/GameList'
import React from 'react'
import { useGameUrl, useGetMemberShip, useUser } from 'utils'

import { useGetGameChoicesQuery } from '../../client'
import { GameChoiceDecorator, SlotDecoratorCheckMark } from './GameChoiceSelector'

export const GameSignupMenu: React.FC = () => {
  const { year } = useGameUrl()
  const { userId } = useUser()
  const membership = useGetMemberShip(userId)

  const { error, loading, data } = useGetGameChoicesQuery({
    variables: { year, memberId: membership?.id ?? 0 },
    skip: !membership,
  })

  if (error) {
    return <GraphQLError error={error} />
  }

  if (!data && (!membership || loading)) {
    return <Loader />
  }

  const gameChoices = data?.gameChoices?.nodes

  const decoratorParams = {
    gameChoices,
  }

  return (
    <GameMenu
      to='/'
      text='Main Menu'
      title={`Game Signup ${year}`}
      slugPrefix='game-signup'
      selectQuery
      itemDecorator={GameChoiceDecorator}
      itemDecoratorParams={decoratorParams}
      navDecorator={SlotDecoratorCheckMark}
      navDecoratorParams={decoratorParams}
    />
  )
}
