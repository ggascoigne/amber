import Typography from '@material-ui/core/Typography'
import { QueryError } from 'client'
import React from 'react'

import { Quote } from '../Typography'

interface GraphQLErrorProps {
  error: QueryError | null
}

export const GraphQLError = ({ error }: GraphQLErrorProps) => {
  console.log(JSON.stringify(error, null, 2))
  const networkErrors = error?.networkError?.result?.errors
  return (
    <>
      <Typography variant='h3' color='inherit'>
        GraphQL Error
      </Typography>
      {error?.message && <Quote text={error.message} />}
      {error?.graphQLErrors && error?.graphQLErrors.length !== 0 && (
        <Quote text={JSON.stringify(error.graphQLErrors, null, 2)} />
      )}
      {networkErrors?.map((e: any, i: any) => (
        <Quote key={i} text={e.message} />
      ))}
    </>
  )
}
