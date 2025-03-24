import React, { Fragment } from 'react'

import { type AppRouter } from '@amber/server/src/api/appRouter' // Assuming AppRouter is your TRPC router type
import Typography from '@mui/material/Typography'
import { TRPCClientErrorLike } from '@trpc/client'

import type { QueryError } from '../../client'

const Quote: React.FC<{
  children: React.ReactNode
}> = ({ children }) => (
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
      {children}
    </Typography>
  </Typography>
)

type ErrorTypes = QueryError | null | TRPCClientErrorLike<AppRouter>
interface TransportErrorProps {
  error: ErrorTypes
}

const isQueryError = (value: ErrorTypes): value is QueryError => !!(value && Object.hasOwn(value, 'transportError'))

const isTrpcError = (value: ErrorTypes): value is TRPCClientErrorLike<AppRouter> =>
  !!(value && Object.hasOwn(value, 'shape'))

export const TransportError = ({ error }: TransportErrorProps) => {
  console.log('TransportError', JSON.stringify(error, null, 2))
  if (isQueryError(error)) {
    const networkErrors = error?.networkError?.result?.errors
    return (
      <>
        <Typography variant='h3' color='inherit'>
          GraphQL Error
        </Typography>
        <Quote>
          {error?.message}
          {error?.TransportErrors && error?.TransportErrors.length !== 0 && (
            <pre>{JSON.stringify(error.TransportErrors, null, 2)}</pre>
          )}
          {networkErrors?.map((e: any, i: any) => <Fragment key={i}>text={e.message}</Fragment>)}
        </Quote>
      </>
    )
  } else if (isTrpcError(error)) {
    // hide the stack trace, it's a bunch of webpack noise and not very useful
    const { stack: _stack, ...data } = error.shape?.data ?? {}
    const details = { code: error.shape?.code, data }
    return (
      <>
        <Typography variant='h3' color='inherit'>
          TRPC Error
        </Typography>
        <Quote>
          {error?.message}
          <pre>{JSON.stringify(details, null, 2)}</pre>
        </Quote>
      </>
    )
  } else {
    return (
      <Typography variant='h3' color='inherit'>
        Error
      </Typography>
    )
  }
}
