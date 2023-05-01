import { graphql, print } from 'graphql'
import type { Maybe } from 'graphql/jsutils/Maybe'
import gql from 'graphql-tag'
import { createPostGraphileSchema, withPostGraphileContext } from 'postgraphile'

import { PoolType, getPool, getSchemas, dbEnv } from './config'
import { acnwReadCache, acusReadCache, options } from './postgraphileOptions'

export const makeQueryRunner = async () => {
  const pgPool = getPool(PoolType.USER)

  const schema = await createPostGraphileSchema(pgPool, getSchemas(), {
    ...options,
    readCache: dbEnv === 'acnw' ? acnwReadCache : acusReadCache,
  })

  // eslint-disable-next-line etc/no-misused-generics
  const query = async <TData, TVariables = Maybe<{ [key: string]: any }>>(
    graphqlQuery: string,
    variables?: TVariables,
    operationName: Maybe<string> = null
  ) => {
    const { data } = await withPostGraphileContext(
      {
        ...options,
        pgPool,
      },
      async (context) =>
        graphql(schema, print(gql(graphqlQuery)), null, { ...context, explain: true }, variables ?? {}, operationName)
    )
    return data as TData
  }

  // Should we need to release this query runner, the cleanup tasks:
  const release = () => {
    pgPool.end()
  }

  return {
    query,
    release,
  } as const
}
