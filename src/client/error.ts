import { GraphQLError } from 'graphql'

export type QueryError = Error & {
  message: string
  graphQLErrors: ReadonlyArray<GraphQLError>
}
