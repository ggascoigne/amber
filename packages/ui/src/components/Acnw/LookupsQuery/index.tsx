import { GetLookups, GetLookups_lookups } from '__generated__/GetLookups'
import { QUERY_LOOKUP } from 'client/queries'
import { GqlQuery } from 'components/Acnw/GqlQuery'
import React from 'react'
import { ChildDataProps, graphql } from 'react-apollo'

interface LookupsQuery {
  children(props: LookupsQueryChild): React.ReactNode
}

interface LookupsQueryChild {
  lookups?: GetLookups_lookups
}

export const LookupsQuery: React.FC<LookupsQuery> = ({ children }) => {
  return (
    <GqlQuery<GetLookups> query={QUERY_LOOKUP} errorPolicy='all'>
      {data => children && children({ lookups: data && data.lookups ? data.lookups : undefined })}
    </GqlQuery>
  )
}

type ChildProps = ChildDataProps<{}, GetLookups, {}>

export const withLookupsQuery = graphql<{}, GetLookups, {}, ChildProps>(QUERY_LOOKUP, {
  // props: ({ data, ownProps }) => {
  //   const { lookups } = data
  //   return {
  //     data, // only here to shut up typescript
  //     ...ownProps,
  //     lookups
  //   }
  // }
})

export interface WithLookupsQuery extends ChildProps {}
