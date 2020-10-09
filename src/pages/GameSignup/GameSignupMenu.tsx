import { Button } from '@material-ui/core'
import { GraphQLError, Loader, Page } from 'components/Acnw'
import { GameMenu } from 'components/Acnw/GameList'
import React from 'react'
import { useGameUrl, useGetMemberShip, useUser } from 'utils'

import { useGetGameChoicesQuery } from '../../client'
import { useConfirmDialogOpenState } from '../../utils/useConfirmDialogOpenState'
import { GameChoiceDecorator, SlotDecoratorCheckMark, allSlotsComplete } from './GameChoiceSelector'

export const GameSignupMenu: React.FC = () => {
  const { year } = useGameUrl()
  const { userId } = useUser()
  const membership = useGetMemberShip(userId)
  const setShowConfirmDialog = useConfirmDialogOpenState((state) => state.setState)

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
  const complete = allSlotsComplete(year, gameChoices)

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
      {complete && (
        <Button
          variant='contained'
          color='primary'
          size='large'
          onClick={() => setShowConfirmDialog({ open: true })}
          style={{ margin: '10px 10px 0 10px' }}
        >
          Confirm your Game Choices
        </Button>
      )}
    </GameMenu>
  )
}
