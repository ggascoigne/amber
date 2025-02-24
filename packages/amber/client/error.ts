import { GraphQLError } from 'graphql'

export type QueryError = Error & {
  message: string
  locations?: Array<{ line: number; column: number }>
  TransportErrors: ReadonlyArray<GraphQLError>
  networkError: {
    result?: { errors: Array<Error> }
  }
}
