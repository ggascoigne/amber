import gql from 'graphql-tag'
import get from 'lodash/get'
import React from 'react'
import { Query } from 'react-apollo'

import { GraphQLError } from '../GraphQLError'
import { Loader } from '../Loader'

const QUERY_FIRST_SLOT_ONE_GAME = gql`
  query($year: Int!) {
    games(orderBy: NAME_ASC, condition: { slotId: 1, year: $year }, first: 1) {
      nodes {
        id
        name
        year
        slotId
        description
        charInstructions
        estimatedLength
        gameContactEmail
        genre
        lateFinish
        lateStart
        message
        playerMax
        playerMin
        playerPreference
        playersContactGm
        returningPlayers
        slotPreference
        type
        teenFriendly
        slotConflicts
        setting
        gameAssignments(filter: { gm: { lessThan: 0 } }) {
          nodes {
            gm
            member {
              user {
                profile {
                  fullName
                }
              }
            }
          }
        }
      }
    }
  }
`

export const GameByYearQuery = ({ year, children }) => {
  return (
    <Query key={`year_${year}`} query={QUERY_FIRST_SLOT_ONE_GAME} variables={{ year }} errorPolicy='all'>
      {({ loading, error, data }) => {
        if (loading) {
          return <Loader />
        }
        if (error) {
          return <GraphQLError error={error} />
        }
        const game = get(data, 'games.nodes[0]')
        return children && children({ year, game })
      }}
    </Query>
  )
}
