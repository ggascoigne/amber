import { useAuth } from 'components/Auth'
import { print } from 'graphql'
import gql from 'graphql-tag'
import { OperationDefinitionNode } from 'graphql/language/ast'
import { useCallback } from 'react'

// eslint-disable-next-line etc/no-misused-generics
export const useFetchData = <TData, TVariables>(query: string): (() => Promise<TData>) => {
  const authProps = useAuth()
  const { getTokenSilently, isAuthenticated } = authProps
  return useCallback(
    async (variables?: TVariables) => {
      let headers = {}

      if (isAuthenticated) {
        const token = getTokenSilently && (await getTokenSilently())
        headers = {
          Authorization: token ? `Bearer ${token}` : '',
        }
      }

      const ast = gql(query)
      const operation = ast.definitions.find((def) => def.kind === 'OperationDefinition') as OperationDefinitionNode
      const operationName = operation?.name?.value ?? ''
      // note that we use gql from graphql-tag to drop duplicate fragment definitions
      // then we use graphql print to convert that back to a text string.
      const res = await fetch(`/api/graphql/${operationName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify({
          query: print(ast),
          variables,
        }),
      })

      const json = await res.json()

      if (json.errors) {
        const { message } = json.errors[0] || 'Error..'
        throw new Error(message)
      }

      return json.data
    },
    [getTokenSilently, isAuthenticated, query]
  )
}
