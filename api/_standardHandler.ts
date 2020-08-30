import { NowRequest, NowResponse } from '@now/node'

export type Handler = (req: NowRequest, res: NowResponse, next: (err?: any) => void) => Promise<any>

export function combineHandlers(handlers: Array<Handler>) {
  return handlers.reduce(
    (
      parent: (req: NowRequest, res: NowResponse, next: (err?: any) => void) => void,
      fn: (req: NowRequest, res: NowResponse, next: (err?: any) => void) => void
    ): ((req: NowRequest, res: NowResponse, next: (err?: any) => void) => void) => (req, res, next) => {
      parent(req, res, (error) => {
        if (error) {
          return next(error)
        }
        fn(req, res, next)
      })
    },
    (_req: NowRequest, _res: NowResponse, next: (err?: any) => void) => next()
  )
}

export function withApiHandler(handlers: Handler[]): Handler {
  return async (req: NowRequest, res: NowResponse) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET')
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Accept, Content-Type')

    if (req.method === 'OPTIONS') {
      return res.status(200).json({})
    }

    const handler = combineHandlers(handlers)
    try {
      const result = await handler(req, res, (err) => {
        if (err) {
          return res.status(err.status || err.statusCode || 500).json({ errors: [{ message: err.message }] })
        }
        if (!res.writableEnded) {
          if (!res.headersSent) {
            res.statusCode = 404
          }
          res.end(`'${req.url}' not found`)
        }
      })
      return result
    } catch (err) {
      return res.status(err.status || err.statusCode || 500).json({ errors: [{ message: err.message }] })
    }
  }
}
