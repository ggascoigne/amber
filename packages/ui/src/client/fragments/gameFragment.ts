import gql from 'graphql-tag'

export const GAME_FRAGMENT = gql`
  fragment gameFields on Game {
    nodeId
    id
    charInstructions
    description
    estimatedLength
    gameContactEmail
    genre
    lateFinish
    lateStart
    message
    name
    playerMax
    playerMin
    playerPreference
    playersContactGm
    returningPlayers
    setting
    slotConflicts
    slotId
    slotPreference
    teenFriendly
    type
    year
  }
`
