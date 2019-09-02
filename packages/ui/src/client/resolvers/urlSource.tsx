import { useMutation, useQuery } from '@apollo/react-hooks'
import { ApolloCache } from 'apollo-cache'
import gql from 'graphql-tag'
import { dropUnset } from 'utils/dropUnset'

type UrlSourceDetails = {
  source: 'jump' | 'scroll'
  url: string
}

type UrlSource = {
  urlSource: UrlSourceDetails & { __typename?: string }
}

const urlSourceDefaults = {
  urlSource: {
    source: 'jump',
    url: '',
    __typename: 'urlSource'
  }
}

const urlSourceQuery = gql`
  query getUrlSources {
    urlSource @client {
      source
      url
    }
  }
`
const updateUrlSourceQuery = gql`
  mutation updateUrlSource($source: String!, $url: String!) {
    updateUrlSource(source: $source, url: $url) @client
  }
`

const updateUrlSource = (_obj: any, data: UrlSource, { cache }: { cache: ApolloCache<{}> }): any => {
  const currentData = cache.readQuery({ query: urlSourceQuery }) as UrlSource
  cache.writeData({ data: { urlSource: { ...currentData.urlSource, ...dropUnset(data) } } })
  return null
}

export const urlSourceStore = {
  defaults: urlSourceDefaults,
  mutations: {
    updateUrlSource
  }
}

export const useUrlSourceQuery = () => {
  return useQuery<UrlSource>(urlSourceQuery)
}

export const useUrlSourceMutation = () => {
  return useMutation<void, UrlSourceDetails>(updateUrlSourceQuery)
}
