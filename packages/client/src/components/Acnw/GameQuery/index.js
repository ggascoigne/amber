import { GAME_FRAGMENT, PROFILE_FRAGMENT } from 'client/fragments'
import { GqlQuery } from 'components/Acnw/GqlQuery'
import gql from 'graphql-tag'
import get from 'lodash/get'
import * as PropTypes from 'prop-types'
import React from 'react'

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
    <GqlQuery key={`slot_${slot.id}`} query={QUERY_GAMES} variables={{ year: year, slotId: slot.id }} errorPolicy='all'>
      {data => children && children({ year, slot, games: get(data, 'games.edges') })}
    </GqlQuery>
  )
}

GameQuery.propTypes = {
  year: PropTypes.number.isRequired,
  slot: PropTypes.object.isRequired,
  children: PropTypes.func.isRequired
}
