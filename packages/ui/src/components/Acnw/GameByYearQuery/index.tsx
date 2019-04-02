import { GetSlots_slots_nodes } from '__generated__/GetSlots'
import { GAME_FRAGMENT, PROFILE_FRAGMENT } from 'client/fragments'
import { GqlQuery } from 'components/Acnw/GqlQuery'
import gql from 'graphql-tag'
import get from 'lodash/get'
import * as PropTypes from 'prop-types'
import React from 'react'

const QUERY_FIRST_SLOT_ONE_GAME = gql`
  query GetFirstGameOfSlot($year: Int!) {
    games(orderBy: NAME_ASC, condition: { slotId: 1, year: $year }, first: 1) {
      nodes {
        ...gameFields
        gameAssignments(filter: { gm: { lessThan: 0 } }) {
          nodes {
            nodeId
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

  ${GAME_FRAGMENT}
  ${PROFILE_FRAGMENT}
`

interface IGameByYearQuery {
  year: number

  children(props: IGameByYearQueryChild): React.ReactNode
}

interface IGameByYearQueryChild {
  year: number
  game: GetSlots_slots_nodes
}

export const GameByYearQuery: React.FC<IGameByYearQuery> = ({ year, children }) => {
  return (
    <GqlQuery key={`year_${year}`} query={QUERY_FIRST_SLOT_ONE_GAME} variables={{ year }} errorPolicy='all'>
      {data => children && children({ year, game: get(data, 'games.nodes[0]') })}
    </GqlQuery>
  )
}

GameByYearQuery.propTypes = {
  year: PropTypes.number.isRequired,
  children: PropTypes.func.isRequired
}
