import React from 'react'

import Typography from '@mui/material/Typography'
import { GraphQLError as _GraphQLError } from 'graphql'

export type QueryError = Error & {
  message: string
  locations?: Array<{ line: number; column: number }>
  graphQLErrors: ReadonlyArray<_GraphQLError>
  networkError: {
    result?: { errors: Array<Error> }
  }
}

interface QuoteProps {
  text: React.ReactNode
  author?: React.ReactNode
}

const Quote: React.FC<QuoteProps> = (props) => {
  const { text, author } = props
  return (
    <Typography
      component='blockquote'
      sx={{
        fontWeight: 300,
        lineHeight: '1.5em',
        padding: '10px 20px',
        margin: '0 0 20px',
        fontSize: '17.5px',
        borderLeft: '5px solid #eee',
      }}
    >
      <Typography paragraph sx={{ margin: '0 0 10px', fontStyle: 'italic' }}>
        {text}
      </Typography>
      <Typography component='small' sx={{ display: 'block', fontSize: '80%', lineHeight: '1.42857143', color: '#777' }}>
        {author}
      </Typography>
    </Typography>
  )
}

interface GraphQLErrorProps {
  error: QueryError | null
}

export const GraphQLError = ({ error }: GraphQLErrorProps) => {
  console.log('GraphQLError', JSON.stringify(error, null, 2))
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
      {networkErrors?.map((e: any, i: any) => <Quote key={i} text={e.message} />)}
    </>
  )
}
