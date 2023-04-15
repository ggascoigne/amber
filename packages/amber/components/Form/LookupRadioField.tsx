import React from 'react'

import { GraphQLError, Loader, RadioGroupFieldWithLabel, RadioGroupProps } from 'ui'

import { useGetLookupValuesQuery } from '../../client'

export interface LookupRadioFieldProps extends RadioGroupProps {
  realm: string
}

export const LookupRadioField: React.ComponentType<LookupRadioFieldProps> = (props) => {
  const { realm, ...rest } = props

  const { isLoading, error, data } = useGetLookupValuesQuery(
    { realm },
    {
      staleTime: 10 * 60 * 1000,
    }
  )
  if (error) {
    return <GraphQLError error={error} />
  }
  if (isLoading) {
    return <Loader />
  }
  const selectValues = data?.lookups?.edges[0]?.node?.lookupValues.nodes.map((v) => ({
    value: v!.code,
    text: v!.value,
  }))
  return <RadioGroupFieldWithLabel selectValues={selectValues} {...rest} />
}

LookupRadioField.displayName = 'LookupRadioField'
