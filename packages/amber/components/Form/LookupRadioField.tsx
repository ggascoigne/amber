import React from 'react'

import { Loader, RadioGroupFieldWithLabel, RadioGroupProps } from 'ui'

import { useGraphQL, GetLookupValuesDocument } from '../../client-graphql'
import { TransportError } from '../TransportError'

export interface LookupRadioFieldProps extends RadioGroupProps {
  realm: string
}

export const LookupRadioField: React.ComponentType<LookupRadioFieldProps> = (props) => {
  const { realm, ...rest } = props

  const { isLoading, error, data } = useGraphQL(GetLookupValuesDocument, {
    variables: { realm },
    options: {
      staleTime: 10 * 60 * 1000,
    },
  })
  if (error) {
    return <TransportError error={error} />
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
