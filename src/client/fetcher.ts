import { useAuth } from 'components/Auth'
import { print } from 'graphql'
import gql from 'graphql-tag'

export const useFetchData = <TData, TVariables>(query: string): (() => Promise<TData>) => {
  const authProps = useAuth()
  return async (variables?: TVariables) => {
    const { getTokenSilently, isAuthenticated } = authProps
    let headers = {}

    if (isAuthenticated) {
      const token = getTokenSilently && (await getTokenSilently())
      headers = {
        Authorization: token ? `Bearer ${token}` : '',
      }
    }

    // note that we use gql from graphql-tag to drop duplicate fragment definitions
    // then we use graphql print to convert that back to a text string.
    const res = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({
        query: print(gql(query)),
        variables,
      }),
    })

    const json = await res.json()

    if (json.errors) {
      const { message } = json.errors[0] || 'Error..'
      throw new Error(message)
    }

    return json.data
  }
}
