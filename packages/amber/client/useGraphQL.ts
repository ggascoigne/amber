import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from '@tanstack/react-query'
import type { ASTNode, OperationDefinitionNode } from 'graphql'
import request from 'graphql-request'

import { QueryError } from './error'

const isOperationDefinition = (def: ASTNode): def is OperationDefinitionNode => def.kind === 'OperationDefinition'

const getKey = <TResult, TVariables>(document: TypedDocumentNode<TResult, TVariables>) =>
  document.definitions.find(isOperationDefinition)?.name?.value ?? 'missing operation'

type TQueryKey<TVariables> = [string, TVariables | undefined]

type TOptions<TResult, TVariables> = Omit<
  UseQueryOptions<TResult, QueryError, TResult, TQueryKey<TVariables>>,
  'queryKey' | 'initialData'
> & {
  initialData?: TResult | (() => TResult)
}

type WithOptions<TResult, TVariables> = {
  variables?: TVariables
  options?: TOptions<TResult, TVariables>
}

const isWithOptions = <TResult, TVariables>(
  value: TVariables | WithOptions<TResult, TVariables>,
): value is WithOptions<TResult, TVariables> => value && typeof value === 'object' && Object.hasOwn(value, 'options')

const parseVars = <TResult, TVariables>(
  params?: TVariables | WithOptions<TResult, TVariables>,
  options?: TOptions<TResult, TVariables>,
) => (params && isWithOptions(params) ? ([params.variables, params.options] as const) : ([params, options] as const))

export function useGraphQL<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables | WithOptions<TResult, TVariables>,
  options?: TOptions<TResult, TVariables>,
) {
  const operationName = getKey(document)
  const [vars, opts] = parseVars(variables, options)
  return useQuery<TResult, QueryError, TResult, TQueryKey<TVariables>>({
    queryKey: [operationName, vars],
    queryFn: async ({ queryKey }) =>
      request(
        `${window.location.origin}/api/graphql/${operationName}`,
        document,
        queryKey[1] ? queryKey[1] : undefined,
      ),
    ...opts,
  })
}

export const useGraphQLMutation = <TResult, TVariables, QueryError, TContext = unknown>(
  document: TypedDocumentNode<TResult, TVariables>,
  options?: UseMutationOptions<TResult, QueryError, TVariables, TContext>,
) => {
  const operationName = getKey(document)
  return useMutation<TResult, QueryError, TVariables, TContext>({
    mutationKey: [operationName],
    mutationFn: (variables) =>
      request(`${window.location.origin}/api/graphql/${operationName}`, document, variables ?? undefined),
    ...options,
  })
}

export function fetchGraphQl<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  const operationName = getKey(document)
  return request(`${window.location.origin}/api/graphql/${operationName}`, document, variables ?? undefined)
}
