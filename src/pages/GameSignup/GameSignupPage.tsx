import { gql, useApolloClient } from '@apollo/client'
import { Button } from '@material-ui/core'
import NavigationIcon from '@material-ui/icons/Navigation'
import {
  useCreateGameChoiceMutation,
  useCreateGameChoicesMutation,
  useGetGameChoicesQuery,
  useUpdateGameChoiceByNodeIdMutation,
} from 'client'
import { ExpandingFab, GameListFull, GameListNavigator, GraphQLError, Loader, Page } from 'components/Acnw'
import React, { MouseEventHandler, useCallback, useState } from 'react'
import { InView } from 'react-intersection-observer'
import { Link, Redirect } from 'react-router-dom'
import {
  PropType,
  UnpackArray,
  notEmpty,
  pick,
  useGameScroll,
  useGameUrl,
  useGetMemberShip,
  useUrlSourceState,
  useUser,
} from 'utils'

import { useAuth } from '../../components/Acnw/Auth/Auth0'
import { Perms } from '../../components/Acnw/Auth/PermissionRules'
import { useConfirmDialogOpenState } from '../../utils/useConfirmDialogOpenState'
import { ChoiceConfirmDialog } from './ChoiceConfirmDialog'
import {
  GameChoiceSelector,
  SelectorUpdate,
  SlotDecoratorCheckMark,
  allSlotsComplete,
  orderChoices,
} from './GameChoiceSelector'
import { SignupInstructions } from './SignupInstructions'

type choiceType = NonNullable<UnpackArray<PropType<SelectorUpdate, 'gameChoices'>>> & { modified?: boolean }

const choiceFragment = gql`
  fragment gameChoiceFields on GameChoice {
    gameId
    id
    memberId
    nodeId
    rank
    returningPlayer
    slotId
    year
  }
`

export const useEditGameChoice = () => {
  const [createGameChoice] = useCreateGameChoiceMutation()
  const [updateGameChoice] = useUpdateGameChoiceByNodeIdMutation()
  const [createGameChoices] = useCreateGameChoicesMutation()
  const client = useApolloClient()

  const createAllGameChoices = async (memberId: number, year: number) => {
    createGameChoices({
      variables: {
        memberId,
        year,
      },
      refetchQueries: ['GetGameChoices'],
    }).then(() => {
      // console.log('choices created')
    })
  }

  const createOrUpdate = async (values: choiceType, refetch = false) => {
    if (values.nodeId) {
      client.writeFragment({
        id: `GameChoice:${values.id}`,
        fragment: choiceFragment,
        data: pick(values, 'id', 'nodeId', 'memberId', 'gameId', 'returningPlayer', 'slotId', 'year', 'rank'),
      })
      return updateGameChoice({
        variables: {
          input: {
            nodeId: values.nodeId!,
            patch: pick(values, 'id', 'memberId', 'gameId', 'returningPlayer', 'slotId', 'year', 'rank'),
          },
        },
        refetchQueries: refetch ? ['GetGameChoices'] : undefined,
        optimisticResponse: {
          ...pick(values, 'id', 'nodeId', 'memberId', 'gameId', 'returningPlayer', 'slotId', 'year', 'rank'),
          __typename: 'GameChoice',
        },
      }).catch((error) => {
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
        refetchQueries: ['GetGameChoices'],
      })
        .then((res) => {
          // console.log({ text: 'GameChoice created', variant: 'success' })
        })
        .catch((error) => {
          console.log({ text: error.message, variant: 'error' })
        })
    }
  }

  return [createOrUpdate, createAllGameChoices] as const
}

const gotoTop = () => {
  window.scrollTo(0, 0)
}

export const GameSignupPage: React.FC = () => {
  const { slot, year } = useGameUrl()
  const setNewUrl = useGameScroll()
  const { userId } = useUser()
  const membership = useGetMemberShip(userId)
  const [createOrEditGameChoice, createGameChoices] = useEditGameChoice()
  const [created, setCreated] = useState(false)
  const setShowConfirmDialog = useConfirmDialogOpenState((state) => state.setState)
  const showConfirmDialog = useConfirmDialogOpenState((state) => state.state).open

  const [showFab, setShowFab] = useState(false)
  const { hasPermissions } = useAuth()
  const isAdmin = hasPermissions(Perms.IsAdmin)

  const { loading, error, data } = useGetGameChoicesQuery({
    variables: { year, memberId: membership?.id ?? 0 },
    skip: !membership,
    fetchPolicy: 'cache-and-network',
  })

  const onCloseConfirm: MouseEventHandler = () => {
    setShowConfirmDialog({ open: false })
  }

  const updateChoice = useCallback(
    (params: SelectorUpdate) => {
      const { gameChoices, gameId, rank, returningPlayer, slotId, year, oldRank } = params

      const empty = {
        memberId: membership?.id ?? 0,
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
    [createOrEditGameChoice, membership?.id]
  )

  const gameChoices = data?.gameChoices?.nodes
  const gameSubmission = data?.gameSubmissions?.nodes

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

  if (gameChoices !== null && gameChoices !== undefined && gameChoices.length === 0 && !created) {
    setCreated(true)
    createGameChoices(membership.id, year).then()
  }

  // debug a smaller subset fo the data, sorted
  // const g = gameChoices
  //   ?.map((c) => pick(c!, 'slotId', 'rank', 'gameId', 'id'))
  //   ?.sort((a, b) => (a?.rank ?? 0) - (b?.rank ?? 0))
  //   ?.sort((a, b) => (a?.slotId ?? 0) - (b?.slotId ?? 0))
  // console.table(g)

  const gmSlots = gameChoices?.filter((c) => c?.rank === 0 && c?.gameId).filter(notEmpty)
  const selectorParams = {
    gameChoices,
    updateChoice,
    gmSlots,
  }

  if (gameSubmission?.[0] && !isAdmin) {
    return <Redirect to='/game-choices' />
  }

  const complete = allSlotsComplete(year, gameChoices)

  return (
    <Page>
      {showFab && (
        <ExpandingFab label='Goto Top' show={showFab} onClick={gotoTop}>
          <NavigationIcon />
        </ExpandingFab>
      )}
      {gameSubmission?.[0] && isAdmin ? <Link to='/game-choices'>See completed Summary</Link> : null}

      {slot === 1 && <SignupInstructions year={year} />}
      {complete && (
        <Button
          variant='contained'
          color='primary'
          size='large'
          onClick={() => setShowConfirmDialog({ open: true })}
          style={{ marginBottom: 20 }}
        >
          Confirm your Game Choices
        </Button>
      )}
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
      </InView>
    </Page>
  )
}
