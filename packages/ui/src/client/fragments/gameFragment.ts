import gql from 'graphql-tag'

export const GAME_FRAGMENT = gql`
  fragment gameFields on Game {
    nodeId
    id
    name
    gmNames
    description
    genre
    type
    setting
    charInstructions
    playerMax
    playerMin
    playerPreference
    returningPlayers
    playersContactGm
    gameContactEmail
    estimatedLength
    slotPreference
    lateStart
    lateFinish
    slotConflicts
    message
    slotId
    teenFriendly
    year
  }
`

export const GAME_GMS_FRAGMENT = gql`
  fragment gameGms on Game {
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
`
