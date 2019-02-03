import { GAME_FRAGMENT, PROFILE_FRAGMENT } from 'client/fragments'
import gql from 'graphql-tag'
import get from 'lodash/get'
import React from 'react'
import { Query } from 'react-apollo'

import { GraphQLError } from '../GraphQLError'
import { Loader } from '../Loader'

const QUERY_GAMES = gql`
  query($year: Int!, $slotId: Int!) {
    games(condition: { year: $year, slotId: $slotId }, orderBy: [SLOT_ID_ASC, NAME_ASC]) {
      edges {
        node {
          ...gameFields
          gameAssignments(filter: { gm: { lessThan: 0 } }) {
            nodes {
              gm
              member {
                user {
                  profile {
                    ...profileFields
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  ${GAME_FRAGMENT}
  ${PROFILE_FRAGMENT}
`

export const GameQuery = ({ year, slot, children }) => {
  return (
    <Query key={`slot_${slot.id}`} query={QUERY_GAMES} variables={{ year: year, slotId: slot.id }} errorPolicy='all'>
      {({ loading, error, data }) => {
        if (loading) {
          return <Loader />
        }
        if (error) {
          return <GraphQLError error={error} />
        }
        const games = get(data, 'games.edges')
        return children && children({ year, slot, games })
      }}
    </Query>
  )
}
