import { GetGames, GetGamesVariables } from '__generated__/GetGames'
import { useQuery } from '@apollo/react-hooks'
import { GAME_FRAGMENT, PROFILE_FRAGMENT } from 'client'
import gql from 'graphql-tag'

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

export const useGameQuery = (variables: GetGamesVariables) =>
  useQuery<GetGames, GetGamesVariables>(QUERY_GAMES, { variables })
