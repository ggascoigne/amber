import React, { MouseEventHandler, useCallback, useState } from 'react'

import { useTRPC, useInvalidateGameChoiceQueries } from '@amber/client'
import { pick, ContentsOf, ExpandingFab, Loader, notEmpty, Page, pickAndConvertNull } from '@amber/ui'
import NavigationIcon from '@mui/icons-material/Navigation'
import { Button } from '@mui/material'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { InView } from 'react-intersection-observer'

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const debugGameChoices = (gameChoices: ChoiceType[] | undefined) => {
  const g = gameChoices
    ?.map((c) => pick(c!, 'slotId', 'rank', 'gameId', 'id'))
    ?.sort((a, b) => (a?.rank ?? 0) - (b?.rank ?? 0))
    ?.sort((a, b) => (a?.slotId ?? 0) - (b?.slotId ?? 0))
  console.table(g)
}
export type ChoiceType = ContentsOf<SelectorUpdate, 'gameChoices'> & { modified?: boolean }

export const useEditGameChoice = () => {
  const trpc = useTRPC()
  const configuration = useConfiguration()
  const createGameChoice = useMutation(trpc.gameChoices.createGameChoice.mutationOptions())
  const invalidateGameChoiceQueries = useInvalidateGameChoiceQueries()
  const queryClient = useQueryClient()
  const updateGameChoice = useMutation(
    trpc.gameChoices.updateGameChoice.mutationOptions({
      onMutate: async (input) => {
        const queryKey = trpc.gameChoices.getGameChoices.queryKey({
          memberId: input.data.memberId,
          year: input.data.year,
        })
        const previousData = queryClient.getQueryData(queryKey)
        await invalidateGameChoiceQueries()
        // note that this isn't doing a deep copy, but since we're replacing the data that seems like a reasonably shortcut
        if (previousData?.gameChoices && input?.data) {
          const choiceIndex = (input.data.slotId! - 1) * 5 + input.data.rank!
          previousData.gameChoices[choiceIndex] = {
            ...input.data,
            id: input.id,
          }
          // console.log('onMutate, updating cache for', queryKey, 'at index', choiceIndex, previousData)
          queryClient.setQueryData(queryKey, () => previousData)
        }
        return { previousData }
      },
    }),
  )

  const createGameChoices = useMutation(trpc.gameChoices.createGameChoices.mutationOptions())

  const createAllGameChoices = async (memberId: number, year: number) => {
    createGameChoices.mutateAsync(
      {
        memberId,
        noSlots: configuration.numberOfSlots,
        year,
      },
      {
        onSuccess: invalidateGameChoiceQueries,
      },
    )
  }

  const createOrUpdate = async (values: ChoiceType, refetch = false) => {
    // console.log('GameSignupPage:', values)
    if (values.id) {
      return updateGameChoice
        .mutateAsync(
          {
            id: values.id,
            data: pick(values, 'id', 'memberId', 'gameId', 'returningPlayer', 'slotId', 'year', 'rank'),
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
      .mutateAsync(pickAndConvertNull(values, 'memberId', 'gameId', 'returningPlayer', 'slotId', 'year', 'rank'), {
        onSettled: invalidateGameChoiceQueries,
      })
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

const GameSignupPage = () => {
  const trpc = useTRPC()
  const { slot, year } = useGameUrl()
  const setNewUrl = useGameScroll()
  const { userId } = useUser()
  const membership = useGetMemberShip(userId)
  const [createOrEditGameChoice, createAllGameChoices] = useEditGameChoice()
  const [created, setCreated] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useConfirmDialogOpen()
  const configuration = useConfiguration()

  const [showFab, setShowFab] = useState(false)
  const { hasPermissions } = useAuth()
  const isAdmin = hasPermissions(Perms.IsAdmin)

  const { error, data, isLoading } = useQuery(
    trpc.gameChoices.getGameChoices.queryOptions(
      { year, memberId: membership?.id ?? 0 },
      {
        enabled: !!membership,
        trpc: {
          context: {
            skipBatch: true,
          },
        },
      },
    ),
  )

  const onCloseConfirm: MouseEventHandler = () => {
    setShowConfirmDialog(false)
  }

  const updateChoice = useCallback(
    (params: SelectorUpdate) => {
      const { gameChoices, gameId, rank, returningPlayer, slotId, year: newYear, oldRank } = params

      const empty = {
        memberId: membership?.id ?? 0,
        slotId,
        year: newYear,
        gameId: null,
        returningPlayer: false,
        modified: true,
      }

      const thisSlotChoices: ChoiceType[] = orderChoices(
        gameChoices?.filter((c) => c?.year === newYear && c.slotId === slotId),
      )
        // fill out array
        .map((c, index) => (c ? { ...c, modified: false } : { ...empty, rank: index }))
        // unset any other references to the same game
        .map((c) => (c.gameId === gameId && c.rank !== rank ? { ...c, ...empty } : c)) as ChoiceType[]

      // debugGameChoices(gameChoices)
      // debugGameChoices(thisSlotChoices)

      if (rank === null) {
        if (oldRank || oldRank === 0) {
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

      // console.log(`slotId ${slotId} thisSlotChoices:`, thisSlotChoices)

      const updaters = thisSlotChoices
        .filter((c) => c.modified)
        .reduce((acc: Promise<any>[], c, idx, arr) => {
          if (c.id) acc.push(createOrEditGameChoice(c, idx + 1 === arr.length))
          return acc
        }, [])

      Promise.allSettled(updaters).then(() => {
        // console.log('all updaters complete')
      })
    },
    [configuration, createOrEditGameChoice, membership?.id],
  )

  const gameChoices = data?.gameChoices
  const gameSubmission = data?.gameSubmissions

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
  if (!data || isLoading) {
    return <Loader />
  }

  if (gameChoices !== undefined && gameChoices.length === 0 && !created) {
    setCreated(true)
    createAllGameChoices(membership.id, year).then()
  }

  if (gameChoices !== undefined && gameChoices.length === 0) {
    return <Loader />
  }

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
          {({ year: y, slot: s, games }) => (
            <GameListFull
              year={y}
              slot={s}
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
