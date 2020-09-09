import { ApolloCache, useMutation, useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { configuration } from 'utils'
import { dropUnset } from 'utils/dropUnset'

type YearDetails = {
  year: number
}

type YearFilter = {
  yearDetails: YearDetails & { __typename?: string }
}

const yearFilterDefaults = {
  yearDetails: {
    year: configuration.year,
    __typename: 'yearFilter',
  },
}

const yearFilterQuery = gql`
  query getYearFilter {
    yearDetails @client {
      year
    }
  }
`
const updateYearFilterQuery = gql`
  mutation updateYearFilter($year: Number!) {
    updateYearFilter(year: $year) @client
  }
`

const updateYearFilter = (_obj: any, data: YearFilter, { cache }: { cache: ApolloCache<unknown> }): any => {
  const currentData = cache.readQuery({ query: yearFilterQuery }) as YearFilter
  cache.writeQuery({
    query: yearFilterQuery,
    data: { yearDetails: { ...currentData.yearDetails, ...dropUnset(data) } },
  })
  return null
}

export const yearFilterStore = {
  defaults: yearFilterDefaults,
  query: yearFilterQuery,
  mutations: {
    updateYearFilter,
  },
}

export const useYearFilterQuery = () => useQuery<YearFilter>(yearFilterQuery)

export const useYearFilterMutation = () => useMutation<void, YearDetails>(updateYearFilterQuery)
