import cors from 'cors'
import { NextFunction, Request, Response } from 'express'
import { postgraphile } from 'postgraphile'

import { getPool, getSchemas } from '../shared/config'
import { options } from '../shared/postgraphileOptions'
import { combineMiddlewares } from './_combineMiddlewares'

const app = combineMiddlewares([
  /*
   * Note that any middlewares you add here *must* call `next`.
   *
   * This is typically useful for augmenting the request before it goes to PostGraphile.
   */

  // CORS middleware to permit cross-site API requests. Configure to taste
  cors(),

  // Determines the effective URL we are at if `absoluteRoutes` is set
  (req: Request, res: Response, next: NextFunction) => {
    if (options.absoluteRoutes) {
      try {
        const event = JSON.parse(decodeURIComponent(req.headers['x-apigateway-event'] as string))
        // This contains the `stage`, making it a true absolute URL (which we
        // need for serving assets)
        const realPath = event.requestContext.path
        req.originalUrl = realPath
      } catch (e) {
        return next(new Error('Processing event failed'))
      }
    }
    next()
  },
  postgraphile(getPool(`${__dirname}/../shared/`), getSchemas(), {
    ...options,
    readCache: `${__dirname}/../shared/postgraphile.cache`,
  }),
])

module.exports = (req: Request, res: Response) => {
  app(req, res, (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      console.error(`env = ${JSON.stringify(process.env, null, 2)}`)
      if (!res.headersSent) {
        res.statusCode = err.status || err.statusCode || 500
        res.setHeader('Content-Type', 'application/json')
      }
      res.end(JSON.stringify({ errors: [{ message: err.message }] }))
      return
    }
    if (!res.finished) {
      if (!res.headersSent) {
        res.statusCode = 404
      }
      res.end(`'${req.url}' not found`)
    }
  })
}
