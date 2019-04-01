import { ApolloCache } from 'apollo-cache'
import { GqlQuery } from 'components/Acnw/GqlQuery'
import gql from 'graphql-tag'
import React from 'react'
import { ChildDataProps, graphql } from 'react-apollo'
import compose from 'recompose/compose'
import { dropUnset } from 'utils/dropUnset'

type IUrlSource = {
  urlSource: IUrlSourceDetails
}

type IUrlSourceDetails = {
  source: 'jump' | 'scroll'
  url: string
  __typename?: string
}

const urlSourceDefaults = {
  urlSource: {
    source: 'jump',
    url: '',
    __typename: 'urlSource'
  }
}

export const urlSourceQuery = gql`
  query getUrlSources {
    urlSource @client {
      source
      url
    }
  }
`
export const updateUrlSourceQuery = gql`
  mutation updateUrlSource($source: String!, $url: String!) {
    updateUrlSource(source: $source, url: $url) @client
  }
`

const updateUrlSource = (_obj: any, data: IUrlSource, { cache }: { cache: ApolloCache<{}> }): any => {
  const currentData = cache.readQuery({ query: urlSourceQuery }) as IUrlSource
  cache.writeData({ data: { urlSource: { ...currentData.urlSource, ...dropUnset(data) } } })
  return null
}

interface IGameFilterQuery {
  children(props: IUrlSourceDetails): React.ReactNode
}

export const UrlSourceQuery = ({ children }: IGameFilterQuery) => {
  return (
    <GqlQuery query={urlSourceQuery} errorPolicy='all'>
      {data => {
        const {
          urlSource: { source, url }
        } = data
        return children && children({ source, url })
      }}
    </GqlQuery>
  )
}

export const store = {
  defaults: urlSourceDefaults,
  mutations: {
    updateUrlSource
  }
}

type ChildProps = ChildDataProps<{}, IUrlSource, {}>

const withUrlSourceHandler = graphql<{}, IUrlSource, {}, ChildProps>(urlSourceQuery, {
  props: ({ ownProps, data }) => {
    const { urlSource = urlSourceDefaults } = data
    return {
      data,
      ...ownProps,
      urlSource
    }
  }
})

export const withUrlSource = compose(
  withUrlSourceHandler,
  graphql(updateUrlSourceQuery, { name: 'updateUrlSourceMutation' })
)

export interface WithUrlSource extends IUrlSource {
  updateUrlSourceMutation: (options: { variables: IUrlSourceDetails }) => void
}
