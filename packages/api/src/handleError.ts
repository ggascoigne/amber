import debug from 'debug'
import { NextApiResponse } from 'next'

import { JsonError } from './JsonError'

const log = debug('@amber/amber:api:handleError')

export const handleError = (err: any, res: NextApiResponse) => {
  log('handleError', err)
  if (err instanceof JsonError) {
    res.status(err.status).send({
      status: err.status,
      error: err.message,
    })
  } else {
    res.status(err.status ?? 500).send({
      error: err.message,
    })
  }
}
