import { Button } from '@material-ui/core'
import { useGetGameChoicesQuery } from 'client'
import { GraphQLError, Loader } from 'components/Acnw'
import { GameMenu } from 'components/Acnw/GameList'
import React from 'react'
import { useConfirmDialogOpen, useGameUrl, useGetMemberShip, useUser } from 'utils'

import { GameChoiceDecorator, SlotDecoratorCheckMark } from './GameChoiceSelector'

export const GameSignupMenu: React.FC = () => {
  const { year } = useGameUrl()
  const { userId } = useUser()
  const membership = useGetMemberShip(userId)
  const [_, setShowConfirmDialog] = useConfirmDialogOpen()

  const { error, data } = useGetGameChoicesQuery({
    variables: { year, memberId: membership?.id ?? 0 },
    skip: !membership,
    fetchPolicy: 'cache-and-network',
  })

  if (error) {
    return <GraphQLError error={error} />
  }

  if (!data && !membership) {
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
    >
      <Button
        variant='contained'
        color='primary'
        size='large'
        onClick={() => setShowConfirmDialog(true)}
        style={{ margin: '10px 10px 0 10px' }}
      >
        Confirm your Game Choices
      </Button>
    </GameMenu>
  )
}
