import { GraphQLError } from 'components/Acnw/GraphQLError'
import { Loader } from 'components/Acnw/Loader'
import gql from 'graphql-tag'
import React from 'react'
import { graphql, Query } from 'react-apollo'
import compose from 'recompose/compose'
import { dropUnset } from 'utils/dropUnset'

const gameFilterDefaults = {
  gameFilter: {
    year: 2017,
    slot: {
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
        id
        slot
        day
        length
        time
      }
      year
    }
  }
`
export const updateGameFilterQuery = gql`
  mutation updateGameFilter($year: Int, $slot: Slot) {
    updateGameFilter(year: $year, slot: $slot) @client
  }
`

const updateGameFilter = (_obj, data, { cache }) => {
  const currentData = cache.readQuery({ query: gameFilterQuery })
  cache.writeData({ data: { gameFilter: { ...currentData.gameFilter, ...dropUnset(data) } } })
  return null
}

export const GameFilterQuery = ({ children }) => {
  return (
    <Query query={gameFilterQuery} errorPolicy='all'>
      {({ loading, error, data }) => {
        if (loading) {
          return <Loader />
        }
        if (error) {
          return <GraphQLError error={error} />
        }
        const {
          gameFilter: { year, slot }
        } = data
        return children && children({ year, slot })
      }}
    </Query>
  )
}

export const store = {
  defaults: gameFilterDefaults,
  mutations: {
    updateGameFilter
  }
}

const gameFilterHandler = {
  props: ({ ownProps, data: { gameFilter = gameFilterDefaults } }) => ({
    ...ownProps,
    gameFilter
  })
}

export const withGameFilter = compose(
  graphql(gameFilterQuery, gameFilterHandler),
  graphql(updateGameFilterQuery, { name: 'updateGameFilterMutation' })
)
