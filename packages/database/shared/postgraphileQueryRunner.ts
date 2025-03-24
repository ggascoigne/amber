import { dbEnv } from '@amber/environment'
import { DocumentNode, graphql, print } from 'graphql'
import type { Maybe } from 'graphql/jsutils/Maybe'
import gql from 'graphql-tag'
import { createPostGraphileSchema, withPostGraphileContext } from 'postgraphile'

import { PoolType, getPool, getSchemas } from './config'
import { acnwReadCache, acusReadCache, options } from './postgraphileOptions'

export type QueryResult<T> = {
  data: T
  errors: readonly any[] | undefined
}

export type QueryRunner = <TData, TVariables = Maybe<Record<string, any>>>(
  graphqlQuery: string | DocumentNode,
  variables?: TVariables | undefined,
  operationName?: Maybe<string>,
) => Promise<QueryResult<TData>>

export type Release = () => void

export const makeQueryRunner = async () => {
  const pgPool = getPool(PoolType.ADMIN)

  const schema = await createPostGraphileSchema(pgPool, getSchemas(), {
    ...options,
    readCache: dbEnv === 'acnw' ? acnwReadCache : acusReadCache,
  })

  const query: QueryRunner = async <TData, TVariables = Maybe<Record<string, any>>>(
    graphqlQuery: string | DocumentNode,
    variables?: TVariables,
    operationName: Maybe<string> = null,
  ): Promise<QueryResult<TData>> => {
    const document: DocumentNode = typeof graphqlQuery === 'string' ? gql(graphqlQuery) : graphqlQuery
    const { data, errors } = await withPostGraphileContext(
      {
        ...options,
        pgPool,
      },
      async (context) =>
        graphql(schema, print(document), null, { ...context, explain: true }, variables ?? {}, operationName),
    )
    if (errors) {
      console.log(JSON.stringify(errors, null, 2))
    }
    return { data: data as TData, errors }
  }

  // Should we need to release this query runner, the cleanup tasks:
  const release: Release = () => {
    pgPool.end()
  }

  return {
    query,
    release,
  } as const
}
