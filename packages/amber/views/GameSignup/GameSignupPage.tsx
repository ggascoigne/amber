import React, { MouseEventHandler, useCallback, useState } from 'react'

import NavigationIcon from '@mui/icons-material/Navigation'
import { Button } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { InView } from 'react-intersection-observer'
import { ContentsOf, ExpandingFab, Loader, notEmpty, Page, pick } from 'ui'

import { ChoiceConfirmDialog } from './ChoiceConfirmDialog'
import {
  GameChoiceSelector,
  isAnyGame,
  isNoGame,
  orderChoices,
  SelectorUpdate,
  SlotDecoratorCheckMark,
} from './GameChoiceSelector'
import { SignupInstructions } from './SignupInstructions'

import {
  GameChoiceFieldsFragment,
  GetGameChoicesQuery,
  useGraphQL,
  useGraphQLMutation,
  UpdateGameChoiceByNodeIdMutationVariables,
  CreateGameChoiceDocument,
  CreateGameChoicesDocument,
  GetGameChoicesDocument,
  UpdateGameChoiceByNodeIdDocument,
} from '../../client'
import { useInvalidateGameChoiceQueries } from '../../client/querySets'
import { Perms, useAuth } from '../../components/Auth'
import { GameListFull, GameListNavigator } from '../../components/GameList'
import { Link, Redirect } from '../../components/Navigation'
import { TransportError } from '../../components/TransportError'
import {
  useConfiguration,
  useConfirmDialogOpen,
  useGameScroll,
  useGameUrl,
  useGetMemberShip,
  useUser,
} from '../../utils'

export type ChoiceType = ContentsOf<SelectorUpdate, 'gameChoices'> & { modified?: boolean }

export const useEditGameChoice = () => {
  const configuration = useConfiguration()
  const createGameChoice = useGraphQLMutation(CreateGameChoiceDocument)
  const invalidateGameChoiceQueries = useInvalidateGameChoiceQueries()
  const queryClient = useQueryClient()
  const updateGameChoice = useGraphQLMutation(UpdateGameChoiceByNodeIdDocument, {
    onMutate: async (input: UpdateGameChoiceByNodeIdMutationVariables) => {
      const queryKey = ['getGameChoices', { memberId: input.input.patch.memberId, year: input.input.patch.year }]
      await invalidateGameChoiceQueries()
      const previousData = queryClient.getQueryData<GetGameChoicesQuery>(queryKey)
      // note that this isn't doing a deep copy, but since we're replacing the data that seems like a reasonably shortcut
      if (previousData?.gameChoices?.nodes && input?.input?.patch) {
        const choiceIndex = (input.input.patch.slotId! - 1) * 5 + input.input.patch.rank!
        previousData.gameChoices.nodes[choiceIndex] = {
          ...input.input.patch,
          nodeId: input.input.nodeId,
        } as GameChoiceFieldsFragment
        queryClient.setQueryData(queryKey, () => previousData)
      }
      return { previousData }
    },
  })

  const createGameChoices = useGraphQLMutation(CreateGameChoicesDocument)

  const createAllGameChoices = async (memberId: number, year: number) => {
    createGameChoices
      .mutateAsync(
        {
          memberId,
          slots: configuration.numberOfSlots,
          year,
        },
        {
          onSuccess: invalidateGameChoiceQueries,
        },
      )
      .then(() => {
        // console.log('choices created')
      })
  }

  const createOrUpdate = async (values: ChoiceType, refetch = false) => {
    if (values.nodeId) {
      return updateGameChoice
        .mutateAsync(
          {
            input: {
              nodeId: values.nodeId,
              patch: pick(values, 'id', 'memberId', 'gameId', 'returningPlayer', 'slotId', 'year', 'rank'),
            },
          },
          {
            onSettled: () => {
              if (refetch) invalidateGameChoiceQueries()
            },
          },
        )
        .catch((error) => {
          console.log({ text: error.message, variant: 'error' })
        })
    }
    return createGameChoice
      .mutateAsync(
        {
          input: {
            gameChoice: {
              ...pick(values, 'memberId', 'gameId', 'returningPlayer', 'slotId', 'year', 'rank'),
            },
          },
        },
        {
          onSettled: invalidateGameChoiceQueries,
        },
      )
      .then(() => {
        // console.log({ text: 'GameChoice created', variant: 'success' })
      })
      .catch((error) => {
        console.log({ text: error.message, variant: 'error' })
      })
  }

  return [createOrUpdate, createAllGameChoices] as const
}

const gotoTop = () => {
  window.scrollTo(0, 0)
}

