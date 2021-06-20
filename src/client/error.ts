import { GraphQLError } from 'graphql'

export type QueryError = Error & {
  message: string
  locations?: Array<{ line: number; column: number }>
  graphQLErrors: ReadonlyArray<GraphQLError>
  networkError: {
    result?: { errors: Array<Error> }
  }
}
