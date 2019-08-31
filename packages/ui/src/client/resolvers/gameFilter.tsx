import { slotFields } from '__generated__/slotFields'
import { ApolloCache } from 'apollo-cache'
import { SLOT_FRAGMENT } from 'client/fragments'
import { GqlQuery } from 'components/Acnw/GqlQuery'
import gql from 'graphql-tag'
import React from 'react'
import { ChildDataProps, graphql } from 'react-apollo'
import compose from 'recompose/compose'
import { dropUnset } from 'utils/dropUnset'

type GameFilter = {
  gameFilter: GameFilterDetails
}

type GameFilterDetails = {
  year: number
  slot: slotFields
  __typename?: string
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

export const gameFilterQuery = gql`
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
export const updateGameFilterQuery = gql`
  mutation updateGameFilter($year: Int, $slot: Slot) {
    updateGameFilter(year: $year, slot: $slot) @client
  }
`

const updateGameFilter = (_obj: any, data: GameFilter, { cache }: { cache: ApolloCache<{}> }): any => {
  const currentData = cache.readQuery({ query: gameFilterQuery }) as GameFilter
  cache.writeData({ data: { gameFilter: { ...currentData.gameFilter, ...dropUnset(data) } } })
  return null
}

interface GameFilterQuery {
  children(props: GameFilterDetails): React.ReactNode
}

export const GameFilterQuery = ({ children }: GameFilterQuery) => {
  return (
    <GqlQuery query={gameFilterQuery} errorPolicy='all'>
      {(data: GameFilter) => {
        const {
          gameFilter: { year, slot }
        } = data
        return children && children({ year, slot })
      }}
    </GqlQuery>
  )
}

export const store = {
  defaults: gameFilterDefaults,
  mutations: {
    updateGameFilter
  }
}

type ChildProps = ChildDataProps<{}, GameFilter, {}>

const withGameFilterQuery = graphql<{}, GameFilter, {}, ChildProps>(gameFilterQuery, {
  props: ({ data, ownProps }) => {
    const { gameFilter } = data!
    return {
      data: data!, // only here to shut up typescript
      ...ownProps,
      gameFilter
    }
  }
})

export const withGameFilter = compose(
  withGameFilterQuery,
  graphql(updateGameFilterQuery, { name: 'updateGameFilterMutation' })
)

export interface WithGameFilter extends GameFilter {
  updateGameFilterMutation: (options: { variables: GameFilterDetails }) => void
}
