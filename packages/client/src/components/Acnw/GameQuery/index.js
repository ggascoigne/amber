import { Loader } from '../Loader'
import gql from 'graphql-tag'
import get from 'lodash/get'
import React from 'react'
import { Query } from 'react-apollo'
import { GraphQLError } from '../GraphQLError'

const QUERY_GAMES = gql`
  query($year: Int!, $slotId: Int!) {
    games(condition: { year: $year, slotId: $slotId }, orderBy: [SLOT_ID_ASC, NAME_ASC]) {
      edges {
        node {
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
  }
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
