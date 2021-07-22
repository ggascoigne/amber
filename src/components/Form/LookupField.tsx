import { useGetLookupValuesQuery } from 'client'
import React from 'react'

import { GraphQLError } from '../GraphQLError'
import { Loader } from '../Loader'
import { SelectField } from './SelectField'
import type { TextFieldProps } from './TextField'

export interface LookupFieldProps extends TextFieldProps {
  realm: string
}

export const LookupField: React.ComponentType<LookupFieldProps> = (props) => {
  const { select, realm, ...rest } = props
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
  return <SelectField {...rest} selectValues={selectValues} />
}

LookupField.displayName = 'LookupField'
