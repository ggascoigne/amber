import gql from 'graphql-tag'

export const PROFILE_FRAGMENT = gql`
  fragment profileFields on Profile {
    id
    email
    fullName
    phoneNumber
    snailMailAddress
  }
`
