// Basically copied from
// https://github.com/graphile/postgraphile/blob/160670dd91ca7faddf784351b33da2bb9924df39/src/postgraphile/http/createPostGraphileHttpRequestHandler.ts#L210
/*
 * This function will combine many Express middlewares into one middleware.
 * All but the final middleware must be a simple middleware that definitely
 * calls next().
 */
import { Request, RequestHandler, Response } from 'express'

export function combineMiddlewares(middlewares: Array<RequestHandler>) {
  return middlewares.reduce(
    (
      parent: (req: Request, res: Response, next: (err?: Error) => void) => void,
      fn: (req: Request, res: Response, next: (err?: Error) => void) => void
    ): ((req: Request, res: Response, next: (err?: Error) => void) => void) => {
      return (req, res, next) => {
        parent(req, res, (error) => {
          if (error) {
            return next(error)
          }
          fn(req, res, next)
        })
      }
    },
    (_req: Request, _res: Response, next: (err?: Error) => void) => next()
  )
}