const GameSignupPage: React.FC = () => {
  const { slot, year } = useGameUrl()
  const setNewUrl = useGameScroll()
  const { userId } = useUser()
  const membership = useGetMemberShip(userId)
  const [createOrEditGameChoice, createGameChoices] = useEditGameChoice()
  const [created, setCreated] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useConfirmDialogOpen()
  const configuration = useConfiguration()

  const [showFab, setShowFab] = useState(false)
  const { hasPermissions } = useAuth()
  const isAdmin = hasPermissions(Perms.IsAdmin)

  const { error, data } = useGraphQL(
    GetGameChoicesDocument,
    { year, memberId: membership?.id ?? 0 },
    { enabled: !!membership },
  )

  const onCloseConfirm: MouseEventHandler = () => {
    setShowConfirmDialog(false)
  }

  const updateChoice = useCallback(
    (params: SelectorUpdate) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { gameChoices, gameId, rank, returningPlayer, slotId, year, oldRank } = params

      const empty = {
        memberId: membership?.id ?? 0,
        slotId,
        year,
        gameId: null,
        returningPlayer: false,
        modified: true,
      }

      const thisSlotChoices: ChoiceType[] = orderChoices(
        gameChoices?.filter((c) => c?.year === year && c.slotId === slotId),
      )
        // fill out array
        .map((c, index) => (c ? { ...c, modified: false } : { ...empty, rank: index }))
        // unset any other references to the same game
        .map((c) => (c.gameId === gameId && c.rank !== rank ? { ...c, ...empty } : c)) as ChoiceType[]

      if (rank === null) {
        if (oldRank) {
          thisSlotChoices[oldRank] = { ...thisSlotChoices[oldRank]!, ...empty }
        } else {
          console.log(`update changed rank, but didn't pass in the old rank`)
        }
      } else {
        if (rank !== oldRank && (rank === 0 || rank === 1)) {
          const otherRank = rank ? 0 : 1
          // if rank is GM or 1st then nuke the other one
          thisSlotChoices[rank] = { ...thisSlotChoices[rank]!, ...empty, gameId, returningPlayer }
          thisSlotChoices[otherRank] = { ...thisSlotChoices[otherRank]!, ...empty }
        } else {
          thisSlotChoices[rank] = { ...thisSlotChoices[rank]!, ...empty, gameId, returningPlayer }
        }

        if ((isNoGame(configuration, gameId) || isAnyGame(configuration, gameId)) && rank < 4) {
          for (let i = rank + 1; i <= 4; i++) {
            if (thisSlotChoices[i]!.gameId) thisSlotChoices[i] = { ...thisSlotChoices[i]!, ...empty }
          }
        }
      }

      // console.log(thisSlotChoices)

      const updaters = thisSlotChoices
        .filter((c) => c.modified)
        .reduce((acc: Promise<any>[], c, idx, arr) => {
          acc.push(createOrEditGameChoice(c, idx + 1 === arr.length))
          return acc
        }, [])

      Promise.allSettled(updaters).then(() => {
        // console.log('all updaters complete')
      })
    },
    [configuration, createOrEditGameChoice, membership?.id],
  )

  const gameChoices = data?.gameChoices?.nodes
  const gameSubmission = data?.gameSubmissions?.nodes

  if (membership === undefined) {
    // still loading
    return <Loader />
  }
  if (membership == null) {
    // OK we know this is not a member
    return <Redirect to='/membership' />
  }

  if (error) {
    return <TransportError error={error} />
  }
  if (!data) {
    return <Loader />
  }

  if (gameChoices !== undefined && gameChoices.length === 0 && !created) {
    setCreated(true)
    createGameChoices(membership.id, year).then()
  }

  if (gameChoices !== undefined && gameChoices.length === 0) {
    return <Loader />
  }

  // debug a smaller subset fo the data, sorted
  // const g = gameChoices
  //   ?.map((c) => pick(c!, 'slotId', 'rank', 'gameId', 'id'))
  //   ?.sort((a, b) => (a?.rank ?? 0) - (b?.rank ?? 0))
  //   ?.sort((a, b) => (a?.slotId ?? 0) - (b?.slotId ?? 0))
  // console.table(g)

  const gmSlots = gameChoices?.filter((c) => c?.rank === 0 && c.gameId).filter(notEmpty)
  const selectorParams = {
    gameChoices,
    updateChoice,
    gmSlots,
  }

  if (gameSubmission?.[0] && !isAdmin) {
    return <Redirect to='/game-choices' />
  }

  return (
    <Page title='Game Signup'>
      {showFab && (
        <ExpandingFab label='Goto Top' show={showFab} onClick={gotoTop}>
          <NavigationIcon />
        </ExpandingFab>
      )}
      {gameSubmission?.[0] && isAdmin ? <Link href='/game-choices'>See completed Summary</Link> : null}

      {slot === 1 && <SignupInstructions year={year} />}
      <Button
        variant='contained'
        color='primary'
        size='large'
        onClick={() => setShowConfirmDialog(true)}
        style={{ marginBottom: 20 }}
      >
        Confirm your Game Choices
      </Button>
      {showConfirmDialog && (
        <ChoiceConfirmDialog
          year={year}
          memberId={membership.id}
          open={showConfirmDialog}
          onClose={onCloseConfirm}
          gameChoices={gameChoices}
          gameSubmission={gameSubmission?.[0] ?? undefined}
        />
      )}
      <InView as='div' rootMargin='-100px 0px -80% 0px' onChange={(inView) => setShowFab(inView)}>
        <GameListNavigator name='page' selectQuery decorator={SlotDecoratorCheckMark} decoratorParams={selectorParams}>
          {/* eslint-disable-next-line @typescript-eslint/no-shadow */}
          {({ year, slot, games }) => (
            <GameListFull
              year={year}
              slot={slot}
              games={games!}
              onEnterGame={setNewUrl}
              decorator={GameChoiceSelector}
              decoratorParams={selectorParams}
            />
          )}
        </GameListNavigator>
      </InView>
    </Page>
  )
}

export default GameSignupPage
