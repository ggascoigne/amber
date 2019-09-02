import { GetFirstGameOfSlot, GetFirstGameOfSlotVariables } from '__generated__/GetFirstGameOfSlot'
import { useQuery } from '@apollo/react-hooks'
import { GAME_FRAGMENT, PROFILE_FRAGMENT } from 'client'
import gql from 'graphql-tag'

export const useGameByYearQuery = (variables: GetFirstGameOfSlotVariables) =>
  useQuery<GetFirstGameOfSlot, GetFirstGameOfSlotVariables>(
    gql`
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
    `,
    { variables }
  )
