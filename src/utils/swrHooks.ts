import {
  LazyQueryHookOptions,
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  QueryTuple,
  useLazyQuery,
  useQuery,
} from '@apollo/client'
import { DocumentNode } from 'graphql'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useLazySwrQuery<TData = any, TVariables = OperationVariables>(
  query: DocumentNode,
  options?: LazyQueryHookOptions<TData, TVariables>
): QueryTuple<TData, TVariables> {
  const [fetch, result] = useLazyQuery(query, options)

  let inCache = true
  if (result.loading) {
    try {
      result.client.readQuery({
        query: query,
        variables: result.variables,
      })
    } catch (error) {
      inCache = false
    }
  }
  result.loading = !inCache
  return [fetch, result]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useSwrQuery<TData = any, TVariables = OperationVariables>(
  query: DocumentNode,
  options?: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> {
  const result = useQuery(query, options)

  let inCache = true
  if (result.loading) {
    try {
      result.client.readQuery({
        query: query,
        variables: result.variables,
      })
    } catch (error) {
      inCache = false
    }
  }
  result.loading = !inCache
  return result
}
