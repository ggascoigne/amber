import { Response } from 'express'

import { JsonError } from './_JsonError'

export const handleError = (err: any, res: Response) => {
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
