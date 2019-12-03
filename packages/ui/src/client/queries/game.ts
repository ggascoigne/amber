import { GetGames, GetGamesVariables } from '__generated__/GetGames'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { GAME_FRAGMENT, GAME_GMS_FRAGMENT, PROFILE_FRAGMENT } from 'client'
import gql from 'graphql-tag'

import { createGame, createGameVariables } from '../../__generated__/createGame'
import { deleteGame, deleteGameVariables } from '../../__generated__/deleteGame'
import { GetGamesBySlot, GetGamesBySlotVariables } from '../../__generated__/GetGamesBySlot'
import { GameInput } from '../../__generated__/globalTypes'
import { updateGameByNodeId, updateGameByNodeIdVariables } from '../../__generated__/updateGameByNodeId'

const QUERY_GAMES_BY_SLOT = gql`
  query GetGamesBySlot($year: Int!, $slotId: Int!) {
    games(condition: { year: $year, slotId: $slotId }, orderBy: [SLOT_ID_ASC, NAME_ASC]) {
      edges {
        node {
          ...gameFields
          ...gameGms
        }
      }
    }
  }

  ${GAME_FRAGMENT}
  ${GAME_GMS_FRAGMENT}
  ${PROFILE_FRAGMENT}
`

export const useGameBySlotQuery = (variables: GetGamesBySlotVariables) =>
  useQuery<GetGamesBySlot, GetGamesBySlotVariables>(QUERY_GAMES_BY_SLOT, { variables })

const QUERY_GAMES = gql`
  query GetGames($year: Int!) {
    games(condition: { year: $year }, orderBy: [SLOT_ID_ASC, NAME_ASC]) {
      edges {
        node {
          ...gameFields
          ...gameGms
        }
      }
    }
  }

  ${GAME_FRAGMENT}
  ${GAME_GMS_FRAGMENT}
  ${PROFILE_FRAGMENT}
`

export const useGameQuery = (variables: GetGamesVariables) =>
  useQuery<GetGames, GetGamesVariables>(QUERY_GAMES, { variables })

const useUpdateGame = () =>
  useMutation<updateGameByNodeId, updateGameByNodeIdVariables>(gql`
    mutation updateGameByNodeId($input: UpdateGameByNodeIdInput!) {
      updateGameByNodeId(input: $input) {
        game {
          ...gameFields
          ...gameGms
        }
      }
    }
    ${GAME_FRAGMENT}
    ${GAME_GMS_FRAGMENT}
    ${PROFILE_FRAGMENT}
  `)

const useCreateGame = () =>
  useMutation<createGame, createGameVariables>(gql`
    mutation createGame($input: CreateGameInput!) {
      createGame(input: $input) {
        game {
          ...gameFields
          ...gameGms
        }
      }
    }
    ${GAME_FRAGMENT}
    ${GAME_GMS_FRAGMENT}
    ${PROFILE_FRAGMENT}
  `)

export const useDeleteGame = () =>
  useMutation<deleteGame, deleteGameVariables>(
    gql`
      mutation deleteGame($input: DeleteGameInput!) {
        deleteGame(input: $input) {
          clientMutationId
          deletedGameNodeId
        }
      }
    ` /*,
    { refetchQueries: [{ query: QUERY_GAME }] }*/
  )

interface createOrUpdateGame extends GameInput {
  nodeId?: string
}

export const useCreateOrUpdateGame = () => {
  const [updateGame] = useUpdateGame()
  const [createGame] = useCreateGame()

  return (values: createOrUpdateGame) => {
    if (values.nodeId) {
      return updateGame({
        variables: {
          input: {
            nodeId: values.nodeId,
            patch: {
              ...values
            }
          }
        }
      })
    } else {
      return createGame({
        variables: {
          input: {
            game: {
              ...values
            }
          }
        }
      })
    }
  }
}
