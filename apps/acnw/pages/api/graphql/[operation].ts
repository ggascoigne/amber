/* eslint-disable @typescript-eslint/no-shadow */
import { NextApiRequest, NextApiResponse } from 'next'
import { getPool, PoolType } from 'database/shared/config'
import { getPostgraphileHandler } from 'database/shared/portgraphileHandler'

// note that the route here is /api/graphql/[:operation] because I like to append the query
// operation name to the path to make debugging the queries easier in Chrome dev tools.

// FYI export DEBUG="postgraphile:postgres*"to access the postgraphile debugging

// /api/graphql
// auth token: optional
// body: graphql query/mutation

const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: any) =>
  new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })

// GraphQL route that handles queries
export const graphqlRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.url?.startsWith('/api/graphql')) req.url = '/api/graphql'

  const pool = await getPool(PoolType.USER)
  await runMiddleware(req, res, getPostgraphileHandler(pool, req, res))
  res.end()
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default graphqlRoute
