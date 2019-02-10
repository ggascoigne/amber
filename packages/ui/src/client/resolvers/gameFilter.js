import { SLOT_FRAGMENT } from 'client/fragments'
import { GqlQuery } from 'components/Acnw/GqlQuery'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'react-apollo'
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

const updateGameFilter = (_obj, data, { cache }) => {
  const currentData = cache.readQuery({ query: gameFilterQuery })
  cache.writeData({ data: { gameFilter: { ...currentData.gameFilter, ...dropUnset(data) } } })
  return null
}

export const GameFilterQuery = ({ children }) => {
  return (
    <GqlQuery query={gameFilterQuery} errorPolicy='all'>
      {data => {
        const {
          gameFilter: { year, slot }
        } = data
        return children && children({ year, slot })
      }}
    </GqlQuery>
  )
}

GameFilterQuery.propTypes = {
  children: PropTypes.func.isRequired
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
