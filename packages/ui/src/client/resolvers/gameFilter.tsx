import { slotFields } from '__generated__/slotFields'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { ApolloCache } from 'apollo-cache'
import { SLOT_FRAGMENT } from 'client'
import gql from 'graphql-tag'
import { dropUnset } from 'utils/dropUnset'

type GameFilterDetails = {
  year: number
  slot: slotFields
}

type GameFilter = {
  gameFilter: GameFilterDetails & { __typename?: string }
}

const gameFilterDefaults: GameFilter = {
  gameFilter: {
    year: 2017,
    slot: {
      nodeId: 'dummy',
      id: 1,
      slot: 1,
      day: 'Thursday',
      length: '5 hrs',
      time: '7 pm to midnight',
      __typename: 'Slot'
    },
    __typename: 'gameFilter'
  }
}

const gameFilterQuery = gql`
  query getGameFilters {
    gameFilter @client {
      slot {
        ...slotFields
      }
      year
    }
  }
  ${SLOT_FRAGMENT}
`
const updateGameFilterQuery = gql`
  mutation updateGameFilter($year: Int, $slot: Slot) {
    updateGameFilter(year: $year, slot: $slot) @client
  }
`

const updateGameFilter = (_obj: any, data: GameFilter, { cache }: { cache: ApolloCache<{}> }): any => {
  const currentData = cache.readQuery({ query: gameFilterQuery }) as GameFilter
  cache.writeData({ data: { gameFilter: { ...currentData.gameFilter, ...dropUnset(data) } } })
  return null
}

export const gameFilterStore = {
  defaults: gameFilterDefaults,
  mutations: {
    updateGameFilter
  }
}

export const useGameFilterQuery = () => {
  return useQuery<GameFilter>(gameFilterQuery)
}

export const useGameFilterMutation = () => {
  return useMutation<void, GameFilterDetails>(updateGameFilterQuery)
}
