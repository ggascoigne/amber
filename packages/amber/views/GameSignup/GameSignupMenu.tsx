import React from 'react'

import { useTRPC } from '@amber/client'
import { Button } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Loader } from 'ui'

import { GameChoiceDecorator, SlotDecoratorCheckMark } from './GameChoiceSelector'

import { GameMenu } from '../../components/GameList'
import { TransportError } from '../../components/TransportError'
import { useConfirmDialogOpen, useGameUrl, useGetMemberShip, useUser } from '../../utils'

export const GameSignupMenu = () => {
  const trpc = useTRPC()
  const { year } = useGameUrl()
  const { userId } = useUser()
  const membership = useGetMemberShip(userId)
  const [, setShowConfirmDialog] = useConfirmDialogOpen()

  const { error, data } = useQuery(
    trpc.gameChoices.getGameChoices.queryOptions({ year, memberId: membership?.id ?? 0 }, { enabled: !!membership }),
  )

  if (error) {
    return <TransportError error={error} />
  }

  if (!data && !membership) {
    return <Loader />
  }

  const gameChoices = data?.gameChoices?.filter((c) => c?.gameId)

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
