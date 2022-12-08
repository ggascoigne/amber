import { Button } from '@mui/material'
import React from 'react'
import { useGetGameChoicesQuery } from '@/client'
import { useConfirmDialogOpen, useGameUrl, useGetMemberShip, useUser } from '@/utils'

import { GameMenu } from '@/components/GameList'
import { GraphQLError } from '@/components/GraphQLError'
import { Loader } from '@/components/Loader'
import { GameChoiceDecorator, SlotDecoratorCheckMark } from './GameChoiceSelector'

export const GameSignupMenu: React.FC = () => {
  const { year } = useGameUrl()
  const { userId } = useUser()
  const membership = useGetMemberShip(userId)
  const [_, setShowConfirmDialog] = useConfirmDialogOpen()

  const { error, data } = useGetGameChoicesQuery({ year, memberId: membership?.id ?? 0 }, { enabled: !!membership })

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
