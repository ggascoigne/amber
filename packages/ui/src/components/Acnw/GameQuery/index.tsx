import { GetGames, GetGamesVariables, GetGames_games_edges } from '__generated__/GetGames'
import { GetSlots_slots_nodes } from '__generated__/GetSlots'
import { GAME_FRAGMENT, PROFILE_FRAGMENT } from 'client/fragments'
import gql from 'graphql-tag'
import React from 'react'

import { GqlQuery } from '../GqlQuery'

const QUERY_GAMES = gql`
  query GetGames($year: Int!, $slotId: Int!) {
    games(condition: { year: $year, slotId: $slotId }, orderBy: [SLOT_ID_ASC, NAME_ASC]) {
      edges {
        node {
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
  }

  ${GAME_FRAGMENT}
  ${PROFILE_FRAGMENT}
`

interface GameQuery {
  year: number
  slot: GetSlots_slots_nodes
  children(props: GameQueryChild): React.ReactNode
}

export interface GameQueryChild {
  year: number
  slot: GetSlots_slots_nodes
  games?: GetGames_games_edges[]
}

export const GameQuery: React.FC<GameQuery> = ({ year, slot, children }) => (
  <GqlQuery<GetGames, GetGamesVariables>
    key={`slot_${slot.id}`}
    query={QUERY_GAMES}
    variables={{ year: year, slotId: slot.id }}
    errorPolicy='all'
  >
    {data => children && children({ year, slot, games: data && data.games ? data.games.edges : undefined })}
  </GqlQuery>
)
