import { GqlQuery } from 'components/Acnw/GqlQuery'
import gql from 'graphql-tag'
import * as PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'react-apollo'
import compose from 'recompose/compose'
import { dropUnset } from 'utils/dropUnset'

export const URL_SOURCE_JUMP = 'jump'
export const URL_SOURCE_SCROLL = 'scroll'

const urlSourceDefaults = {
  urlSource: {
    source: URL_SOURCE_JUMP,
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

const updateUrlSource = (_obj, data, { cache }) => {
  const currentData = cache.readQuery({ query: urlSourceQuery })
  cache.writeData({ data: { urlSource: { ...currentData.urlSource, ...dropUnset(data) } } })
  return null
}

export const UrlSourceQuery = ({ children }) => {
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

UrlSourceQuery.propTypes = {
  children: PropTypes.func.isRequired
}

export const store = {
  defaults: urlSourceDefaults,
  mutations: {
    updateUrlSource
  }
}

const urlSourceHandler = {
  props: ({ ownProps, data: { urlSource = urlSourceDefaults } }) => ({
    ...ownProps,
    urlSource
  })
}

export const withUrlSource = compose(
  graphql(urlSourceQuery, urlSourceHandler),
  graphql(updateUrlSourceQuery, { name: 'updateUrlSourceMutation' })
)
