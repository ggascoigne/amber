import { useCreateGameChoiceMutation, useGetGameChoicesQuery, useUpdateGameChoiceByNodeIdMutation } from 'client'
import { GameListFull, GameListNavigator, GraphQLError, Loader, Page } from 'components/Acnw'
import React, { useCallback } from 'react'
import { Redirect } from 'react-router-dom'
import { PropType, UnpackArray, pick, useGameScroll, useGameUrl, useGetMemberShip, useUser } from 'utils'

import {
  GameChoiceSelector,
  SelectorUpdate,
  SlotDecoratorCheckMark,
  allSlotsComplete,
  orderChoices,
} from './GameChoiceSelector'
import { SignupInstructions } from './SignupInstructions'

type choiceType = NonNullable<UnpackArray<PropType<SelectorUpdate, 'gameChoices'>>> & { modified?: boolean }

export const useEditGameChoice = () => {
  const [createGameChoice] = useCreateGameChoiceMutation()
  const [updateGameChoice] = useUpdateGameChoiceByNodeIdMutation()

  return async (values: choiceType, refetch = false) => {
    if (values.nodeId) {
      return updateGameChoice({
        variables: {
          input: {
            nodeId: values.nodeId!,
            patch: {
              ...pick(values, 'id', 'memberId', 'gameId', 'returningPlayer', 'slotId', 'year', 'rank'),
            },
          },
        },
        refetchQueries: refetch ? ['GetGameChoices'] : undefined,
        optimisticResponse: {
          ...pick(values, 'id', 'nodeId', 'memberId', 'gameId', 'returningPlayer', 'slotId', 'year', 'rank'),
          __typename: 'GameChoice',
        },
      })
        .then(() => {})
        .catch((error) => {
          console.log({ text: error.message, variant: 'error' })
        })
    } else {
      return createGameChoice({
        variables: {
          input: {
            gameChoice: {
              ...pick(values, 'memberId', 'gameId', 'returningPlayer', 'slotId', 'year', 'rank'),
            },
          },
        },
        refetchQueries: refetch ? ['GetGameChoices'] : undefined,
      })
        .then((res) => {
          // console.log({ text: 'GameChoice created', variant: 'success' })
        })
        .catch((error) => {
          console.log({ text: error.message, variant: 'error' })
        })
    }
  }
}

export const GameSignupPage: React.FC = () => {
  const { slot, year } = useGameUrl()
  const setNewUrl = useGameScroll()
  const { userId } = useUser()
  const membership = useGetMemberShip(userId)
  const createOrEditGameChoice = useEditGameChoice()

  const { loading, error, data } = useGetGameChoicesQuery({
    variables: { year, memberId: membership?.id ?? 0 },
    skip: !membership,
  })

  const updateChoice = useCallback(
    (params: SelectorUpdate) => {
      const { gameChoices, gameId, rank, returningPlayer, slotId, year, oldRank } = params

      const empty = {
        slotId,
        year,
        gameId: null,
        returningPlayer: false,
        modified: true,
      }

      const thisSlotChoices: choiceType[] = orderChoices(
        gameChoices?.filter((c) => c?.year === year && c?.slotId === slotId)
      )
        // fill out array
        .map((c, index) => (c ? { ...c, modified: false } : { ...empty, rank: index }))
        // unset any other references to the same game
        .map((c) => (c.gameId === gameId && c.rank !== rank ? { ...c, ...empty } : c)) as choiceType[]

      if (rank === null) {
        if (oldRank) {
          thisSlotChoices[oldRank] = { ...thisSlotChoices[oldRank], ...empty }
        } else {
          console.log(`update changed rank, but didn't pass in the old rank`)
        }
      } else {
        if (rank !== oldRank && (rank === 0 || rank === 1)) {
          const otherRank = rank ? 0 : 1
          // if rank is GM or 1st then nuke the other one
          thisSlotChoices[rank] = { ...thisSlotChoices[rank], ...empty, gameId, returningPlayer }
          thisSlotChoices[otherRank] = { ...thisSlotChoices[otherRank], ...empty }
        } else {
          thisSlotChoices[rank] = { ...thisSlotChoices[rank], ...empty, gameId, returningPlayer }
        }
      }

      // console.log(thisSlotChoices)

      const updaters = thisSlotChoices
        .filter((c) => c.modified)
        .reduce((acc: Promise<any>[], c, idx, arr) => {
          acc.push(createOrEditGameChoice(c, idx + 1 === arr.length))
          return acc
        }, [])

      Promise.all(updaters).then(() => {
        // console.log('all updaters complete')
      })
    },
    [createOrEditGameChoice]
  )

  if (membership === undefined) {
    // still loading
    return <Loader />
  } else if (membership == null) {
    // OK we know this is not a member
    return <Redirect to='/membership' />
  }

  if (error) {
    return <GraphQLError error={error} />
  }
  if (loading && !data) {
    return <Loader />
  }

  const gameChoices = data?.gameChoices?.nodes
  const gameSubmission = data?.gameSubmissions?.nodes

  const selectorParams = {
    gameChoices,
    updateChoice,
  }

  const complete = allSlotsComplete(year, gameChoices)

  return (
    <Page>
      {slot === 1 && <SignupInstructions year={year} />}
      {complete && <>COMPLETE</>}
      <GameListNavigator name='page' selectQuery decorator={SlotDecoratorCheckMark} decoratorParams={selectorParams}>
        {({ year, slot, games }) => (
          <>
            <GameListFull
              year={year}
              slot={slot}
              games={games!}
              onEnterGame={setNewUrl}
              decorator={GameChoiceSelector}
              decoratorParams={selectorParams}
            />
          </>
        )}
      </GameListNavigator>
    </Page>
  )
}
