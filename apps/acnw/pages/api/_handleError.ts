import { NextApiResponse } from 'next'

import { JsonError } from './_JsonError'

export const handleError = (err: any, res: NextApiResponse) => {
  if (err instanceof JsonError) {
    res.status(err.status).send({
      status: err.status,
      error: err.message,
    })
  } else {
    res.status(err.status || 500).send({
      error: err.message,
    })
  }
}
